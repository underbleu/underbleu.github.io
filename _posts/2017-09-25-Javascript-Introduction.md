---
layout: post
title:  "Javascript_브라우저 동작 원리"
date:   2017-09-03 16:16:01 -0600
categories: TIL
---

## 1. 브라우저 동작 원리

웹페이지를 서버에 요청(request)하고 응답(respond)받아 브러우저에 표시하는 과정
![브라우저 동작원리](/img/browser-operating-principle.jpg "웹페이지를 서버에 요청(request)하고 응답(respond)받아 브러우저에 표시하는 과정")
1. 서버에서 html, css, javascript 파일을 응답받음
2. html, css는 파싱(parsing)되어 DOM, CSSOM트리로 변환
3. 이때 script태그를 만나면 html 파싱 일시중단 -> javascript 파싱 &실행
4. 중단 되었던 html, css 파싱 재게

** DOM이 완성되지 않은 상태에서 자바스크립트가 실행되면, 에러와 페이지 로딩지연이 생길 수 있음
-> 따라서 스크립트는 body요소 가장 끝에 위치하도록 권장 (DOM이 업로드되지않아 생길 문제 방지)

## 2 `<script>`의 async / defer 속성
* html5부터 스크립트 로딩지연으로 생기는 문제를 방지하기 위해 추가된 속성 (IE9 이하 버전 지원 X)
* 웹페이지 파싱과 외부 스크립트파일 다운로드를 동시에함
-> async : 스크립트 다운로드 직후 스크립트 파일 실행
-> defer: 웹페이지 파싱 완료 직후 스크립트 파일 실행 (DOM 로드 오류가 적음)

_______________
# 3 Javascript Syntax Basics

- 구문(Statement): 각각의 명령을 의미 (프로그램은 구문들의 집합이다)
- 코드블록(Code block): 함께 실행되어져야 하는 구문을 그룹화하는것
- 표현식 (Expression): 하나의 값을 만드는 문장
    ```javascript
    'Hello' + ' ' + 'Bong'    // Hello Bong
    8 * 10    // 80
    ```
- 변수(Variable): 값을 받아들이는 상자 (한번 쓰고 버리는 값이 아닐경우 변수에 담는다)
    - 참조: 값을 꺼내서 사용하는것 | 할당(저장): 값을 집어넣는 것
    - 자바스크립트에서는 변수의 값으로 문자열, 숫자, boolean 구분없이 모두 할당할 수 있다(= type이 없다)
    이는 프로그램이 커졌을 때 문제를 유발-> 타입스크립트 사용 (변수에 타입을 지정)
    - 자바스크립트가 로드될 때 var 선언된 만큼 메모리에 공간을 만드는데, 변수명은 이 공간을 가르키는 식별자(Identifier)이다.
- 값(Value): 변수에 저장되는 값 자체를 리터럴(literal)이라고 부름
    - 기본자료형(Primitive): string, number, boolean, undefined, null, symbol(ES6)
    - 객체형: object
- 주석(Comment): 코드의 의미를 설명하기 위해 사용
    - 잘 만들어진 코드는 좋은 주석을 가지고 있음 (길지도 짧지도 않은 가독성 좋은 설명)
    - 왜 쓰나?     

	1. 미래의 나를위해: 3개월 뒤면 내코드가 내코드가 아님 (기억이 안나기 때문)
	2. 남을 위해: 협업 혹은 훗날 코드를 볼 다른사람이 잘 이해되도록 (읽기 좋은 코드가 좋은 코드)

    - 주석은 해석기(parser)가 무시하며 실행되지 않음
    -  // : 한줄 주석  /* */ : 여러줄 주석


__________

# ESlint 설치

- linting한다? 옷에 보푸래기 떼는것을 린트 한다고함. 즉 코드의 오류제거를 서포트해주는 것
- Javascript Linter: 특정 스타일 가이드를 따르지 않거나 문제가 있는 패턴이나 코드를 찾아줌
- [ESlint 설치](http://poiemaweb.com/eslint)


# 더 공부해 볼 것

- [ ] Sass, 부트스트랩 공부 계획  
- [X] 생활코딩과 poiemaweb 이전에 공부했던 것 다시보기   
[X] Hw_ [1,2,3복습 4,5,6예습](http://poiemaweb.com/)  
[ ] 브라우저 전쟁, ECMA  
[ ] 유효범위(scope)와 코드블록(code block)  
[X] 컴파일러와 인터프리터, 컴파일과 파싱의미 명확히 공부   [컴파일러와 인터프리터](#)  


# 유용한 사이트

- [브라우저별 ES6 지원 현황](https://kangax.github.io/compat-table/es6/)
- 앞으로 프론트엔드개발자가 되기 위해 배워야할 것:   [web developer road-map](https://github.com/kamranahmedse/developer-roadmap)
- [ESlint 설치](http://poiemaweb.com/eslint)
