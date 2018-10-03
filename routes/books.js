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
  .catch(err => console.log(err))
})

router.get('/books/:id', (req, res) => {
  let book = {};

  Books.findById(req.params.id)
  .then(data => {
      book.id = data.dataValues.id;
      book.title = data.dataValues.title;
      book.author = data.dataValues.author;
      book.genre = data.dataValues.genre;
      book.first_published = data.dataValues.first_published;
      book.loan = {};
  })
  .then(data => {
    Loans.findAll({
      where: {
        book_id: book.id
      },
      include: [{model: Patrons}]
    })
    .then(loans => {
      return loans.map(c => {
        return {
          title: book.title,
          loan_id: c.dataValues.id,
          patron_id: c.dataValues.Patron.dataValues.id,
          patron: `${c.dataValues.Patron.dataValues.first_name} ${c.dataValues.Patron.dataValues.last_name}`,
          loaned_on: c.dataValues.loaned_on,
          return_by: c.dataValues.return_by,
          returned_on: c.dataValues.returned_on
        }
      })
    })
    .then(loans => {
      res.render('../views/book_detail.pug',
        {
          book,
          loans
        }
      )
    })
  })
  .catch(err => console.log(err))
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
  .catch(err => console.log(err))
})

router.get('/checked_books', (req, res) => {
  Loans.findAll({
    include: [
      {model: Books}
    ]
  })
  .then(data => {
    return data.filter(item => item.dataValues.returned_on === null)
    })
    .then(data => {
      return data.map(c => c.dataValues.Book)
    })
    .then(book => {
    res.render('../views/checked_books.pug',
      {
        book
      }
    )
  })
  .catch(err => console.log(err))
})

router.get('/overdue_books', (req, res) => {
  Loans.findAll({
    include: [
      {model: Books}
    ]
  })
  .then(data => {
    return data.filter(c => {
      let due = new Date(c.dataValues.return_by)
      let today = new Date()
      return ((today >= due) && (c.dataValues.returned_on === null)) ? true : false;
    })
  })
  .then(data => {
    return data.map(c => c.dataValues.Book)
  })
  .then(books => {
    res.render('../views/overdue_books.pug',
      {
        books
      }
    )
  })
  .catch(err => console.log(err))
})

router.get('/new_book', (req, res) => {
  res.render('../views/new_book.pug')
})

module.exports = router;
