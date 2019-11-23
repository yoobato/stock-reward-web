const express = require('express');
const router = express.Router();

const Stock = require('../models/Stock');
const Store = require('../models/Store');
const SHInvestService = require('../services/ShinhanInvest');

// 메인 (상품 목록)
router.get('/', (req, res) => {
  // 테스트 데이터
  const items = [
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
      thumbnail: "list_item_lf.svg",
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
      thumbnail: "list_item_shinhan.svg",
      name: "(무)신한인터넷암보험",
      price: "월 3,300원 ~",
    },
  ];

  res.render('index', {
    items: items,
  });
});

router.get('/detail', async (req, res) => {
  const storeId = req.query.store_id;
  const stockId = req.query.stock_id;

  const store = await Store.getStoreById(storeId);
  let stock = await Stock.getStockById(stockId);
  let item = {};

  // 테스트 데이터
  if (stock.id == 1) {
    item.name = "삼성 QLED 8K 189 cm";
    item.price = "8,960,000원";
    item.thumbnail = "item_samsung.svg";
    item.options = [
      "본체만",
      "본체 + 사운드바",
    ];
    item.description = "눈 앞에 있는 것처럼 깊이감 있는 8K 화질. 선명한 화면을 위해 TV가 커질수록 고화질이 적용되어야 합니다. 8K 화질은 밝기, 윤곽, 질감, 컬러를 디테일하게 표현해내는 초고화질입니다.";
    item.point = 864980;
    item.point_str = "864,980";
    item.stock_icon = "ic_samsung.svg";
  } else if (stock.id == 2) {
    item.name = "JILLSTUART 하트 2단 반지갑";
    item.price = "115,200원";
    item.thumbnail = "item_lf.svg";
    item.options = [
      "Red",
      "Green",
      "Blue",
    ];
    item.description = "고급스러운 소가죽 바탕에 로고 레터링과 하트 참장식으로 포인트를 준 2단 반지갑입니다.";
    item.point = 5760;
    item.point_str = "5,760";
    item.stock_icon = "ic_lf.svg";
  } else if (stock.id == 3) {
    item.name = "한샘 아동 인디언 놀이텐트";
    item.price = "89,900원";
    item.thumbnail = "item_hanssem.svg";
    item.options = [
      "2인용(소)",
      "4인용(대)",
    ];
    item.description = "배송은 무척 빠르고 설치도 쉬웠어요. 18개월 아기 자꾸 드레스룸에 숨길래 사줬어요 처음 보면 얼마나 좋아 할까 생각하면서 조립했는데 막상 반응이 별로더라구요 그래서 같이 텐트에 들어가 온 가족이 출동하여 까꿍 놀이 하였습니다.";
    item.point = 8990;
    item.point_str = "8,990";
    item.stock_icon = "ic_hanssem.svg";
  } else if (stock.id == 4) {
    item.name = "Apple AirPods Pro";
    item.price = "329,000원";
    item.thumbnail = "item_apple.svg";
    item.options = [
      "유선 충전",
      "무선 충전",
    ];
    item.description = "새롭게 귓가를 찾아온 매혹. AirPods Pro는 몰입감 넘치는 사운드를 들려주는 액티브 노이즈 캔슬링 기능과 주변 소리를 들을 수 있는 주변음 허용 모드, 그리고 하루 종일 착용해도 편안한 맞춤형 핏을 자랑합니다.";
    item.point = 32900;
    item.point_str = "32,900";
    item.stock_icon = "ic_apple.svg";
  } else if (stock.id == 5) {
    item.name = "그랜드 힐튼 서울 1박 숙박권";
    item.price = "191,301원";
    item.thumbnail = "item_hilton.svg";
    item.options = [
      "비수기",
      "성수기",
    ];
    item.description = "그랜드 힐튼 서울 호텔은 서울 중심부에서는 15분 이내, 인천국제공항에서는 40분 이내 거리에 있습니다. 호텔에서 시내 중심지역 및 이태원, 홍대 입구 역까지 호텔 내 무료 셔틀버스를 이용하여 편하게 이동할 수 있습니다.";
    item.point = 15304;
    item.point_str = "15,304";
    item.stock_icon = "ic_hilton.svg";
  } else if (stock.id == 6) {
    item.name = "(무)신한인터넷암보험 (10년)";
    item.price = "396,000원";
    item.thumbnail = "item_shinhan.svg";
    item.options = [
      "남 20대",
      "남 30대",
      "남 40대",
      "여 20대",
      "여 30대",
      "여 40대",
    ];
    item.description = "인터넷으로 가입해서 합리적인 보험료! 암 발병시 진단보험금을 일시에 지급하여 드립니다. 비갱신형 암보험으로 보험료 증가없이 보장 받으세요.";
    item.point = 79200;
    item.point_str = "79,200";
    item.stock_icon = "ic_shinhan.svg";
  }

  // 예상 지급 주식
  SHInvestService.getStockCurrentPrice(stock.code).then(stock => {
    const availableAmount = item.point / stock.price;
    item.stock = availableAmount.toFixed(2);

    // 상품 상세
    res.render('detail', {
      store: store,
      stock: stock,
      item: item,
    });
  });
});

module.exports = router;
