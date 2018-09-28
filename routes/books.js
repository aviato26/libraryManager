const express = require('express');
const router = express.Router();
const Books = require('../models').Books;
const Loans = require('../models').Loans;
const Patrons = require('../models').Patrons;
const parser = require('body-parser');
let details;
let newBook;
let loans;
let patrons;


router.use(parser());

router.get('/all_books', (req, res) => {
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
  Books.findAll({
    include: [{model: Loans,include: [{model: Patrons}]}],
    where: {id: req.params.id}
  })
  .then(data => {
    if(data[0].dataValues.Loans.length === 0){
      Books.findById(req.params.id)
      .then(data => {
        details = data.dataValues;
        res.render('../views/book_detail.pug',
          {
            details
          }
        )
      })
    }
      else if(data[0].dataValues.Loans.length > 0){
        patron = data[0].dataValues.Loans[0].dataValues.Patron.dataValues;
        loans = data[0].dataValues.Loans[0].dataValues;
        details = data[0].dataValues;
        res.render('../views/book_detail.pug',
          {
            details,
            patron,
            loans
          }
        )
      }
  })
})

router.post('/books/:id', (req, res) => {
  Books.findById(req.params.id)
  .then((data) => {
    data.update(req.body)
  })
  .then(() => {
    res.redirect('/all_books')
  })
  .catch(err => console.log(err))
})

router.post('/new_book', (req, res) => {
  newBook = Books.build({
    title: req.body.title,
    author: req.body.author,
    genre: req.body.genre,
    first_published: req.body.year
  })
  .save()
  res.redirect('/all_books')
})

router.get('/checked_books', (req, res) => {
  res.render('../views/checked_books.pug')
})

router.get('/overdue_books', (req, res) => {
  res.render('../views/overdue_books.pug')
})

router.get('/new_book', (req, res) => {
  res.render('../views/new_book.pug')
})

module.exports = router;
