---
layout: post
title: 자바스크립트 드래그앤드롭 만들기
category: Javascript
permalink: /Javascript/:title/

tags: [자바스크립트]
comments: true
---

> [드래그&드롭 Github 코드](https://github.com/underbleu/fds-event/blob/master/drag-drop.html)

![drag&drop]({{site.baseurl}}/img/drag-drop.jpg)

* originTop, originLeft : box의 처음위치
* originX, originY : box를 클릭한 곳의 처음위치
* diffX, diffY : box를 이동시키며 변경된 위치값
* resultX, resultY : box가 최종적으로 위치해야하는 top, left 값
* ①. ② : box가 틀을 벗어나지 않기위한 최소/최대위치

## 1. MouseEvent 등록할 객체 선정
1. mousedown -> box
  * 클릭하여 움직일 element에 직접지정
2. mouseup, mousemove -> document에 지정해야 **버그없음**
  * mouseup : 화면 어디서 마우스를 떼도 box를 멈추게 할 수 있음
  * mousemove : 빠르게 마우스가 움직일때의 버그해결을 위해 document에 이벤트 등록

>마우스 포인터 위치체크는 브라우저 화면렌더링속도(60fps)와 비슷하게 동작한다. 따라서 box를 잡고 빠르게 움직일시, box렌더링이 마우스 속도를 따라오지못해 위치감지가 어려워진다.

## 2. 클릭이 일어난 순간에 상대적 위치 저장(mousedown)
* `originTop/Left = box.offsetTop/Left` : box의 초기위치 (부모요소 기준)
* `originX/Y = e.clientX/Y` : box를 클릭한 마우스 포인터의 위치 (viewport기준)

> **HTMLElement.offset** (read-only 속성)
* offsetParent : element의 부모요소
* offsetTop/Left : 부모를 기준으로한 위치
* offsetWidth/Height : 부모를 기준으로한 크기 (padding, border를 모두 포함한 크기)

> **MouseEvent**
* screenX / screenY : 모니터화면 기준의 마우스좌표
* clientX / clientY : 브라우저(viewport) 기준의 마우스좌표


## 3. 상대적 위치를 유지하며 박스 위치 변경(mousemove)
* `diffX = e.clientX - originX;`
* mousemove가 되고있는 마우스위치(e.clientX)에서 처음 박스를 클릭했던 곳의 위치(originX) 거리차이를 구해준다.

## 4. box가 틀안에서만 움직이게 하기
`Math.min(Math.max(최소위치, resultX), 최대위치)`

1. 왼쪽/위로 벗어나지 않게
  * 최소위치 : resultX, resultY가 음수가 되지 않도록
  * `Math.max(0, originalLeft + diffX)`
2. 오른쪽/아래 벗어나지 않도록
  * 최대위치 : box크기 + offsetTop/Left가 전체 박스크기 넘지 않도록
  * `getBoundingClientRect()`활용

> **getBoundingClientRect()**
* element의 크기와 위치를 반환하는 메소드
* viewport를 기준점으로 삼는다.
* 반환값 : `x, y, top, bottom, left, right, width, height`
* 게임에서 굉장히 많이 쓰는 코드이기때문에 함수로 만들어 사용하곤한다


