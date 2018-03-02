## Serverless Architecture
외부 API 중에 바로 호출이 불가하여 서버를 거쳐야하는 경우, 간편하게 사용하기 위해 서버리스를 사용한다.
* ex. AWS, Lamda...
* 사용하는 사례
  * HTTP요청처리
  * 썸네일 생성
  -> user가 업로드한 원본이미지가 아닌 작은이미지를 처리하여 불러옴
  * 좋아요 갯수 세기

---

# Node.js
[Node.js 교재](https://wpsn.github.io/wpsn-handout/1-1-2-node.html)

* Node.js서버는 성능이 좋다. 동시접속자를 많이 처리 할 수 있다.  
* npm에 등록된 라이브러리 개수가 다른 언어에 비해 압도적으로 많다

* Java spring 서버는 기업용으로 쓰기에 과금이 있고, 기능이 너무 많아 스타트업에서는 잘 사용하지 않는 중이다.

## Express
[Express 교재](https://wpsn.github.io/wpsn-handout/1-2-2-express.html)
, [Express 공식문서](https://expressjs.com/ko/)
* Node.js 생테계에서 가장 많이 쓰이는 웹프레임워크
* 기능확장하려면 "미들웨어"를 사용한다.

---

# Firebase용 Cloud 함수
Firebase용 Cloud 함수를 사용하면 Firebase 기능 및 HTTPS 요청에 의해 트리거된 이벤트에 대한 응답으로 백엔드 코드를 자동으로 실행할 수 있어, 직접 서버를 관리하고 크기를 조절할 필요가 없다.

## Cloud 함수용 Firebase SDK 설정 및 초기화
Firebase Cloud는 node v.6을 사용한다 (React코딩을 할때는 v.8을 사용하도록)
-> 현재 과도기이기 때문에 모든 버전이 8로 넘어오지 못한상태

1. 초기화
```bash
$ firebase init functions
```

2. 노드버전 6으로 설정
    * 사용할 버전 설정 : `functions폴더 > .nvmrc 파일 생성 > 6 입력후 저장 `
    * node v.6설치
    ```bash
    $ cd functions
    $ nvm install 6
    $ nvm use 6
    $ npm install
    $ npm install -g firebase-tools
    ```

3. `.gitignore` 에 설치한 node_modules 추가
```bash
# dependencies
/node_modules # 이건 루트의 node_modules만 가르킴
node_modules # 슬래시를 제거하여, functions폴더 안의 node_modules까지 포함시켜주기
```
---

# 참고글

## Firebase Functions + Express 특강 관련 링크
* https://firebase.google.com/docs/functions/get-started
* https://firebase.google.com/docs/functions/http-events
* https://firebase.google.com/docs/functions/local-emulator

## HTTP 복습하기
* [HTTP](https://wpsn.github.io/wpsn-handout/1-2-1-http.html)
* [HTTP Cache](https://wpsn.github.io/wpsn-handout/2-3-1-cache.html)
