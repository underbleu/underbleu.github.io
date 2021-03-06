---
layout: post
title: React-router, Redux 기초
category: React
permalink: /React/:title

tags: [React]
comments: true
---

## 게시판만들기_폼요소

### FormData
* 생성자
* iterable이다
    1. for...of루프로 item을 순회하며 출력가능
    `["title", "제목1"], ["content", "내용1"]`
    2. Array.from으로 배열로 변경가능

[서버타임스탬프](https://firebase.google.com/docs/database/web/offline-capabilities?authuser=0)

[firebase.database.ThenableReference](https://firebase.google.com/docs/reference/js/firebase.database.ThenableReference?authuser=0)


## Browser History
[브라우저 히스토리 조작하기](https://developer.mozilla.org/ko/docs/Web/API/History_API)
* 브라우저엔 history stack가 내장되어있어, 뒤로/앞으로가기를 할 수 있다
    * `window.history.back();` 뒤로가기
    * `window.history.forward();` 앞으로가기
* 페이지 새로고침없이 history stack을 조작할 수 있다
    * `history.pushState({page: 'list'}, null, 'list')`
    1. `{page: 'list'}` : 보여줄 페이지 -> history stack
    2. null
    3. `'list'` : URL표시해줄 text
* `pushState(), popState(), hashchange`

# React Router
[공식문서](https://reacttraining.com/react-router/)

Basic, URL Parameters, Redirects, No Match(404) 네파트가 중요함

### 사용해야하는 이유?     
* 사용자경험을 위하여
* 주소와 연결된 기능에서 새로고침 없게해줌. (부드러운 연결)

### 기능
* `<Link>`
    * `exact` 정확히 특정경로일 때만 보여줘라. 
    * ex. `path="/"` 일때만 Home을 보여줄때. 이걸 안써주면 `path="/account"`인 곳에서도 Home이 떠있다
* `<Route>`
* `${match.url}` : 주소에있는 문자열을 그대로 가져와서 코드로 쓸때 필요한 속성
* `<Redirect to={}>` 렌더링되면 to로 주소를 바로 이동하는 컴포넌트 (pushState같은 효과)
    * ex. 로그인이 안되어있을때, 권한이 없을때 다른 페이지로 이동

### No Match
* `<Redirect from="/old-match" to="/will-match"/>` from이 이거면 to로 가라 
* `<Switch>` 아래있는 컴포넌트들중 일치하는 것 하나만 렌더링함
* 매치되는 컴포넌트가 없을때 404페이지를 렌더링해준다.

### 설치
```bash
$ npm install react-router-dom
```

# Redux
[공식문서](https://deminoth.github.io/redux/)
1. 대규모의 리액트 application을 짤때 state를 관리하기 위한 상태저장소.
    * 리액트 Component트리는 보이는 곳
    * 리덕스는 컴포넌트들의 State를 담당하는 역할
2. 상태를 편하게 연결시키는 연결지점
3. 비동기함수에서 일어나는 여러 상태변경을 편하게 작업할 수 있는 함수 제공

* Action: 애플리케이션에서 스토어(중앙 container)로 보내는 데이터 묶음
* dispatch: store안의 상태를 바꾸기위해 action을 파견할떄 쓰는 메소드.
* Reducer: action이 store에 dispatch됐을때 상태를 **어떻게** 변경할지 서술하는 함수
    * 현재상태와 action을 보고 변경할 다음상태를 반환해준다.


```js
const {createStore, combineReducers} = require('redux');

function addTodo(text) {
  return {
    type: 'ADD_TODO',
    text
  }
}

function login(username) {
  return {
    type: 'LOGIN',
    username
  }
}

function logout(){
  return{
    type: 'LOGOUT'
  }
}

function user(state = null, action){
    switch(action.type){
      case 'LOGIN':
        return action.username;
      case 'LOGOUT':
        return null;
      default:
        return state;
    }
}

function todos(state = [], action) {
  switch(action.type){
    case 'ADD_TODO': 
      return [
          ...state,
          {
            text: action.text
          }
        ]
    default:
      return state;
  }
}

const reducer = combineReducers({
  todos,
  user
});

const store = createStore(reducer);

// 상태변경이 일어날 때 마다 호출됨 (= dispatch될 때 마다)
store.subscribe(() => {
  console.log(store.getState());
})
```



















