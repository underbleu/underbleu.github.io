---
layout: post
title: Storybook, React-router
category: React
permalink: /React/:title

tags: [React]
comments: true
---

# 개발환경 세팅

>개발환경 세팅
>1. storybook
>2. [ESLint](https://eslint.org/)
>3. editorconfig

## 1. storybook
>[storybook 공식문서](https://storybook.js.org/)
1. storybook 설치  
`npm i --save-dev @storybook/react`
2. 설치가 완료되면, package.json에 devDependencies에 `"@storybook/react"`생성된다.
    * `"dependencies"` : 서비스운영에 진짜 필요한 것들 (`$ npm install`시 자동설치됨)
    * `"devDependencies"` : 개발할때만 사용하는 라이브러리를 따로 설정 (자동설치안됨)
    * 두 개를 구분하여 설치할 파일들의 의존성관리를 따로 해주면 좀 더 효율적이다.

3. scripts에 storybook 실행명령어 추가 
```js
// package.json
{
  "scripts": {
    "storybook": "start-storybook -p 9001 -c .storybook"
  }
}
```

4. `.storybook/config.js`를 생성하여 아래코드 작성
```js
import { configure } from '@storybook/react';

function loadStories() {
  require('../stories/index.js');
  // You can require as many stories as you need.
}
```

* `stories/index.js`를 생성하여 아래코드 작성
```js
// Button -> button으로 변경
import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

storiesOf('button', module)
  .add('with text', () => (
    <button onClick={action('clicked')}>Hello button</button>
  ))
  .add('with some emoji', () => (
    <button onClick={action('clicked')}>😀 😎 👍 💯</button>
  ));
```

* `$ npm run storybook` 스토리북 실행

---

## 2. ESLint
* `create-react-app`으로 프로젝트를 생성하면 자동으로 node_modules ESLint가 깔린다
* `$ npx eslint`로 ESLint를 바로 실행시킬 수 있다
* ESLint 설정파일에서 코딩컨벤션을 세세하게 설정할 수 있다. -> [ESLint_rules](https://eslint.org/docs/rules/)
* src폴더에 `.eslintrc`파일을 생성하여 규칙 설정 코드를 붙여넣는다.
```js
{
  "rules": {
    "semi": ["error", "always"], // semicolon을 항상 사용한다.
    "quotes": ["error", "double"] // " 쌍따옴표만 사용한다.
  }
}
```
* 일단 우리는 [create-react-app](https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/template/README.md#displaying-lint-output-in-the-editor) 방식을 사용한다  
( air-bnb의 ESLint규칙도 많이 사용한다 )
```js
// src폴더에 `.eslintrc`파일을 생성하여 아래코드를 붙여넣는다.
{
"extends": "react-app"
}
```

* Vscode의 확장기능 `EsLint`을 설치한다.

---


## 3. editorconfig
src폴더에 `.editorconfig`파일을 만들고, 아래코드를 작성해준다.
```js
root = true

[*]
indent_style = space
indent_size = 2
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true

```

---

# 게시판 실습 (with Redux)

## CSS라이브러리 세팅
* src/components/LoginScreen.js 생성
* stories/LoginScreen.js 생성하여 components 불러오기
`import LoginScreen from '../src/components/LoginScreen';`
* semantic-ui-react와 semantic-ui-css 설치
`$ npm install semantic-ui-react semantic-ui-css`

* src/index.js에서 `semantic-ui`불러오는 코드 추가
`import 'semantic-ui-css/semantic.min.css';`

* [semantic-ui-react](https://react.semantic-ui.com/elements/button) 에서 필요한 component 문서 정독

* src/index.js에서 styled-component 설치 & 불러오기
  * `$ npm install styled-component`
  * LoginScreen.js -> `import styled from 'styled-components';`

>재사용이 많을경우 styled-components로, 일회성 혹은 급하게 쓸경우에만 inline-style로 스타일링해준다.

---

## 개발순서
필히 기능단위로 차곡차곡 절차를 밟으며 개발을 진행해야한다.
개발순서 계획에 따라 프로젝트를 성패를 좌우하기 때문에 아주 중요하다.

>![개발순서]({{site.baseurl}}/img/dev-process.png)
>1. 화면 (Presentational Component)
>2. 라우터
>3. 컨테이너 (Container Component)
>4. 통신/데이터구조

## firebase 설치 & 설정
1. `$ npm install firebase`
2. 파이어베이스 설정코드 추가  
(파이어베이스 콘솔 > 프로젝트 > 웹앱추가 코드 복사)
```js
// src/index.js
import * as firebase from 'firebase';

const config = {
  apiKey: "...",
  authDomain: "fds-redux.firebaseapp.com",
  databaseURL: "https://fds-redux.firebaseio.com",
  projectId: "fds-redux",
  storageBucket: "",
  messagingSenderId: "..."
};
firebase.initializeApp(config);
```

## Container Component 생성 & firebase
1. src/containers 폴더 생성 (Containter 컴포넌트 전용 폴더)  
src/components 폴더 (Presentational 컴포넌트 전용 폴더)
2. LoginScreenContainer.js 생성
3. LoginScreen.js -> 구글로그인 기능 추가
```js
export default class LoginScreen extends Component {
  static defaultProps = {
    onGoogleLogin: () => {} // Prop이 안들어왔을때의 코드 추가
  }
  render() {
    return (
      <Button color='google plus' fluid onClick={this.props.onGoogleLogin}> {/*추가*/}
    );
  }
}
```

4. 이벤트핸들러 action에 넣어, 스토리보드에서 잘 동작하는지 테스트

---

## react-router-dom 설정

1. `containters/LoginScreenContainer.js`에 로그인 기능 구현
2. 라우터 설치  
`$ npm install react-router-dom`
3. Redirect 불러오기  
`import {Redirect} from 'react-router-dom';`

```js
import React, {Component} from 'react';
import * as firebase from 'firebase';
import {Redirect} from 'react-router-dom';

import LoginScreen from '../components/LoginScreen';

export default class LoginScreenContainer extends Component {
  state = {
    redirectToList: false
  }
  handleGoogleLogin = async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    await firebase.auth().signInWithPopup(provider);
    this.setState({
      redirectToList: true
    });
  }
  render() {
    if (this.state.redirectToList) {
      return (
        <Redirect to="/list" />
      );
    } else {
      return (
        <LoginScreen onGoogleLogin={this.handleGoogleLogin} />
      );
    }
  }
}

```


6. src/index.js
logo.svg, App.css, App.test.js -> 필요없는 파일 삭제


```js
// src/App.js
import React, { Component } from 'react';
import {
  BrowserRouter,
  Route
} from 'react-router-dom';

import LoginScreenContainer from './containers/LoginScreenContainer';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div>
          <Route path="/login" component={LoginScreenContainer} />
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
```

---

## 글 목록페이지

>복잡한 레이아웃. 컴포넌트를 어떻게 분리할까 ?
Presentational / Container Component 개발계획 수립
1. 고정 nav 컴포넌트 (재사용성고려) ->  PC + CC
2. 글 목록 컴포넌트 -> PC + CC
3. 새 글쓰기 버튼 -> PC + CC
4. 푸터 (단순히 회사정보를 보여줌) -> PC (CC는 아님)


### [semantic-ui > Menu](https://react.semantic-ui.com/collections/menu#menu-example-menus) 컴포넌트 추가

```js
// components/TopMenu.js
import React, {Component} from 'react';

import {Menu} from 'semantic-ui-react';

export default class TopMenu extends Component {
  render () {
    return (
      <Menu>
        <Menu.Item name='browse'>
          게시판
        </Menu.Item>

        <Menu.Menu position='right'>
          <Menu.Item name='signup'>
            계정
          </Menu.Item>
        </Menu.Menu>
      </Menu>
    );
  }
}
```

### 'react-router' a태그 대신 Link 컴포넌트로 사용 (새로고침 없게)
`<Menu.Item as="a" href="https://google.com" name='browse'>` 새로고침O  
`<Menu.Item as="{Link}" to="https://google.com" name='browse'>` 새로고침X

```js
// TopMenu.js
import React, {Component} from 'react';
import {Menu} from 'semantic-ui-react';

export default class TopMenu extends Component {
  static defaultProps = {
    logoProps: {},
    accountProps: {}
  }

  render () {
    const {logoProps, accountProps} = this.props;
    return (
      <Menu>
        <Menu.Item {...logoProps} name='browse'>
          게시판
        </Menu.Item>
        <Menu.Menu position='right'>
          <Menu.Item {...accountProps} name='signup'>
            계정
          </Menu.Item>
        </Menu.Menu>
      </Menu>
    );
  }
}
```

```js
// TopMenuContainer.js
import React, {Component} from 'react';
import {Link} from 'react-router-dom';

import TopMenu from '../components/TopMenu';

const logoProps = {
  as: Link,
  to: '/list'
};

const accoutProps = {
  as: Link,
  to: '/account'
};

export default class TopMenuContainer extends Component {
  render() {
    return (
      <TopMenu logoProps={logoProps} accountProps={accountProps} />
    );
  }
}
```

```js
// ListPage.js
import React from 'react';
import TopMenuContainer from './TopMenuContainer';

export default () => (
  <div>
    <TopMenuContainer />
  </div>
)
```

* src/hocs/withAuth.js
```js
// withAuth.js
import React, { Component } from 'react';
import * as firebase from 'firebase';
import { Redirect } from 'react-router-dom';
import { Dimmer, Loader } from 'semantic-ui-react';

export default function withAuth(WrappedComponent) {
  return class extends Component { // 익명함수로 사용가능
    state = {
      currentUser: null,
      loading: false,
      redirectToLogin: false
    }
    componentWillMount() {
      const currentUser = firebase.auth().currentUser;
      if (currentUser) {
        this.setState({
          currentUser
        });
      } else {
        this.setState({
          loading: true
        })
        const unsubscribe = firebase.auth().onAuthStateChanged(user => {
          unsubscribe();
          if (user) {
            this.setState({
              currentUser: user,
              loading: false
            });
          } else {
            this.setState({
              redirectToLogin: true
            });
          }
        })
      }
    }
    render() {
      if (this.state.redirectToLogin) {
        return (
          <Redirect to="/login" />
        )
      } else if (this.state.loading) {
        return (
          <Dimmer active={this.state.loading}>
            <Loader />
          </Dimmer>
        )
      } else {
        return (
          <WrappedComponent {...this.props} />
        )
      }
    }
  }
}
```
* hocs적용후 코드수정

```js
// ListPage.js
import React from 'react';
import TopMenuContainer from './TopMenuContainer';
import withAuth from '../hocs/withAuth';

const ListPage = () => (
  <div>
    <TopMenuContainer />
  </div>
)

export default withAuth(ListPage);
```

---
# 참고글
[redux ducks 패턴](https://github.com/JisuPark/ducks-modular-redux)

