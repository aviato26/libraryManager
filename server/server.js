const express = require('express');
const pug = require('pug');
const app = express();

app.get('/', (req, res) => {
  res.render('../views/home.pug')
})

app.listen(3000, console.log('server is listening'))
