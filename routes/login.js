var express = require('express');
var router = express.Router();
const auth = require("../auth.js");
const sessions = require("../controllers/session.controller");


router.post("/", auth.login);

router.post("/check", async function (req, res) {
    let isLoggedIn = await auth.isLoggedIn(req, res)


    if (isLoggedIn) {
        res.send(JSON.stringify({ isLoggedIn: true }))
    } else {
        res.send(JSON.stringify({ isLoggedIn: false }))
    }
});

router.post("/disconnect", async function (req, res) {
    await auth.disconnect(req, res);
})

router.post("/getId", async function (req, res) {
    let ses = await sessions.findByToken(req.body.token)


    console.log("POST /login/getId")
    // const user = await Users.findOne({ where: { token: req.body.token } })
    res.send(JSON.stringify({ id: ses.userId }))
})


module.exports = router;