const MariaDB = require('../database/MariaDB');

class User {
  addStock(userId, storeId, stock, amount) {
    return new Promise((resolve, reject) => {
      console.log(`[유저] 주식 지급`);

      return MariaDB.query(`INSERT INTO user_stock (user_id, stock_id, store_id, amount, base_price) VALUES (${userId}, ${stock.id}, ${storeId}, ${amount}, ${stock.price})`).then(({ client, res }) => {
        MariaDB.close(client);
        return resolve();
      }).catch((err) => {
        console.log(`[유저] 주식 지급 오류: ${err}`);
        MariaDB.close(client);
        return reject(`오류: ${err}`);
      });
    });
  }

  getStockRewardSummary(userId) {
    return new Promise((resolve, reject) => {
      console.log(`[유저] 주식 리워드 요약`);

      return MariaDB.query(`SELECT us.stock_id, s.code AS stock_code, s.name AS stock_name, ROUND(SUM(us.amount), 2) AS balance, ROUND(AVG(us.base_price), 0) AS base_unit_price, 0 AS current_unit_price FROM user_stock us
                              LEFT JOIN stock s ON s.id = us.stock_id
                            WHERE us.user_id = ${userId}
                            GROUP BY us.stock_id
                            ORDER BY balance DESC`).then(({ client, res }) => {
        MariaDB.close(client);
        return resolve(res);
      }).catch((err) => {
        console.log(`[유저] 주식 리워드 오류: ${err}`);
        MariaDB.close(client);
        return reject(`오류: ${err}`);
      });
    });
  }

  getStockRewardHistory(userId, stockId = null) {
    return new Promise((resolve, reject) => {
      console.log(`[유저] 주식 리워드 내역`);

      let queryStr = `SELECT us.stock_id, s.code AS stock_code, s.name AS stock_name, st.name AS store_name, ROUND(us.amount, 2) AS amount, ROUND(us.base_price, 0) AS base_unit_price, us.created_at FROM user_stock us
                        LEFT JOIN stock s ON s.id = us.stock_id
                        LEFT JOIN store st ON st.id = us.store_id
                      WHERE us.user_id = ${userId}`;
      // 주식 ID를 넘긴 경우 해당 주식 내역만 조회
      if (stockId) {
        queryStr += ` AND us.stock_id = ${stockId}`;
      }
      queryStr += ` ORDER BY us.created_at DESC`;

      return MariaDB.query(queryStr).then(({ client, res }) => {
        MariaDB.close(client);
        return resolve(res);
      }).catch((err) => {
        console.log(`[유저] 주식 리워드 오류: ${err}`);
        MariaDB.close(client);
        return reject(`오류: ${err}`);
      });
    });
  }
}

module.exports = new User();
