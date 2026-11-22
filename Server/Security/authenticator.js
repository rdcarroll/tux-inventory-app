let userDB;

module.exports = (injectedUserDB) => {
    userDB = injectedUserDB;

    return {
        registerUser: registerUser,
        updateUser: updateUser,
        login: login,
        requestReset: requestReset,
    };
};

function registerUser(req, res) {
    userDB.isValidUser(req.body.UserName, (error, isValidUser) => {
        //if (error || isValidUser) {
        if (error) {
            const message = error
                ? "Something went wrong!"
                : "This user already exists!";

            sendResponse(res, message, error);

            return;
        }
        
        //new user gets default password
        req.body.Password = "123456";

        userDB.register(req.body.UserName, req.body.Password, (resp) => {
            if(resp.error){
                sendResponse(
                    res,
                    "Something went wrong!",
                    resp.error
                );
            }
            let insertId = resp.results.insertId;
            userDB.updateUser(insertId, req.body, (response) => {
                sendResponse(
                    res,
                    !response.error  ? "Success!!" : "Something went wrong!",
                    response.error
                );
            });
        });
    });
}
function updateUser(req, res) {
    userDB.isValidUser(req.body.UserName, (error, isValidUser) => {
        if (error) {
            const message =  "Something went wrong!";

            sendResponse(res, message, error);

            return;
        }
        if(!!req.body.Password){
            userDB.register(req.body.UserName, req.body.Password, (response) => {
                sendResponse(
                    res,
                    !response.error  ? "Success!!" : "Something went wrong!",
                    response.error
                );
            });
        }
        else{
            sendResponse(
                res,
                 "Password missing!",
                "null Password"
            );
        }
    });
}
function requestReset(req, res) {
    userDB.getUserByUserName(req.body.UserName, (error, response) => {
        if (error) {
            const message =  "Something went wrong!";

            sendResponse(res, message, error);

            return;
        }
        if(!!response.Email){
            
            const message =  "Email not setup for Heroku deployment!";
            sendResponse(res, message, "Not Supported");
            return;

            //sendResponse(res, "Success!!", response.error);
            // userDB.register(req.body.UserName, req.body.Password, (response) => {
            //     sendResponse(
            //         res,
            //         !response.error  ? "Success!!" : "Something went wrong!",
            //         response.error
            //     );
            // });
        }
        else{
            sendResponse(
                res,
                 "Email missing!",
                "Not in record."
            );
        }
    });
}

function login(query, res) {}

function sendResponse(res, message, error) {
    res.status(error !== undefined && error !== null ? 400 : 200).json({
        message: message,
        error: error,
    });
}