
const db = require("../Models");
const Model = db.access_token;

module.exports = () => {
    return {
        saveAccessToken: saveAccessToken,
        getUserIDFromBearerToken: getUserIDFromBearerToken,
    };
};

function saveAccessToken(accessToken, userID, cbFunc) {
    
    Model.destroy({ where: {user_id:userID} }).then(function() {
        Model.create({access_token:accessToken,user_id:userID})
       .then(function(response) {
           cbFunc(response==null);
         }).catch(function (err) {
            // handle error;
            cbFunc(err);
          });
        });
}

function getUserIDFromBearerToken(bearerToken, cbFunc) {
     Model.findAll({where:{access_token:bearerToken}})
    .then(function(response) {
        const userID =
            response && response.length == 1
                ? response[0].user_id
                : null;

        cbFunc(userID);
      });
}