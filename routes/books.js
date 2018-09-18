const express = require('express');
const router = express.Router();
const Books = require('../models').Books

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
    console.log(req)
    router.get('/book_detail.pug', (req, res) => {
      res.render('../views/book_detail.pug')
    })
  })
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
