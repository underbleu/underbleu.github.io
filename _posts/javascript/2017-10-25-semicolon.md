---
layout: post
title: javascript 세미콜론 상황에 따른 사용법
category: javascript
permalink: /javascript/:title/

tags: [자바스크립트, 세미콜론, 자바스크립트 스타일가이드]
comments: true
---
>자바스크립트는 상황에따라 세미콜론을 꼭 사용하지 않아도 된다. 코드 전체를 통으로 읽고 처리하는 컴파일언어와 달리, 자바스크립트는 인터프리터가 코드를 한 줄씩 읽고 처리하면서 세미콜론을 자동으로 삽입 시켜주기 때문이다.  
[참고](https://www.codecademy.com/blog/78)

## **필수. 한 줄에 여러개의 명령어가 오는경우**
한 줄에 여러개의 명령어가 오는경우, 세미콜론으로 문장을 구분해줘야한다. 그러나 줄바꿈이 일어나는 마지막은 생략해줘도 상관없다  
>※ 함수표현식에도 세미콜론 쓰길 강력히 권장

```javascript
var i = 0; i < 10; i++ //optional
```
## **옵션. 한 줄에 하나의 명령어만 있을 때 (=줄바꿈)**

```javascript
var i = 0 //optional
i++ //optional
```
## **세미콜론 사용하지 말아야 하는 경우**
1. 중괄호 뒤 } -> 함수표현식 예외  
에러는 안나지만 JsLint가 불필요하다 경고함
2. 소괄호 뒤 )    
if, for, while, switch 괄호안 조건이 동작안함
3. for()루프 안의 3번째 구문 뒤에 세미콜론 쓰면 에러

```javascript
//1. 중괄호 뒤 }
function (){...} 
if (){...} else {...}
while(){...}; //Unnecessary semicolon
var a = function(){...}; //예외

//2. 소괄호 뒤 )
if(0 === 1);{alert('hi')} //hi
if(0 === 1){alert('hi')} //undefined

//3. for루프 3번째 구문
for(var i=0; i<1; i++) //correct
for(var i=0; i<1; i++;) //SyntaxError

```
-> 2번에서 (1 === 0)은 false이기 때문에 alert('hi')은 작동되지 않고 종료하는 것이 옳다.
>[ ] 대괄호 square bracket   
{ } 중괄호 curly bracket  
( ) 소괄호 round bracket  

## **세미콜론 생략시 오류 예시**
1. 의도치 않게 줄바꿈이 제거될 때  
파일 용량을 줄이기 위해 minify작업으로 불필요한 공백, 줄바꿈, 주석등을 제거할 때 이슈가 생긴 사례 있음
2. 함수표현식에서 세미콜론 생략   
심각한 디버깅 상황에 빠질 수 있음

```javascript
var a = 1
var b = 2 //no problem

//1. 줄바꿈 제거
var a = 1var b = 2; //SyntaxError

//2. 함수표현식
var func = function(){
  return 2007; 
} 
(function(){
  console.log('hello')
})(); //TypeError
```
-> 원래 의도는 2007을 return하는 함수 a()를 정의하고, 즉시실행함수로 'hello'를 출력하려함. 하지만 'number is not a function'이라는 에러가 뜬다. 세미콜론으로 함수 정의를 종료하지 않은채 즉시실행함수를 만나 func()함수를 호출하고 2007을 return. 이후 2007과 IIFE의 마지막괄호();가 만나 2007();형태로 함수호출하려 시도한다. 2007은 return받아온 숫자이지 함수가 아니므로 결국 에러가 발생하는 것이다


## **결론**

**구글 자바스크립트 스타일 가이드에서...**  
모든 구문은 반드시 세미콜론으로 끝나야한다. 인터프리터 언어가 자동으로 세미콜론을 생성해주는 것에 의존하는 것은 금지!
>"세미콜론으로 각 명령문을 종료하는 것이 좋은습관이다"







