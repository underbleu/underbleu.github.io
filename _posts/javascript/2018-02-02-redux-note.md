# 실습

## 무한루프 문제 해결
>역할과 책임의 중요성 !
* dispatch가 계속되어 무한 loading 되고있는 상태.
* Presentational Component에서 데이터로딩 금지 !
    * PC는 보여지는 역할만 담당하도록
    * `componentDidMount`를 쓰려면 아주 조심히 써야한다.

>해결책 ) PC의 데이터로딩코드 "componentDidMount"를 CC로 이동시켜 각자의 역할과 책임을 확실히 구분해준다!

1. PC에서 데이터로딩 code를 : `componentDidMount() {..}`
```js
// components/ArticleList.js

export default class ArticleList extends Component {
  // [무한루프해결] PC의 데이터로딩 code -> CC로 이동
  // static defaultProps = {
  //   articles: [],
  //   onMount: () => {},
  // }
  // componentDidMount() {
  //   this.props.onMount();
  // }

  render() {...}
}
```
2. CC로 옮기기
```js
// containers/ArticleListContainer.js

class ArticleListContainer extends Component {
  // [무한루프해결] PC의 데이터로딩 code -> CC로 이동
  static defaultProps = {
    onMount: () => {},
  }
  componentDidMount() {
    this.props.onMount();
  }
  render() {
    return (
      <ArticleListWithLoading {...this.props} />
    );
  }
}
```


## 글쓰기 Form 구현
>[semantic-ui:Form](https://react.semantic-ui.com/collections/form#form-example-field)

* 글쓰기 Form을 구현할땐 데이터통신을 redux말고 "react의 내장상태"를 활용

* But, 회원가입폼이라면 DB에서 회원정보가 이미 존재하는지 등의 통신이 필요하기 때문에, 외부세계와 연결됨 container component가 되어야한다


## Form데이터를 전송 두가지 방법
* `<Form onSubmit={this.handleSubmit}>`
: input필드에서 엔터를치면 자동으로 form데이터가 전송되는 브라우저 내장기능을 사용하고 싶을때
* `<Form.Button onClick={this.handleSubmit}>`
: button을 눌렀을때만 form데이터가 전송되게 하고싶을때
브라우저 내장기능(기본기능)막는방법 2가지
    1. `<Form onSubmit={e.preventDefault()}>...</Form>`
    2. `<Form as='div'>...</Form>` -> 우리는 이걸사용 !

## Firebase와 데이터 연동
articles / content 를 따로 저장.
articles > title, uid, createdAt
content > id

---

# React-helmet 라이브러리
document head태그의 내용들(title, meta...)를 바꿔주기 위해 사용
페이지마다 다른 helmet을 입혀줄 수 있음.
[React-helmet](https://github.com/nfl/react-helmet)

---

# Firebase 프로젝트 관리 요령
[create-react-app 환경변수 설정하기](https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/template/README.md#adding-custom-environment-variables)

firebase인증코드를 환경변수에 넣어주도록한다

프로젝트에 `.env`파일 생성 (외부연결)
index.js 안의 config를 .env로 이동시키

```bash
# .env
REACT_APP_API_KEY=AIzaSyBD8CfLa32HnzXiItzAoYFKvmVuAhPy82Y
REACT_APP_AUTH_DOMAIN=fds-redux.firebaseapp.com
REACT_APP_DATABASE_URL=https://fds-redux.firebaseio.com
REACT_APP_PROJECT_ID=fds-redux
REACT_APP_STORAGE_BUCKET=fds-redux.appspot.com
REACT_APP_MESSAGING_SENDER_ID=321732403014
```

```js
// index.js
const config = {
  apiKey: process.env.REACT_APP_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
};
```

netlify > deploys > Deploy setting > Build environment variables
이곳에 환경변수 모두 넣어주며 배포완료 !


## 보안규칙 업로드
database.rules.json에 보안규칙 작성후
* `$ firebase deploy`
* `$ firebase deploy -P` 모든프로젝트에 보안규칙 업로드

---

# GraphicQL & SSR (Server Side Rendering)
* GraphicQL
  * https://developer.github.com/v4/explorer/

  * 위 URL에서 쿼리변환 테스트해보기 !!
```
query {
viewer {
  name,
  avatarUrl,
  createdAt,
  repositories(first: 10) {
    nodes {
      name,
      createdAt,
      diskUsage,
    }
  }
}
}
```


* 서버사이드 렌더링의 중요성
  * 브라우저에서 자바스크립트를 실행시켜야만 화면이 그려짐.
  * But, 크롤러같은 기계들이 검색엔진에 데이터를 쌓을땐 자바스크립트를 실행시키지 않는 경우도 있음 -> SEO문제
  * 그렇기 때문에 SEO를 개선시키기위해, 브라우저측이 아닌 서버에서 렌더링하는게 좋다
  * 로딩속도도 조금 더 빠르다
  * 검색엔진 최적화에 필수이다 !

>Next.js, Prerender.io, Netlify prerender기능 찾아보기
---

# 과제

새게시물 버튼이 한번 새글을 작성한 이후에는 다시 눌리지 않는다.
이 버그를 해결하세요

---

# 참고글

* [storybook시작하기](https://github.com/storybooks/storybook)
