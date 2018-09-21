const express = require('express');
const router = express.Router();
const Books = require('../models').Books;
const Loans = require('../models').Loans;
const Patrons = require('../models').Patrons;
const parser = require('body-parser');
let sql = require('../models').sequelize;
let details;
let newBook;


router.use(parser());

router.get('/all_books.pug', (req, res) => {
  Books.findAll().then(notFiltered => {
     return notFiltered.map(c => c.dataValues)
  })
  .then(filtered => {
    res.render('../views/all_books.pug',
      {
        filtered
      }
    )
  })
})

router.get('/books/:id', (req, res) => {
  Books.findById(req.params.id)
  .then((data) => {
    details = data.dataValues;
    res.render('../views/book_detail.pug',
      {
        details
      }
    )
  })
})

router.post('/new_book.pug', (req, res) => {
  newBook = Books.build({
    title: req.body.title,
    author: req.body.author,
    genre: req.body.genre,
    first_published: req.body.year
  })
  .save()
  res.redirect('/all_books.pug')
  console.log(typeof req.body.title === '')
})

router.get('/checked_books.pug', (req, res) => {
  res.render('../views/checked_books.pug')
})

router.get('/overdue_books.pug', (req, res) => {
  res.render('../views/overdue_books.pug')
})

router.get('/new_book.pug', (req, res) => {
  res.render('../views/new_book.pug')
})

module.exports = router;
