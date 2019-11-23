const axios = require('axios');
const config = require('config');
const moment = require('moment');

const Stock = require('../models/Stock');
const User = require('../models/User');
const OneSignal = require('./OneSignal');

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

      // 테스트 데이터 (임의의 현재가)
      if (stock.id == 1) {
        // 삼성전자
        price = 51600;
      } else if (stock.id == 2) {
        // LF
        price = 17750;
      } else if (stock.id == 3) {
        // 한샘
        price = 60500;
      } else if (stock.id == 6) {
        // 신한지주
        price = 44200;
      } else {
        price = 50000;
      }
      // -15% ~ +15% 사이의 random variation을 둔다. (테스트용)
      price = Math.round(price * (1 + ((Math.random() * 30 - 15) / 100)));

      stock.price = price;
      return Promise.resolve(stock);
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
      // TODO: 현재 환율
      price *= 1200;

      // 테스트 데이터 (임의의 현재가)
      if (stock.id == 4) {
        // 애플
        price = 309096;
      } else if (stock.id == 5) {
        // 힐튼
        price = 119515;
      } else {
        price = 100000;
      }
      // -15% ~ +15% 사이의 random variation을 둔다. (테스트용)
      price = Math.round(price * (1 + ((Math.random() * 30 - 15) / 100)));

      stock.price = price;
      return Promise.resolve(stock);
    });
  }

  // 주식 지급
  async payStock(storeId, userId, stockCode, wonPrice) {
    const stock = await this.getStockCurrentPrice(stockCode).then(stock => {
      return stock;
    });

    // 지급할 주식 수
    const stockQuantity = (wonPrice / stock.price).toFixed(2);

    // 우리한테 지급할 주식이 남아있지 않은 경우, 주식을 새로 구매해서 지급한다.
    if (stock.balance < stockQuantity) {
      // 주식을 구매할 때는 1주를 기본 단위로 구매한다
      const buyStockQuantity = Math.ceil(stockQuantity);

      // 주식을 새로 구매해서 지급 (주문 -> 체결)
      let contractQuantity = 0;
      if (stock.is_domestic) {
        // 국내
        let orderId = await this._orderDomesticStock(stock, buyStockQuantity);
        
        // FIXME: 임의의 체결내역 데이터
        orderId = "22668";
        
        const contract = await this._checkDomesticStockContract(stock, orderId);
        contractQuantity = contract.cntr_qty;
        stock.price = contract.cntr_uv;

        // FIXME: 임의의 체결수량 및 체결단가 데이터
        contractQuantity = buyStockQuantity;
        stock.price = wonPrice;
      } else {
        // 해외
        let orderId = await this._orderForeignStock(stock, buyStockQuantity);

        // FIXME: 임의의 체결내역 데이터
        orderId = "21";

        const contract = await this._checkForeignStockContract(stock, orderId);
        contractQuantity = contract.cntrQty;
        stock.price = contract.cntrUv;

        // FIXME: 임의의 체결수량 및 체결단가 데이터
        contractQuantity = buyStockQuantity;
        stock.price = wonPrice;
      }

      // 구매한 주식 반영
      const newBalanace = stock.balance + contractQuantity;
      await Stock.updateStockBalance(stock, newBalanace);
      stock.balance = newBalanace;
    }

    // 고객에게 주식 지급
    // 1. 주식 잔고 차감
    const newBalanace = stock.balance - stockQuantity;
    await Stock.updateStockBalance(stock, newBalanace);
    stock.balance = newBalanace;

    // 2. 고객 주식 리워드 기록 추가
    await User.addStock(userId, storeId, stock, stockQuantity);

    // 3. 푸시 메세지 발송
    const pushResult = await OneSignal.sendStockRewardReceiveNotification(stock.name, stockQuantity);
    console.log(`[OneSignal] 푸시 발송됨: ${pushResult.id}`);
    
    return Promise.resolve();
  }

  // 국내주식 주문
  _orderDomesticStock(stock, quantity) {
    console.log('[신한금융투자 API] 국내주식 주문');
    
    return this.restClient.post('/v1/stock/order', {
      dataHeader: {},
      dataBody: {
        acct_no: config.get('account.number'),
        acct_gds_code: "01",
        acct_pwd: config.get('account.password'),
        acct_mang_dbrn_code: "",
        mrkt_tp_code: "",
        futr_repl_tp_code: "0",
        crd_deal_tp_code: "00",
        sell_buy_tp_code: "2",    // 매도=1, 매수=2
        stbd_code: stock.code,
        ord_qty: quantity,
        ord_uv: stock.price,
        regul_tmout_tp_code: "1",
        callv_type_code: "I",     // 시장가=1, 지정가=2, 조건부지정가=I
        ord_cond_tp_code: "0",
        crd_lndo_cmbn_ord_tp_code: "0",
        crd_lndo_ymd: "",
        orig_ord_no: "",
      }
    }).then(response => {
      return Promise.resolve(response.data.dataBody.ord_no);
    });
  }

  // 해외주식 주문
  _orderForeignStock(stock, quantity) {
    console.log('[신한금융투자 API] 해외주식 간편투자 주문');
    
    return this.restClient.post('/v1/fstock/simple/ord', {
      dataHeader: {},
      dataBody: {
        acctNo: config.get('account.number'),
        acctPwd: config.get('account.password'),
        sellBuyTpCode: "2",    // 매도=1, 매수=2
        gicCode: stock.code,
        ordQty: quantity,
        ordScdlYmd: "",
        resvSeq: "",
      }
    }).then(response => {
      return Promise.resolve(response.data.dataBody.resvSeq);
    });
  }
  
  // 국내주식 체결수량 및 체결단가 조회
  _checkDomesticStockContract(stock, orderId) {
    console.log('[신한금융투자 API] 국내주식 체결내역 조회');
    
    return this.restClient.post('/v1/stock/cntrlist', {
      dataHeader: {},
      dataBody: {
        acct_no: config.get('account.number'),
        acct_gds_code: "01",
        acct_pwd: config.get('account.password'),
        ord_ymd: moment().format("yyyyMMdd"),
        cntr_dcd_tp_code: "1",    // 전체=0, 체결=1, 미체결=2
        stbd_code: stock.code,
        sell_buy_tp_code: "2",    // 전체=0, 매도=1, 매수=2
        stbd_tp_code: "0",
        adup_tp_code: "1",        // 합산=0, 건별=1
        cash_crd_tp_code: "0",
      }
    }).then(response => {
      const contractList = response.data.dataBody.list;
      const contract = contractList.filter(contract => contract.ord_no == orderId);
      return Promise.resolve(contract[0]);
    });
  }

  // 해외주식 체결내역 조회
  _checkForeignStockContract(stock, orderId) {
    console.log('[신한금융투자 API] 해외주식 체결내역 조회');
    
    return this.restClient.post('/v1/fstock/simple/cntr', {
      dataHeader: {},
      dataBody: {
        qryStrtYmd: moment().format("yyyyMMdd"),
        qryEndYmd: moment().format("yyyyMMdd"),
      }
    }).then(response => {
      const contractList = response.data.dataBody.list;
      const contract = contractList.filter(contract => contract.resvSeq == orderId);
      return Promise.resolve(contract[0]);
    });
  }
}

module.exports = new SHInvest();
