const MariaDB = require('../database/MariaDB');

class Stock {
  getStockById(stockId) {
    return new Promise((resolve, reject) => {
      console.log('[주식] 조회 (ID)');

      return MariaDB.query(`SELECT * FROM stock WHERE id = "${stockId}"`).then(({ client, res }) => {
        MariaDB.close(client);
        return resolve(res[0]);
      }).catch((err) => {
        console.log(`[주식] 조회 (ID) 오류: ${err}`);
        MariaDB.close(client);
        return reject(`오류: ${err}`);
      });
    });
  }

  getStockByCode(stockCode) {
    return new Promise((resolve, reject) => {
      console.log('[주식] 조회 (code)');

      return MariaDB.query(`SELECT * FROM stock WHERE code = "${stockCode}"`).then(({ client, res }) => {
        MariaDB.close(client);
        return resolve(res[0]);
      }).catch((err) => {
        console.log(`[주식] 조회 (code) 오류: ${err}`);
        MariaDB.close(client);
        return reject(`오류: ${err}`);
      });
    });
  }

  updateStockBalance(stock, newBalance) {
    return new Promise((resolve, reject) => {
      console.log(`[주식] 잔액 차감 (${stock.balance} => ${newBalance})`);

      return MariaDB.query(`UPDATE stock SET balance = ${newBalance} WHERE id = ${stock.id}`).then(({ client, res }) => {
        MariaDB.close(client);
        return resolve();
      }).catch((err) => {
        console.log(`[주식] 잔액 차감 오류: ${err}`);
        MariaDB.close(client);
        return reject(`오류: ${err}`);
      });
    });
  }

  getStockholders(stock) {
    return new Promise((resolve, reject) => {
      console.log(`[주식] 주주 조회 (${stock.name}`);

      return MariaDB.query(`SELECT us.user_id, u.name AS user_name, u.bank_account AS user_bank_account, SUM(amount) AS amount FROM user_stock us
                             LEFT JOIN user u ON u.id = us.user_id
                            WHERE us.stock_id = ${stock.id}
                            GROUP BY us.user_id`).then(({ client, res }) => {
        MariaDB.close(client);
        return resolve(res);
      }).catch((err) => {
        console.log(`[주식] 주주 조회 오류: ${err}`);
        MariaDB.close(client);
        return reject(`오류: ${err}`);
      });
    });
  }
}

module.exports = new Stock();
