---
layout: post
title: HTML5 마크업기초 (아웃라인 알고리즘)
category: html
permalink: /html/:title/

tags: [html5, markup, 마크업]
comments: true
---

## **HTML5 Markup**
>
### HTML의 탄생
>김데레사 강사님 수업과 생활코딩을 듣고 정리한 강의노트입니다 -> [html5 강의자료](https://github.com/seulbinim/FC-FDS/blob/master/PDF/HTML5.pdf){:target="_blank"}

* 1999년 XHTML
* 과거의 html은 간단한 마크업언어였음
* HTML 3.0버전이 가장 망작. 데코레이션 기능이 추가되면서 마크업언어의 위상이 떨어짐
* 그래서 W3C가 XML을 기반으로한 XHTML을 만들음.
    * 명령어는 소문자로만 _ 대/소문자 둘다가능한 문법이 느슨한 것은 개발적관점에서 좋지않음
    * 더블사이드 명령어 `<p>` `</p>` 짝꿍
* W3C가 XHTML2.0 실패인정하고, WHATWG(5대브라우저가 설립한 그룹)의 표준안을 반영하여 HTML5 탄생
(밴더들의 요구사항이 너무 많이 반영되어 기준으로서의 잣대역할이 흔들리는듯함)


### 아웃라인 알고리즘 (Outline Algorithm)
HTML5에서 정보 구조를 명확히 하기위한 개념 도입 (책의 목차와 비슷) -> [참고](https://docs.google.com/presentation/d/1Z_L7Jm1bTd9MmiVHWnX90HwyyP9xaDQ1g0w4_yM5sQo/mobilepresent?slide=id.g207806c5f7_0_228){:target="_blank"}
* **섹셔닝 루트(Sectioning Root)**  
독립적인 콘텐츠로 분리되어 아웃라인에 영향을 주지는 않지만, 보이지 않는 자기만의 제목이 있다. 독립체지만 구조중 하나에 포함될 수 있도록 해줘야 좋은 아웃라인이 됨
`<blockquote>, <body>, <detail>, <fieldset>, <figure>, <td>`
* **섹셔닝 콘텐츠 (Sectioning Content)**  
대부분 HTML5에 새로 추가된 요소, 반드시 헤딩 `<h1>`을 포함해야함
`<section>, <article>, <nav>, <aside>`
* **헤딩 콘텐츠(Heading Content)**  
문서의 아웃라인을 고려하여 사용해야함  
`<h1>, <h2>, <h3>...`

### HTML5의 API (Application Programming Interface)
HTML5에서는 Js기술을 좀 더 편리하게 이용할 수 있도록 다양한 API를 지원

* 어플리케이션 캐쉬: 구글맵으로 네비게이션 시뮬레이션하면 어플리케이션 캐쉬에 저장. 오프라인에도 작동됨
* 기울기 감지: 포트레잇, 랜드스케이프 ver

### 마크업순서
1. 논리적인 구조설계  
디자인순서와 논리적자료의 순서는 다르다!  

헤더 > 네비게이션 | `<header>``<nav>`  
비주얼컨텐츠 | `<div>`          
메인, 사이드바 | `<main>` :딱 한번만 사용가능  
슬로건 | `<section>``<article>` 독립컨텐츠  
푸터 주소, 저작권 | `<footer>`

2. 시맨틱 마크업
* 사람뿐만아니라 기계도 이해할 수 있는 구조설계
* `<div>`로만 이루어져있는 경우에 role="banner"로 역할지정
* ARIA


### 네이밍방법

* Camel케이스
mainContent
* 언더바 케이스
main_content
* 케밥case
main-content

