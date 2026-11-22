module.exports = (injectedPgPool) => {
    pgPool = injectedPgPool;

    return {
        register: register,
        getUser: getUser,
        isValidUser: isValidUser,
        getUserByID: getUserByID
    };
};

var crypto = require("crypto");

function register(username, password, cbFunc) {
    var shaPass = crypto.createHash("sha256").update(password).digest("hex");

    const query = `INSERT INTO employees (username, password) VALUES ('${username}', '${shaPass}') ON DUPLICATE KEY UPDATE password = "${shaPass}"`;

    pgPool.query(query, cbFunc);
}

function getUser(username, password, cbFunc) {
    var shaPass = crypto.createHash("sha256").update(password).digest("hex");

    const getUserQuery = `SELECT * FROM employees WHERE username = '${username}' AND password = '${shaPass}'`;

    pgPool.query(getUserQuery, (response) => {
        cbFunc(
            false,
            response.results && response.results.length === 1
                ? response.results[0]
                : null
        );
    });
}
function getUserByID(id, cbFunc) {
    const getUserQuery = `SELECT * FROM employees WHERE ID = '${id}'`;
    pgPool.query(getUserQuery, (response) => {
        cbFunc(
            false,
            response.results && response.results.length === 1
                ? response.results[0]
                : null
        );
    });
}

function isValidUser(username, cbFunc) {
    const query = `SELECT * FROM employees WHERE username = '${username}'`;

    const checkUsrcbFunc = (response) => {
        const isValidUser = response.results
            ? (response.results.length > 0)
            : null;

        cbFunc(response.error, isValidUser);
    };

    pgPool.query(query, checkUsrcbFunc);
}
