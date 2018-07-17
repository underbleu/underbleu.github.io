---
layout: post
title: HTML/CSS 웹카페예제 (신규이벤트, 인기사이트, IR)
category: html
permalink: /html/:title/

tags: [html5, markup, 마크업]
comments: true
---

## IR (Image Replacement)

1. overflow hidden으로 텍스트 감추기
네트워크 문제로 이미지를 전송받지 못한경우 아무 정보도 볼 수 없음(단점)

3. -9999em
Text-indent 속성은 사용하기 간편하지만 단점이 있습니다. 만약 사용자의 단말기에 따라 이미지가 제대로 로드되지 않을 때 스크린리더 사용자가 아니라 하더라도 이미지를 설명하는 텍스트를 보고 콘텐츠의 내용을 확인해야 하지만 할 수 없다는 것입니다. 또한, 웹페이지에 text-indent 스타일 속성이 적용된 요소가 많을 때 컴퓨터가 웹페이지 로드 시 위치값을 그만큼 많이 계산해 하므로 성능에 저하를 불러올 수 있습니다.


2. ::after 가상요소에 이미지를 넣어 텍스트를 덮어주기
공수가 많이 들어 현업에선 잘 사용하지 않지만, 좋은방법임

* Title 무엇이 문제인가?
Title 속성으로 스크린리더 사용자에게 추가 설명을 제공하는 것의 문제는 스크린리더 대부분이 폼 요소를 제외한 링크 등의 컨트롤에 적용된 title 속성을 무시한다는 것입니다. 아울러 title 속성은 국내 웹 접근성 지침과는 달리 WEBAIM은 폼 요소 등으로 제한하여 사용할 것을 권고하고 있습니다.

## Sprite Image
한 이미지에 여러 아이콘을 넣고 위치만 바꿔 사용하는 것
여러 아이콘 이미지를 각각 출력하여 사용하는 것 보다 성능이 훨씬 좋아짐
너무 큰 이미지는 오히려 성능안좋아지니 적절한 크기 제한을 둬야함.

## 신규 이벤트

1. 제목 마크업 -> 의미를 갖지않는 스타일링이닌깐 span사용 (강조해야할 시맨틱한 내용이면 em, strong)
2. 이벤트 #아이디로 마크업 -> 나중에 스크립트로 데이터 컨트롤하기 위해
3. div.btn-event > button*2 
버튼은 form태그를 사용해야하지 않은가? 서버로 데이터를 전송하는게 아니라 스크립트 제어의 목적이니 필요없음 
키보드 컨트롤이 필요하니 a, span이 아닌 button으로 마크업
submit 서버로 데이터전송 / reset 초기화 /  button 스크립트 연동하여 마크업 컨트롤할 때

* 이미지 대체텍스트  
책의 이름뿐만아니라 이벤트의 경품이라는 것이 중요한 내용이기 때문에 포함시키도록
최대한 간결하고 명확한 이미지가 필요하지만
정보량이 많은 이미지의 경우엔 세세하게 설명해주도록 한다. 
본문을 참조해야하는 경우는 title로
하지만 네이티브로 어려운경우 aria를 쓴다. aria-labelledby="#contentId"이렇게 하면 본문을 연결해줘 훨씬 명확하고 깔끔해짐

### 정교하게 레이아웃 작업하려면 block 요소가 좋다
inline과 inline-block은 아래에 살짝 디센드 여백이 생기기 때문에 정교하게 작업하기 힘듬

### Sprite Image

### 버튼이 span / button 일때
button을 크로스브라우징 이슈가 많아, 
현업에서는 button을 안쓰고 span a를쓰는데 스크립트에서 keycode를 받지못해
이것을 일일히 설정해주려면 더 고생이다
그래서  button의 문제를 우회해서 가면됨 float + cleafix
.btn-event button으로 하면 구체성 점수가 아래와 같아져서
아래가 안먹어 !important써줘야하게 되닌깐
.btn-event .btn-event-prev처럼 구체성 점수 같은 클래스 선택자 쓰도록한데 
or
속기법 background말고 (재정의 이닌깐)
기본 backgroundj-position으로 써주면 된다 (재정의가 아니라 없는 값을 새로 입력해주는 것이라 먹음)
속기법보다 길게 봤을때 수정하기 유리하다
속기법이 더쎈가? ㅇㅇ
[cursor:pointer](http://naradesign.net/wp/2016/09/07/2197/)

### 제이쿼리 
last를 밖에 써주면 또 다른곳에서 활용이 가능해짐 -> 차이점은 focusin에서만 쓸수있음 모듈화로 재활용하기 좀 안좋을듯

### focus outline디테일
outline이 테두리에 겹처서 안보이지 않게 안으로 살짝 들여줌
.related-list a:focus {
  outline-offset: 5px;
}

### 구체성점수를 고려한 선택자
/* .btn-event button 구체성 11점 */
/* .btn-event-prev, .btn-event-next 구체성 10점 */
포지션 100%로 하면 맨오른쪽으로 감

아 그러닌깐. 
속기법쓰면 강력해져서 기본문법이 덮어쓰질 못하닌깐 
장기적으로 봤을때 수정을 고려해서 기본문법 쓰도록하고
혹시 재정의를 해야하는 경우면
요소선택자를 하나 더 추가해서 구체성점수를 높여주면 된다는 소리임


-----
## 인기 사이트

* 상승/하락 아이콘_장식이 아닌 의미가 있기 때문에 마크업에 넣어주도록
`<em></em>` 강조의 의미를 가진 태그도 괜찮을듯. span도 괜찮고

* li 리스트아이템 모두 클래스를 지님

* btn-more 모듈화
클래스 마지막 -more로끝나는 클래스 선택자
[class$="more"]
~ 이것도잇음
클래스를 추가해서 모듈화하는 것 보다 훨씬 간략한 코드가 되는듯.

* h2에 #id를 주고 더보기 버튼에 aria-labelledby로 연결

### ol의 순서 불릿기호. 읽을 수 있으면서 보이지 않게 하기
display:none을 주면 순서의 의미를 읽어주지 못함(비추천 ol을 쓴 의미가 사라짐)
-> reset.css의 ol도 제거하고 사용하는게 시맨틱마크업에 더 좋다

1. overflow:hidden으로 배경밖의 영역을 안보이게 해줌
2. after가상요소로 덮어줌

### 가상요소로 예쁜 숫자 만들어주기


### 순서상자 한번에 
favorite-list li{
    counter-icrement: number;
}

.favorite-list li::before{
    content: counter(number, upper-roman);
}

## vertical-align: baseline(기본) bottom middle top
인라인요소만 가질 수 있는 속성

### rank 아이콘 오른쪽으로 정렬
IR이유좀 써주면 좋을듯

1. float:right -> X
인라인요소를 float하면 다음 컨텐츠 밑으로 떨어지지 않음 -? 해보셈
2. 포지션
p:a
right:0
1. transform
li p:r 블록의 성격으로 변하지 않아서 dis block또해줘야함. 기준점이 자기자신이 됨
em p:a 블록 레이어로 변경됨. 기준점이 나의 부모 p:r 가 됨
   top 50%
   transform:translateY(-50%)
>CSS애니메이션이 스크립트 애니메이션보다 10배정도 성능이 좋음

2. 음수마진

--------
## 슬로건
IR로 h2헤딩의 텍스트가 보이진 않지만, 커피를 한잔 먹는 웹이라는 의미를 담아 텍스트를 숨기기 보단 커피잔 이미지로 덮는다

### blockquote(블록) q(인라인)
cite 인용 출처정보
일본사이트의 특징 중 하나. 인용태그가 굉장히 많고 '저자의 허락을 구했습니다.'라는 텍스트도 숨겨놓음
법적인 문제가 있을 때 자신을 보호할 수 있는 수단도 됨
인터넷은 URL, 책은 ISBN으로 출처 명시

" 따옴표 - `<q>`의 agent style. :before 가상요소 안에 들어있음. 스타일 커스터마이징 가능
blockquote는 들여쓰기 agent style을 가짐
->quotes: "<<"">";이걸로 원하는 걸로 바꿔쓸수잇음

" 살짝 끌어내리기
내자리에서 살짝만 움직이면 되닌깐
pos:rela로 하면 좋음

header나 footer는 body, footer, article등 안에 넣어 사용할수 있다 -> 흠?

출처 footer에 넣어줘 -> 네이버에서 복붙했을때 출처 붙어있는경우

The <footer> element specifies a footer for a document or section.
A <footer> element should contain information about its containing element.
A footer typically contains the author of the document, copyright information, links to terms of use, contact information, etc.

 <header> 요소와 마찬가지로, 필요한 경우 페이지에서 여러 번 사용할 수 있다. 예를 들어, 블로그의 푸터뿐만 아니라 블로그 포스트 <article>의 푸터를 표시하기 위해 사용할 수 있다. 그러나 규격에 의하면 블로그 포스트 작성자의 정보는 <address> 요소를 사용해서 표시해야 한다.

### 커피잔
포지션
플로트 
그리드
플렉스

부모 absolute안에 absolute가 있어도 부모를 기준으로 잡는다
pos:static만 아니면 부모를 기준으로 잡는다. 꼭 relative를 찾아올라가지 않는다. 
