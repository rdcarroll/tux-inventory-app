// Get dependencies
const express = require('express');
const cron = require('node-cron');
const path = require('path');
//const http = require('http');
const https = require('https');
const fs = require('fs');
const bodyParser = require('body-parser');

// Database imports
const pgPool = require("./Server/DataAccess/dbWrapper");
const tokenDB = require("./Server/DataAccess/tokenDB2")();
const userDB = require("./Server/DataAccess/userDB2")(pgPool);

// OAuth imports
const oAuthService = require("./Server/Services/tokenService")(userDB, tokenDB);
const oAuth2Server = require("node-oauth2-server");

const loggingService = require("./Server/Services/loggingService");

const app = express();

// Schedule tasks to be run on the server.
cron.schedule('0 5 * * *', function() {
  loggingService.prune();
});

// Parsers for POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Point static path to dist
app.use('/dist', express.static(path.join(__dirname, 'dist')));
//app.use('/wwwroot', express.static(path.join(__dirname, 'wwwroot')));

// Auth and routes
app.oauth = oAuth2Server({
  model: oAuthService,
  grants: ["password"],
  debug: true,
});
const authenticator = require("./Server/Security/authenticator")(userDB);
const routes = require("./Server/Security/login")(express.Router(),app,authenticator);
app.use("/auth", routes);

const authmiddleware = require("./Server/Security/auth.js")(tokenDB);
app.use(authmiddleware.setUserFromToken);

const queryService = require("./Server/Services/queryService.js");
app.use(queryService.setQuery);

//log all calls
app.use(loggingService.logQuery);

// Set our api routes
const api = require('./Server/Routes/api')(express.Router(),app);
app.use('/api', api);

// const db = require("./Server/Models");
// const tokenService = require('./Server/Services/tokenService');
//db.sequelize.sync();

// Catch all other routes and return the index file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

/**
 * Get port from environment and store in Express.
 */
const port = process.env.PORT || '3000';
app.set('port', port);

/**
 * Create HTTP server.
 */
const server = https.createServer({
  key: fs.readFileSync('certs/server.key'),
  cert: fs.readFileSync('certs/server.cert')
},app);

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port, () => console.log(`API running on localhost:${port}`));