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
  const wonPrice = req.query.won_price;

  SHInvestService.getStockCurrentPrice(stockCode).then(stock => {
    const availableAmount = wonPrice / stock.price;
    res.status(200).send({
      expectedAmount: availableAmount.toFixed(2)
    });
  });
});

// TODO: POST
// 주식 지급
router.get('/api/store/:storeId/pay-stock', (req, res) => {
  const storeId = req.params.storeId;

  const userId = req.query.user_id;
  const stockCode = req.query.stock_code;
  const wonPrice = req.query.won_price;

  SHInvestService.payStock(storeId, userId, stockCode, wonPrice).then(() => {
    res.status(200).send('Success');
  });
});

// TODO: 주식 리워드 잔고 조회

module.exports = router;
