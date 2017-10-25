---
layout: post
title: Lv1. 삼각형출력하기
category: algorithm
permalink: /algorithm/:title/

tags: [알고리즘, 자바스크립트]
comments: true
---
> [알고리즘 문제 출처](https://programmers.co.kr/learn/challenge_codes/103)  

## **문제** 
printTriangle 메소드는 양의 정수 num을 매개변수로 입력받습니다.
다음을 참고해 *(별)로 높이가 num인 삼각형을 문자열로 리턴하는 printTriangle 메소드를 완성하세요
printTriangle이 return하는 String은 개행문자('\n')로 끝나야 합니다. 

```javascript
// 높이가 3일때 
*
**
***
```

## **내 풀이 (Javascript)**
```javascript
function printTriangle(num) {
  var result = '';
  for (var i = 0; i < num; i++) {
    for (var j = 0; j <= i; j++) {
      result += '*';
    }
    result += '\n';
  }
  return result;
}
```

## **다른 풀이**
### 1. for문 1번사용 + repeat()메소드
```javascript
function printTriangle2(num) {
  var result = '';
  for (var i = 0; i < num; i++) {
    result += '*'.repeat(i + 1) + '\n'
    }
  return result;
}
```
### 2. 재귀함수 + 삼항연산자
printTriangle(num - 1)이 앞에있을땐 삼각형, 뒤에있을땐 역삼각형이 출력됨.
아직 그 원리가 이해가 안된다
```javascript
function printTriangle3(num) {
  return (num < 1) ? '' : printTriangle3(num - 1) + '*'.repeat(num) + '\n';
}
```

## **배운것**  
* str.repeat(*count*)  
특정문자열을 *count*만큼 반복시켜 
리턴해주는 메서드 (IE 지원안됨)
* 재귀함수
