---
layout: post
title: 웹카페 - 검색, 게시판영역
category: HTML,CSS
permalink: /HTML,CSS/:title/

tags: [html5, markup, 마크업]
comments: true
---

### 검색영역

### Form
다양한 폼영역 예시 있음 ->  [Web Forms 2.0 demo](https://www.miketaylr.com/pres/html5/forms2.html)

* 입력상자는 1대1로 대응하는 레이블이 필요함
* 입력상자가 2개 이상 있으면 div로 묶어도 된다. 한개만 있을 경우 굳이 묶을 필요없음
* word-break: break-all;

* 정규표현식으로 입력 받을 값의 조건을 걸어줄 수 있음(pattern="[0-9]{10}")
* autofocus 신중하게 생각하고 사용하도록. 포커스 순서가 틀어질수 있음(검색포털은 주요기능이 검색이기 때문에 사용하기 적절함)
* 추천검색, 연관검색어
제안해주는것
* type = tel하면 숫자패드가 올라옴
* 캘린더 UI 레퍼런스 페이지로 활용하기 좋음. 대한항공 홈페이지 시각장애인 단체에 소송사건이 있어 aria 접근성이 굉장히 좋아짐 -> [대한항공 홈페이지](https://kr.koreanair.com/korea/ko.html)
* textarea 여러줄 글상자
* 브라우저별 사용할 수 있는 form태그. [“Forms 2.0” Tests](https://bestvpn.org/whats-my-ip/)
* html5 태그별 레퍼런스 [html 서적](http://html5ref.clearboth.org/)

-->실습
* 아이콘을 많이 사용한다면 아예 이걸 모듈할 클라스로 만들면 좋음 자주쓰는 패턴들
* border같은거를 변수처리해서 CSS4 나 사스 레스에서 사용 가능해질 예정. [Sass 홈페이지](http://sass-lang.com/)

* flex가 아닌 인풋크기를 늘리는 이유?
예측과 다른 결과를 보여줌. 크롬에선 안되고 파폭에선됨. webkit엔진에서 form의 fieldset에 flex를 주면 오류가생김 -> div로 감싸주고 적용하면 되긴함

------
## 공지사항

목록 탭데이터
* 탭UI가 적을 경우
각 리스트에 탭은 헤딩으로 준다

* 탭UI가 많을 경우
탭을 헤딩이 아닌 탭list로 따로 마크업해주고 역할을 지정해준다 (role="tab" tabindex="0") 
태그별 ARIA 적용 예제와 가이드라인이 -> [ARIA 깃허브](https://github.com/underbleu/ARIA)

-----

### a와 button은 서로 다른 목적이다
a를 button처럼 쓰려면 키보트 컨트롤을 할 수 있게 스크립트를 따로짜줘야한다던제 고려해야할 게 더많음

### # 링크텍스트
WCAG가이드_`<a>`링크에 적절한 링크텍스트 사용하도록 권고
우선적으론 title 네이티브 속성을 활용한다. title을 사용하기 힘들거나 문서내에 중복정보가 있는경우, arialabel을 활용하도록한다.

* `<a title="공지사항">`
네이티브의 단점 -> 이미 위에 중복된 제목이 존재하기 때문에 + 제목수정시 연동이 어려움
* id="공지사항" / arialabelledby="공지사항" 으로 연결. (문장형은 descrbedby 사용)
헤딩을 수정할경우 더보기의 링크텍스트까지 함께 바뀌어 용이함

-> 프레임워크에서 ARIA적용사례
-> 12월중에 아리아 세미나 있을 예정 [공지_접근성연구소](http://www.wah.or.kr/)

title aria-label 중복으로 주지 말도록. 문제없을 시 네이티브를 우선적으로 사용해라

-----
board영역 CSS

* 합리적이지 않은방법
다 display:none하고 
h2만 float처리하고 목록은 absolute로 띄워준다
이때 부모가 높이를 잃으닌깐, .board height값을 정해주도록한다 
-> 이렇게 하면 리스트 추가되었을때 부모 값을 재정의해줘야한다.
>레이어를 띄우는 것은 유연한 디자인에 쓰이지 않는다. 고정적인 디자인에만 사용하도록.
* 좀더 합리적인 방법

### # 구체성점수를 심플하게 하는 선택자 선택
`.notice-list, .pds-list, .notice-more, .pds-more`나
`.board ul, .board > div > a`같은것을 가르키나, 구체성 점수가 높아져 복잡해지므로 클래스선택자를 사용한것(심플)

### 클래스 선택자 권장
`.board-act .notice-heading, .board-act .pds-heading`
`.board-act h2`
같은 것이지만 요소선택자는 변경될 수 있는 가능성이 있어 되도록 클래스선택자를 사용하도록 한다. 

### 리스트의 여백
패딩이 조금더 좋은선택일듯. 
위의 마진과 병합될 수있기때문에

포지션 주는순간 레이어로 뜨고 크기가 안의 콘텐츠양의 크기에 맞게 줄어든다

### list-style
안쪽여백 들여줘서 불릿기호가 상자안에 들어오게 해준다

overflow:hidden을 쓰면 불릿기호가 약간 아래로 떨어져 레이아웃 틀어짐
디센더가 추가된대
이게 불릿 네이티브기호를 안쓰는 이유이다. 네이티브는 위치조정같은거 못하기 때문이다

### text-overflow 3개 세트 (IE8+)
```css
white-space: nowrap;
overflow: hidden;
text-overflow: ellipsis;
```
문단은 muli 시도되는중 webkit이라서 파폭에선안됨
```css
-webkit-line-clamp: 3; //높이분석후 줄 계산에서 입력됨
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
```

