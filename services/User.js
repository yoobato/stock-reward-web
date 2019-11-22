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
}

module.exports = new User();
