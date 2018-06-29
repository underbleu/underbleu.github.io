# 3-35 Login In with Facebook
[문서](https://github.com/keppelen/react-facebook-login)
1. 설치  
`$ yarn add react-facebook-login`
2. import  
`import FacebookLogin from "react-facebook-login";`
3. 페이스북 로그인 라이브러리의 컴포넌트는 Ionicon를 가질 수 없음 -> Fontawesome으로 대체
4. LoginForm에 `_handleFacebookLogin()`을 만들어 props로 내려주고
5. props로 내려온 `handelFacebookLogin` 타입체크
6. presenter.js의 `<FacebookLogin />`컴포넌트에서
    * 콜백으로 props로 받아온 함수 `handelFacebookLogin` 호출
    * appID추가(facebook developer)
    * cssClass={formStyles.facebookLink} 속성추가 & 스타일링
    * icon="fa-facebook-official"
    ```js
    <FacebookLogin
        appId="1748996755157174"
        autoLoad={false}
        callback={props.handleFacebookLogin}
        cssClass={formStyles.facebookLink}
        icon="fa-facebook-official"
        textButton={context.t("Log in with Facebook")}
      />
    ```
---

# 3-36 Creating Facebook Login Redux Action

1. 만료되지 않는 JWT 토큰 만들기
```js
// config/settings/base.py
JWT_TOKEN = {
  'JWT_VERIFY_EXPIRATION': False
}
```
2. API Action 생성  
    * 액세스 토큰을 장고의 페이스북 로그인 url로 보내기
    * 리덕스 thunk를 이용해 디스패치할 시점을 조절
3. actionCreators 생성, 내보내기
```js
// redux/modules/user.js

// API Actions

function facebookLogin(access_token) { //--> 2번
  return dispatch => {
    fetch("/users/login/facebook", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringity({
        access_token
      })
    })
    .then(response => response.json())
    .then(json => console.log(json))
    .catch(err => console.log(err));
  };
}

// ...

// exports
const actionCreators = { //--> 3번
  facebookLogin
};

export { actionCreators }; //--> 3번
```

4. LoginForm/SignupForm의 컨테이너로 facebookLogin 액션을 props로 내려보내주기
    1. Container Components로 connect한, "`mapDispatchToProp`함수"에서 반환되는 객체가
    2. `Presentational Component`의 props가 된다.
```js
// LoginForm/index.js
import { actionCreators as userActions } from "redux/modules/user";

const mapDispatchToProps = (dispatch, ownProps) => {
  return { // 1. 반환된 객체가(facebookLogin 메서드)
    facebookLogin: access_token => {
      dispatch(userActions.facebookLogin(access_token));
    }
  }
}

export default connect(null, mapDispatchToProps)(Container);
```

```js
// LoginForm/container.js
class Container extends Component {
  
  // ...
  
  static propTypes = {
    facebookLogin: PropTypes.func.isRequired
  }
  
  render() {
    return (
      <LoginForm
        //...
        // 2. PC의 props로 내려가서 response의 토큰을 받아온다
        handleFacebookLogin={this._handleFacebookLogin}
      />
    );
  }
  // ...
  
  _handleFacebookLogin = response => {
    const { facebookLogin } = this.props;
    facebookLogin(response.accessToken);
  }
}
```

### # 현재상태
여기까진 "Facebook으로 로그인"버튼을 눌렀을때의 response의 토큰을 받아와서 콘솔에 표시해준뿐, 로그인 후의 화면으로 전환되지 않는 상태  
* 토큰이 있어도 화면의 변화는 없다  
* state를 변화시켜줘야 화면 변화가 생긴다 !  
* action을 디스패치하여 state를 변화시켜주자

---

# 3-38 Setting the Token with FB Login

토큰을 받을 때마다, saveToken이라는 액션을 디스패치하여 state를 바꿔주어 `Feed`로 화면을 전환할 수 있도록 해야한다

## 선 예측
`facebookLogin()`에서 response로 받아온 json의 토큰을 콘솔에 찍던것을

1. localStorage에 저장시켜준다 -> 새로고침해도 로그인이 유지됨
2. `saveToken()`을 디스패치하여 state를 변경 시켜준다  
-> `isLoggedIn: true`상태가 되어 `Feed`페이지로 화면 진입(Redirect)이 가능해진다
3. isLoggedIn의 PropTypes는 불리언이어야 하닌깐
    ```js
    // App/presenter.js
    App.propTypes = {
      isLoggedIn: propTypes.bool.isRequired
    }
    ```
4. localStorage에 jwt의 토큰을 `string`으로 받아와 저장하던 것을, 불리언으로 받아오도록 해준다

```js
// redux/modules/user.js

// API actions
function facebookLogin(access_token) {
  return dispatch => {
    fetch("/users/login/facebook/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        access_token
      })
    })
    .then(response => response.json()) // json으로 변환된 값을 반환
    // .then(json => console.log("응답", json))
    .then(json => {
      localStorage.setItem("jwt", json.token); //--> 1번. 로그인유지
      dispatch(saveToken(json.token)); //--> 2번. Feed페이지로
    })
    .catch(err => console.log(err));
  };
}

// initial state
const initialState = {
  // isLoggedIn: localStorage.getItem("jwt") || false 
  isLoggedIn: localStorage.getItem("jwt") ? true : false //--> 4번
}
```
* `.json()`의 반환값  
    * A promise that resolves with the result of parsing the body text as JSON. This could be anything that can be represented by JSON 
    * json 메소드는, HTTP 응답에 포함된 JSON 문자열을 JavaScript 객체로 바꾸어주는 역할을 합니다. 특이한 점은 json 메소드 역시 Promise 객체를 반환한다는 것

## 후 작업

1. action 생성
2. action creator 생성 (+ token)
3. state를 변경해줄 `applySetToken(state, action)` 리듀서함수 생성
3. reducer에 `SAVE_TOKEN` 액션이 들어오면 `applySetToken(state, action)`을 실행

```js
// redux/modules/user.js

// Actions
const SAVE_TOKEN = "SAVE_TOKEN"; //--> 1번

// Action Creator
function saveToken(token) { //--> 2번
  return {
    type: SAVE_TOKEN,
    token
  }
}

// Reducer
function reducer(state = initialState, action) {
  switch(action.type) {
    case SAVE_TOKEN: //--> 4번
      return applySetToken(state, action);
    default:
      return state;
  }
}

// Reducer Functions
function applySetToken(state, action) { //--> 3번
  const { token } = action;
  return {
    ...state,
    isLoggedIn: true,
    token
  };
}

export default reducer;
```

## 결과

* "Facebook로그인"을 클릭하면 response에 토큰이 들어온다
    ```js
    // Login/container.js
    _handleFacebookLogin = response => {
    const { facebookLogin } = this.props;
    facebookLogin(response.accessToken);
    }
    ```
* state의 `isLoggedIn: true`가 되어 `Feed`페이지로 이동하고
* 개발자도구의 application/LocalStorage에 "jwt토큰"이 저장되는걸 확인할 수 있음
    * "jwt토큰"이 있기 때문에 새로고침시 로그인이 유지됨
    * "jwt토큰"을 삭제하고 새로고침하면 로그아웃 된다