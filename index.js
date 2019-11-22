const config = require('config');
const express = require('express');
const logger = require('winston-this')('index');
const port = process.env.PORT || config.get('port');
const environment = process.env.NODE_ENV;

logger.info(`NODE_ENV: ${environment}`);

// Express Application initialization
const app = express();

const SHInvestService = require('./services/ShinhanInvest');

app.use('/', (req, res, next) => {
  // TODO: Test
  SHInvestService.orderForeignStockSimple("27001234567", "71374773999190%2FENC%2FZ6tnuZ292EXO%2B2MoGTbaXQ%3D%3D%0A", "USAAAPL", "1", "10", "", "").then(resvSeq => {
    res.status(200).send({
      resvSeq: resvSeq
    });
  });
});

app.use((err, req, res, next) => {
  logger.error(err);

  res.status(500).send('Oops, an error ocurred...');
});

app.listen(port, function () {
  logger.info(`Application up and running on port ${port}`);
});
