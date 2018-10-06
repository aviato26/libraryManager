const express = require('express');
const router = express.Router();
const Books = require('../models').Books;
const Loans = require('../models').Loans;
const Patrons = require('../models').Patrons;
const parser = require('body-parser');
const moment = require('moment');

let loanObj = (data) => {
  return data.map(c => {
    return {
    loanId: c.dataValues.id,
    loanOn: c.dataValues.loaned_on,
    returnBy: c.dataValues.return_by,
    returnedOn: c.dataValues.returned_on,
    title: c.dataValues.Book.dataValues.title,
    bookId: c.dataValues.Book.dataValues.id,
    patron: `${c.dataValues.Patron.dataValues.first_name} ${c.dataValues.Patron.dataValues.last_name}`,
    patronId: c.dataValues.Patron.dataValues.id
    }
  })
}

router.get('/all_loans', (req, res) => {
  Loans.findAll({
    include: [
      {model: Books},
      {model: Patrons}
    ]
  })
  .then(data => {
    return loanObj(data)
  })
  .then(data => {
    res.render('all_loans.pug',
      {
        data
      }
    )
  })
  .catch(err => console.log(err))
})

router.get('/overdue_loans', (req, res) => {
  Loans.findAll({
    include: [
      {model: Books},
      {model: Patrons}
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
    return loanObj(data)
  })
  .then(data => {
    res.render('overdue_loans.pug',
      {
        data
      }
    )
  })
  .catch(err => console.log(err))
})

router.get('/checked_loans', (req, res) => {
  Loans.findAll({
    include: [
      {model: Books},
      {model: Patrons}
    ]
  })
  .then(data => {
    return data.filter(c => c.dataValues.returned_on === null)
  })
  .then(data => {
    return loanObj(data)
  })
  .then(data => {
    res.render('checked_loans.pug',
      {
        data
      }
    )
  })
  .catch(err => console.log(err))
})

router.get('/new_loan', (req, res) => {
  let books;
  let patrons;

  Books.findAll()
  .then(data => {
    books = data.map(c => c.dataValues)
  })
  .then(() => {
    Patrons.findAll()
    .then(data => {
      let date = new Date();
      patrons = data.map(c => c.dataValues)
      res.render('new_loan.pug',
      {
        books,
        patrons,
        date
      })
    })
  })
  .catch(err => console.log(err))
})

router.post('/new_loan', (req, res) => {
  let books;

  Books.findAll({
    where: {
      title: req.body.book
    }
  })
  .then(data => {
    return books = {
      book_id: data[0].dataValues.id
    }
  })
  .then(data => {
    Patrons.findAll({
      where: {
        first_name: req.body.patron.split(' ')[0],
        last_name: req.body.patron.split(' ')[1]
      }
    })
    .then(data => {
      books.patId = data[0].dataValues.id;

      Loans.build({
        book_id: books.book_id,
        patron_id: books.patId,
        loaned_on: req.body.loanedOn,
        return_by: req.body.returnBy
      })
      .save()
      res.redirect('/all_loans');
      })
    })
    .catch(err => console.log(err))
  })

  router.get('/return_book/:id', (req, res) => {
    let patron = {};

    Loans.findById(req.params.id)
    .then(loanId => {
      patron.loanId = loanId.dataValues.id;
      patron.loanOn = loanId.dataValues.loaned_on;
      patron.returnBy = loanId.dataValues.return_by;
      patron.bookId = loanId.dataValues.book_id;

      Patrons.findById(loanId.dataValues.patron_id)
      .then(data => {
        patron.name = `${data.dataValues.first_name} ${data.dataValues.last_name}`;

        Books.findById(patron.bookId)
        .then(data => {
          patron.title = data.dataValues.title;

          res.render('return_book.pug',
            {
              patron
            }
          )
        })
      })
    })
    .catch(err => console.log(err))
  })


  router.post('/return_book/:id', (req, res) => {
    if(moment(req.body.date, 'YYYY-MM-DD', true).isValid()){
        Loans.findById(req.params.id)
        .then(loan => {
          loan.update({returned_on: req.body.date})
        })
        .then(() => res.redirect('/all_loans'))
    }
    else {
      res.redirect('/all_loans')
      throw Error('please enter date in YYYY-MM-DD format')
    }
    })

module.exports = router;
