const express = require('express');
const router = express.Router();

router.get('/all_patrons.pug', (req, res) => {
  res.render('../views/all_patrons.pug')
})

module.exports = router;
