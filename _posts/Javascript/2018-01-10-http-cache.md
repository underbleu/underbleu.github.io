---
layout: post
title: HTTP 캐시, ETag
category: Javascript
permalink: /Javascript/:title/

tags: [자바스크립트]
comments: true
---

## HTTP Cache
>[교재](https://wpsn.github.io/wpsn-handout/2-3-1-cache.html)

* Cache : 속도를 빠르게 하기위해 데이터를 미리 복사해둔 임시 저장소.
* HTTP Cache
  * 서버에서 가져온 자원(HTML, CSS, 이미지...)을 가까운데 저장해서 재사용하는것. 웹표준이다.
  * 브라우저마다, 서버마다 캐시 쌓는 규칙이 다름.

## 캐시의 문제

>**사이트의 실제자원과 캐시자원이 달라지는 상황**
어떤 페이지를 방문했을때 index.html을 캐시에 저장해두고 재사용을 하는데, 홈페이지 업데이트를 하면 어떻게 될까?

1. **Expiration(만료): Cache-Control**
    * Response Header에 자료의 유효기간 설정
    -> 개발자의 예상과 다르게 불가피한 변경이 있으면 반영이 안됨(netlify에선 안쓴다!)
2. **Validation(검증) : ETag(자원의 내용 식별자)**
    * ETag를  [If-None-Match 헤더](https://wpsn.github.io/wpsn-handout/2-3-1-cache.html)의 값에 보내서 캐시를 계속 사용할 수 있는지 확인
    -> 자원내용버전 같은경우 (304. Not Modified)응답
    * `ETag`는 자원의 **내용**식별자 `fc.co.kr/index.html` 자원의 **위치**식별자
    * 사이트문제시 크롬 Network 헤더에서 etag 버전 확인해보면됨

### If-None-Math헤더에서 etag를 확인하고, HTTP상태코드 전송
![etag1]({{site.baseurl}}/img/etag1.jpg)
![etag2]({{site.baseurl}}/img/etag2.jpg)

## ETag 생성방법
`etag:W/"518-IUUcU4dNqz88Ytwacyqq9mV+V2g"`
* 원리 : 중복을 제거한다
* 자원의내용을 hash라는 알고리즘을 통해 Hashing문자열을 생성하여 etag에 달아준다.
* 내용이 .(쩜) 하나라도 달라지면 hash값이 달라진다.
* 해시생성알고리즘 : MD5, SHA-1, SHA-256 -> [SHA1 online 사이트](http://www.sha1-online.com/)

>**해시사용 예시**
>* 불법다운로드시 iso 생성해서 사용하는 경우 해시사용
>* 깃허브 commit ID, 파이어베이스 uid

### 쿠키는 사용자정보(로그인, 토큰), 캐시는 파일(HTML, 이미지..)을 저장
1. 쿠키: 은행에서 10분뒤에 로그아웃되는 기능은 **쿠키** 만료시간 지정한것
2. 캐시: css-flex 개구리게임 **캐시**가 저장되어, 재방문해도 같은 level유지됨

---

## Firebase Storage
>[실습코드](https://github.com/underbleu/fds-firebase-storage)

### 분해대입 : 배열 vs 객체
* 배열분해대입 : 속성들의 index(순서)가 있기 때문에, 대입하고자하는 변수명을 마음대로 지정해도된다
* 객체분해대입 : 객체에는 index(순서)가 없기 때문에, 대입하고자하는 변수명을 정확한 key값으로 지정해야한다
  * ***어떤속성의 값을 가져올지를 "key값"을 명확하게 써줘야한다***

```js
const imageObj = {
  LB1: {filename:1, downloadURL: "..."},
  LB2: {filename:2, downloadURL: "..."}
};
Object.entries(imageObj); //[["LB1", {..}], ["LB2", {..}]]
Object.keys(imageObj);    //["LB1", "LB2"]
Object.values(imageObj);  //[{..}, {..}]

// 배열분해대입: 변수명 맘대로 지정해도 됨
for(let [imageId, obj] of Object.entries(imageObj)){

  //객체분해대입: 변수명 정확한 key값으로 지정
  const {filename, downloadURL} = obj; (배열분해대입과 다름)
}
```
## Pagination
>[데이터 정렬 및 필터링](https://firebase.google.com/docs/database/web/lists-of-data#sorting_and_filtering_data)

실시간데이터베이스의 개수를 세며 pagination을 만들어주는건 굉장히 어려운일이다.
-> 그래서 페이스북, 인스타그램이 무한스크롤 인거임


### # 파이어베이스 실시간DB의 특징
꼭! 정렬 후 필터링을 해야한다. 필터링만 단독적으로 사용불가

**1. 데이터 정렬**
* orderByKey() : 하위**key**에 따라 정렬
ex. 데이터베이스 쓰기(push)할때 시간 순서대로 데이터식별자(ID)가 생기기때문에 등록한 시간순으로 정렬됨
```json
{ -LB1: {..},
  -LB2: {..},
  -LB3: {..} }
```
* orderByValue() : 하위**value**에 따라 정렬
ex. 동물원관리시스템. 동물 마리수에 따라 정렬하고싶은경우
```json
{ monkey: 5,
  rabbit: 10,
  dog: 15 }
```
* orderByChild : 중첩된 객체안의 값으로 정렬하고 싶을때
```json
{ {age:1},
  {age:3},
  {age:15} }
```
> 최신순 이미지 맨처음부터 2개씩 가져오기
`firebase.database().ref('/images').orderByKey().limitToFirst(2).once('value')`

### 메소드가 많은경우 가독성을 위한 코딩

```js
const snapshot = await database.ref(`/images`).orderByKey().limitToFirst(IMAGE_PER_PAGE + 1).once('value');

//변경후
const snapshot = await database
        .ref(`/images`)
        .orderByKey()
        .limitToFirst(IMAGE_PER_PAGE + 1)
        .once('value');
```

## uid를 토큰


## What is Snapshot?
![firebase-snapshot]({{site.baseurl}}/img/firebase-snapshot.png)
