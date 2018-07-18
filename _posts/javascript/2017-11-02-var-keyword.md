---
layout: post
title: 자바스크립트 var키워드와 변수
category: Javascript
permalink: /Javascript/:title/

tags: [자바스크립트, var, 전역변수]
comments: true
---
[실행컨텍스트](https://poiemaweb.com/js-execution-context)
>참고 [MDN var](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/var)

The variable statement declares a variable, optionally initializing it to a value.

>var varname1 [= value1] [, varname2 [= value2] ... [, varnameN [= valueN]]];

* varnameN: Variable name. It can be any legal identifier.
* valueN: Initial value of the variable. It can be any legal expression. Default value is undefined.

## **var 키워드란?**

## **var 호이스팅**


전역 변수는 간단한 애플리케이션의 경우, 사용이 편리한 면이 있지만 불가피한 상황을 제외하고 사용을 억제해야 한다.

1. 소스와 데이터의 공개성
일단 첫번째로 "소스와 데이터의 공개성"은 웹에서는 '브라우져에서 돌아가는 모든 소스와 데이터는 클라이언트 측에서 돌아간다'는 점에서 해킹이나 보안에 취약할수도 있다. -> 클로저 외부에서 수정도 불가능하고 접근도 불가능하다.
1의 변수는 일반 사람들이 쉽게 브라우져에서 접근하여 내용을 알아내기 힘들다.

2. "모바일/PC 등 고른 브라우징 환경"
하지만 글로벌은 언제나 어떠한 scope에서도 참조되고 있으므로 글로벌로 생성한 변수를 개발자가 수동으로 해제하기 전까지는 언제나 메모리에 남아있게 된다. 따라서 모바일을 고려할 때 모바일 브라우져의 메모리 사용을 최적화 해주기 위하여 '잠시 사용할 변수'는 글로벌 변수 목록에서 빼서 로컬로 돌려서 사용 안할 때에는 해제될 수 있도록 해주는 것이 좋고, 마찬가지로 AJAX의 요청 등으로 오게 될 '대용량 데이터(예: html, table 데이터, 예2의 element, button, insertHTML 등)'는 오래 가지고 있을수록 메모리에 영향을 미치므로 이러한 변수들 역시 로컬로 보관해서 처리하고나면 바로바로 메모리가 해제 될 수 있도록 해주는 것이 좋다.





글로벌 변수의 사용은 프로그래머라면 어찌되었든 최소화하자.
var 선언 없이 사용하는 것은 글로벌 변수의 사용이 '될 수도' 있으므로 항상 조심하자.
var로 정의를 하면 현재 환경을 실행하기 전에 먼저 변수를 정의해 놓는다.

### var키워드를 생략하면 전역 변수가 되는 이유는?
자바스크립트 ​엔진은 ​변수 ​할당문을 ​만나면 ​해당 ​스코프 ​내에서 ​해당 ​변수의 ​선언을
검색한다. ​이때 ​검색에 ​실패하면 ​상위 ​스코프에서 ​해당 ​변수의 ​선언을 ​검색한다. ​최상위
스코프인 ​전역에서도 ​해당 ​변수 ​선언의 ​검색에 ​실패한 ​경우, ​자바스크립트 ​엔진은 ​해당
변수를 ​전역 ​변수로 ​간주하고 ​선언하기 ​때문이다.

function이라는 새로운 scope 안에 있지만, var로 변수 선언을 하지 않았기 때문에 global 영역에 있는 변수들을 접근하여 조회/설정하게 된다.

정확하게 말하자면 글로벌 영역으로 가는 것이 아니라 '현재보다 위의 scope에 sum이라는 변수가 있는지 체크'하는 것이다.

글로벌 변수로 선언된 모든 변수들을 window 객체가 속성으로 가지게 된다.

변수를 var 없이 바로 사용하게 된다면, noVar = "...";를 실제로 실행하기 전에는 window의 속성으로 정의되어있지 않고, noVar구문이 실행되기 전에 noVar에 접근하려고 하니 레퍼런스 에러가 일어났다. 이것은 var 구문으로 정의된 것은 처음에 파싱될 때 미리 해당 변수에 대한 선언을 먼저 정의해놓는 다는 것을 알 수 있고, var를 이용하지 않는 경우, window의 속성으로 설정하는 경우에는 실행 당시(runtime)에 그 속성을 새롭게 추가하고 설정하는 것이라고 볼 수 있다. 이에 대해서 다시 표준 정의를 찾아보자. 먼저 Variable에 대해서 설명하고 있는 부분을 보자.

```javascript
var a = 'a';

function func() {
  // 지역변수로 var scope가 이미 정의되었기 때문에 지역변수로 사용된다.
  var a = 'b'; //이게 없으면 전역변수'c'로 재할당됨
  a = 'c';
  console.log(a);//c
}
func();
console.log(a);//a
```

The variable statement declares a variable, optionally initializing it to a value.

Variable declarations, wherever they occur, are processed before any code is executed. The scope of a variable declared with var is its current execution context, which is either the enclosing function or, for variables declared outside any function, global. If you re-declare a JavaScript variable, it will not lose its value.

[MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/var)

```javascript
var x = 0;

function f() {
  var x = y = 1; // x is declared locally. y is not!
console.log(x);
console.log(y);
}
f();

console.log(x, y);
```

Implicit globals and outer function scope
Variables that appear to be implicit globals may be references to variables in an outer function scope:
```javascript
var x = 0;  // x is declared global, then assigned a value of 0

console.log(typeof z); // undefined, since z doesn't exist yet

function a() { // when a is called,
  var y = 2;   // y is declared local to function a, then assigned a value of 2

  console.log(x, y);   // 0 2

  function b() {       // when b is called
    x = 3;  // assigns 3 to existing global x, doesn't create a new global var
    y = 4;  // assigns 4 to existing outer y, doesn't create a new global var
    z = 5;  // creates a new global variable z and assigns a value of 5.
  }         // (Throws a ReferenceError in strict mode.)

  b();     // calling b creates z as a global variable
  console.log(x, y, z);  // 3 4 5
}

a();                   // calling a also calls b
console.log(x, z);     // 3 5
console.log(typeof y); // undefined as y is local to function a
```
