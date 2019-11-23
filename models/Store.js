const MariaDB = require('../database/MariaDB');

class Store {
  getStoreById(storeId) {
    return new Promise((resolve, reject) => {
      console.log('[상점] 조회 (ID)');

      return MariaDB.query(`SELECT * FROM store WHERE id = "${storeId}"`).then(({ client, res }) => {
        MariaDB.close(client);
        return resolve(res[0]);
      }).catch((err) => {
        console.log(`[상점] 조회 (ID) 오류: ${err}`);
        MariaDB.close(client);
        return reject(`오류: ${err}`);
      });
    });
  }
}

module.exports = new Store();
