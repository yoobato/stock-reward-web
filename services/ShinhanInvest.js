const logger = require('winston-this')('SHInvest-service');
const axios = require('axios');

class SHInvest {
  constructor() {
    this.restClient = axios.create({
      baseURL: 'http://10.3.17.61:8082',
      timeout: 10000,
    });
  }

  // acctNo	String		계좌번호
  // acctPwd	String		계좌 비밀번호
  // gicCode	String		종목코드 (취소시 공백)
  // sellBuyTpCode	String		매도매수구분코드
  // ordQty	String		주문수량 (취소시 공백)
  // ordScdlYmd	String		주문예정일자 (취소시 필요)
  // resvSeq	String		예약순번 (취소시 필요)
  orderForeignStockSimple(acctNo, acctPwd, gicCode, sellBuyTpCode, ordQty, ordScdlYmd, resvSeq) {
    logger.info(`Order Foreign Stock`);

    return this.restClient.post('/v1/fstock/simple/ord', {
      dataHeader: {},
      dataBody: {
        acctNo: acctNo,
        acctPwd: acctPwd,
        gicCode: gicCode,
        sellBuyTpCode: sellBuyTpCode,
        ordQty: ordQty,
        ordScdlYmd: ordScdlYmd,
        resvSeq: resvSeq,
      }
    }).then(response => {
      return Promise.resolve(response.data.dataBody.resvSeq);
    });
  }
}

module.exports = new SHInvest();
