var express = require('express');
var router = express.Router();
const { Sequelize, connection } = require("./../db.connection");
const bookStoredInExpress = require("./../data/books.json")
const users = require("../models/user.model")(connection, Sequelize);
const sessions = require("./../controllers/session.controller");
const bookController = require("./../controllers/book.controller")

users.sync();


// Working
// router.post("/post/book", async function (req, res, next) {
//     console.log('POST /post/book')
//     const tableName = "books" + req.body.userId
//     const BookTable = require("./../models/book.model")(tableName, connection, Sequelize)
//     await BookTable.sync()

//     maxId(tableName).then(maxId => {
//         req.body.bookId = maxId + 1
//         BookTable.create({
//             id: req.body.bookId,
//             title: req.body.title,
//             author: req.body.author,
//             publishingHouse: req.body.publishingHouse,
//             publishingDate: req.body.publishingDate,
//             available: req.body.available,
//             loaned: req.body.loaned,
//             image: req.body.image,
//         })
//         console.log("Creating new book (id: " + (maxId + 1) + ") in " + tableName)
//     }).catch(e => console.log("Error", e))
// })

// Working
// router.post("/post/edit/", async function (req, res, next) {
//     console.log('POST /post/edit/')

//     const tableName = "books" + req.body.userId
//     const BookTable = require("./../models/book.model")(tableName, connection, Sequelize)
//     await BookTable.sync()

//     await BookTable.update({
//         id: req.body.bookId,
//         title: req.body.title,
//         author: req.body.author,
//         publishingHouse: req.body.publishingHouse,
//         publishingDate: req.body.publishingDate,
//         available: req.body.available,
//         loaned: req.body.loaned,
//         image: req.body.image,
//     },
//         {
//             where: { id: req.body.bookId }
//         }).catch(e => console.log("Error", e))
//     console.log("Editing book (id: " + req.body.bookId + ") in " + tableName)
// })

// router.post("/post/delete", async function (req, res, next) {
//     bookController.delete(req.body.id, req.body.userId)
// })

// !!! it should not be used anymore
// router.get('/books', async function (req, res, next) {
//     console.log("this function should not be used anymore, find me if u saw me")
//     await BookTable.findAll()
//         .then(books => {
//             res.header('Content-Type', 'application/json');  // Specify file type
//             res.send(JSON.stringify(books));
//         })
//         .catch(e => console.log("Error", e)
//         )
// })

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