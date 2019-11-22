const config = require('config');
const express = require('express');
const port = config.get('port');

const app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use(express.static('public'));

app.use(require('./routes/api'));
app.use(require('./routes/web'));

app.use((err, req, res, next) => {
  console.log(err);

  res.status(500).send('Oops, an error occurred...');
});

app.listen(port, function() {
  console.log(`Application is running on port ${port}`);
});
