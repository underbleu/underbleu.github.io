---
layout: post
title: 강의노트. React, classNames
category: javascript
permalink: /javascript/:title/

tags: [자바스크립트]
comments: true
---
# React

>* e.target : 실제로 클릭한 요소
>* e.currentTarget : eventListener를 등록한 요소

target은 바뀌지 않지만, currentTarget은 버블링과정을 거치면서 계속 바뀐다.

* 이벤트함수를 비동기안에서 쓰려면 항상 주의해야한다  
-> 비동기함수 await와 currentTarget 함께 쓰면 에러  

---

## 리스트와 키

* 아이템의 ID를 식별자로 쓰는게 좋지, 배열인덱스를 식별자로 쓰는 건 좋지않다.
>map쓸때는 - 항상 key prop를 줘야한다.!

---
# 폼
리액트에서는 폼요소를 특별한 방식으로 사용한다
폼을 써서 할수 있는 기능.   
```js
// ex) 대문자만 받기.
handleChange(event) {
    this.setState({value: event.target.value.toUpperCase()});
}
```
---
## State 끌어올리기


## 구성 vs 상속 -> 건너뛰어도됨

---

## Refs와 DOM
key와 ref는 리액트에서 특별하게 취급하는 prop(속성)이다.

>참고자료
>* [React.Component](https://gracious-thompson-07e192.netlify.com/docs/react-component.html#componentwillupdate)  
>* [DOM Elements](https://gracious-thompson-07e192.netlify.com/docs/dom-elements.html)



---

예제: [리액트로 todo-list만들기](https://codesandbox.io/s/znpv2xxn8p)

## React의 단방향 데이터흐름
>state (데이터) -> render (화면그리기)  
: state를 바꾸어(= setState) render가 다르게 되게한다.

1. 리액트에서는 렌더링할때 필요한 데이터를 **위 -> 아래쪽** 컴포넌트로 props를 이용하여 내려보낸다.
2. 자식이 변화가 있을때 부모에게 데이터를 올려보내 상태를바꿔야한다면?  
부모 컴포넌트에서 생성한 함수를 자식에게 내려보내어, 자식에서 그 함수를 호출한다 -> 부모의 상태를 간접적으로 바꾸어줌



## classNames 라이브러리
* [classNames](https://www.npmjs.com/package/classnames) 과거에 리액트의 내장 기능이었다. 
* 이젠 아주 많이 쓰이지 않아서 라이브러리로 떨어져나옴
* css로 스타일링하는 회사에서 여전히 많이 쓰는 라이브러리이기 때문에 알아둬야한다.

* classnames는 css로 스타일링하는 회사에서 많이 쓰는 라이브러리이다.
>요즘엔 스타일링을 css로하기 보단, css가 가미된 컴포넌트를 만들어내는 [styled-components](https://www.styled-components.com/)를 많이쓴다.


## 복습할것 
yarn깔고, 노마드코더 하나들어보고
1. [codepen](https://codepen.io/underbleu/pen/GyBxNP?editors=0010)
2. [리액트로 todo-list만들기](https://codesandbox.io/s/znpv2xxn8p))
app -> list -> item을 걸쳐 내려온 함수를 살펴보기
3. 리액트문서 정독


>과제: 참조, 불변성, ImmutableJs 찾아보기