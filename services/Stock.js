const MariaDB = require('../database/MariaDB');

class Stock {
  getStockByCode(stockCode) {
    return new Promise((resolve, reject) => {
      console.log('[주식] 조회(code)');

      return MariaDB.query(`SELECT * FROM stock WHERE code = "${stockCode}"`).then(({ client, res }) => {
        MariaDB.close(client);
        return resolve(res[0]);
      }).catch((err) => {
        console.log(`[주식] 조회(code) 오류: ${err}`);
        MariaDB.close(client);
        return reject(`오류: ${err}`);
      });
    });
  }
}

module.exports = new Stock();
