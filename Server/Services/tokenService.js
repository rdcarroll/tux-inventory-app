
let userDB;
let tokenDB;

module.exports = (injectedUserDB, injectedTokenDB) => {
    userDB = injectedUserDB;
    tokenDB = injectedTokenDB;

    return {
        getClient: getClient,
        saveAccessToken: saveAccessToken,
        getUser: getUser,
        grantTypeAllowed: grantTypeAllowed,
        getAccessToken: getAccessToken
    };
};

function getClient(clientID, clientSecret, cbFunc) {
    const client = {
        clientID,
        clientSecret,
        grants: null,
        redirectUris: null,
    };

    cbFunc(false, client);
}

function grantTypeAllowed(clientID, grantType, cbFunc) {
    cbFunc(false, true);
}

function getUser(username, password, cbFunc) {
    userDB.getUser(username, password, cbFunc);
}

function saveAccessToken(accessToken, clientID, expires, user, cbFunc) {
    tokenDB.saveAccessToken(accessToken, user.ID, cbFunc);
}

function getAccessToken(bearerToken, cbFunc) {
    tokenDB.getUserIDFromBearerToken(bearerToken, (userID) => {
        
        try {
            //if(userID==null){ throw new Error('Token Not Found');}
            if(userID==null){ cbFunc(new Error('Token Not Found'),null);}
            else{
                let user = userDB.getUserByID(userID, (err,data)=>{
                    if(err){
                        cbFunc(err, null);
                        return;
                    }
                    const accessToken = {
                        user: {
                            id: data.ID,
                            name: data.UserName,
                            isAdmin:data.IsAdmin
                        },
                        expires: null,
                    };
            
                    cbFunc(userID === null, userID === null ? null : accessToken);
                });
            }
        } catch (error) {
            cbFunc(error, null);
        }
    });
}

