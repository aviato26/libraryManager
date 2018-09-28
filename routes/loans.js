const express = require('express');
const router = express.Router();
const Books = require('../models').Books;
const Loans = require('../models').Loans;
const Patrons = require('../models').Patrons;
const parser = require('body-parser');

let loanObj = (data) => {
  return data.map(c => {
    return {
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
    console.log(data)
    res.render('overdue_loans.pug',
      {
        data
      }
    )
  })
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
})

module.exports = router;
