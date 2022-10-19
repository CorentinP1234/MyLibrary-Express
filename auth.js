const users = require("./controllers/user.controller.js");
const sessions = require("./controllers/session.controller");

exports.login = async (req, res) => {
    let user = await users.findByEmail(req, res)


    // if the user exists and password matches
    if(user == null || user == undefined) {
        res.status(404);
        res.send("User account does not exists");

        return;
    }
    
    console.log()
    console.log("user.id = " + user.id);
    console.log("user.password = " + user.password);
    console.log("req.body.password = " + req.body.password);

    if (user && user.id && user.password == req.body.password) {
        // search for a session for this user
        let session = await sessions.findByUserId(user.id)

        // if there is a session, check if it's expired
        let isTokenExpired = session ? (new Date(session.validUntil) - new Date() <= 0) : true
        let token = ""

        // if the session exists and is not expired, go on
        // else, create a session
        if (session && !isTokenExpired) {
            console.log("user exists")
            token = session.token
        } else {
            console.log("create new")
            session = await sessions.create(user.id)
            if (session) {
                token = session.token
            }
        }

        res.send(JSON.stringify({ token: token, id: user.id }))
    } else {
        res.status(403).send("Access denied")
    }
}

exports.isLoggedIn = async (req, res) => {
    let token = req.body.token


    if (token) {
        let session = await sessions.findByToken(token)

        if (session) {
            let isTokenExpired = (new Date(session.validUntil) - new Date()) <= 0
            console.log(session.validUntil, isTokenExpired)

            if (session && !isTokenExpired) {
                console.log("all good!, authentification passed")
                return true
            }
            console.log("token expired!")
            return false
        }

        console.log("no session!")
        return false
    }

    console.log("no token!")
    return false
}

exports.disconnect = async (req, res) => {
    if(req.body.token) {
        let connectionState = await sessions.delete(req.body.token);


        if(Number.isNaN(connectionState) || connectionState == undefined) {
            res.status(500);
            res.send("Couldn't disconnect you from your session");
        } else if(connectionState != 1) {
            res.status(404);
            res.send("Token not found");
        } else {
            res.send("You have been disconnected");
        }
    } else {
        res.status(400);
        res.send("Missing parameters");
    }
}