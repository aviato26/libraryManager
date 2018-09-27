const express = require('express');
const router = express.Router();
const Books = require('../models').Books;
const Loans = require('../models').Loans;
const Patrons = require('../models').Patrons;
const parser = require('body-parser');
let books;
let loans;
let totalLoans;

router.get('/all_loans.pug', (req, res) => {
  Books.findAll({
    include: [
      {
        model: Loans,
        include: [
          {
          model: Patrons
          }
        ]
      }
    ]
  })
  .then(data => {
    return data.filter(c => c.dataValues.Loans.length > 0)
  })
  .then(loan => {
      books = loan.map(c => { return title= {t: c.dataValues.title}})
      loans = loan.map(c => {
            return c.Loans.map(c => {
              return {
                firstName: c.dataValues.Patron.dataValues.first_name,
                lastName: c.dataValues.Patron.dataValues.last_name,
                loanOn: c.dataValues.loaned_on,
                returnBy: c.dataValues.return_by,
                returnOn: c.dataValues.returned_on
              }
          })
        })
      })
  .then((filteredLoan) => {
    totalLoans = {...books};
    console.log(totalLoans)
    res.render('../views/all_loans.pug',
      {
        filteredLoan
      }
    )
  })
})

module.exports = router;
