# tumblbug 과제

1. 모든 dependency install

```
// tumblbug root directory
// server dependency 설치
1. yarn install

// tumblbug client directory
// CRA dependency 설치
2. cd client
   yarn install
```

2. dev 환경 구축

```
// server+client 실행의 경우
yarn start

// server만 단독실행
yarn server

// client만 단독실행
yarn client
```

3. Address API

- 주소목록 가져오기

  - /api/address/:count/:currentpage (GET)
    - path parameter로 count와 currentpage값을 요구
    - 성공 200 : json 객체반환 (address 배열, currentPage, totalCount, default)

- 주소 추가

  - /api/address (POST)
    - data 값으로 정의된 형식의 address객체 값(id, postnumber, name, address)과 setDefault값을 요구
    - 성공 200 : json 객체반환 (변경된 address, totalCount)

- 주소 삭제

  - /api/address/:id (DELETE)
    - path parameter로 address id값을 요구
    - 성공 204 반환값 없음

- 기본 주소지 변경
  - /api/adress (PUT)
  - data값으로 address id값을 요구
  - 성공 204 반환값 없음
