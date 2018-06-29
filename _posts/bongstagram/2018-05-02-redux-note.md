# #3-21 Making the App container

## 리덕스 구성
>One Store,  
>Many Reducers(to divide functions)
* 액션: 무엇이 일어날지
* 리듀서: 이 액션에 따라 상태를 수정
* 스토어: 이들을 함께 가져오는 객체
  * 애플리케이션의 상태를 저장하고
  * getState()를 통해 상태에 접근하게 하고
  * dispatch(action)를 통해 상태를 수정할 수 있게 하고
  * subscribe(listener)를 통해 리스너를 등록한다
  

## 액션 타입을 문자열 상수로 정의하는 것의 이점

* 작은 프로젝트에서 상수는 불필요하다
* 하지만 큰프로젝트에서는 모든 액션 타입이 한 곳에 모이기 때문에
  * 액션타입 이름짓기의 일관성을 유지에 좋고
  * 기존의 모든 액션을 한눈에 볼 수 있어 팀원들이 추가/삭제된 액션들을 금방 알아챌 수 있다
  * 액션 상수를 불러오다가 오타를 내면 undefined가 나오기때문에 에러를 알아차리기 쉽다. 타입에 변수명이 아닌 `type: "ADD_TODO"`와 같이 문자열로 넣으면 오타를 내도 아무일이 일어나지 않는다
```js
// Actions Types
export const ADD_TODO = 'ADD_TODO';
export const COMPLETE_TODO = 'COMPLETE_TODO';

// Action Creator
export function addTodo(text) {
  return { type: ADD_TODO, text };
}

export function completeTodo(index) {
  return { type: COMPLETE_TODO, index };
}
```

## 리덕스에서 불변성을 유지해야 하는 이유
* 데이터가 변경 되는 것을 감지하기 위하여 shallow equality 검사를 하기 때문  
(= 깊숙한 안쪽까지 비교를 하는 것이 아니라 겉핥기 식으로 비교를 하여 좋은 성능을 유지할 수 있는 것)
* 동일한 input이라면 언제나 동일한 output이 나와야한다 (순수함)
* 하지만 실행 할 때 마다 다른 결과값을 나타낸다면 ? (순수하지 않음)  
(ex. new Date(), 랜덤숫자, 네트워크요청...)
  * -> 리덕스 미들웨어 를 사용하여 리듀서 함수의 바깥에서 처리

---

# # React Basic

## Default / Named import, export

Q: 이들의 차이점은?  
A: 모듈을 대표하는 값은 Default exports로, 부가적인 것들은 Named exports로 지정
```js
import React from "react"; // Default import
import React, { Component } from "react"; // Default + Named import

export default App; // Default export
export { App }; // Named export
```

### 1. import

1. `export default`한 것을 받아올 때에는 중괄호를 쓰지 않고 내가 쓰고 싶은 이름을 써서 받아올 수 있다.

2. Named exports와 Default exports를 동시에 사용한 모듈을 import할 때 한 번에 import하는 것도 가능하다.

   ```javascript
   import serviceName, {MESSAGE, BYE_MESSAGE as BM} from './myModule'
   ```

3. React 모듈은 Named exports와 Default exports가 모두 처리되어 있기 때문에 다음과 같은 형식으로 불러올 수도 있다.

   ```javascript
   import React, {Component} from 'react';
   ```

4. [MDN import](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Statements/import)

5. export한 값을 import할 때는 값이 복사되는 것이 아니라 실제로 선언된 변수가 들어온다. 따라서 다음 코드는 `const`로 선언된 변수에 새로운 값을 할당하고 있으므로 에러가 발생한다.

   ```javascript
   export const foo = 1;
   import {foo} from './myModule'
   foo = 2; // Error!
   ```

6. 객체를 export하고 해당 모듈을 import한 파일에서 해당 객체의 프로퍼티를 변경하면 해당 객체를 참조하고 있는 모든 프로퍼티에 영향을 미친다.

<br />

### 2. export

1. export를 하는 방법은 Named exports, Default exports(스크립트 당 딱 하나)의 두 가지가 있다.

2. `export default`는 파일 당 한 번만 할 수 있다. 대표하는 값을 `export default`한다.

3. export할 때에도 마찬가지로 as 키워드를 사용하여 별칭을 지정할 수 있다.

   ```javascript
   const BYE_BYE_BYE_MESSAGE = 'bye';

   export { BYE_BYE_BYE_MESSAGE as BYE_MESSAGE };
   ```

4. Named exports와 Default exports를 함께 사용할 수도 있다. 모듈을 대표하는 값은 Default exports로, 부가적인 것들은 Named exports로 지정한다.

5. export를 다음과 같은 형식으로도 가능하다.

   ```javascript
   export const MESSAGE = 'Hello';
   ```

6. [MDN export](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Statements/export)


## # PropTypes
컴포넌트의 props에서 타입을 체크. 성능상의 이유로 propTypes 는 개발 모드에서만 체크한다

```js
import PropTypes from 'prop-types';

MyComponent.propTypes = {
  optionalArray: PropTypes.array,
  optionalBool: PropTypes.bool,
  optionalFunc: PropTypes.func,
  optionalNumber: PropTypes.number,
  optionalObject: PropTypes.object,
  optionalString: PropTypes.string,
  optionalSymbol: PropTypes.symbol,

  optionalNode: PropTypes.node,

  // A React element.
  optionalElement: PropTypes.element,

  // JS's instanceof operator.
  optionalMessage: PropTypes.instanceOf(Message),

  // it as an enum.
  optionalEnum: PropTypes.oneOf(['News', 'Photos']),

  // 여러 타입중 하나이면 된다
  optionalUnion: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.instanceOf(Message)
  ]),

  // An array of a certain type
  optionalArrayOf: PropTypes.arrayOf(PropTypes.number),

  // An object with property values of a certain type
  optionalObjectOf: PropTypes.objectOf(PropTypes.number),

  // An object taking on a particular shape
  optionalObjectWithShape: PropTypes.shape({
    color: PropTypes.string,
    fontSize: PropTypes.number
  }),

```

---


### align-self: center; align-items: center;
### 마진병합
### 마진을 위로줄것인가? 아래로 줄것인가? 인스타그램의 규칙 알아보기
### flex-basis
플렉스 아이템의  초기 / 시작 크기를 지정 main-axis
width: 고정된 크기

[](http://gedd.ski/post/the-difference-between-width-and-flex-basis/)

flex shorthand는 flex-grow, flex-shrink 및 flex-basis 


The first thing that comes to mind when reading your question is that flex-basis doesn't always apply to width.

When flex-direction is row, flex-basis controls width.
But when flex-direction is column, flex-basis controls height.
flex-basis applies only to flex items. Flex containers (that aren't also flex items) will ignore flex-basis but can use width and height.

flex-basis works only on the main axis. For example, if you're in flex-direction: column, the width property would be needed for sizing flex items horizontally.

flex-basis has no effect on absolutely-positioned flex items. width and height properties would be necessary. Absolutely-positioned flex items do not participate in flex layout.

By using the flex property, three properties – flex-grow, flex-shrink and flex-basis – can be neatly combined into one declaration. Using width, the same rule would require multiple lines of code.

css animation
```css
._824m9 {
    height: 427px;
    left: 0;
    opacity: 0;
    position: absolute;
    top: 0;
    visibility: hidden;
    width: 240px;
}

._4je3h, ._9i1mm {
    opacity: 1;
    visibility: visible;
}

._4je3h {
    -webkit-transition: opacity 1.5s ease-in;
    transition: opacity 1.5s ease-in;
    z-index: 2;
```