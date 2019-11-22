const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  // TODO: Test
  res.render('index', {
    length: 10,
  });
});

module.exports = router;
