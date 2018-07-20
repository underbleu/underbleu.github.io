---
layout: post
title:
category: NodeJs
permalink: /NodeJs/:title

tags: [NodeJs]
comments: true
---

# Node.js, Express 특강

## 개념1) Firebase HTTP Function으로 API키 숨기기
Google Vision API, 지도 API, Github API를 쓸때는 인증정보(token, API)를 포함시켜야한다. HTTP요청시 토큰을 함께 보내줘야하는데, 이것들이 유출되면 매우 곤란한 상황이 발생한다. 고로 API key를 소스코드에 직접 작성하여 보내주지 말고 Firebase HTTP Function에 숨겨서 보내줘야한다.

>`브라우저를 통해 인증정보를 직접보낸다 = 자살행위` (웹은 까보기 너무 쉬움..)

## 개념2) 주기적으로 수행해야하는 작업 Firebase HTTP Function
>* [HTTP트리거 사용법](https://firebase.google.com/docs/functions/http-events)
>* [Firebase Functions 환경 구성](https://firebase.google.com/docs/functions/config-env)

* 주기적으로 수행해야 하는 작업에 사용할 수 있다
  1. 데이터베이스 조작
  2. Firebase Cloud / Message(FCM)
* ex. 3개월이상 로그인하지 않은 장기미사용 고객에게 메일을 보내준다

* 출처가 다른 도메인에 Ajax요청을 보낼때의 처리할때,
* CORS(동일출처정책)을 해제시켜 두 도메인간의 서버통신에 사용할 수 있다
* Firebase인증 IdToken

---

# 개념1 실습

## 1. API키를 소스에 직접 붙여넣는 방식 (위험)

1. 노드 버전 변경, 필요한 패키지 설치
```bash
# fds-redux-bbs (function 브랜치)
$ cd function
$ nvm ls # 버전확인 -> 6점대 버전 사용
$ nvm use 6.0.0
$ npm install --save express body-parser cors node-fetch
```

2.  Github 저장소 정보 가져오기
  * node 6버전이기 때문에 async-await 비동기함수 사용불가 -> .then( )메소드사용
  * [Github REST API: List your repositories](https://developer.github.com/v3/repos/#list-your-repositories)
  * 어떻게 인증정보를 포함시킬 수 있을지 [Github REST API: Auth](https://developer.github.com/v3/auth/)
  * [fetch함수 사용법](http://devdocs.io/dom/windoworworkerglobalscope/fetch)
  * [로컬에서 함수 실행](https://firebase.google.com/docs/functions/local-emulator)

3. node버전 업그레이드 후 firebase 재설치
* `$ firebase serve --only functions` -> 에러! node 버전 6.11이상 필요
```bash
$ nvm install 6.12.3
$ nvm use 6.12.3
$ npm install -g firebase-tools
$ firebase serve --only functions`
```

```js
// functions / index.js
const functions = require('firebase-functions');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fetch = require('node-fetch');

// Express 앱 객체 생성
const app = express();

// 미들웨어 등록
app.use(bodyParser.json());
app.use(cors({ origin: true }));

const myToken = 'Github token';

app.get('/repos', (req, res) => {
  // Github 저장소 정보 가져오기
  return fetch('https://api.github.com/user/repos?access_token', {
    headers: {
      Authorization: `token ${myToken}`
    }
  })
  .then(res => res.json())
  .then(data => {
    res.send(data);
  });
})

exports.github = functions.https.onRequest(app);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
 response.send("Hello from Firebase!");
});
```

---

## 2. API 외부에서 불러오기 (안전)

1. Github토큰을 직접불러오던 코드를 외부에서 불러오는 코드로 변경
```bash
const myToken = '25c7a258e...(Github token)'; # 위험!!
const myToken = functions.config().github.token; # 외부에서 데려오기
```

2. Firebase 클라우드(외부)에 토큰을 저장
```bash
firebase functions:config:set github.token="25c7a258e...(Github token)" # 저장
firebase functions:config:get # 클라우드에 저장된 Github토큰 호출
```

3. [로컬에서 함수실행](https://firebase.google.com/docs/functions/local-emulator)
firebase cloud에 토큰 get해와서 `.runtimeconfig.json`에 저장
```bash
$ firebase functions:config:get > .runtimeconfig.json
```

4. `.gitignore`에 토큰정보 올리지 않도록 코드추가
```bash
# firebase
.runtimeconfig.json
```
-> 이렇게하면 파일명이 회색으로 변경된다. (확인하기!)

---

## 댓댓 project: 좋아요 개수 세기 기능구현
Firebase 데이터에 좋아요수를 브라우저가 아닌 FB서버에서만 조작가능하도록 만들어야한다
Firebase 함수 문서 참조

[Firebase 데이터 구조화](https://firebase.google.com/docs/database/admin/structure-data)
