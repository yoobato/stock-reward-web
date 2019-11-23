const axios = require('axios');
const config = require('config');

// 신한은행 API 서비스
class SHBank {
  constructor() {
    this.restClient = axios.create({
      baseURL: config.get('api.bank'),
      timeout: 10000,
    });
  }

  // 원화(KRW) 이체
  transferDomestic(memoForUs = "", memoForReceiver = "") {
    console.log('[신한은행 API] 이체(원화)');
    
    return this.restClient.post('/v1/transfer/krw', {
      dataHeader: {},
      dataBody: {
        serviceCode: "D2600",
        거래일련번호: "233023",
        클라이언트_거래번호: "0510134537",
        입금계좌메모: memoForReceiver,
        출금계좌메모: memoForUs,
      }
    }).then(response => {
      return Promise.resolve(response);
    });
  }
}

module.exports = new SHBank();
