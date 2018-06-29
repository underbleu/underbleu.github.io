---
layout: post
title: HTML/CSS 웹카페예제 (비주얼, 로그인영역)
category: html
permalink: /html/:title/

tags: [html5, markup, 마크업]
comments: true
---

## 비주얼 영역
코드삽입

### Background 속성
레이어 쌓이는 순서를 고려한 배경넣기 -> `.container`에 flower이미지보다 그라디언트를 나중에 선언
* Markup에선 나중에 선언한게 위로 쌓임
* Css background는 먼저 선언한게 위로 쌓임


`background: #00ff00 url("hello.gif") no-repeat fixed center; `
background-image: none | url() | linear-gradient()
background-position: X축 Y축
background-size: auto auto | cover(높이에 맞춰 확대) | contain(폭에 맞춰 확대)
background-repeat: repeat | space(간격있음                                                                                                                                                                                                                                                       ) | round | no-repeat
background-attachment: scroll | fixed | local

* background-attachment
scroll(기본) fixed

### 꽃 이미지 넣기
현업에선 배경이미지를 마크업에 넣는 경우도 있지만, 꽃은 장식일뿐 의미를 가지고 있지 않기 때문에 css background로 처리한다

background: #000 url(images/bg.gif) no-repeat left top;
font: italic bold .8em/1.2 Arial, sans-serif;

/* @keyframes duration | timing-function | delay |
iteration-count | direction | fill-mode | play-state | name */
animation: 3s ease-in 1s 2 reverse both paused slidein;
<single-animation-play-state> = running | paused
<single-animation-fill-mode> = none | forwards | backwards | both
ease | ease-in | ease-out | ease-in-out | cubic-bezier(<number>, <number>, <number>, <number>)
-----
#### 특수문자
[특수문자 Entity Name](https://www.w3schools.com/html/html_entities.asp)
`&lt;` <
`&gt;` >
`&amp;` &
`&nbsp;` 공백문자
공백|non-breaking space|`&nbsp;`
---|---|---
<|less than|`&lt;`
>|greater than|`&gt;`
&|ampersand|`&amp;`
"|double quotation mark|`&quot;`
'|single quotation mark (apostrophe)|`&apos;`

-----
## CSS Animation

---
## CSS Animation

### [transition-timing-function 예시](http://www.the-art-of-web.com/css/timing-function/)

에펙처럼 애니메이션 속도를 그래프로 생성해 볼 수 있음 [cubic-bezier](http://cubic-bezier.com/#.17,.67,.83,.67)


비주얼 애니메이션 [네이버 주니어개발자 발표자료](https://www.slideshare.net/wsconf/css-animation-wsconfseoul2017-vol2?qid=03751171-30ff-4317-a7d9-31f45a110931&v=&b=&from_search=2)
레이아웃 배치에 주는 속성중 margin 제거한 사례


>1. 이동 -> `translate(X, Y)`
>2. 글자크기 -> `font-size`
>3. 투명도 -> rgba()

### 1. 텍스트 애니메이션  .text-ani

코드

1. translte방법과 -> 성능이 더 좋음!
2. absolute top left방법 두개잇음
계속 이미지를 다시그림repainting. 성능 안좋음. 특히 모바일환경에선 쓰지말도록(모바일은 IE안쓰닌깐)
-> [게코 렌더링](https://www.youtube.com/watch?v=ZTnIxIA5KGw)
[이거이쁨](https://codepen.io/sergiompereira/pen/dqvwJ?q=text+shadow+animation&limit=all&type=type-pens)

상자가 통채로 옆으로 가서 스크롤바 생기는 이슈
1. 박스width설정 - 콘텐츠양에 따라 유동적이지 않음
2. display: inline-block;
3. absolute로 레이로 띄워짐
4. float: left띄워짐 뜨면 박스크기가 컨텐츠크기만해짐
>항상 환경에 따라 다양한 방법중 어떤것을 쓸지 생각하는 습관을 가지도록

animation-iteration-count: 3;

[스프라이트 이미지 예시](https://codepen.io/simurai/pen/tukwj)
svg로 만들면 좋을듯

와.... 코드로 그린 그림 [css 심슨](https://pattle.github.io/simpsons-in-css/)

------
# 로그인 영역 Form
1. 컨텐츠를 보며 마크업순서 적어보기
2. h1웹카페의 > h2로그인영역 이런 논리적 구조로 태그정해주기
3. 클래스 네이밍하기

>form > fieldset > legend + label
legend와 관련된 요소들을 fieldset이라는 컨테이너에 담는다.
div와 같이 그루핑하는 역할이라는 공통점이 있지만, fieldset을 form전용 컨테이너이다
div는 범용적 fieldset은 폼전용 컨테이너

* label과 input의 관계
명시적으로 두개가 짝꿍이라고 말해줄 수 있음. label을 클릭하면 입력상자로 이동하는등 접근성이 좋아짐(이런 눈에보이지 않는게 코드레벨을 결정한다)


* input값이 들어왔는지 가볍게 확인하기(실제론 쓰면안되는 안좋은 방식임)
`<form action="javascript:alert('값이 들어왔다')" class="login-form">` action에 원래 정보를 받을 서버를 넣어줘야하는데 임시적으로 자바스크립트 콘솔로 보기위함


CSS유지보수 편한 방법론 BEM. 넷플릭스는 이방법 채용중 [css BEM](http://wit.nts-corp.com/2015/04/16/3538)

------
# Responsive web설계
큰 컨테이너 태그설계 -> id, class등 네이밍 -> 각 컨테이너 세부설계
* article rss피드로 배포해볼만 한것. (뉴스, 트위터등 누구에게 배포하는)
* section
* div < h1 중립적인 Grouping + 헤딩을 포함하여 아웃라인 형성
* address주소 div저작권

>1px의 오차가 중요하지 않은 것은 아니다. 하지만 시간을 많이 할애할만큼 진짜 critic한 이슈인지 고민해봐야한다. 브라우저 렌더링마다 이슈가 굉장히! 다양하기 때문이다.

## Media Query
참고글 [css 미디어쿼리의 이해](http://naradesign.net/wp/2012/05/30/1823/)

* Mobile First

반응형은 큰기업엔 좋지않음 one-source-multi-use가 힘듬
모바일 데스크탑 정보량이 많이 차이나지 않을경우
네이버도 반응형 아니다. 웹용. 앱용 url자체가 다름

* 디바이스의 물리적 크기로 브라우저가 화면을 렌더링하도록 설정
`<meta name="viewport" content="width=device-width">`
-> meta태그 좀더 공부해보기
max scale min scale 확대/축소 몇배이상.

* 접근성을 위한 "배경과 전경색의 대비" 가이드라인
4.5:1 일반 / 3:1 (모바일 확대/축소 가능한 경우)

------
## 유용한것

BEM규칙으로 웹카페 다시만들어보기


-> 주말에 mediaQuery사용해보기
>"이론에 바탕하지 않은 현실은 발전이 없다"

>숙제 미디어쿼리 이용하여 사이트 배치해보기 -> [사이트](https://seulbinim.github.io/)
1. flex로
2. position으로
하고 선생님께 슬랙으로 깃허브계정 보내기


----

## 메인메뉴와 하위메뉴 토글
## jQuery
>제이쿼리보다 바닐라js 프로토타입으로 사용하는 추세임
* body끝에 있던 스트립트 파일을 head마지막으로 옮김
-> 스크립트가 body 컨텐츠 이전에 생성되면 아직 html이 다 parsing되어있지 않아 오류가 생길 수 도 있다
-> 제이쿼리 문서준비 event를 사용하여 문제 해결 `$(document).ready(function(){});`
선택자 방식이 css와 90% 같아서 편하고 익숙하다
* toggleClass 넣었다 뺏다. 여기선 Class란 명시를 했기 때문에 .을 찍지 않아도된다.
* 하위메뉴 들어갔을때 상위메뉴 컬러 그대로 유지되게 선택자 변경
* on()바인딩 하나의 태그에 두가지 이벤트를 줄때 바인딩

### shiftTab이슈해결 코드 실습해보기
```javascript
$('.main-menu > li').hover(function() {
    // 6개 li중 지금 마우스가 올라가있는 li를 선택해라
    $(this).find('.sub-menu').toggleClass('menu-act');
  });
```
hover보다 focus가 까다로운것을 체크해서. focus로 라인이랑 컬러 유지되는 스크립트 고안 -> 해보셈
