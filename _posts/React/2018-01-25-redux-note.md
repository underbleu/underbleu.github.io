---
layout: post
title: Redux 심화, 카운터만들기 실습
category: React
permalink: /React/:title

tags: [React]
comments: true
---

# # Redux

## 복습

* 액션 : 상태를 어떻게 변경할 지 담긴 데이터. type이 들어있음
* 리듀서 : 이전상태를 받아 다음상태를 만들어주는 함수
* `combineReducers({리듀서1, 리듀서2, 리듀서3})`  
: 작은 리듀서들을 하나로 객체로 합쳐주는 함수
* State Tree `"리듀서의 모양 = 상태의 모양"`  
: action이 root리듀서로 들어오면 작은리듀서들에게 전달되고, 각 리듀서들이 해당상태에대해 반응한다.


## React와 Redux 함께 사용하기

Angular, Vue등과도 함께쓰이지만 특히 React와 궁합이 잘맞는다. 데이터가 바뀌면 화면이 바뀐다는 핵심 때문에(subscribe)

### # 설치
리액트와 리덕스 세계를 연결시켜주는 도구  
`$ npm install --save react-redux`

### # 2가지 형태의 컴포넌트

* Presentational Component
  * : "어떻게 보여질지"
  * State를 가지지 않는 컴포넌트. 부모가 보내준 props로만 동작한다.
  * 결합도가 낮기 때문에 재사용하기 용이하다. (버튼 Component하나를 다양한 용도로 사용)
  * ex. 표시만을 위한 컴포넌트(Style Component), storybook에 Palette처럼 넣어놓고 쓰기 좋다.

* Container Coponent
  * : "어떻게 동작할지"
  * State를 가지는 컴포넌트
  * 재사용성이 없다
  * `connect()` 함수를 사용하여 생성

### # React와 Redux의 세계를 연결해주는 `connect( )`함수
dispatch되어 Redux store의 상태가 바뀔때 마다, presentational컴포넌트에게 props를 다르게 보내준다

```js
import { connect } from 'react-redux'

// store가 변경될 때 마다 TodoList에 새로운 props를 전달
const VisibleTodoList = connect(
  mapStateToProps,
  mapDispatchToProps
)(TodoList)
```

* `mapStateToProps = state => {...}`
  * redux의 상태와 프레젠테이셔널 컴포넌트가 받을 props를 연결
  * redux상태를 인자로 받아 객체를 return
  * mapDispatchToProps와 함께 쓰려면, 빈 값이던 null이던 꼭 명시해줘야한다
* `mapDispatchToProps = dispatch => {...}`
  * dispatch를 호출하는 콜백을 만들어서 보내줘, state를 바꿀 수 있게 해줌
  * setState( )와 비슷하다

>redux 사용전: 부모에서 setState를 호출하는 콜백을 자식에게 내려주어, 자식이 간접적으로 state를 바꿀 수 있게해줬음 (dispatch와 setState는 상태를 변경한다)


# # 카운터 만들기 실습

```bash
$ npx create-react-app hello-redux
$ npm install redux react-redux
```

## 1. React로 만들기

### # setState는 비동기식으로 동작한다
바로 state가 반영되는게 아니라 나중에 하도록 예약을 걸어둔다(비동기식)
따라서 아래코드처럼 똑같은 작업을 두개 걸어둔 경우 2씩 증가하는게 아니라. 1씩증가한다 (같은 중복작업을 1개로 취급함)
```js
// 1씩 증가 (중복된 작업 -> 1개로 취급)
handleClick = () => {
  this.setState({
    count: this.state.count + 1
  });
  this.setState({
    count: this.state.count + 1
  });
}
```

### # 따라서 state를 다룰땐, 객체를 전달하지 말고 `prevState`와 콜백함수를 호출하도록 한다
* prevState : 이전 state를 담고있는 매개변수


```js
// 2씩 증가
handleClick = () => {
  this.setState(prevState => {
    return {
      count: prevState.count + 1
    };
  });
  this.setState(prevState => {
    return {
      count: prevState.count + 1
    };
  });
}
```

## 2. Redux로 만들기

```js
// redux.js
import { combineReducers, createStore } from 'redux';

// Action Creators
export function incCount() {
  return {
    type: 'INC_COUNT'
  };
}

// Reducers
function count(state = 0, action) {
  switch (action.type) {
    case 'INC_COUNT':
      return state + 1;
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  count
});

export const store = createStore(rootReducer);
```
-> incCount, store를 export해준다

```js
// App.js
import React, { Component } from 'react';
import { connect, Provider } from 'react-redux';
import { incCount, store } from './redux';

// 1. Presentational Components
const IncButton = ({onClick}) => (
  <button onClick={onClick}>증가</button>
);

const CounterDisplay = ({count}) => (
  <div>{count}</div>
)

// 2. Container Components
const ConnectedIncButton = connect(
  state => ({}), // = null,
  dispatch => {
    return {
      onClick: () => {
        dispatch(incCount());
      }
    }; // "mapDispatchToProp함수"에서 반환되는 이 객체가
  }
)(IncButton) // "presentational컴포넌트"의 props가 된다

const ConnetedCounterDisplay = connect(
  state => {
    return {
      count: state.count
    };
  }
)(CounterDisplay)

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <div>
          <ConnectedIncButton />
          <ConnetedCounterDisplay />
        </div>
      </Provider>
    );
  }
}

export default App;
```
### # 동작방식
1. Container Components의 "`mapDispatchToProp`함수"에서 반환되는 객체가
2. `Presentational Component`의 props가 된다.

### # mapDispatchToProps는 전달해야하는데, mapStateToProps는 전달할 필요 없을때
* dispatch를 쓰려면 state를 필히 명시해줘야한다!
* state를 빈객체로 넘겨줘도되고
* null로 명시해줘도된다.
```js
const ConnectedIncButton = connect(
  null, // state => ({})
  dispatch => {
    return {
      onClick: () => {
        dispatch(incCount());
      }
    };
  }
)(IncButton)
```

# # Redux & 불변성

> 매번 새객체를 만들어주는것 = 불변성
>* 불변성 프로그래밍 방식: 객체는 변경될 수 없다는 생각을 가지고 프로그래밍 하는 방식
>* reducer안에서 변경이 있을때마다 무조건 새로운 객체나 배열을 만들어준다

### # connect함수로 최적화가 적용되면?
객체의 값이 변경되었다 할지라도, 똑같은 **참조값**을 가지고 있기 때문에 변화가 없다고 생각한다.
action이 들어올때마다 reducer가 실행되어 state로 항상 **새객체, 새배열**을 반환해줘야 connect함수가 인지할 수 있다
 
* connect함수는 객체의 내용이 아닌 참조값이 변경된 것만 인지한다  
* connect함수에는 최적화가 적용되있다 (= prop이 변경됬을때만 render를 다시한다)  
* 이전과 똑같은 prop를 주면 render하지 않는다(변경이 없는데 tree를 다시짜는건 비효율적임)

### # 예시
  1. new-todo를 포함한 새배열 생성 -> 동작
  2. new-todo를 push()메소드로 추가해주기 -> 동작안함

```js
// 1. new-todo를 포함한 새배열 생성 -> 동작
function todos(state = [], action) {
  switch (action.type) {
    case 'ADD_TODO':
      return [
        ...state,
        action.text
      ];
    default:
      return state;
  }
}

// 2. new-todo를 push()메소드로 추가해주기 -> 동작 안함
function todos(state = [], action) {
  switch (action.type) {
    case 'ADD_TODO':
      state.push(action.text); // state에 내용이 추가되었지만(변화)
      return state; // state의 참조값은 그대로이기 때문에 connect함수가 인지하지 못한다.
    default:
      return state;
  }
}
```

>**immutable.js 라이브러리**  
이런코딩이 힘들어서.  
push같은 메소드를 사용해도 이런 불변성을 지켜주면서 해준다 = 새객체 생성하는 효과


# # Redux DevTools
[Redux DevTools](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd?hl=ko) : Redux 스토어가 눈에 보이게 해주는 개발도구
* 기능: 혁신적인 time travel (시간여행)  
Action의 history를 가지고 있어서 Jump, Skip으로 과거로 돌아가거나 과거의 특정 일을 삭제할수 있음
1. Chrome Extension 설치
2. 설치후 store에 코드 추가하면 동작함
```js
 const store = createStore(
   reducer, /* preloadedState, */
+  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
 );
```


# # Redux 심화

## 설치

1. 썽크 리덕스의 내장기능은 아니기때문에 라이브러리를 설치해야한다  
`$ npm install --save redux-thunk`
2. 설치후 코드를 추가해준다.
    ```js
    // redux.js
    import {combineReducers, createStore, applyMiddleware} from 'redux';
    import thunk from 'redux-thunk';

    export const store = createStore(
      rootReducer,
      applyMiddleware(
        thunk,
      )
    );
    ```

## 함수를 반환하는것 

> ***반환값이...** 객체이면 action, 함수이면 thunk*
* 동기식에선 -> action(객체)을 dispatch하여 state를 변경했지만,
* 비동기식에선 -> 반환값이 action이 아니라 thunk이기 때문에, dispatch하는 순간 incCountAsync함수의 반환값인  `function(dispatch) { setTimeout... }`(이것이 바로 Thunk!)이 실행된다.

```js
// App.js
const ConnectedIncButton = connect(
  state => ({}),
  dispatch => {
    return {
      onClick: () => {
        dispatch(incCountAsync()); // 함수를 dispatch한다
      }
    };
  }
)(IncButton)

// redux.js
export function incCountAsync() {
  return function(dispatch) { // -> Thunk : 함수를 반환하는 것
    setTimeout(() => {
      dispatch(incCount());
    }, 1000); // 이 함수를 dispatch하면 1초뒤에 count가 증가한다.
  }
}
```

## Action은 한 번, Thunk는 가지고 있는 dispatch 개수만큼 state를 변경한다.
1번 클릭했지만 dispatch를 3개가지고 있는 Thunk는 3초에 걸쳐 count를 3증가시킨다.
```js
// App.js
const ConnectedIncButton = connect(
  state => ({}), // null로 써도된다.
  dispatch => {
    return {
      onClick: () => {
        dispatch(incCountAsync());
      }
    };
  }
)(IncButton)

// redux.js
export const incCountAsync = () => dispatch => {
  setTimeout(() => {
    dispatch(incCount());
  }, 1000);

  setTimeout(() => {
    dispatch(incCount());
  }, 2000);

  setTimeout(() => {
    dispatch(incCount());
  }, 3000);
}
```





