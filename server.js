const config = require('config');
const express = require('express');
const port = config.get('port');

const app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use(express.static('public'));
app.use(express.json())

app.use(require('./routes/api'));
app.use(require('./routes/web'));

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send('서버 오류가 발생했습니다.');
});

app.listen(port, function() {
  console.log(`주식리워드 서버를 시작합니다 (Port: ${port})`);
});
