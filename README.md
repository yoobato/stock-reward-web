# 주식 리워드 (Stock Reward)
2019 신한 해커톤; do-while 팀 (학생부문)
- Web & API: https://github.com/yoobato/stock-reward-web
- Android: https://github.com/yoobato/stock-reward-android

## 팀 소개
- 유대열 (팀장, 개발자)
- 김수아 (디자이너)
- 엄인영 (개발자)

## 개발 환경
* [Shinhan API](https://github.com/ShinhanOpenInnovationLab/Hackathon)
* [NodeJS](https://nodejs.org/)
* [Express](https://expressjs.com/)
* [MariaDB](https://mariadb.org/)
* [Docker](https://docker.com/)

## 실행 방법
```sh
yarn install
yarn start

docker run -d -p 3306:3306 -e MYSQL_ROOT_PASSWORD=secret -v [LOCAL_MARIA_DB_PATH]:/var/lib/mysql --name sr_mariadb mariadb
```

## API 문서
```sh
yarn apidoc
```
http://localhost:[PORT]/apidoc 접속
