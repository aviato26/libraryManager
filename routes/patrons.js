const express = require('express');
const router = express.Router();
const Books = require('../models').Books;
const Loans = require('../models').Loans;
const Patrons = require('../models').Patrons;
const parser = require('body-parser');
let patron;

router.get('/all_patrons.pug', (req, res) => {
  res.render('../views/all_patrons.pug')
})

router.get('/patron_detail/:id', (req, res) => {
    Patrons.findById(req.params.id)
    .then(data => {
      patron = data.dataValues
      res.render('../views/patron_detail.pug',{
        patron
      })
    })
  })

module.exports = router;
