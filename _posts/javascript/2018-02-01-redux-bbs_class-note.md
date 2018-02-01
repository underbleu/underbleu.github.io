>**오늘 배울 내용**
>1. ESLint (Airbnb)
>2. Firebase 환경별 프로젝트 설정
>     * 환경변수
>     * dev-project : localhost접속가능
>     * production-project : localhost접속불가 (보안)
>3. Firebase CLI
>     * 보안규칙 설정
>     * 예제 데이터 삽입
>4. ducks패턴을 활용한 redux실습
>5. netlify 배포방법
>     * BrowserRouter vs HashRouter
>     * 주의사항

---

# 실습.

## 1. 루트경로 접속시 Redirect
>*한 페이지는 하나의 URL만 갖도록해야한다 !*

* 같은 페이지로 이동하더라도 중복된 URL은 쓰지 말도록한다.
* `<Route path="/list" component={ListPage} />`와 중복된 경로 `{ListPage}`쓰지말기 -> Home을 선언하여 Redirect시키자!

```js
// App.js
import withAuth from './hocs/withAuth.js';

const Home = withAuth(() => <Redirect to="/list" />);

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div>
          <Route path="/" exact component={Home}/>
          {/*<Route path="/" exact component={ListPage}/>*/}
          <Route path="/login" component={LoginScreenContainer} />
          <Route path="/list" component={ListPage} />
        </div>
      </BrowserRouter>
    );
  }
}
```

## ESLint 재설정 (Airbnb버전)
1. `.eslintrc` 파일에 코드 삽입
```js
// .eslintrc
{
  "parser": "babel-eslint",
  "env": {
    "browser": true,
    "node": true,
    "jest": true
  },
  "extends": "airbnb",
  "rules": {
    "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
    "import/prefer-default-export": "off",
    "no-bitwise": "off",
    "react/prop-types": "off",
    "react/prefer-stateless-function": "off",
    "import/no-extraneous-dependencies": "off"
    "linebreak-style": "off", // 윈도우에서 추가해줘야하는 code
  }
}
```
2. 설치 Go!
`npx install-peerdeps --dev eslint-config-airbnb`

3. 설치후 빨간줄 많이 생김
    * 마지막에 , 콤마를 찍어주기 -> Git관리 개행 때문
    ```js
    import React, { Component } from 'react';
    import {
      BrowserRouter,
      Route,
      Redirect, // -> 콤마 찍어주기
    } from 'react-router-dom';
    ```
    * **Autofix 기능**
ctrl+shift+P > ESLint:fix 자동으로 문법을 고쳐줌. 작업 중간에 자주 해주도록
    * ESLint 꺼주기 -> [eslint-disable](https://eslint.org/docs/user-guide/configuring#disabling-rules-with-inline-comments)
    registerServiceWorker.js에 주석추가해주기
    `/* eslint-disable */`

## ArticleList
[semantic-ui의 List활용](https://react.semantic-ui.com/elements/list#list-example-divided)
스토리북에 넣어서 잘 출력되는지 확인해가며 작업하기

* 더미데이터 만들기
  * createdAt -> 에포크타임생성
  "`new Date().getTime()`" or "`Date.now()`" 둘중하나 쓰기

```js
import React, { Component } from 'react';
import { List } from 'semantic-ui-react';

const articles = [
  {
    id: 'article01',
    title: '게시글 제목',
    createdAt: 1517453801003,
    nickName: 'Bong',
  },
  {
    id: 'article02',
    title: '게시글 제목2',
    createdAt: 1517453801003,
    nickName: 'Bong',
  },
  {
    id: 'article03',
    title: '게시글 제목3',
    createdAt: 1517453801003,
    nickName: 'Bong',
  },
];

export default class ArticleList extends Component {
  render() {
    return (
      <List divided relaxed>
        {
          articles.map(({
            id,
            title,
            createdAt,
            nickName,
          }) => (
            <List.Item key={id}>
              <List.Icon name="github" size="large" verticalAlign="middle" />
              <List.Content>
                <List.Header as="a">{title} ({nickName})</List.Header>
                <List.Description as="a">{createdAt}</List.Description>
              </List.Content>
            </List.Item>
          ))
        }
      </List>
    );
  }
}
```

## 더미데이터 Storybook으로 이동시키고 실제 데이터 받아올 준비

```js
export default class ArticleList extends Component {
  static defaultProps = {
    articles: [],
  }
  render() {
    const { articles } = this.props;
    return (...);
```

## Storybook 테스트 더미 추가
```js
import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import ArticleList from '../src/components/ArticleList';

const articles = [
  {
    id: 'article01',
    title: '게시글 제목',
    createdAt: 1517453801003,
    nickName: 'Bong',
  },
  {
    id: 'article02',
    title: '게시글 제목2',
    createdAt: 1517453801003,
    nickName: 'Bong',
  },
  {
    id: 'article03',
    title: '게시글 제목3',
    createdAt: 1517453801003,
    nickName: 'Bong',
  },
];

const articlesWithLink = articles.map(article => ({
  ...article,
  itemProps: {
    as: 'a',
    href: 'https://google.com',
    target: '_blank',
  },
}))

storiesOf('ArticleList', module)
  .add('default', () => (
    <ArticleList articles={articles}/>
  ))
  .add('links', () => (
    <ArticleList articles={articlesWithLink}/>
  ));
```
> commit | Complete. ArticleList Component



---
# firebase CLI
>[firebase CLI 문서](https://firebase.google.com/docs/cli/)
이제 컴퓨터의 모든 터미널 창에서 디렉토리에 관계없이 Firebase 명령을 사용할 수 있다.

1. 자주 사용할것. 전역에 설치
`$ npm install -g firebase-tools`
2. 설치후 로그인
`$ firebase login`
3. 관리하는 프로젝트 list 확인
`$ firebase list`
4. 해당 프로젝트 안으로 이동하여 실행(주의!)
`$ firebase init`
    * Database만 체크하고 실행
    * 연동할 프로젝트 파일 체크
    * 보안규칙 -> 그냥 엔터(기본 사용)

5. json파일 생성 루트에
```json
{
  "articles": {
    "article0": {
      "title": "게시글 01",
      "createdAt": 1517453801003
    },
    "article1": {
      "title": "게시글 02",
      "createdAt": 1517453801003
    }
  }
}
```
6. firebase 데이터에 넣어주기
`$ firebase database:set / sample.json`

## Redux & 데이터구조 생각해보기
actions CRUD

```js
// src/ducks/articleList.js

// Actions
export const LOADING = 'articleList/LOADING';
export const SUCCESS = 'articleList/SUCCESS';

// Action Creator
export function loadingArticleList() {
  return {
    type: LOADING,
  };
}

export function successArticleList(articles) {
  return {
    type: SUCCESS,
    articles,
  };
}

// Reducers
const initialState = {
  loading: false,
  articles: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case LOADING:
      return {
        ...state,
        loading: true,
      };
    case SUCCESS:
      return {
        loading: false,
        articles: action.articles,
      };
    default:
      return state;
  }
}
```

## Jest로 Redux 코드 테스트하기
* Presentational Component : Storybook으로 테스드
* Container Component는 React와 궁합이 좋은 프론트엔드 테스트툴 Jest를 활용한다.
Action Creator와 Reducer는 Jest로 테스트한다
* 참고로 Jest는 create-react-app에 내장되어 자동으로 설치되어있다
* 선생님여담... test를 신경써서 짜면 면접에 도움되요
>[jest 공식홈](https://facebook.github.io/jest/)
>[Jest로 Redux 코드 테스트하기](https://github.com/reactjs/redux/blob/master/docs/recipes/WritingTests.md#action-creators)

1. test 코드작성
```js
//articleList.test.js

import reducer, { // default import는 따로 써줌
  LOADING,
  loadingArticleList,
} from './articleList';

describe('articleList', () => {
  it('loadingArticleList 동작 여부 확인', () => {
    const action = loadingArticleList();
    expect(action).toEqual({
      type: LOADING,
    });
  });

  it('reducer 초기 상태 테스트', () => {
    const state = reducer(undefined, {}); // undefined를 넘기면 initialState를 비교
    expect(state.loading).toBe(false);
    expect(state.articles).toEqual([]); // 객체는 깊은비교 : toEqual()
  });

  it('loadingArticleList 넘겼을 때의 상태', () => {
    const state = reducer(undefined, loadingArticleList());
    expect(state.loading).toBe(true);
    expect(state.articles).toEqual([]);
  });

  it('loadingArticleList를 articles가 존재하는 상태에 적용', () => {
    const state = reducer({ // {객체를 넘기면} 객체와 비교
      loading: false,
      articles: [1, 2, 3],
    }, loadingArticleList());
    expect(state.loading).toBe(true);
    expect(state.articles).toEqual([1, 2, 3]);
  });
});
```
2. test 시작 -> PASS되면 통과
`$ npm run test`
>의문1) 객체와 객체비교는 얕은비교인데 PASS가 될 수 있나?
>* toEqual()이라는 함수는 깊은비교를 하기 때문에 내용을 비교
>* toBe()는 얕은 비교라 FAIL된다
[toBe, toEqual 공식문서](https://facebook.github.io/jest/docs/en/using-matchers.html)

3. function이름 전체 문서에서 수정하기
왼쪽 메뉴바 > 돋보기 아이콘 > `loadingArticleList -> articleListLoading` 수정!

## thunk테스트는 일일히 손으로 짜서 테스트해야함

1. thunk 설치
`$ npm install --save redux-thunk`
2. thunk import 코드 추가
```js
// App.js
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

const store = createStore(
  rootReducer,
  applyMiddleware(thunk),
);
```

```js
// ducks/articleList.js
import * as firebase from 'firebase';

// Thunk
export const fetchArticleList = () => async (dispatch) => {
  dispatch(articleListLoading());
  const snapshot = await firebase.database().ref('articles').once('value');
  const articleObj = snapshot.val(); // 객체를 가져옴 -> 배열의 형태로 변환필요
  const articles = articleObj.entries(articleObj).map(([id, article]) => ({
    ...article,
    id,
    nickName: 'Bong', // FIXME : 나중에 수정필요
  }));
  dispatch(articleListSuccess(articles));
};
```
`// FIXME` 주석 패턴

* [redux react와 함께 사용하기](https://deminoth.github.io/redux/advanced/UsageWithReactRouter.html)
`$ npm install redux react-redux`

```js
//ducks/index.js
import { combineReducers } from 'redux';

import articleList from './articleList';

export default combineReducers({
  articleList,
});
```

```js
//App.js
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import rootReducer from './ducks';

const store = createStore(rootReducer);

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <div>
            <Route path="/" exact component={Home} />
            <Route path="/login" component={LoginScreenContainer} />
            <Route path="/list" component={ListPage} />
          </div>
        </BrowserRouter>
      </Provider >
    );
  }
}
```

```js
//containers/ArticleListContainer.js

import { connect } from 'react-redux';

import ArticleList from '../components/ArticleList';

export default connect(
  // mapStateToProps
  state => ({
    articles: state.articleList.articles,
  }),
  // mapDispatchToProps
  dispatch => ({
    onMount: () => {
      dispatch(fetchArticleList());
    },
  }),
)(ArticleList);

```
```js
//container/ListPage.js
import React from 'react';
import TopMenuContainer from './TopMenuContainer';
import withAuth from '../hocs/withAuth';
import ArticleListContainer from './ArticleListContainer';

const ListPage = () => (
  <div>
    <TopMenuContainer />
    <ArticleListContainer />
  </div>
);

export default withAuth(ListPage);
```

```js
//ArticleList.js
export default class ArticleList extends Component {
  static defaultProps = {
    articles: [],
    onMount: () => {},
  }

  componentDidMount() {
    this.props.onMount();
  }

```

---

## Loading Indicator

```js
// hocs/withLoading

```

---
# Netlify 배포

1. 루트폴더에 `.nvmrc`파일 생성, node버전인 `8`입력 & commit

2. netlify > Github 레포지토리 선택
Build Command : npm run build
Publish Directory : build
입력
3. firebase 콘솔 > Authentification > 로그인방법 > netlify 도메인추가 (인증승락)

>**혹시 새로고침시 오동작하는 호스팅 서비스 업체라면?**
>-> App.js의 `BrowserRouter`를 `HashRouter`로 써야한다
```js
import React, { Component } from 'react';
import {
  HashRouter,
  Route,
  Redirect,
} from 'react-router-dom';


class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <HashRouter>
          <div>
            <Route path="/" exact component={Home} />
            <Route path="/login" component={LoginScreenContainer} />
            <Route path="/list" component={ListPage} />
          </div>
        </HashRouter>
      </Provider >
    );
  }
}
```
---

## vscode 디버깅
extension debugger for chrome설치
---

# ducks 패턴
컴포넌트엔 비동기함수를 넣지않고, thunk를 사용하는 흐름
서로 연관된 action, reducer, thunk를 한파일에 묶어서 `/ducks/` 폴더에 작업하는 방식

---

## Source Tree설정 추가
원격저장소 push URL은 https://말고 git.블라블라로 쓰도록한다.
이게 훨씬빠름
원격저장소 > 설정 > 주소 SSH주소로 변경
도구 > 옵션 > SSH클라이언트 설정 > OpenSSH로 변경


