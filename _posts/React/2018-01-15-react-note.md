---
layout: post
title:
category: React
permalink: /React/:title/

tags: [React]
comments: true
---

# React

>React 간단한 실습시 이용할 도구[codesandbox](https://codesandbox.io/s/new)

* JSX 문법(ejs와 비슷한 템플릿랭귀지)
  * HTML태그와 javascript가 긴밀하게 연결되 있는 문법.
  * React요소를 만든다.
  * JSX 안에 표현식(값이 될수 있는)을 { }로 묶어서 포함가능 -> 자바스크립트 객체가 됨
  * ejs와 비슷한데 서버가 아닌, 브라우저에서 데이터와 템플릿 결합작업 이루어짐
  * 컴파일


* React요소는 변경불가능(immutable) 한 것처럼 쓴다.
=> immutable의 진짜의미: 변경하지 않고, 변경하고 싶다면 매번 새로 생성한다.

## React, ReactDOM
```js
import React from 'react';
import ReactDOM from 'react-dom';
```
* 리액트 = UI 라이브러리
* 리액트 DOM = 라이브러리를 웹사이트에 출력해줌
* 리액트 Native = 라이브러리를 모바일앱에 출력해줌

## React는 필요한 것만 업데이트한다.(마법같은 일!)
`ref().once('value').innerHTML=""`
이전에 Firebase로 todo리스트 만들때, 업데이트가 있을시마다 innerHTML을 비우고 새로 내용을 넣어줬던건 굉장히 비효율적인 일이었다

## Virtual DOM
필요한 DOM만 업데이트

## 프로그래밍 방식
* 명령형(Imperative) : **"어떻게"**가 코드에 나타나는 방식 (객체지향형)
* 선언형(declarative) : **"무엇을(목표)"**가 코드에 나타나는 방식(함수형)

>함수형프로그래밍 언어를 알고싶다면 Haskell을 공부해보도록

React 컴포넌트는 대문자로 정의해야한다
(소문자로 시작하면 HTML태그로 만들어버린다.)

## 컴포넌트 정의
1. 함수형 컴포넌트 : 단순히 한 번 화면을 그려줄때 사용
lifecycle, setState 데이터를 변경하여 화면을 다시그리는 기능을 내장할 수 없음
2. 클래스 컴포넌트 : UI안에 변경되야하는 데이터가 있을때 사용

```js
// 클래스 컴포넌트
class Counter extends React.Component {
  handleClick = () => {
    alert('handleClick');
  }
  render(){
    return (
      <div>
        <button onClick={this.handleClick}>Click!</button>
        <div>0</div>
      </div>
    );
  }
}
// 함수형 컴포넌트
function Counter(props){
  return (
    <div>
      <button>Click!</button>
      <div>0</div>
    </div>
  );
}
ReactDOM.render(
  <Counter />,
  document.querySelector('#root')
)
```
-> 훨씬 코드가 응집성있어짐

### 클래스가 가지는 장점.
함수는 한 번 호출되고나면, 함수안의 데이터(변수..)에 접근할 방법이 클로저말곤 없다. 클래스는 외부에서 속성을 지정하여 쓸 수 있게 해준다

## React El의 Lifecycle Method (생애주기)
React 엘리먼트가 DOM에 생성될때, 삭제될때, 업데이트되는 과정
* fetch, setInterval을 React El이 DOM에 들어가는 순간에 작성
* componentDidMount() 기능을 실행 시킬때
* componentWillUnmount()

this.setState()가 호출될 때마나 React는 자동으로 화면을 새로 그려줌. 데이터를 업데이트하면 데이터를 그려주는 코드가 자동으로 실행되게 ! UI를 바꾸는게 아니라 데이터를 업데이트

## setState는 비동기식이다
setState엔 객체가 아닌 함수를 넘겨 사용하라
setState는 얕은 병합을한다

## 데이터가 아래로 흐른다(Tree구조 처럼)


---
## 이벤트 제어하기

e는 이전에 사용하던 e(Event)객체:브라우저 내장객체와 다른것이다. 일반적으로 똑같이 사용하면되지만 간혹 내장객체가 아니라서 문제가 발생하는경우만 handle해주면된다

## 리액트의 this 바인딩
* 그냥 함수를 실행시키면 React는 this를 모르기때문에 전역객체로 선언하게된다.
고로 this 바인딩해줘야함
  1. .bind() : 요즘별로 안씀
  2. 화살표함수 (화살표함수는 어디서 정의되었느냐에 따라 this가 결정된다 Lexical Scope -> 인스턴스의 속성)
>Event Handler는 무조건!! 화살표함수로 정의한다.

JSX문법에선 if..else를 사용할 수 없기때문에, 삼항연산자를 사용한다.

## null
React는 `true, false, null, undefined`를 렌더링하지 않는다. -> 이를 잘활용하는 코드를 쓰곤한다
a && b a가 true일때 b코드 실행
`isLoggedIn && <div>welcome</div>`


---
# 노마드코더

```js
//App.js
import Movie from './Movie';

class App extends from Component{
  render(){
    return(
      <div className="App">
        <Movie />
      </div>
    )
  }
}

export default App;

//index.js
ReactDOM.render(<App />, document.getElementById('root'));
```
Component > render > return > JSX(리액트로 작성한 html)
