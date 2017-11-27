---
layout: post
title: HTML,CSS웹카페예제 (슬로건, 푸터)
category: html
permalink: /html/:title/

tags: [html5, markup, 마크업]
comments: true
---
# 슬로건 영역

## **마크업**

1. h2.slogan-heading
h2헤딩의 텍스트를 숨기기 보단, 웹카페 슬로건이라는 의미를 둔채로 커피잔 이미지로 덮는다(IR)
2. p.slogan-content > q + footer.readable-hidden
    * 인용문인 웹카페의 슬로건을 `<q>`태그로 마크업
    * 슬로건의 출처 정보를 담기위해 `<footer>`태그로 마크업

### # 인용문 태그 `<blockqute>, <q>`
* blockquote(블록) 긴 인용문 사용시 넣는 태그
    * 첫문장 들여쓰기 (agent style)
* q(인라인) 짧은 인용문 사용시 넣는 태그
    * " " 따옴표 붙여서 출력한다 (agent style) 
    * ::before 가상요소 안에 들어있기 때문에 스타일 커스터마이징 가능
    * quotes: "<< ">>"; 속성로 따옴표말고 다른 quotation마크 지정 가능
    * p:relative로 위치조정 (그자리에서 살짝 이동시 유용)
* cite="" 속성으로 명확한 출처를 넣어줄 수 있다
    * 인터넷은 URL, 책은 ISBN으로 출처 명시
* 일본사이트의 특징 중 하나. 인용태그가 굉장히 많고 '저자의 허락을 구했습니다.'라는 텍스트도 숨겨놓음
* 법적인 문제가 있을 때 자신을 보호할 수 있는 수단이 될 수 있다

### # footer 태그
* document나 section, article에 포함된 콘텐츠의 연락처, 저작권, 출처등을 담기위해 사용한다.
    * ex1. 블로그의 푸터뿐만 아니라 블로그 포스트 `<article>`의 푸터를 표시하기 위해 사용할 수 있다.
    * ex2. 네이버에서 복사한 글에 출처 붙어있는 경우
* `<header>` 요소와 마찬가지로, 필요한 경우 페이지에서 여러 번 사용할 수 있다. 


## **CSS**
1. 커피잔 이미지 IR
* .slogan-heading::after 가상요소에 커피잔 이미지를 넣어 텍스트를 덮는다.
* pos:absolute로 .slogan-heading을 기준으로 잡는다  
부모가 pos:static만 아니면 포지션 부모를 기준으로 잡는다. 꼭 relative를 찾아올라가지 않는다. 

-----

# 푸터영역

## **마크업**
* 헤딩태그 생략 가능
푸터영역은 일반적인 컨텐츠 블럭이 아니라 페이지를 마무리하는 영역이기 때문에 헤딩레벨을 주지 않아도 된다.

1. 로고삽입 div.footer-logo > a > img  
반응형이미지로 할 경우 래핑이 필요함. div > a > img
alt텍스트에 Web Cafe 단어로 분리해서 입력해줘야 음성브라우저가 제대로 읽을 수 있음
2. 텍스트링크 ul.guide > li > a
3. 주소 address > span*3  
    * `<address>` 태그: 푸터에서만 연락정보 담기위해 사용한다. footer에서만 쓸수있다.
    * 블록요소이고, agent-style 이탤릭체이다
    * 본문에선 주소여도 `<p></p>`안에 담도록
4. 카피라이트 p.copyright
5. 기술뱃지 div.tech-logo > img*2  
    * 우리 무슨기술 썼어요 자랑하기 위한 의미있는 장식  
    * title=" 최신기술을 사용한 홈페이지 입니다"

## **CSS**
누가 normal플로우여서 위치를 바꾸지 않아도 되는가를 먼저 고민
1. footer 컨텐츠가 담길그릇 여백을준다
2. footer p:r / logo & tech-logo p:a로 배치 
나머지는 normal플로우이다 !
3. .guide > li
    * 가로배치 4가지 방법(flex / float: 부모높이잃음 overflow나 clearfix / grid / inline-block)
    * 안쪽여백 2px. 포커스 outline 겹치지 않는 디테일
4. address > span 여백 (flex / 두개span만 오른쪽 여백)
5. copyright margin-top

### # repeating linear gradient
렌더링엔진이 잘 작동안되는게 있어서 크라스브라우징 이슈가 좀 남아있음. 모바일에선 성능이 좀 떨어지는 편.
