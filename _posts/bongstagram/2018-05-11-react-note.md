# 3-34 Controlling inputs and submit on LoginForm
1. 컴포넌트 확장  
input의 값을 잡아서 API로 전송해야하는 등. 컴포넌트 크기가 커져야 하기 때문에 React.Component를 확장하여 컨테이너를 생성한다
2. Input요소 Controlled-component로 변환  
PC의 input에 표시되는 값을, Container에 저장되어있는 state로 표시될 수 있도록 props를 내려보내준다
3. Container에서 내려온 props type 체크
4. `_handleInputChange()`  
input에 타이핑 할 때마다 이를 감지할 함수만든다
5. `<input name="" />`의 name속성  
입력받는 정보가 어떤 인풋으로부터 온것인지 설정
6. state와 연결  
state가 업데이트되면서 정상적으로 인풋창에 타이핑이 된다
7. `_handleSubmit()`  
   * 브라우저는 form의 submit버튼을 누르면, 디폴트로 form을 보내는 이벤트를 가지고 있다
   * 이는 url에 쿼리로 "username과 password"가 표시된다  
   -> `http://localhost:3000/?username=bong&password=no1234`
   * 비밀번호가 노출되는 것은 보안상 문제가 되기 때문에 form의 기본이벤트 막아줘야한다  
   -> `preventDefault()`
   
```js
// LoginForm/container.js
import React, { Component } from "react"; //--- 1
import LoginForm from "./presenter";

class Container extends Component {
  state = {
    username: '',
    password: ''
  }
  
  render() {
    const { username, password } = this.state;
    return (
      <LoginForm 
        usernameValue={username} //--- 2
        passwordValue={password} //--- 2
        handleInputChange={this._handleInputChange}
        handleSubmit={this._handleSubmit}
      />
    );
  }
  
  _handleInputChange = event => { //--- 4
    const{ target: { name, value } } = event;
    this.setState({ //--- 6
      [name]: value // name변수에 담겨있는 값을 key로 사용
    });
  };
  
  _handleSubmit = e => {
    e.preventDefault(); //--- 7
  };
}

export default Container;
```
```js
// LoginForm/presenter.js
import React from "react";
import PropTypes from "prop-types";
import Ionicon from "react-ionicons";
import formStyles from "shared/formStyles.scss";

const LoginForm = (props, context) => (
  <div className={formStyles.formComponent}>
    <form className={formStyles.form} onSubmit={props.handleSubmit}>
      <input type="text" 
        name="username" //--- 5
        value={props.usernameValue}
        onChange={props.handleInputChange}
        placeholder={context.t("Username")}
        className={formStyles.textInput}
        required="true"
      />
      <input type="password"
        name="password" //--- 5
        value={props.passwordValue}
        onChange={props.handleInputChange}
        placeholder={context.t("Password")}
        className={formStyles.textInput}
        required="true"
      />
      <input type="submit" value={context.t("Log in")} className={formStyles.button} />
    </form>
      <span className={formStyles.divider}>{context.t("or")}</span>
      <span className={formStyles.facebookLink}>
        <Ionicon icon="logo-facebook" fontSize="20px" color="#385185" />
        {context.t("Log in with Facebook")}
      </span>
      <span className={formStyles.forgotLink}>{context.t("Forgot password?")}</span>
  </div>
);

LoginForm.contextTypes = {
  t: PropTypes.func.isRequired
};

LoginForm.propTypes = { //--- 3
  usernameValue: PropTypes.string.isRequired,
  passwordValue: PropTypes.string.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired
}

export default LoginForm;
```



---

# 디스트럭처링(Destructuring)  
구조화된 배열 또는 객체를 Destructuring(비구조화, 파괴)하여 개별적인 변수에 할당하는 것. 배열 또는 객체 리터럴에서 필요한 값만을 추출하여 변수에 할당하거나 반환할 때 유용하다.

1. 배열 디스트럭처링 (Array destructuring)
    * 배열에서 필요한 요소만 추출하여 변수에 할당하고 싶은 경우에 유용
    * 추출/할당 기준은 배열의 인덱스

```js
// ES6 Destructuring
const arr = [1, 2, 3];

const [one, two, three] = arr;
console.log(one); // 1
```
2. 객체 디스트럭처링 (Object destructuring)
    * 객체에서 프로퍼티 이름(키)으로 필요한 프로퍼티 값만을 추출할 수 있다
    * 추출/할당 기준은 프로퍼티 이름(키)이다
    * 중첩객체의 경우, 객체 구조대로 중첩하여 추출한다
```js
const todos = [
  { id: 1, content: 'HTML', completed: true },
  { id: 2, content: 'CSS', completed: false },
  { id: 3, content: 'JS', completed: false }
];

// todos 배열의 요소인 객체로부터 completed 프로퍼티만을 추출
const completedTodos = todos.filter(({ completed }) => completed);
console.log(completedTodos); // [ { id: 1, content: 'HTML', completed: true } ]


// 중첩객체
const person = {
  name: 'Lee',
  address: {
    zipCode: '03068',
    city: 'Seoul'
  }
};

const { address: { city } } = person;
console.log(city); // 'Seoul'
```

---

# 객체의 프로퍼티 이름(key)
1. 프로퍼티 이름은 기본적으로 문자열(빈 문자열 포함)로 작성한다
2. 숫자도 가능하지만, 이는 암묵적으로 형변환되어 문자열이 된다 
3. 문자열 타입의 값으로 수렴될 수 있는 표현식
4. 대괄호([]) 표기법을 사용해서, 이미 정의된 변수의 이름을 그대로 속성의 값으로 사용할 수도 있다

```js
// 1, 3번
obj[123] = 123;
obj['prop' + 123] = false;

console.log(obj); // { '123': 123, prop123: false }

// 4번
var person = {};
var age = "한국나이";
person['age'] = 20;
person[age] = 22;

console.log(person); // {age: 20, 한국나이: 22}
```