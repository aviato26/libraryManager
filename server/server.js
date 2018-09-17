const express = require('express');
const pug = require('pug');
const app = express();
let sql = require('../models').sequelize;

app.get('/', (req, res) => {
  res.render('../views/home.pug')
})

app.use(require('../routes/books.js'));

app.use(require('../routes/patrons.js'));

app.use(require('../routes/loans.js'));

sql.sync()
   .then(() => {
     app.listen(3000, console.log('server is listening'))
   })
