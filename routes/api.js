const express = require('express');
const router = express.Router();

const SHInvestService = require('../services/ShinhanInvest');

// router.get('/api/user/:id', (req, res) => {
//   const userId = req.params.id;
//   UserService.getUser(userId).then(user => {
//     res.status(200).send(user);
//   });
// });

// router.get('/api/stock/:code', (req, res) => {
//   const stockCode = req.params.code;
//   StockService.getStockByCode(stockCode).then(stock => {
//     res.status(200).send(stock);
//   }).catch(err => {
//     console.log(err);
//     res.status(500).send(err);
//   });
// });

// 주식 현재가
router.get('/api/stock/:code/current-price', (req, res) => {
  const stockCode = req.params.code;
  SHInvestService.getStockCurrentPrice(stockCode).then(price => {
    res.status(200).send({
      price: price
    });
  });
});

module.exports = router;
