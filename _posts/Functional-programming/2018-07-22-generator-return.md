---
layout: post
title: Generator로 만든 이터러블과 for...of가 만났을 때
category: Functional-programming
permalink: /Functional-programming/:title/

tags: [함수형 프로그래밍]
comments: true
---

>프로그래머스에서 진행한 유인동님의 [ES6로 알아보는 동시성 & 함수형 프로그래밍 강의](https://programmers.co.kr/learn/courses/3409)를 들으며 질문/답변에 대한 추가학습

## # 문제점

보조함수가 프로미스일때, coll로 객체를 받지 못함

```js
reduce(
  (a, b) => Promise.resolve(a + b),
  Promise.resolve({a:1,b:2,c:3})).then(console.log) //3 --> 문제있음
  
reduce(
  (a, b) => Promise.resolve(a + b),
  {a:1,b:2,c:3}).then(console.log) //3 --> 문제있음
  
reduce(
  (a, b) => Promise.resolve(a + b),
  [1,2,3]).then(console.log) //6 --> 정상동작
  
reduce(
  (a, b) => a + b,
  Promise.resolve({a:1,b:2,c:3})).then(console.log) //6--> 정상동작
```

보조함수가 프로미스이면, for문의 `acc = f(acc, v)`의 값은 프로미스이기 때문에 재귀가 일어난다. 

### 이 때, 
1. `coll`이 "배열/배열담은 Promise"일 땐, 재귀를 돌렸을때 for문이 그 자리에서 다시 진행되지만
2. `coll`이 "객체/객체담은 Promise"일 땐, 재귀를 돌렸을때 for문이 종료되어있다  
-> for루프는 종료된 상태이기 때문에 for루프를 1회밖에 순회하지 못한 acc(누적값)이 반환값이 된다

### for루프가 종료되어 있는 이유는 무엇일까?
* 배열 역시 제너레이터로 만든 객체이면 오작동한다  
-> `valuesIter()` 제너레이터의 문제인 것 같다  

```js
var obj = {a:1,b:2,c:3}
var objIterG = valuesIter(obj)
objIterG // valuesIter {<suspended>}

var arr = [1,2,3]
var arrIterG = valuesIter(arr);
arrIterG // valuesIter {<suspended>}

reduce6((a, b) => Promise.resolve(a + b), arrIterG).then(console.log) 
// 3 --> 오작동
reduce6((a, b) => Promise.resolve(a + b), objIterG).then(console.log)
// 3 --> 오작동
```

---

## # 문제 원인 찾기

### Generator의 기본동작
* 제너레이터는 제너레이터 객체를 반환한다
  * 제너레이터 객체는 for-of 루프로 순회할 수 있으며 = 이터러블(iterable)이면서
  * next() 메소드를 가지고 있다 -> 동시에 이터레이터(iterator)이다
* 제너레이터 함수는 호출되어도 즉시 실행되지 않고, 대신 함수를 위한 Iterator 객체(일종의 pointer)를 반환한다
* Iterator의 next메서드를 호출하면 제너레이터 함수가 실행되어 yield문을 만날 때마다 value, done 프로퍼티를 갖는 객체를 반환한다

### Generator.prototype.return()
제너레이터의 `.return()` 메소드는 제공된 값을 반환하고 Generator를 종료시킨다
```js
var test = valuesIter([1,2,3])
test.next(); // {value: 1, done: false}
test.next(); //{value: 2, done: false}

test // valuesIter {<suspended>} --> 아직 종료되지 않은상태

test.return(); //{value: undefined, done: true} --> 종료시키기

test3 // valuesIter {<closed>} --> 종료된상태
```

### Array Iterator vs Generator

* 일반 이터러블객체의 iterator에는 `.return()`메소드가 없지만
* 제너레이터로 만든 제너레이터객체의 iterator에는 `.return()`메소드가 있다

```js
var arrIter = [1,2,3][Symbol.iterator](); // Array Iterator {}
var arrIterG = valuesIter([1,2,3]); // valuesIter {<suspended>}

arrIter.next(); // {value: 1, done: false}
arrIter.return(); // TypeError -> return메소드 없음

arrIterG.next(); // {value: 1, done: false}
arrIterG.return(); // {value: undefined, done: true}
```


Array Iterator  
![함수형 자바스크립트 프로그래밍]({{site.baseurl}}/img/array-iterator.png)

Generator Iterator  
![함수형 자바스크립트 프로그래밍]({{site.baseurl}}/img/generator-iterator.png)


### Generator로 만든 이터러블과 for...of가 만났을때

>for...of는 내부적으로 루프가 종료되었을 때, 받아둔 iterator에 `.return()`메소드가 있다면 이를 실행시켜 이터러블을 종료시킨다  

`reduce()`의 보조함수로 Promise가 왔을때, 비동기가 일어나 재귀를 돌게되는데...

* 일반 이터러블의 iterator엔 `.return()`메소드가 없어 재귀를 돌기위해 루프를 빠져나가도 다시 그 자리에서 루프가 실행되지만
* 제너레이터로 만든 객체의 iterator는 재귀를 돌기위해 루프를 빠져나가는 순간, `.return()`메소드를 실행시켜 제너레이터를 종료시키므로 더이상 순회가 불가능해진다

* for...of 는 내부적으로 for of 가 종료된 후에 받아둔 iterator에 `.return()`메소드가 구현되어있다면 `.return()` 을 실행하도록 되어있다
* 그래서 acc값이 프로미스라 재귀를 돌기위해 `return acc.then(recur);` 으로 for...of를 빠져나가면, iterator의 `.return()`을 실행하므로 Generator가 종료된다


```js
//1. coll의 값으로 plain object가 오면 

//2. *valuesIter 제너레이터를 이용해 iterable 객체를 만든다

const collIter = coll => 
  coll.constructor == Object ? valuesIter(coll) : coll[Symbol.iterator]();

function reduce(f, coll, acc) { 
  return then(function () {
    var iter = collIter(coll);
    acc = acc === undefined ? iter.next().value : acc;
    return then(function recur(acc) {
      for (const a of iter) {
        acc = f(acc, a); 
        //3. 보조함수가 프로미스이기 때문에, 반환값은 프로미스 -> acc
        
        if(acc instanceof Promise) return acc.then(recur);
        //4. 재귀를 돌기위해 for...of를 빠져나가면
        //5. iterator의 `.return()`을 실행 -> Generator 종료
      }
      return acc; 
      //6. 더이상 제너레이터 객체 순회 불가하기 때문에, 첫 누적값이 반환
    }, acc)
  }, coll)
}

reduce((a, b) => Promise.resolve(a + b), {a: 1, b: 2, c: 3}); // 3 
```

* 비동기가 안일어나면,  
제너레이터로 만든 이터레이터를 for...of에 다시 넣어도 `.return()`이 실행되기전에 재귀가 먼저 종료되므로 문제가 안생기고
* 비동기가 일어나면,  
재귀를 돌기위해 for문을 빠져나가면서 `.return()`이 먼저 실행되어, `iter.next()`가 `{ done: true }`가 되도록 되어있어 더이상 for...of로 순회가 불가능하게된다

Q: 왜 이런현상이 있는 걸까요 ?  
A: 에러가 발생했을때 이터레이터를 종료시켜서 제너레이터 객체 자체를 언능 날려버릴 수 있게 하기 위한 목적으로 보여집니다

---

## # 해결책


1. 제너레이터로 만든 결과를 `.return()`이 없는 객체로 감싸서 리턴 하거나  
2. 파격적으로 `.return`에 `null`을 대입해버리는 방법이 있다
```js
const iter = valuesIter({ a: 1, b: 2 });

//1.
function wrap(iter) {
  return { next: () => iter.next(), [Symbol.iterator]() { return this; }};
}

//2.
function delReturn(iter) {
  iter.return = null;
  return iter;
}
```

제너레이터로 생성할 이터러블을 gen함수로 감싸주자

```js
function gen(g) {
  return function(v) {
    const iter = g(v);
    return { next: () => iter.next(), [Symbol.iterator]() { return this; } }
  }
}

const valuesIter = gen(function *(obj) {
  for (const k in obj) yield obj[k];
});
```