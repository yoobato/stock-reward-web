const MariaDB = require('../database/MariaDB');

class User {
  getUser(userId) {
    return new Promise((resolve, reject) => {
      console.log('[유저] 정보 조회');

      return MariaDB.query(`SELECT * FROM user WHERE id = ${userId}`).then(({ client, res }) => {
        MariaDB.close(client);
        return resolve(res);
      }).catch((err) => {
        console.log(`[유저] 정보 조회 오류: ${err}`);
        MariaDB.close(client);
        return reject(err);
      });
    });
  }

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
}

module.exports = new User();
