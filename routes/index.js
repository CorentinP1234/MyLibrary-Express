var express = require('express');
var router = express.Router();
const { Sequelize, connection } = require("./../db.connection");
const bookStoredInExpress = require("./../data/books.json")
const users = require("../models/user.model")(connection, Sequelize);
const sessions = require("./../controllers/session.controller");
const bookController = require("./../controllers/book.controller")

users.sync();

//Sign in
router.post('/signin', async function (req, res, next) {
    console.log("POST /sigin")
    var newId;


    await maxId('users')
        .then(maxId => {
            // Get a new Id
            newId = maxId + 1

            // Create user
            users.create({
                id: newId,
                fullname: req.body.fullname,
                email: req.body.email,
                password: req.body.password
            })

        });

    // Create new BookTable named 'books{newId}'
    const newBookTable = require("./../models/book.model")('books' + newId, connection, Sequelize)
    await newBookTable.sync()

    console.log("!!! new users, get a standard database of books for now")
    for (book of bookStoredInExpress) {
        newBookTable.create(book)
    }

    var session = await sessions.create(newId)
    res.send(JSON.stringify({
        id: newId,
        token: session.token
    }));
})

router.post('/isTokenValid', async function (req, res, next) {
    console.log("POST /isTokenValid")
    const sessions = require("../controllers/session.controller");


    sessions.findByToken(req.body.token)
        .then(ses => {
            if (ses != null)
                res.send(JSON.stringify({ msg: "token is valid" }))
            else {
                res.send(JSON.stringify({ msg: "token is not valid" }))
            }
        });
})

async function maxId(tableName) {
    const maxId = await connection.query("SELECT MAX(id) FROM " + tableName)
    var res = maxId[0][0]['MAX(id)']

    
    if (res == null)
        return 1;
    return res;
}


module.exports = router;