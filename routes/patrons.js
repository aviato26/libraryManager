const express = require('express');
const router = express.Router();
const Books = require('../models').Books;
const Loans = require('../models').Loans;
const Patrons = require('../models').Patrons;
const parser = require('body-parser');
let patron;

router.get('/all_patrons', (req, res) => {
  Patrons.findAll()
  .then(data => {
    res.render('../views/all_patrons.pug',
    {
        data
    })
  })
  .catch(err => console.log(err))
})

router.get('/patron_detail/:id', (req, res) => {
    let patron = {};

    Patrons.findById(req.params.id)
    .then(data => {
      patron.id = data.dataValues.id;
      patron.first_name = data.dataValues.first_name;
      patron.last_name = data.dataValues.last_name;
      patron.address = data.dataValues.address;
      patron.email = data.dataValues.email;
      patron.library_id = data.dataValues.library_id;
      patron.zip_code = data.dataValues.zip_code;
    })
    .then(() => {
      Loans.findAll({
        where: {
          patron_id: patron.id
        },
        include: [{model: Books}]
      })
        .then(loans => {
          return loans.map(c => {
            return {
              loan_id: c.dataValues.id,
              book_id: c.dataValues.book_id,
              title: c.dataValues.Book.dataValues.title,
              patron: `${patron.first_name} ${patron.last_name}`,
              loaned_on: c.dataValues.loaned_on,
              return_by: c.dataValues.return_by,
              returned_on: c.dataValues.returned_on
            }
          })
        })
        .then(loans => {
          res.render('../views/patron_detail.pug',{
            patron,
            loans
          })
        })
      })
      .catch(err => console.log(err))
    })

  router.post('/patron_detail/:id', (req, res) => {
    Patrons.findById(req.params.id)
    .then(data => {
      data.update(req.body)
    })
    .then(() => {
      res.redirect('/all_patrons')
    })
    .catch(err => console.log(err))
  })

  router.get('/new_patrons', (req, res) => {
    res.render('../views/new_patron.pug')
  })

  router.post('/new_patrons', (req, res) => {
    Patrons.build({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      address: req.body.address,
      email: req.body.email,
      library_id: req.body.library_id,
      zip_code: req.body.zip_code
    })
    .save()
    .then(() => res.redirect('/all_patrons'))
    .catch(err => console.log(err))
  })

module.exports = router;
