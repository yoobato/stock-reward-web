const config = require('config');
const mysql = require('mysql');

class MariaDB {
  query(sql, args) {
    return new Promise((resolve, reject) => {
      const client = mysql.createConnection(config.get('database'));
      client.query(sql, args, (err, res) => {
        if (err) return reject(err);
        resolve({client, res});
      });
    });
  }

  close(client) {
    return Promise.resolve().then(() => client.end());
  }
}

module.exports = new MariaDB();
