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
// router.get('/api/stock/:code/current-price', (req, res) => {
//   const stockCode = req.params.code;
//   SHInvestService.getStockCurrentPrice(stockCode).then(price => {
//     res.status(200).send({
//       price: price
//     });
//   });
// });

// 구매 가능 주식 수 조회 (n원으로 몇 주 구매 가능한지)
router.get('/api/stock/:code/calculate', (req, res) => {
  const stockCode = req.params.code;
  const won = req.query.won;

  SHInvestService.getStockCurrentPrice(stockCode).then(price => {
    const amount = won / price;
    res.status(200).send({
      expectedAmount: amount.toFixed(2)
    });
  });
});

// TODO: 주식 주문 (주문 + 체결)

// TODO: 주식 리워드 잔고 조회

module.exports = router;
