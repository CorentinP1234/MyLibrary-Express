var express = require('express');
var router = express.Router();
const auth = require("../auth.js");
const { Sequelize, connection } = require("./../db.connection");
const bookController = require("./../controllers/book.controller")


// Login middleware
router.use(async (req, res, next) => {
  let isLoggedIn = await auth.isLoggedIn(req, res)

  // if logged in, proceed to route
  // else, say the access is denied
  if (isLoggedIn) {
    next()
  } else {
    res.status(403).send("Access denied")
  }
})

router.post("/post/book", async function (req, res, next) {
  console.log('POST /post/book')
  bookController.create(
    req.body.userId,
    {
      id: req.body.bookId,
      title: req.body.title,
      author: req.body.author,
      publishingHouse: req.body.publishingHouse,
      publishingDate: req.body.publishingDate,
      available: req.body.available,
      loaned: req.body.loaned,
      image: req.body.image,
    }
  )
})

router.post("/post/edit/", async function (req, res, next) {
  console.log('POST /post/edit/')
  bookController.update(
    req.body.userId,
    {
      id: req.body.bookId,
      title: req.body.title,
      author: req.body.author,
      publishingHouse: req.body.publishingHouse,
      publishingDate: req.body.publishingDate,
      available: req.body.available,
      loaned: req.body.loaned,
      image: req.body.image
    }
  )
})

router.post("/post/delete", async function (req, res, next) {
  bookController.delete(req.body.id, req.body.userId)
})



router.post('/books/:id', async function (req, res, next) {
  res.header('Content-Type', 'application/json');
  var json = await bookController.get(req.params.id)
  res.send(json)
})


module.exports = router;