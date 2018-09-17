const express = require('express');
const router = express.Router();

router.get('/all_loans.pug', (req, res) => {
  res.render('../views/all_loans.pug')
})

module.exports = router;
