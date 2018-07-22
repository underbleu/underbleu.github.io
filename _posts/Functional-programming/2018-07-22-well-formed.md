---
layout: post
title: well-formed 이터러블의 장점 (feat. 피보나치수열)
category: Functional-programming
permalink: /Functional-programming/:title/

tags: [함수형 프로그래밍]
comments: true
---

>프로그래머스에서 진행한 유인동님의 [ES6로 알아보는 동시성 & 함수형 프로그래밍 강의](https://programmers.co.kr/learn/courses/3409)를 들으며 질문/답변에 대한 추가학습

## Q: well-formed iterable이 가지는 장점이 있을까요 ?

제너레이터로 생성한 이터러블만 자기자신을 반환하는 well-formed이고, 내장 iterator를 가지고 있는 "Array, String, NodeList..." 같은 애들은 well-formed가 아닌것 같은데...  

well-formed iterable이 가지는 장점이 있을까요 ?

```js
var iterG = valuesIter({ a: 1, b: 2 });
var arr = [ 1, 2 ];
var str = "abc";
var node = document.querySelectorAll("div");
var map = new Map([["a", 1],["b", 2]]);
var set = new Set([1, 2, 3]);

iterG[Symbol.iterator]() == iterG // true
arr[Symbol.iterator]() == arr // false
str[Symbol.iterator]() == str // false
node[Symbol.iterator]() == node // false
map[Symbol.iterator]() == map // false
set[Symbol.iterator]() == set // false
```

## A: 선생님 답변
* 일단, well-formed의 장점은 여기저기서 조합하기 좋다
* Array, String은 well-formed가 맞음. 위의 테스트가 잘못되었음
```js
// 올바른 Test Case
var arr = [1,2,3];
arr[Symbol.iterator]() == arr // false

var arrIter = [1,2,3][Symbol.iterator]();
arrIter[Symbol.iterator]() == arrIter; // true
```
-> Array의 [Symbol.iterator] 메서드를 한번 실행시켜줘야 이터레이터가 된다 !   
-> 이터레이터가 된 후와 비교해야 올바른 테스트!

### `collIter()`함수의 코드가 이 원리와 같다

1. coll이 [Symbol.iterator]를 가지고 있다면
2. 이를 실행시켜줘야 -> 이터레이터가 된다
3. 제너레이터는 호출하는 순간 실행 -> 이터레이터가 된다

```js
const collIter = coll =>
  hasIter(coll) ? // --> 1
    coll[Symbol.iterator]() : // --> 2
    valuesIter(coll); // --> 3
```

### `Well-formed Iterable`이 유용한 이유
>[Iterators that are Iterable](
http://exploringjs.com/es6/ch_iteration.html#_iterators-that-are-iterable)  
Why is it useful if an iterator is also an iterable? for-of only works for iterables, not for iterators. Because Array iterators are iterable, ***you can continue an iteration in another loop***  

* Iterator이면서 Iterable인 객체를 잘정의된(well-formed) Iterable이라고 부른다
* 제너레이터가 만들어주는 제너레이터객체는 `well-formed Iterable`  
* This is Why ES6 generators are usually much more convenient !

### 예시) 피보나치 수열을 생성하는 이터러블

1. non well-formed  
이터러블이 진행된 지점을 기억하지 못해 처음부터 Restart
2. well-formed
이터러블이 진행된 지점을 기억하고 그 지점부터 Restart

```js
//1. non well-formed

var fibonacci = {
  [Symbol.iterator]() {
    let [prev, curr] = [0, 1];
    let step = 0;
    const maxStep = 5;
    return {
      next() {
        [prev, curr] = [curr, prev + curr];
        return { value: curr, done: step++ >= maxStep };
      }
    };
  }
};

// Test -----

for(const v of fibonacci) {
  console.log(v);
  break;
} // 1

for(const v of fibonacci) {
  console.log(v);
} // 1 2 3 5 8 -> Restart iterator



//2. well-formed 

var fibonacciW = {
  prev: 0, curr: 1, step: 0, maxStep: 5,
  next() {
    [this.prev, this.curr] = [this.curr, this.prev + this.curr];
    return { value: this.curr, done: this.step++ >= this.maxStep };
  },
  [Symbol.iterator]() {
    console.log(this)
    return this;
  }
};

// Test -----

for(const v of fibonacciW) {
  console.log(v);
  break;
} // 1

for(const v of fibonacciW) {
  console.log(v);
} // 2 3 5 8 -> Continue with same iterator
```

---

## # 결론  
* Array, String, Map, Set, NodeList는 `[Symbol.iterator]`를 내장메서드로 가지고 있기때문에 기본적으로 Iterable하다  
* 하지만 well-formed Iterable로 동작하기 위해선 `[Symbol.iterator]()`를 한 번 **실행**시켜줘야한다

```js
var arr = [1,2,3]; //--> Iterable
var arrIt = arr[Symbol.iterator](); // well-formed Iterable

//1. Iterable
for(const v of arr) {
  console.log(v);
  break;
} // 1

for(const v of arr) {
  console.log(v);
} // 1 2 3 --> 다시 시작

//2. well-formed Iterable

for(const v of arrIt) {
  console.log(v);
  break;
} // 1 --> 순회한 위치를 기억

undefined
for(const v of arrIt) {
  console.log(v);
} // 2 3 -> Continue with Same iterator
```
