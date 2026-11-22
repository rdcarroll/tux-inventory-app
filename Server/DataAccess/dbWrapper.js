module.exports = {
    query: query,
};

const mysql = require('mysql2');
const dbConfig = require("./db.config.js");

function query(queryString, cbFunc) {
    const pool = mysql.createPool({
        connectionLimit : 5, //important
        host     : dbConfig.HOST,
        user     : dbConfig.USER,
        password : dbConfig.PASSWORD,
        database : dbConfig.DB,
        debug    :  false
    });

    pool.query(queryString, (error, results) => {
        cbFunc(setResponse(error, results));
    });
}

function setResponse(error, results) {
    return {
        error: error,
        results: results ? results : null,
    };
}