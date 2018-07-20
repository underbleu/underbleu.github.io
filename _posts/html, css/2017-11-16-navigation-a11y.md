---
layout: post
title: 웹카페 - 네비게이션영역, a11y
category: HTML,CSS
permalink: /HTML,CSS/:title/

tags: [html5, markup, 마크업]
comments: true
---
# 11/16

>마크업 순서
.header > .member + .navigation
.navigation > .main-menu > .sub-menu

## 1. 멤버링크 `.member`
### 1.1 마지막 요소의 여백 격차 줄이는 방법 4가지
1. **last-child의 padding-right:0 으로 설정**  
`.member>li:last-child a {padding-right: 0;}`  
-> 선택자를 한번 더 써서 코드늘어남. 좋지않음
2. **position: static -> relative (CSS2 방식)**  
`.member{position: relative; right: -10px;}`
-> absolute와 달리 relative는 자신의 영역을 그대로 유지한채로 이동하기 때문에
주변 레이아웃에 영향을 주지 않음. 요소를 살짝 옮길 때 유용함  
3. **CSS애니메이션의 transform (CSS3 방식) -> 성능 Best!**  
`transform: translateX(10px)` (IE11+)

> * 어떤 요소의 배치를 살짝 바꾸었을 때 다른요소들도 그것에 맞춰 다 설정해줘야하는데, Sass를 사용하면 변수에 CSS코드를 담아 모듈화하여 사용할 수 있어 편하다(해외는 Sass쓰는 추세)
> * 접근하는 디바이스를 확인하여 대응방법을 다르게 해줄 수 있음. 
Daum은 transform방법을 윈도우에서 시험해보는중. 맥에서 클래스 .macOs로 먹여서 다른방법씀(확인해보도록)

### 1.2 구체성점수 이슈에 따른 코드위치
```css
a:link, a:visited {
  color: inherit;
  text-decoration: none;
}
a:hover, a:focus {
  color: #f00;
}
```
**왜 `a:link`가 앞에 선언되야하나?**  
`a:link`와 `a:hover`구체성 점수(11점)가 같아 뒤에 위치한 코드가 우선순위를 가짐. hover와 focus가 뒤에 위치해야 폰트컬러가 바뀔 수 있다.

### 1.3 접근성을 고려한 a:focus의 outline설계 

```css
.member li {
  padding: 10px 0;
}
.member li > a {
  padding: 8px 10px;
}

```

일반적으로 링크요소엔 접근성을 위해 padding을 줘서 클릭할 수 있는 영역을 넓혀준다.  
>**Q. 부모와 자식의 padding여백을 상이하게 준 이유?**   
키보드로 요소에 접근시 생기는 outline은 박스의 보더 밖에 생기는데, 멤버링크는 화면의 최상단에 위치해 있어 focus받았을 때 생기는 outline이 잘려보여 2px정도 여유를 준것임

* `outline:none`으로 아웃라인을 삭제하는 경우가 있음 -> 키보드 사용자에게 접근성 좋지 않음 (에릭마이어의 reset.css에도 이것이 포함되어있어서 빼고 사용함)
* focus받았을때 글자색이 바뀌는등의 스타일링으로 포커스 인지 가능하다면 outline삭제해도 괜찮다
* 브라우저별로 outline의 agent style이 다른게 마음에 들지 않는다면 직접설계해주도록 한다
outline: 2px dotted red; 
outline-offset: -5px;
-----

## 2. 메인메뉴 `.main-menu`

### 2.1 숨김 콘텐츠 처리방법 `.readable-hidden`
1. **`display: none;` -> 접근성에 좋지않음**  
요소를 존재하지 않게 만들어 영역이 없어짐. 기계적으로 접근하여 읽을 수 없음 (절대 디자인만 연출하기 위한 방법 쓰지 말도록) 고정되있는 기능이 아니라 커서접근하는 순간 나타나는 기능이면 써도됨.
2. **`visibility: hidden`**  
영역은 남아있는 상태에서 컨텐츠만 보이지 않게 해줌. 하지만 영역도 없애야하기때문에 쓰지않음
3. **absolute로 띄워서 화면밖으로 날려버리기**  
스크린리더에서 읽어주다가 focus가 화면 밖으로 나가버리는 문제가 있음 (W3C사이트는 아직 이렇게 사용하는중)
`position: absolute; left: -9999em;`
4. **음수마진 활용한 방법 -> 권장!**
    1. `position:absolute`로 레이어를 띄운다 -> 차지하는 영역제거
    2. 크기를 1px로 만들어줌 (크기가 0이면 커서가 포커스를 못함)
    3. `overflow:hidden`으로 넘치는 컨텐츠 안보이게 해줌
    4. 음수마진으로 -1px보이는 영역을 제거해줌
    5. `clip: rect(<top>, <right>, <bottom>, <left>)` clip 이미지 크롭하는 기능 (웹표준에서 제거됨) [MDN clip](https://developer.mozilla.org/en-US/docs/Web/CSS/clip)

    ```css
    .readable-hidden {
      position: absolute;
      width: 1px;
      height: 1px;
      overflow: hidden;
      margin: -1px;
      clip: rect(0 0 0 0);
    }
    ```
-----
### 2.2 건너뛰기링크 `.a11y` 
키보드 사용자가 핵심영역으로 바로 갈 수 있도록 해주는 기능. 본문전의 수많은 메뉴를 거쳐가려면 너무 불편해서 이를 우회할 수 있는 방법이다. 원페이지 웹에서 사용하는 방법이기도 하다
> *접근성을 고려하여 모든 웹사이트에 필수!* -> WCAG의 웹접근 [운용의 용이성](http://www.wah.or.kr/Participation/technique.asp?tab=2)

#### * 마크업
```html
<!-- 본문의 id컨텐츠로 바로이동 -->
<a href="#content" class="a11y">본문 바로가기</a>
<main id="content" class="main-content clearfix">
```

#### * CSS
```css
a.a11y {
  position: absolute;
  z-index: 10;
  top: 5px;
  left: 50%;
  transform: translateX(-50%);
  width: auto;
  height: auto;
  padding: 5px 10px;
  /* 크로스 브라우징을 고려한 안전장치
  margin: 0;
  clip: rect(auto, auto, auto, auto) */
}
```
#### 1. z-index
레이어가 마크업 순서대로 차곡차곡 쌓이게 때문에, 위로 올려주려면 `z-index`를 준다.  
(positioned elements에만 적용가능. `position:static`엔 쓸수없다 ->
[MDN. z-index](https://developer.mozilla.org/ko/docs/Web/CSS/z-index))

#### 2. 구체성이슈 
>**`.a11y`선택자에 폰트color가 안먹는 이유?**  
상단의 링크스타일에 `a:link`(11점)의 구체성 점수가 `.a11y`(10점)보다 높아서 color를 적용해도 덮어쓰여짐 -> 선택자의 구체성 점수를 높여주도록!

* `.a11y`(10점) -> `a.a11y`(11점) -> `.a11y:focus`(20점)으로 구체성 높아지므로 앞의 요소선택자 a는 없애도 됨
* `!important`(1000점) 남발하면 안됨 나중에 유지보수가 어려워짐. 동작원리를 정확히 알고 사용하도록 한다.
* `!important`는 동적인 클래스에서 사용한다.  
ex) jquery로 상위메뉴를 hover하면 하위메뉴에.menu-act클래스를 동적으로 추가해줘서 나타남
  ```css
  /* display:none -> block */
  .menu-act { display: block !important; }
  ```

#### 3. 가운데로 배치하기
`left: 50%`로 화면의 가운데로 옮기고, `transform: translateX(-50%)`으로 자신의 크기 절반만큼 back시키면 정가운데 위치!

-----
### 2.3 Gradient

```css
.main-menu {
  background: #e27a2f linear-gradient(to bottom, #e04f2f 0%, #e27a2f 50%, #e04f2f 100%);
  background-color: #e27a2f;
```
* background-color는 그라디언트기능을 지원않는 구형브라우저를 위한 안전장치 (IE10+)  
* 브라우저 대응 prefix가 붙은 gradient코드 생성기 -> [gradient generetor](http://www.colorzilla.com/gradient-editor/)
* normalize.css의 기본 prefix로 부족한 css prefix를자동으로 붙여주는 스크립트 -> [-prefix-free](https://leaverou.github.io/prefixfree/)

### 2.4 마크업 tabindex 속성  
nav는 키보드 포커스 못받아서 `"tabindex=0"`속성을 추가해줘야 한다.
>**li에 tabindex주는이유? "코드와 경로를 간략하게 해주기위해"**  
span에주면 다시 부모를 찾아가고 찾아가서 자식 서브메뉴찾아서 보이게 해줘야하므로
경로가 복잡해지짐

#### # 키보드 접근tabindex   
* 전역속성(global attribute)으로 어떤 태그에도 쓸 수 있다.
* `<a> <input> <button> <area> <textarea> <object> <select>` 태그는 기본적으로 키보드접근이 가능하다. 이외의 태그들은 키보드 tabindex속성을 추가해줘야한다.
>* **-1 (음수값)** : 키보드로 접근 불가능
>* **0** : 키보드로 접근 가능
>* **1~32767 (양수값)** : 탭 인덱스 값이 낮은 것부터 차례대로 키보드 접근가능  
예시) tabindex 0 1 3 5가 있다면 접근 순서는 1 -> 3 -> 5 -> 0


hover효과 줄 선택자 설정을 유의하자! `span:hover`가 아님!

### 2.5 메뉴 hover할 때 밑줄그려주기
```css
/* :hover와 :focus 선택자 유의 */
.main-menu>li:hover span::after, .main-menu>li:focus span::after {
  content: "";
  display: block;
  border-top: 2px solid #000;
}
```
-> li에 속해있는 하위메뉴에 마우스를 올려도 밑줄을 유지시켜줘야함. `span:hover`주면 안됨!
* 가상요소에 content를 설정안해주면 상자가 생기지 않아서 빈 값이라도 넣어주어야함.   
* 가상요소는 inline이기 때문에 content가 비어있으면 보이지도 않고 가로정렬되기 때문에 block으로 만들어준다.  
* 키보드로 접근했을 때 디자인적 변화가 생겨 어디에 있는지 인지 가능하므로, outline없애줘도 됨

-----
## 3. 서브메뉴 `.sub-menu`

### 3.1 `white-space`속성과 인라인요소 배치
```css
.main-menu>li {
  position: relative;
}
.sub-menu {
  position: absolute;
  white-space: nowrap;
}
.sub-menu li, .sub-menu a {
  display: inline-block;
}
```
1. sub-menu의 목록들을 인라인으로 만들어 가로정렬 해준다  
-> relative - absolute관계인 메인메뉴 li의 width값을 상속 받아 크기가 넘치는 목록들은 자동으로 줄바꿈되어 아래 배치된다
2. `white-space: nowrap`으로 줄바꿈을 방지해 목록들이 가로 배치되게 해준다  
>**tab, enter, space의 공백문자 처리** -> [참고글](http://aboooks.tistory.com/187)  
" white-space: normal | pre | nowrap | pre-wrap | pre-line "

### 3.2 폰트가 상속하는 7가지 속성
>* font-style | font-size | font-weight | font-family | line-height  
font-variant(소문자 -> 미니대문자) | font-stretch(글자 좁게/넓게)

reset.css에 `font:inherit`이 있음. 하위메뉴에 라인하잇 상속받지 않으려면  `.main-menu>li`가 아닌 `.main-menu span`에 line-height 줘야함


### 3.3 웹폰트 _가상요소에 불릿기호 넣어주기  
* [fontello](http://fontello.com/)에서 원하는 아이콘 zip으로 다운
* font파일을 css/font폴더로 복사
* fonts.css에 fontello.css의 최상단 코드 복붙 > 경로값 수정
* fotello.css 하단의 글자와 맵핑 되있는 특수문자를 넣어준다 `content: '\e800';`

----
## 유용한 것

* MDN팁) 한국 번역본이 없으면, 일어번역본을 불러서 그걸 구글번역해서 보도록. 영문보다 어순이 비슷해서 번역이 더 매끄러움
* [제이쿼리 다운로드](https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.js)
* 책추천) 디자이너가 묻고 개발자가 답하는 웹 이야기

