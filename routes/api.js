const express = require('express');
const router = express.Router();

const User = require('../models/User');
const Stock = require('../models/Stock');
const SHInvestService = require('../services/ShinhanInvest');
const OneSignal = require('../services/OneSignal');

// TODO: 푸시 메세지 테스트
router.get('/api/notification/test', async (req, res) => {
  const stock = await Stock.getStockByCode('USAAAPL');
  
  OneSignal.sendStockRewardReceiveNotification(stock, 1.45).then(response => {
    res.status(200).send(response);
  });
});

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

// 주식 지급
router.post('/api/store/:storeId/pay-stock', (req, res) => {
  const storeId = req.params.storeId;

  const userId = req.query.user_id;
  const stockCode = req.query.stock_code;
  const wonPrice = req.query.won_price;

  // TODO: 주식 지급했을 때, 푸시 메시지 발송

  SHInvestService.payStock(storeId, userId, stockCode, wonPrice).then(() => {
    res.status(200).send('Success');
  });
});

// 주식 리워드 요약
router.get('/api/user/:userId/stock-reward/summary', async (req, res) => {
  const userId = req.params.userId;

  const stockRewards = await User.getStockRewardSummary(userId);
  
  // 현재가 반영
  for (let stockReward of stockRewards) {
    const stock = await SHInvestService.getStockCurrentPrice(stockReward.stock_code);
    stockReward.current_unit_price = stock.price;
  }

  res.status(200).send(stockRewards);
});

// 주식 리워드 히스토리
router.get('/api/user/:userId/stock-reward/history', async (req, res) => {
  const userId = req.params.userId;
  const stockId = req.query.stock_id;

  const stockRewards = await User.getStockRewardHistory(userId, stockId);
  res.status(200).send(stockRewards);
});

module.exports = router;
