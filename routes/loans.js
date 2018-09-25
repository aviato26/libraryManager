const express = require('express');
const router = express.Router();
const Books = require('../models').Books;
const Loans = require('../models').Loans;
const Patrons = require('../models').Patrons;
const parser = require('body-parser');

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
    return data.map(c => {
    if(c.dataValues.Loans.length > 0){
      c.dataValues.Loans
      }
    })
  })
  .then(c => console.log(c))
  res.render('../views/all_loans.pug')
})

module.exports = router;
