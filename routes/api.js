const express = require('express');
const router = express.Router();

const UserService = require('../services/User');
const SHInvestService = require('../services/ShinhanInvest');

router.get('/api/user/:id', (req, res) => {
  const userId = req.params.id;
  UserService.getUser(userId).then(user => {
    res.status(200).send(user);
  });
});

router.get('/api/fstock/order', (req, res) => {
  // TODO: Test
  SHInvestService.orderForeignStockSimple("27001234567", "71374773999190%2FENC%2FZ6tnuZ292EXO%2B2MoGTbaXQ%3D%3D%0A", "USAAAPL", "1", "10", "", "").then(resvSeq => {
    res.status(200).send({
      resvSeq: resvSeq
    });
  });
});

module.exports = router;
