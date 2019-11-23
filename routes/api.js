const express = require('express');
const router = express.Router();

const User = require('../models/User');
const Stock = require('../models/Stock');
const SHInvestService = require('../services/ShinhanInvest');
const SHBankService = require('../services/ShinhanBank');
const OneSignal = require('../services/OneSignal');

/**
 * @api {get} /stock/:code/calculate 지급 예상 주식 수 조회
 * @apiName ConvertKRW2Stock
 * @apiGroup StockReward
 *
 * @apiParam {String} code 종목코드
 * @apiParam {Number} won_price 금액(KRW)
 * 
 * @apiSuccess {Number} expectedAmount 지급 예상 주식 수
 */
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

/**
 * @api {get} /store/:storeId/pay-stock 주식리워드 지급
 * @apiName PayStockReward
 * @apiGroup StockReward
 *
 * @apiParam {Number} storeId 상점 고유번호
 * @apiParam {Number} user_id 유저(수신자) 고유번호
 * @apiParam {String} stock_code 종목코드
 * @apiParam {Number} won_price 금액(KRW)
 * 
 * @apiSuccess Success 주식 주문 완료
 */
router.get('/api/store/:storeId/pay-stock', (req, res) => {
  const storeId = req.params.storeId;

  const userId = req.query.user_id;
  const stockCode = req.query.stock_code;
  const wonPrice = req.query.won_price;

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

// 주식 배당
router.get('/api/stock/:code/dividend', async (req, res) => {
  const stockCode = req.params.code;
  const dividendPerStock = req.query.dividend_per_stock;

  const stock = await Stock.getStockByCode(stockCode);
  const stockHolders = await Stock.getStockholders(stock);

  // 배당금 이체
  for (let stockHolder of stockHolders) {
    const dividend = stockHolder.amount * dividendPerStock;
    console.log(`[주식 배당] ${stock.name} / ${stockHolder.user_name} (${dividend}원)`);

    await SHBankService.transferDomestic(`${stock.name} 배당`, `${stock.name} 배당`);
    // 푸시 메세지 발송
    const pushResult = await OneSignal.sendDividendReceiveNotification(stock.name, dividend);
    console.log(`[OneSignal] 푸시 발송됨: ${pushResult.id}`);
  }

  res.status(200).send('배당금 나누기 성공');
});

module.exports = router;
