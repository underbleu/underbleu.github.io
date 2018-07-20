---
layout: post
title: Sass, Pacel
category: react
permalink: /react/:title

tags: [React]
comments: true
---

# Sass
>[Sass 홈페이지](http://sass-lang.com/)  
>[Sass 실습파일](http://github.com/underbleu/hello-sass)  
>VScode 확장프로그램: Live-Sass Compiler 설치 -> 자동으로 css파일 생성해줌

## Sass ?
* 초기에 Ruby로 만들어짐
* Ruby기반이라 처음엔 다른언어 개발자들이 less를 썼었음(js기반. compile이 브라우저에서 가능)
* 현재는 Sass가 생태계를 확장하여 다른 언어도 섭렵
* Sass, less, Scss중 압도적으로 사용률 1등
* Sass와 비슷게 CSS에도 css-variable이라는 새로운 기능이 생겼다 (IE 지원X)

## CSS와 Sass의 import 성능차이
CSS에서는 import를 많이 쓰면 느려지는 단점이 있지만, Sass에서는 compile과정에서 import된 파일을 필요한것만 골라 합치기 때문에 성능 문제가 없다.

## _Partials import
* 작은 css snippets을 Sass에 import하여 쓰기위한 용도 (ex. reset.scss)
* CSS를 모듈화하기 좋은 방법
* 앞에 _underscore를 붙이면, Sass 컴파일러가 CSS파일을 자동생성하지 않도록 알려준다

> **font파일 import는 무거운가?**  
무겁다. css가아니라 폰트파일 자체가 무겁다.
영문폰트의 경우는 용량이작다. 하지만 한글, 한문폰트의 경우는 용량이 몇 십배이다.
모바일에서 로딩속도가 4~5초까지 되는 경우도 있기 때문에 한글의 경우 되도록 **브라우저 내장폰트를 사용하기를 권장**한다.하지만 브라우저 내장폰트가 기기마다 다르기때문에 이를 다 고려하여 디자인해야할것 (엄청 까다로울듯...)

## Nesting
* nesting을 많이 쓰는건 좋지 않다.
* selector가 복잡해져 브라우저가 해석하기 힘들어함 -> 성능이 안좋아짐
* Nesting은 BEM방식일때만 사용하도록 권장한다.
    * .main > ul > li > span 이런식의 nesting은 비추!

## Technique for coding Sass for BEM
```css
// BEM (Css)
.main {}
.main:hover {}
.main__profile-photo {}
.main__profile-photo--anonymous {}

// BEM in NESTING (Sass)
.main {
    &:hover { }
    &__profile-photo {
        &--anonymous { }
    }
}
```

## Mixins 믹스인
CSS를 위한 일종의 function. 호출하면 함수안에 입력해 두었던 코드를 자동으로 삽입한다

### - Examples
1. vendor prefixes  
다양한 브라우저 대응을 위한 prefix를 자동으로 붙여줄 수 있다.
2. MediaQuery  
기존의 미디어쿼리를 사용하기 위해선 화면크기별로 CSS코딩을 하였지만, 믹스인을 사용하면 컴포넌트별로 CSS코딩을 할 수 있다. 코드의 응집성이 높아짐. Good!
3. 사용법  
    * _mixin.scss 믹스인 선언: `@mixin 함수명(인자){...}`
    * blabla.css 믹스인 호출: `@include 함수명(인자){...}`
```scss
// 1. Prefixer
@mixin border-radius($radius) {
  -webkit-border-radius: $radius;
     -moz-border-radius: $radius;
      -ms-border-radius: $radius;
          border-radius: $radius;
}

// 2. Media-Query
@mixin breakpoint($point) {
  @if $point == desktop {
    @media (min-width: 70em) {
      @content; 
    }
  } @else if $point == mobile {
    @media (min-width: 37.5em) {
      @content;
    }
  }
}

// 3. CSS에서 믹스인 호출
.box {
  @include border-radius(10px);
  
  // 컴포넌트별 화면대응 가능
  @include breakpoint(desktop) {
    font-size: 16px;
  }
  @include breakpoint(mobile) {
    font-size: 12px;
  }
}
```

## Source map
Sass컴파일러가 자동으로 `index.css.map`을 만들어주지만, 디버깅시 컴파일된 css코드의 위치가 아닌 원본 Sass의 코드위치를 알려 줄 수 있음.
> Babel, Sass같이 트랜스파일러를 거치는 경우 필수적으로 소스맵을 사용하도록!!

*Extend / Inheritance 는 사용하지말도록 성능에 안좋음. Mixins 쓰세요!*



# Parcel
[Pacel 사이트](https://ko.parceljs.org/)

## 설치
`$ npm install -g parcel-bundler`

## 역할
파일작업 완료후 uglify등이 완료된 최종적으로 화면에 보여질 최종파일 생성  
`$ parcel build index.html --public-url ./`  
-> dist폴더안에 최종파일들을 생성

## netlify로 Parcel배포하기
1. github 업로드전, `.gitignore`파일 생성
    ```bash
    # .gitignore
    node_modules/
    dist/
    .cache/
    ```

2. package.json안에 netlify가 자동으로 설정해야할 파일목록을 넣어준다  
`$ npm install parcel-bundler`

3. package.json의 "scripts"(자주사용할 명령)을 추가해준다.
    ```js
    "scripts": {
        "test": "echo \"Error: no test specified\" && exit 1",
        "build": "parcel build index.html --public-url./"
    }
    ```
4. netlify에 github "hello-parcel"저장소를 연결해준다.
    * build command : `parcel build index.html --public-url./`
    * build command : `npm run build` (package.json의 "scripts"설정후)
    * publish directory : `dist`






