const axios = require('axios');
const config = require('config');
const moment = require('moment');

const Stock = require('../models/Stock');

// 신한금융투자 API 서비스
class SHInvest {
  constructor() {
    this.restClient = axios.create({
      baseURL: config.get('api.invest'),
      timeout: 10000,
    });
  }

  // 주식 현재가
  async getStockCurrentPrice(stockCode) {
    const stock = await Stock.getStockByCode(stockCode);
    if (stock.is_domestic) {
      // 국내
      return this._getDomesticStockCurrentPrice(stock);
    } else {
      // 해외
      return this._getForeignStockCurrentPrice(stock);
    }
  }

  // 국내주식 현재가
  _getDomesticStockCurrentPrice(stock) {
    console.log('[신한금융투자 API] 국내주식 현재가 주가추이');
    
    return this.restClient.post('/v1/stock/trdprc-trend', {
      dataHeader: {},
      dataBody: {
        code: stock.code,
      }
    }).then(response => {
      let price = response.data.dataBody.trdprc;
      // 콤마(,) 제거
      price = parseFloat(price.replace(/,/g, ''));
      return Promise.resolve(price);
    });
  }

  // 해외주식 현재가
  _getForeignStockCurrentPrice(stock) {
    console.log('[신한금융투자 API] 해외주식 현재가 주가추이');
    
    return this.restClient.post('/v1/fstock/trdprc-trend', {
      dataHeader: {},
      dataBody: {
        userid: "0123456789",
        isdelayed: "DDDDDD",
        country_code: "USA",
        symbol: stock.code.substring(3),
        gic: stock.code,
        trade_date: moment().format("yyyyMMdd"),
        limit_count: "60",
        time_kind: "D",
      }
    }).then(response => {
      let price = response.data.dataBody.historyList[0].trdprc_1;
      // TODO: 환율
      price *= 1200;
      return Promise.resolve(price);
    });
  }
}

module.exports = new SHInvest();
