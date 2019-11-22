# 주식 리워드

2019 신한 해커톤; do-while 팀

## TODO

- [ ] API 문서화

## 팀 소개

- 유대열
- 김수아
- 엄인영

## 개발 환경

* [Shinhan API](https://github.com/ShinhanOpenInnovationLab/Hackathon)
* [NodeJS](https://nodejs.org/)
* [Express](https://expressjs.com/)
* [MariaDB](https://mariadb.org/)

## 사용 방법

```sh
yarn install
yarn start

docker run -d -p 3306:3306 -e MYSQL_ROOT_PASSWORD=secret -v [LOCAL_MARIA_DB_PATH]:/var/lib/mysql --name sr_mariadb mariadb
```
