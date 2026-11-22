const { parseInt } = require("core-js/fn/number");

let tokenDB;

module.exports = (injectedTokenDB) => {
    tokenDB = injectedTokenDB;

    return {
        setUserFromToken: setUserFromToken
    };
};

function setUserFromToken (req,res,next){
    const authorization = req.header('authorization');
    let token = "";
    if(authorization){ 
        token = authorization.split(' ')[1] || "";
    tokenDB.getUserIDFromBearerToken(token, (userID) => {
        // if(userID==null){ 
        //     res.status(401).send({
        //       message: 'Token Not Found'
        //     });}
        req.authedID = userID ;
        next();
        });
    }else{
        next();
    }
  }
