---
layout: post
title: 강의노트. Redux 실습. Github 지토리 목록 가져오기
category: react
permalink: /react/:title

tags: [React]
comments: true
---

## POSTMAN으로 Github 레포지토리 목록 가져와보기
1. Github 임시 토큰생성
  * Github > setting > Developer settings > Personal access tokens > Generate new Token
  * repo >  public_repo (체크!)

[Github REST API v3 | repos](https://developer.github.com/v3/repos/#list-your-repositories)

GET https://api.github.com/user/repos

2. 인증
OAUTH-TOKEN에 방금 생성한 token붙여넣기 후 SEND!
`https://api.github.com/?access_token=OAUTH-TOKEN`


## 리액트의 ref속성**
ref속성은 함수를 prop로 받는다.
input DOM element가 매개변수로 들어옴
this = TokenForm의 input에 DOM element인 input태그를 대입하는것.
Form으로 둘러쌓여있지 않은데 버튼을 눌러 input의 value를 가져오는법

>**리액트의 특별한 속성 key, ref**  
일반 속성들과 다르게 key와 ref는 리액트에서 this.props로 가져올 수 없다

```js
class TokenForm extends Component {
  render () {
    return (
      <div>
        <input type="text" ref={input => this.input = input} />
        <button onClick={this.handleCilick}>불러오기</button>
      </div>
    )
  }
}
```
POSTMAN에 출력된 레포속성확인후

---

1. 데이터 구조
store에 repos라는
updateRepos라는 actionCreator


>순서!!
>1. Presentational Components (보여질거를 만들고)
>2. action, reducer를 만들고
>3. Container Components로 리액트와 리덕스 연결

### 1. Presentational Components을 만들고(보여줄걸 만들고)
```JS
class TokenForm extends Component {
  handleClick = e => {
    this.props.onSubmit(this.input.value); //input DOM element객체가 들어있음
  }

  render () {
    return (
      <div>
        <input type="text" ref={input => this.input = input} />
        <button onClick={this.handleClick}>불러오기</button>
      </div>
    )
  }
}
```

## 2.. action, reducer 만들고
```js
export function fetchRepos(token) {
  return async function(dispatch) {
    const res = await fetch(`https://api.github.com/user/repos?access_token=${token}`);
    const data = res.json();
    const repos = data.map(repoObj => repoObj.name); // repository name이 담겨있는 배열
    dispatch(updateRepos(repos)); // dispatch -> state를 업데이트
  }
}

function updateRepos(repos) {
  return {
    type: 'UPDATE_REPOS',
    repos
  }
}
```
3. Container Components_RepoList TokenForm 리액트와 리덕스 연결

```js
// App.js
const ConnectedTokenForm = connect(
  null,
  dispatch => {
    return {
      onSubmit: token => {
        dispatch(fetchRepos(token)); //-> Thunk
      }
    }
  }
)(TokenForm);

const ConnectedRepoList = connect(
  state => {
    return {
      repos: state.repos
    };
  }
  // 보여주는 역할뿐이니 matchDispatch.는 안넣어줘도됨
)(RepoList);

```

---
## devtools에서 thunk쓰기위한 세팅
https://github.com/zalmoxisus/redux-devtools-extension

에서 1.2 Advanced store setup의 코드 붙여넣기

```js
  import { createStore, applyMiddleware, compose } from 'redux';

+ const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
+ const store = createStore(reducer, /* preloadedState, */ composeEnhancers(
- const store = createStore(reducer, /* preloadedState, */ compose(
    applyMiddleware(...middleware)
  ));
```