---
layout: post
title: 강의노트. Webpack설정, React 이론
category: react
permalink: /react/:title

tags: [React]
comments: true
---

# # 2-2 Introduction to Webpack

## # 웹팩이란?
프로젝트의 여러파일들의 코드를 하나의 js css html파일로 변환시키는 도구
1. entry: 웹팩이 어디서부터 코드를 변환시킬지 (여러개파일)
2. output: 변환된 코드를 어디에 놓을지 (결과물은 단 하나)
3. module: webpack을 통해 bundling을 진행할 때 처리해야 하는 task들
    * module.rules: 각종 loader들을 등록
    * loader: 웹팩이 각각의 파일을 어떻게 변환할지 -> 하나의 파일 (scss로더, js로더...)
4. plugins: 로더가 변환시켜 놓은 각각의 파일을 마지막에 전체적으로 어떻게 변환할지  
*ex. 코드를 압축하여 난독화시켜주는 플러그인 uglify*

> Multiple Entries & One Output  
ES6로 코드를 작성하고, 웹팩을 이용해 브라우저가 이해할 수 있도록 "ES6 -> old JS"로 변환한 bundle.js파일을 만들어서 플러그인으로 uglify하여 최종 압축한다

```js
const path = require('path');
const webpack = require('webpack');
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");

module.exports = {
  entry: "./index.js",
  output: {
    path: path.resolve(__dirname, "dist"), // __dirname: 절대경로
    filename: "bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: "babel-loader",
        options: {
          presets: ["es2015"]
        }
      }
    ]
  },
  plugins: [new UglifyJsPlugin()]
};
```
## # 설치
개발용으로만 필요하기 때문에 dev-dependencies에 설치
```bash
$ yarn add babel babel-core babel-loader babel-preset-es2015 --dev
$ webpack # 웹팩 실행: old코드로 변환!
```

# # 2-4 Create React App

## # Create React App이란?  
일종의 configuration base. 쿠키커터와 유사하다

```bash
$ yarn global add create-react-app
$ create-react-app frontend
$ cd frontend
$ yarn start # 서버 작동
```

## # eject  
* create-react-app의 기본설정에선 CSS모듈과 Sass를 쓸 수 없다  
-> `$ yarn eject`로 커스터마이징 할 수 있게 만들어줘야함!
* eject를 하면 package.json에 많은 dependencies들이 생겨남
* 한 번 eject하면 되돌아갈 수 없다 !

```bash
$ yarn eject
```

* 불필요파일 삭제  
  * config / jest폴더 + package.json에서도 삭제
  * scripts / test~~ 파일모두 + package.json에서도 삭제

>* webpack.config.dev.js 개발용. yarn start
>* webpack.config.prod.js 배포용. yarn build


# # 2-7 SCSS to Webpack

### 1. sass 설치
```bash
$ yarn add sass-loader node-sass
```

### 2. 웹팩에 scss파일 컴파일하도록 설정  
config / webpack.config.dev.js와 webpack.config.prod.js에 코드추가 

* `sourceMap: true`  
SourceMaps는 웹팩이 하나의 파일로 압축해놓은 js, css파일을 path 구조까지 고려하여 원형으로 복원해주는 기술이다. 따라서 bundle된 코드에서 에러가 발생했을 때 어느부분에서 발생했는지 기존의 코드와 연결시켜주어 쉽게 디버깅할 수 있게 해준다
    >"A source map provides a way of mapping code within a compressed file back to it’s original position in a source file."

```js
// webpack.config.dev.js (개발용)
{
  test: /\.(css|scss)$/, // scss추가 !!
  use: [
    require.resolve('style-loader'),
    {
      loader: require.resolve('css-loader'),
      options: {
        importLoaders: 1,
      },
    },
    {
      loader: require.resolve('postcss-loader'),
      options: {
        ident: 'postcss',
        plugins: () => [
          require('postcss-flexbugs-fixes'),
          autoprefixer({
            browsers: [
              '>1%',
              'last 4 versions',
              'Firefox ESR',
              'not ie < 9', 
            ],
            flexbox: 'no-2009',
          }),
        ],
        sourceMap: true // 추가 !!
      },
    },
    { 
      loader: require.resolve('sass-loader'), // sass-loader 추가 !!
      options: {
        sourceMap: true
      }
    }
  ],
}

// webpack.config.prod.js (배포용)
{
  test: /\.(css|scss)$/, // scss 추가 !!
  loader: ExtractTextPlugin.extract(
    Object.assign(
      {
        fallback: {
          loader: require.resolve('style-loader'),
          options: {
            hmr: false,
          },
        },
        use: [
          {
            loader: require.resolve('css-loader'),
            options: {
              importLoaders: 1,
              minimize: true,
              sourceMap: shouldUseSourceMap,
            },
          },
          {
            loader: require.resolve('postcss-loader'),
            options: {
              ident: 'postcss',
              plugins: () => [
                require('postcss-flexbugs-fixes'),
                autoprefixer({
                  browsers: [
                    '>1%',
                    'last 4 versions',
                    'Firefox ESR',
                    'not ie < 9',
                  ],
                  flexbox: 'no-2009',
                }),
              ],
              sourceMap: true // 추가 !!
            },
          },
          {
            loader: require.resolve('sass-loader'), // sass-loader 추가 !!
            options: {
              sourseMap: true
            }
          }
        ],
      },
      extractTextPluginOptions
    )
  ),
}
```

### # loader의 역할
>웹팩의 로더들은 code의 "아래 -> 위"로 로딩된다
* `sass-loader`  
: scss파일을 css파일로 변환 (경로: build / static / css)
* `postcss-loader`  
: compatibility. 크로스 브라우징 이슈 제거  
  ```js
  autoprefixer({
    browsers: [
      '>1%',
      'last 4 versions',
      'Firefox ESR',
      'not ie < 9', // React doesn't support IE8 anyway
    ],
    flexbox: 'no-2009',
  })
  ```
* `css-loader`  
: css 파일 생성
* `style-loader`  
: css코드를 HTML의 헤드에 주입시켜준다
  * webpack.config.dev (개발버전) 
    * 빠른 새로고침을 위해 css코드를 HTML파일에 삽입
    * style-loader를 디폴트로 사용
  * webpack.config.prod (배포버전)
    * 독립적인 css파일을 생성  
    * style-loader는 fallback(안전빵)으로 사용
  ```js
  // webpack.config.prod.js
  test: /\.(css|scss)$/,
            loader: ExtractTextPlugin.extract(
              Object.assign(
                {
                  fallback: { // 안전빵
                    loader: require.resolve("style-loader"),
                    options: {
                      hmr: false
                    }
                  },
                  // ... 아래의 다른로더들이 실패했을 경우
                  // style-loader로 css코드를 html헤더에 inject
                  use: [ 
                    {
                      loader: require.resolve("css-loader"),
                  
  ```

# # 2-8 CSS모듈

## # CSS모듈의 역할  
같은 클래스명을 가진 요소들이 중복문제를 가지지않도록, 고유한 클래스명을 만들어준다.   

`.컴포넌트이름__클래스명__랜덤숫자(hash)`

>ex)  
`<Nav />` 안에 ul.list -> `Nav__list__fd35633`  
`<Photo />` 안에 ul.list -> `Photo__list__ae34743`

## # 설치
```js
// webpack.config.dev.js
{
  test: /\.(css|scss)$/,
  use: [
    require.resolve('style-loader'),
    {
      loader: require.resolve('css-loader'),
      options: {
        importLoaders: 1,
        modules: true // 추가!
      },
    },
    {
      
      
// webpack.config.prod.js
{
  loader: require.resolve("css-loader"),
  options: {
    importLoaders: 1,
    minimize: true,
    modules: true, // 추가!
    sourceMap: shouldUseSourceMap
  }
}
```

## # 랜덤 클래스명 사용을 위한 코드수정

```js
// App.js
import styles from './App.scss';

class App extends Component {
  render() {
    return (
      // 클래스명을 __ underscore로 변경
      <div className={styles.App}> 
        <header className={styles.App__header}> 
```
## # 클래스명 커스터마이징 코드 추가  
`[경로][앱이름]__[클래스명]--[해쉬넘버]`
  * (설정전) `.H8aTftz0aayF6-aGVA7ul` 
  * (설정후) `.src-App__App__title--3Cg-X` 

```js
test: /\.(css|scss)$/,
  use: [
    require.resolve('style-loader'),
    {
      loader: require.resolve('css-loader'),
      options: {
        // ...
        localIdentName: "[path][name]__[local]--[hash:base64:5]" // 추가
      },
    },
```

# # 2-10 Webpack Bundles with Django

장고서버에 업로드를 하고, 장고서버가 리액트앱을 읽을 수 있어야한다

* 포트 3000 (개발용. React server)
* 포트 8000 (배포용. Django server)

## # Proxy
* 리액트가 url `/notification`으로 가도 포트가 :3000이기때문에 요청을 받아올 수 없다.  
* request를 보내 데이터를 :3000에서 찾지 못했을때, proxy주소(:8000 장고서버)를 찾아보게 한다

### 1. Proxy the requests from :3000 to :8000
```js
// package.json
{
  "name": "frontend",
  "version": "0.1.0",
  "private": true,
  "proxy": "http://localhost:8000", // 추가
  // ...
```

### 2. Install django-cors-headers  
장고는 본인의 요청만 허용한다 -> :8000포트 이외에서 접근하면, 장고는 요청을 자동으로 차단하는데 이를 풀어줘야한다
```bash
$ pipenv install django-cors-headers
```

### 3. Add 'corsheaders' to APPS
리액트 리퀘스트를 받기위해 django-cors-header를 base.py에 추가
```py
# base.py
THIRD_PARTY_APPS = [
    # ...
    'corsheaders', # To accept requests from React
]
```
### 4. corsheaders 미들웨어 추가 + 세팅
* CommonMiddleware 전에 추가해야한다!  
* 장고서버가 request를 막는것을, CorsMiddleware가 허용하게 해준다
* CORS로 API를 오픈해주고, json web token을 받아 보안을 지켜준다
```py
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware', # 추가
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# ...

CORS_ORIGIN_ALLOW_ALL = True # 맨 마지막에 추가
```

### 5. 장고에게 리액트 static파일이 frontend/build안에 있다고 알려준다.
```py
STATICFILES_DIRS = [
    str(APPS_DIR.path('static')),
    str(ROOT_DIR.path('frontend', 'build', 'static')) # 추가
]
```

### 6. 봉스타그램 전체 view파일 생성

```py
# bongstagram/bongstagram/views.py
from django.views.generic import View
from django.http import HttpResponse
from django.conf import settings
import os


class ReactAppView(View):

    def get(self, request):
        try:
            with open(os.path.join(str(settings.ROOT_DIR), 'frontend', 'build', 'index.html')) as file:
                return HttpResponse(file.read())
        except:
            return HttpResponse(
                """
                index.html not found ! build your React app !!
                """,
                status=501,
            )
```

### 7. url에 react-app-view추가
url루트에 view를 추가하면 build된 리액트앱이 보일것이다 (static files)  
* 리액트 수정이 실시간으로 반영되는 것은 아님
* 장고에서도 업데이트된 화면을 보려면 `$ yarn build`로 앱을 새로 빌드해야한다
* catch-all-url: 위에 있는 url에서 해당되는곳이 없으면, 마지막에서 어떤 url이던 캐치하여 ReactAppView를 보여준다
```py
# config/urls.py
from bongstagram import views # 추가

urlpatterns = [
    
    # ...
    url(r"^", views.ReactAppView.as_view()), # 추가
```
