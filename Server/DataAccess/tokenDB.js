let pgPool;

module.exports = (injectedPgPool) => {
    pgPool = injectedPgPool;

    return {
        saveAccessToken: saveAccessToken,
        getUserIDFromBearerToken: getUserIDFromBearerToken,
    };
};

function saveAccessToken(accessToken, userID, cbFunc) {
    const getUserQuery = `INSERT INTO access_tokens (access_token, user_id) VALUES ('${accessToken}', ${userID}) ON DUPLICATE KEY UPDATE access_token = "${accessToken}";`;

    pgPool.query(getUserQuery, (response) => {
        cbFunc(response.error);
    });
}

function getUserIDFromBearerToken(bearerToken, cbFunc) {
    const getUserIDQuery = `SELECT * FROM access_tokens WHERE access_token = '${bearerToken}';`;

    pgPool.query(getUserIDQuery, (response) => {
        const userID =
            response.results && response.results.length == 1
                ? response.results[0].user_id
                : null;

        cbFunc(userID);
    });
}