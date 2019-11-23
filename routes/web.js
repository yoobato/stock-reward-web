const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  // TODO: 상품 목록
  res.render('index', {
    length: 10,
  });
});

router.get('/detail', (req, res) => {
  // TODO: 상품 상세
  res.render('detail', {
    length: 5,
  });
});

module.exports = router;
