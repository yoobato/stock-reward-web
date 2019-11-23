const express = require('express');
const router = express.Router();

// 메인 (상품 목록)
router.get('/', (req, res) => {
  res.render('index', {
    items: [
      {
        store_id: 1,
        stock_id: 1,
        thumbnail: "list_item_samsung.svg",
        name: "삼성 QLED 8K 189 cm",
        price: "8,960,000원",
      },
      {
        store_id: 2,
        stock_id: 2,
        thumbnail: "list_item_lf.svg",    // TODO: LF 로고 교체
        name: "JILLSTUART 하트 2단 반지갑",
        price: "115,200원",
      },
      {
        store_id: 3,
        stock_id: 4,
        thumbnail: "list_item_apple.svg",
        name: "Apple AirPods Pro",
        price: "329,000원",
      },
      {
        store_id: 4,
        stock_id: 3,
        thumbnail: "list_item_hanssem.svg",
        name: "한샘 아동 인디언 놀이텐트",
        price: "89,900원",
      },
      {
        store_id: 5,
        stock_id: 5,
        thumbnail: "list_item_hilton.svg",
        name: "그랜드 힐튼 서울 1박 숙박권",
        price: "191,301원",
      },
      {
        store_id: 6,
        stock_id: 6,
        thumbnail: "list_item_samsung.svg",  // TODO: 신한생명 보험 썸네일
        name: "(무)신한인터넷암보험",
        price: "월 3,300원 ~",
      },
    ]
  });
});

router.get('/detail', (req, res) => {
  const storeId = req.query.store_id;
  const stockId = req.query.stock_id;

  // TODO: 상품 상세
  res.render('detail', {
    stockId: stockId,
    storeId: storeId,
  });
});

module.exports = router;
