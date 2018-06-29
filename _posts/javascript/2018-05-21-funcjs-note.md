# 컬렉션 중심 프로그래밍
# 1강. reduce, 제너레이터, 다형성
>자바스크립트 함수형 프로그래밍 250p
* 컬렉션 중심 프로그래밍의 목표는 컬렉션을 다루는 **좋은 로직의 함수** 세트들을 만들어 **재사용성을 극대화** 시키는 데 있다
* 함수를 조합하는 식으로 프로그래밍을 하면 코드는 간결해지고 표현력은 풍부해진다
* 많은 데이터형을 지원하는 화려한 함수 10개보다, 적은 데이터형을 지원하며 작은 기능만을 정확히 수행하는 함수 100개가 낫다
* 크기가 작기때문에 값의 변이 과정을 고려하지 않고도, 코드가 무슨 일을 하는지 쉽게 알 수 있다
* 작은 함수들을 조합하여 로직을 짜게 되면, 함수 이름으로 로직을 읽기 때문에 복잡한 코드를 이해하기 쉽다

### 4가지 유형별 대표함수  
각 유형의 중 추상화 레벨이 가장 높은 함수. 즉, 이 함수를 이용해 필요에따라 다양한 함수를 만들어 나갈 수 있다는 것
* `map`: 다 돌면서, **수집하기**
* `filter`: 다 돌면서, **거르기**
* `reduce`: 다 돌면서 좁히기. **접기**
* `find`: 찾아나가다가 원하는 결과를 완성하면 나가기. **찾아내기**

### 함수형 프로그래밍의 특징
* 적은 수의 자료구조, 많은 연산자
* 패턴매칭: 특정한 '모양'(패턴)을 가지고 있는가를 테스트하는 것

---

## # reduce함수 만들기
* Array.prototype.reduce메소드는 유사배열등의 배열이 아닌 객체에서는 사용을 할 수 없다
* [Symbol.iterator]()가 구현되어 있지 않은 객체에도 사용가능한 reduce 함수를 만들어보자


```js
/* 
  f: 적용할 함수
  coll: 콜렉션 데이터 (돌릴 수 있는)
  acc(optional): 누적값. 공백시 coll의 첫번째 요소를 초기값으로 사용
*/
 
function reduce(f, coll, acc) { 
  const iter = coll[Symbol.iterator](); // 1. coll -> iterable
  acc = acc === undefined ? iter.next().value : acc; // 2. acc: *optional
  for (const v of iter) {
    acc = f(acc, v);
  }
  return acc;
}

console.log( reduce((acc, a) => acc + a, [1,2,3]) ); // 6
console.log( reduce((acc, a) => acc + a, [1,2,3], 10) ); // 10
```

### 1. coll을 iterable하게 만들어주기
```js
const iter = coll[Symbol.iterator]();
```

**이터레이션 프로토콜(iteration protocol)**
* Iterable(이터러블)  
: `[Symbol.iterator]`라는 특정한 이름의 method가 구현되어있는 순회 가능한 자료 구조
* Iterator (이터레이터)  
: 이터러블의 `[Symbol.iterator]()`가 반환한 값
  * 이터러블의 요소를 탐색하기 위한 포인터
  * `next()` method가 구현되어 있어야 한다
* `next()` method  
: value, done 프로퍼티를 갖는 객체를 반환 한다  
  * done: false -> 생략가능
  * done: true일 때, value 생략가능
### 2. acc를 optional하게 만들어주기
```js
acc = acc === undefined ? coll.next().value : acc;
```
* undefined를 **구분자**로 사용하여 acc가 들어왔는지 여부를 체크한다
* `iter.next()` 활용하여 첫번째 요소를 미리 꺼내 acc에 할당하고, 뒤의 요소를 순회한다  
-> Iterator를 활용하여 코드도 깔끔하고 성능문제도 없다  
-> ES5였다면 slice로 첫요소를 제외한 배열을 **통채로 복사**하여 coll을 재정의 해야 때문에, 배열의 크기가 클 경우 성능이슈가 있다
  ```js
  // ES5 였다면...
  acc = acc === undefined ? coll[0] : acc;
  coll = coll.slice(1); // coll재정의: 첫번째 요소만 제외한 요소들 통채로 복사
  ```

---

## # `collIter()`: 이터러블을 만들어주는 작은 함수 독립
reduce함수에 명령적으로 쓰여져 있던 코드를 `collIter()`로 독립시켜준다
* collIter에 다형성을 높여줄 수 있는 코드를 추가할 수 있다 -> `valuesIter()`
* 받는 인자의 타입이 어떻던, 기존의 iterator를 만들어주던 기능은 무너지지 않음

```js
const collIter = coll => coll[Symbol.iterator]();

function reduce(f, coll, acc) {
//coll = coll[Symbol.iterator](); //--- 명령형
  coll = collIter(coll); //--- 선언형
  // ...
}
```

### 명령형 / 선언형 프로그래밍의 차이
>참고: [명령형과 함수형 프로그래밍 비교](https://github.com/funfunStudy/study/wiki/%EB%AA%85%EB%A0%B9%ED%98%95-%ED%94%84%EB%A1%9C%EA%B7%B8%EB%9E%98%EB%B0%8D%EA%B3%BC-%ED%95%A8%EC%88%98%ED%98%95-%ED%94%84%EB%A1%9C%EA%B7%B8%EB%9E%98%EB%B0%8D-%EB%B9%84%EA%B5%90)

* **명령형 프로그램**은 알고리즘을 명시하고 목표는 명시하지 않는다  
-> 알고리즘: 수행해야 하는 단계를 매우 자세히 설명하는 코드
* **선언형 프로그램**은 목표를 명시하고 알고리즘을 명시하지 않는다  
-> 실행할 일련의 함수(목표)로 코드를 구성

 _ | 명령형 | 함수형
--- | --- | ---
포인트 | 작업을 수행하는 방법(알고리즘)과 상태의 변경을 추적하는 방법 | 원하는 정보와 필요한 변환 (=인자와 리턴값)
상태 변경 | 중요 | 존재하지 않음
실행 순서 | 중요 | 중요도가 낮음
흐름 제어 | 루프, 조건 및 함수(메서드) 호출 | 재귀를 비롯한 함수 호출
조작 단위 | 클래스나 구조체의 인스턴스 | 1급(first-class) 개체와 데이터 컬렉션인 함수
.

---

## `valuesIter()`: 인자의 다형성을 높여주기 위한 보조함수
* 성능적으로 이슈가 없다면 함수를 범용적으로 만들 필요가 있다  
-> `reduce()`가 배열뿐만 아니라, 객체도 인자로 받을 수 있도록 만들어 주자
* 객체는 이터러블이 아니지만 이터레이션 프로토콜을 준수하면 순회할 수 있는 이터러블 객체를 만들수 있다  
-> 제너레이터 함수로 순회 가능한(iterable)한 값을 생성해주자

```js
// 기존배열에서 값을 하나씩 꺼내서 전달하는 함수
function *valuesIter(obj) {
  for(const k in obj) yield obj[k];
}

// 기존배열과 같은 크기의 배열을 새로 만드는 함수 (성능이슈**)
function toArray(obj) {
  return [...valuesIter(obj)]
}
```
-> `toArray(makeArr(300000000))` 부터 콜스택에러 !! 성능이슈 !!

### 성능이슈 Tip 
* for안에서 **코드를 추가**하는게 아니면, 성능상 문제를 주는 코드는 거의 없다
* 심지어 for문 안에서 if문으로 조건 체크를 만번, 이만번을 돌려도 성능 차이가 거의 없기때문에, 다형성을 지원하기위한 조건들을 함수에 많이 넣어줘도 된다
* 이런식으로 `Array.prototype.reduce`가 지원하지 못하는 상황을 고려하여, 내가 직접 다형성을 지원하는 함수를 구현해볼 수 있다
* `console.time()`, `console.timeEnd()` 으로 성능 차이 확인해볼 수 있다

```js
// 1. for문
function makeArr1(a) {
  var arr = [];
  console.time("test1")
  for(let i = 0; i < a; i++) {
    arr.push(i);
  }
  console.timeEnd("test1")
  return arr;
}

//2. for문 안에서 if문으로 조건 체크
function makeArr2(a) {
  var arr = [];
  console.time("test2")
  for(let i = 0; i < a; i++) {
    if(i.constructor === Number) 
    arr.push(i);
  }
  console.timeEnd("test2")
  return arr;
}

//3. for안에서 코드를 추가
function makeArr3(a) {
  var arr = [];
  console.time("test3")
  for(let i = 0; i < a; i++) {
    if(i.constructor === Number) i = [i + 10];
    arr.push(i);
  }
  console.timeEnd("test3")
  return arr;
}
makeArr1(3000000); //test1: 106.338134765625ms
makeArr2(3000000); //test2: 114.83203125ms
makeArr3(3000000); //test3: 239.372802734375ms

```
-> for문안에서 코드를 추가하는게 아니면, if문으로 조건체크를 아무리 많이해도 성능차이는 거의 없다

---

### for-in / for-of
>for–in 문은 객체의 **프로퍼티**를 순회하기 위해 사용하고,  
>for–of 문은 배열의 **요소**를 순회하기 위해 사용한다

* for-in  
: 객체의 문자열 키(key)를 순회하기 위한 문법  
: 배열엔 사용하지 않도록 한다 -> 순서를 보장하지 않고, 배열의 요소뿐만 아니라 속성까지도 순회하기때문

* for-of  
: 이터러블 객체를 순회한다 (Array, String, Map, Set, DOM node)  
: done 프로퍼티가 true가 될 때까지 반복하며, done 프로퍼티가 true가 되면 반복을 중지

---

### 자료형에 따른 기본 Iterator의 종류
* `ƒ values() {...}`: value를 리턴
* `ƒ entries() {...}`: key와 value를 리턴  
-> Map의 기본 이터레이터는 entries. 구조분해하여 key/value 골라 쓸 수 있다  
-> Map은 json을 지원하지 않아서 자주안쓸거다 -> 저번주 강의 참고
```js
Array.prototype[Symbol.iterator] // ƒ values() { ... }
String.prototype[Symbol.iterator] // ƒ values() { ... }
Map.prototype[Symbol.iterator] // ƒ entries() { ... }
Set.prototype[Symbol.iterator] // ƒ values() { ... }
NodeList.prototype[Symbol.iterator] // ƒ values() { ... }

var m = new Map([["a", 1], ["b", 2]]);
for (const a of m) console.log(a); // ["a", 1] ["b", 2]
for (const [k, v] of m) console.log(k); // a, b
for (const [k, v] of m) console.log(v); // 1, 2
```

### 함수형프로그래밍적 사고  
  * 자료형에 따라 어떤 iterator를 사용하는지 내부를 보고, 다양한 함수를 만들어 사용가능하다
  * value가 필요하면 `valuesIter()`, key가 필요하면 `entriesIter()`를 사용하면 해결된다는 사고
```js
function *valuesIter(obj) {
  for (const k in obj) yield obj[k];
}

function *entriesIter(obj) {
  for (const k in obj) yield [k, obj[k]];
}
```

---

## `collIter()`의 확장

* 자바스크립트의 모든 것은 `key: value`쌍 (심지어 함수도), 하지만 무엇을 key value로 볼 것인지 의미있는 기준을 가져야한다
* 데이터로 다루기 위한 객체만을 `key: value`로 보자 (함수, Nodelist는 순회할 이유가 없다)
```js
const collIter = coll => 
  coll.constructor === Object ?
    valuesIter(coll) :  coll[Symbol.iterator]();
```

* `instanceof`연산자  
: instanceof 연산자는 object의 프로토타입 체인에 constructor.prototype 이 존재하는지를 테스트 (조상님까지 다 살펴봄)  
: 즉 체이닝안에 있으면 `true`
* `constructor`프로퍼티  
: constructor 프로퍼티는 객체의 입장에서 자신을 생성한 객체를 나타냄 (리얼부모)  
: plain Object를 찾기위해 사용

```js
var func = function() {};
var arr = [];
var obj = {};

arr instanceof Array; // true
arr instanceof Object; // true
func instanceof Object; // true
obj instanceof Object; // true

arr.constructor == Object; // false
arr.constructor == Array; // true
func.constructor == Object; // false
func.constructor == Function; // true
obj.constructor == Object; // true --> plain object !
```

---

# 2강. reduce 활용 (posts, users), countBy, groupBy

## acc(누적값)을 주는 경우 vs 안주는 경우
* 안주는 경우: 반드시 acc와 a가 같은 형이라는걸 보장할 수 있을 때 사용
* 누적값을 주는 경우: acc와 a가 다른 형이어도 된다
  * 다만 형이 다를경우, 보조함수의 리턴값이 acc가 되야한다
```js
reduce((acc, a) => acc + a, [1,2,3]); // 6
reduce((acc, a) => (acc.value += a, acc), [1,2,3], {value: 0}); // 6
```
```js
a = 10, 20 // 20 -> 뒤의 값이 리턴됨
a // 10

var a = 10, b // a와 b가 함께 선언되는것
a // 10
b // undefined
```

---

## `reduce()` 활용하기

### 1. reduce의 보조함수를 통해 다형성을 더 높일 수 있다

```js
const posts = [
  {id: 1, body: "내용1", comments: [{}]},
  {id: 2, body: "내용2", comments: [{}, {}, {}]},
  {id: 3, body: "내용3", comments: [{}, {}]},
  {id: 4, body: "내용4", comments: [{}]},
];

const users = [
  {id: 1, name: "name1", age: 21},
  {id: 2, name: "name2", age: 23},
  {id: 3, name: "name3", age: 20},
  {id: 4, name: "name4", age: 23},
  {id: 5, name: "name5", age: 23},
  {id: 6, name: "name6", age: 21}
];

// posts의 comments의 총 수
reduce((count, p)=> (count += p.comments.length, count), posts, 0);

// age별 user 그룹
reduce((group, u) => {
  (group[u.age] || (group[u.age] = [])).push(u);
  return group;
}, users, {});

// age별 user의 수
reduce((count, u) => 
  (count[u.age] ? count[u.age]++ : count[u.age] = 1, count)
, users, {});
```

### 2. 보조함수 `incSel()`, `pushSel()`를 생성하여 표현을 간결하게 만들어 준다

```js
function incSel(parent, k) {
  parent[k] ? parent[k]++ : parent[k] = 1;
  return parent;
}

function pushSel(parent, k, v) { 
  (parent[k] || (parent[k] = [])).push(v)
  return parent;
}

reduce((count, u) => incSel(count, u.age), users, {}); 
// {20: 1, 21: 2, 23: 3}

reduce((group, u) => pushSel(group, u.age, u), users, {});
// {20: Array(1), 21: Array(2), 23: Array(3)}
```

### 3. 추상도를 더 높인 `countBy()`, `groupBy()` 함수
위의 함수에서 가변적인 부분은 `u.age`뿐이다. 추상도를 더 높여 다방면으로 활용가능한 함수를 만들어보자
* 인자 이름 arr, coll의 차이?  
: arr은 형이 반드시 배열일때만 인자이름으로 사용하도록
```js
const countBy = (f, coll) => reduce((count, a) => incSel(count, f(a)), coll, {});
const groupBy = (f, coll) => reduce((group, a) => pushSel(group, f(a), a), coll, {});

countBy(u => u.age, users); // {20: 1, 21: 2, 23: 3}
groupBy(u => u.age, users); // {20: Arr(1), 21: Arr(2), 23: Arr(3)}
```

ex) `countBy()`로 아래의 결과들을 집계할 수 있다
* a로부터 연산한 결과
* a로부터 접근 `.get()` 결과
* a의 메서드를 실행했을 때의 결과

```js
// 다방면으로 응용
countBy(n => n, [1,1,2,3,3,3]); // {1: 2, 2: 1, 3: 3}
groupBy(n => n, [1,1,2,3,3,3]); // {1: [1,1], 2: [2], 3: [3,3,3]}

const identity = a => a;
const count = data => countBy(identity, data);

count([1,1,2,3,3,3]); // {1: 2, 2: 1, 3: 3}
```
### `identity()`


---

# 3강. Promise, then, 동기/비동기 다형성, reduce에 Promise 다형성 추가

## Promise의 중요성
>Promise를 얼마나 잘다루느냐가 관건이다 !  
>고로 모든 코드를 짤 때, 동기/비동기 상황을 모두 염두해놓고 짜도록 하자 (난이도 up)

* 비동기 통신에서의 데이터 처리뿐만아니라
* UI 구현에서도 중요함  
  * confirm창을 띄우고, 확인을 눌러야 밑으로 내려가지는 UI  
  * 카카오톡 채팅방에 친구를 초대할 때, 친구목록을 띄워서 선택한 목록을 프로미스로 받아서 초대요청  
  * 2가지 인터렉션이 동시에 일어날 때, 박스가 올라가며 서버에 API요청을 한 그림을 그리는 경우 -> 버벅버벅 튕기지 않으려면 두가지 인터렉션을 프로미스로 받아놓고 실행해야함

---

13분
한 객체에 크기, 색상, 위치 조정(서로의존적임)을 제이쿼리로 3번 주는 경우,
브라우저가 화면을 그리는 타이밍? 함수하나의 콜스택이 다 비워졌을 때
보통 콜스택은 함수가 끝나야 비워지는데, 비동기가 일어나면 콜스택이 바로 비워진다
그래서 동시에 크기, 색상, 위치가 의존적으로 바뀌며 렌더링되는게 아니라, 각각 따로 틱틱틱 그려지는 것
## 작업 큐 (Task Queue)
[참고](https://helloworldjavascript.net/pages/285-async.html)

await는 연산자이기도 하며, await 연산의 결과값은 뒤에 오는 Promise 객체의 결과값

await연산자는 Promise를 기다리기 위해 사용됩니다. 이는 async function 내부에서만 사용될 수 있습니다.

await은 Promise가 fulfill되기를 기다렸다가, 해당 값을 리턴합니다.
 
* await
프로미스의 값을 리턴. 
Returns the fulfilled value of the promise, or the value itself if it's not a Promise.
* then
then() method returns a Promise
-> 프로미스 책을 더 읽어봐야할듯 

>동기로 돌아야할 경우와, 비동기로 돌아야할 경우를 잘 나누어 코딩하는게 매우 중요하다 !

async_await 지옥을 만들지 말고, 함수에 다형성을 높여서 동기/비동기를 모두 관리할 수 있도록 해주자


---

## `reduce()`가 Promise를 다루기위한 임시방편
Promise안에 있는 것을 `.then()`으로 꺼낸 데이터는 모두 coll(컬렉션)이라는 가정하에 `reduce()`함수를 개선 시켜보자

* 인자로 Promise가 들어왔을 때. 임시방편으론 `async_await`를 사용해볼 수 있다. 하지만 이방법은 끝이 없음...
* 함수에 `async`키워드를 다는순간, 함수안에서 아무일도 하지 않아도 Promise를 반환한다 (비동기가 일어나는것) -> 기존의 `reduce()`는 동작 X
```js
async function reduce(f, coll, acc) {
  var iter = collIter(await coll);
  acc = acc === undefined ? iter.next().value : acc;
  for(const v of iter) {
    acc = f(acc, v);
  }
  return acc;
}

(async function() {
  console.log(
    await reduce((a, b) => a + b, Promise.resolve([1,2,3,4]))
  );
})(); // 10

console.log( reduce((a, b) => a + b, [1,2,3,4]) ); 
// Promise {<pending>} --> 기존의 reduce동작 X
```

* 비동기처리는 성능적으로 비싼 일이다  
* 동기와 비동기를 동시에 지원하기 위해 모든 것을 프로미스로 다루겠다는 생각 -> 콜스택이 비워지질 않음 -> 엄청느려짐  
ex) 대부분의 요즘 라이브러리들이 동기여도 비동기로 다루는 코드가 많기 때문에, 내가 모르는 사이에 프로그램이 느려지곤 한다

---

## `reduce()`에 Promise 다형성 추가
>1. `coll`인자가 프로미스인 경우
>2. 보조함수가 프로미스인 경우
>3. 최초의 `acc`가 프로미스인 경우 


### 1. `then()`: `coll`이 프로미스인 경우
`reduce()`가 인자로 프로미스를 받을 수 있도록 개선

```js
const then1 = f => a => a instanceof Promise ? a.then(f) : f(a);
const then2 = (f, a) => a instanceof Promise ? a.then(f) : f(a);

then1(console.log)(10); //10
then1(console.log)(Promise.resolve(10)); //10
then2(console.log, 10); //10
then2(console.log, Promise.resolve(10)); //10
```
```js
function reduce(f, coll, acc) {
  return then2(function(coll) { // --> 1.
    const iter = collIter(coll);
    acc = acc === undefined ? iter.next().value : acc;
    for(const v of iter) {
      acc = f(acc, v);
    }
    return acc;
  }, coll);
}

reduce2((a, b) => a + b, Promise.resolve([1,2,3]))
.then(console.log) // 6 

(async function() {
  console.log(
    // --> await: Promise의 값을 반환
    await reduce2((a, b) => a + b, Promise.resolve([1,2,3]));
  );
})(); // 6
```


### 2. 보조함수가 비동기일 경우 해결 -> 재귀

>재귀의 공식
>1. 재귀를 돌리고자 하는 구간을 함수로 싼다
>2. 즉시실행 한다 (처음돌때 값 acc넣어줘)

```js
function reduce(f, coll, acc) {
  return then2(function(coll) {
    const iter = collIter(coll);
    acc = acc === undefined ? iter.next().value : acc;
    return function recur(acc) { // acc: then에서 풀어준, 2번째 for루프이후의 인자
      for (const v of iter) {
        acc = f(acc, v);
        if (acc instanceof Promise) return acc.then(recur);
      }
      return acc;
    } (acc); // acc: 1번째 for루프의 인자
  }, coll);
}

console.log( reduce((a, b) => a + b, [1,2,3])); //6

reduce(
  (a, b) => Promise.resolve(a + b),
  [1,2,3])
  .then(console.log) //6
  
reduce(
  (a, b) => Promise.resolve(a + b),
  Promise.resolve([1,2,3]))
  .then(console.log) //6
```

### 3. 최조의 `acc`가 프로미스인 경우

```js
function reduce(f, coll, acc) {
  return then2(function(coll) {
    const iter = collIter(coll);
    acc = acc === undefined ? iter.next().value : acc;
    return then1(function recur(acc) { //--> then1(): acc가 프로미스인지 체크
      for (const v of iter) {
        acc = f(acc, v);
        if (acc instanceof Promise) return acc.then(recur);
      }
      return acc;
    })(acc); 
  }, coll);
}

reduce(
  (a, b) => Promise.resolve(a + b),
  Promise.resolve([1,2,3]),
  Promise.resolve(10))
  .then(console.log) //16
```
---

### `==` vs `===`
`coll.constructor == Object`
`acc === undefined`

---

# 4강. 명령형으로 map, filter의 Promise 다형성 구현, Promise의 규칙 

## 1. map, filter를 명령형으로 짜보기
```js
function map(f, coll) {
  const res = [];
  const iter = coll[Symbol.iterator]();
  return function recur() {
    for(const a of iter) {
      const b = f(a);
      if (b instanceof Promise) {
        return b.then(function(b) {
          res.push(b);
          return recur();
        })
      } else {
        res.push(b);
      }
    }
    return res;
  } ();
}

function filter(f, coll) {
  const res = [];
  const iter = coll[Symbol.iterator]();
  return function recur() {
    for(const a of iter) {
      const b = f(a);
      if (b instanceof Promise) {
        return b.then(function(b) {
          if(b) res.push(a);
          return recur();
        })
      } else {
        if(b) res.push(a);
      }
    }
    return res;
  } ();
}

console.clear();

map(a => Promise.resolve(a + 100), [1,2,3]).then(console.log) // [101,102,103]
filter(a => Promise.resolve(a > 2), [1,2,3]).then(console.log) // [3]
```

Test Case를 다 통과하는 추상화된 함수 `reduce()`를 하나 만들어 놓고 나면,
* 보조함수를 붙여서 애플리케이션에 필요한 기능별 함수들을 만들 수 있을 뿐만아니라
* 동기/비동기를 모두 같은 코드로 처리할 수 있다

이러한 추상도 높은 함수세트를 제작해논 이후엔 두가지 규칙만 지키면 된다
1. `await`가 코드에 나오지 않도록 짜야하고
2. 모든함수가 연속적으로, 중첩적으로 실행되게 하면된다


## (중요) 프로미스는 중첩되있더라도, 단 한 번의 then으로 값을 꺼낼 수 있다
* then은 프로미스가 모두 완료되길 기다렸다가 값을 꺼낸다 
* `reduce()`, `map()`, `filter()`모두다 이 법칙 기반으로 동작하는 것.
* `then2()`안에 아무리 많은 프로미스가 있더라도, 이들이 모두 완료되길 기다렸다가 값을 꺼낸다
* `setTimeout()`, `setInterval()` 비동기함수를 걸어도 then은 동작한다

```js 
// 이 법칙을 기반으로 then(), reduce() 함수들이 만들어진다
const then2 = (f, a) => a instanceof Promise ? a.then(f) : f(a);

Promise.resolve(10)
  .then(a => a + 10)
  .then(a => a + 10)
  .then(a => a + 10)
  .then(console.log) // 40
  
then2(console.log, Promise.resolve(10)
  .then(a => a + 10)
  .then(a => a + 10)
  .then(a => a + 10)
  .then(console.log) // 40 
)


new Promise(function(resolve) {
  resolve(Promise.resolve(Promise.resolve(Promise.resolve(10))))
}).then(a => a + 100)
  .then(console.log) // 110


new Promise(function(resolve) {
  resolve(new Promise(function(resolve) {
    setTimeout(function() {
      resolve(10)
    }, 1000)
  }))
}).then(a => a + 1000)
  .then(console.log) // 1010


then2(console.log, new Promise(function(resolve) {
  resolve(new Promise(function(resolve) {
    setTimeout(function() {
      resolve(10)
    }, 1000)
  }))
}).then(a => a + 1000)) // 1010
```

* 프로미스를 기반으로 돌아가는 async...await
* 프로미스는 일급객체로서 여러함수의 인자로 전달 될 수 있어, then으로 꺼내 쓸 수 있다  
-> 함수형 프로그래밍에서의 비동기는 관리하는 모나드와 같음

>이처럼 Promise를 얼마나 아느냐가,  
자바스크립트에서 동시성을 얼마나 다루느냐의 거의 전부라 할 수 있다

---

# 5. reduce로 map 구현, reduce에 Promise 다형성 추가

1. reduce로 map 구현
2. 사용하지 않는 b를 줄여 코드를 간결하게
3. `push()`: 배열에 요소를 집어넣는 보조함수  
`return a, b; // b` -> 원리를 이용
4. 가독성이 좋은 비동기제어를 위한 `thenR()`

```js
const push = (arr, v) => (arr.push(v), arr);
const thenR = (a, f) => a instanceof Promise ? a.then(f) : f(a);
const map = (f, coll) => reduce5((res, a) => thenR(f(a), b => push(res, b)), coll, []);

map(a => Promise.resolve(a + 1000), [1, 2, 3]).then(console.log); // [1001, 1002, 1003]
```

---

# 6. reduce로 filter 만들기, map에 PlainObject 다형성 추가 (26분 9초)

## 함수형 프로그래밍에서의 인자 이름
* 인자이름을 a -> b -> c 로 써주면 흐름을 따라가면서 읽기가 편해진다
* 요즘 filter의 보조함수를 `predi`보단 `f`로 함수이름 짓는편이다
* 인자이름을 의미에 맞게 짓는것 보다, `a, b, c`같은 규칙적인 인자이름에 익숙해지면 코드를 읽기 편하고 이해하기 쉽다
```bash
ex) `ramda.js`문서의 인자 이름 규칙
ex) `f(a) => b` a를 함수로 돌려 b를 만든다
```

## 1. 명령형으로 짠 `filter()` vs 함수형
얼마나 코드가 간결해졌는지 알 수 있다
```js
//1. 명령형으로 짠 filter
function filter(f, coll) {
  const res = [];
  const iter = coll[Symbol.iterator]();
  return function recur() {
    for(const a of iter) {
      const b = f(a);
      if (b instanceof Promise) {
        return b.then(function(b) {
          if(b) res.push(a);
          return recur();
        })
      } else {
        if(b) res.push(a);
      }
    }
    return res;
  } ();
}

//2. 함수형으로 짠 filter
function filter(predi, coll) {
  return reduce5((res, a) => thenR(predi(a), b => b ? push(res, a) :res), coll, []);
}

console.log(filter(a => a % 2, [1,2,3,4])); //[1, 3]
filter(a => Promise.resolve(a % 2), [1,2,3,4]).then(console.log); //[1, 3]
```

* 이정도 수준은 underscore.js 정도 (배열뿐만아니라 객체도 지원)  
-> 하지만,  underscore.js는 프로미스까지 해결은 못한다. 우리는 가능하다 짱이다!!!
* 객체를 객체로 반환할 수 있게

## 2. 리팩토링: 배열과 객체형 `coll`을 각각 지원하도록
1. `isPlainObject()`: plain object인지 확인
2. `entriesIter()`를 활용하여 객체는 객체로 반환하도록 개선  
반환값이 [k, v]인것을 응용
3. `set()`함수로 mapping된 k, v를 res에 넣어주도록
4. 삼항연산자로 리팩토링
```js
function *entriesIter(obj) {
  for(const k in obj) yield [k, obj[k]];
}

const isPlainObject = obj => obj.constructor == Object;
const push = (arr, v) => (arr.push(v), arr);
const set = (obj, k, v) => (obj[k] = v, obj);

function map8(f, coll) {
  isPlainObject(coll) ?
    reduce(
      (res, [k, a]) => thenR(f(a), b => set(res, k, b)),
      entriesIter(coll),
      {}) :
    reduce(
      (res, a) => thenR(f(a), b => push(res, b)), 
      coll, 
      []);
}

```

>도큐먼트보다 코드나 테스트케이스를 읽어보면 공부가 많이 된다  
>ex) underscore.js testcase

---

# 7강 filter의 다형성 높이기, map과 filter 리팩토링, gen 함수 ()

## for...of 중단 문제

## `collIter()` 리팩토링
* 문제의 보다 직접적인 원인을 찾기위해  
-> coll이 Plain Object인지를 보기 보단, `[Symbol.iterator]`가 구현되어있는지를 판별기준으로 보자
```js
console.log( map8(a => a + 100, {a: 1, b: 2, c: 3, d: 4}) ); //{a: 101, b: 102, c: 103, d: 104}
map8(a => Promise.resolve(a + 100), {a: 1, b: 2, c: 3, d: 4}).then(console.log); //{a: 101} --> 오작동
```
-> 여전히 비동기코드에서는 for...of가 1번 동작하고 종료되어 버리는 현상을 볼 수 있다  
-> 문제는 제너레이터로 만든 이터러블 객체이다

>[return() terminates the generator](http://exploringjs.com/es6/ch_generators.html#_return-terminates-the-generator)  
>close iterators: return() performs a return at the location of the yield that led to the last suspension of the generator.

## `gen()`: 제너레이터를 위임해주는 래퍼함수
* 제너레이터들을 `gen()`으로 감싸준다



## `reduce, filter` 리팩토링
`collIter()`를 리팩토링할때처럼, `coll`을 판단하는 기준을 "Plain Object인지 -> `[Symbol.iterator]`가 구현되있는지"로 보도록

```js
const map8 = (f, coll) =>
  coll[Symbol.iterator] ?
    reduce5(
      (res, a) => then2(f(a), b => push(res, b)), 
      coll, 
      []) :
      reduce5(
      (res, [k, a]) => then2(f(a), b => set(res, k, b)),
      entriesIter(coll),
      {}) ;


const filter5 = (f, coll) => 
  coll[Symbol.iterator] ? 
    reduce5(
      (res, a) => then2(f(a), b => b ? push(res, a) : res), 
      coll, 
      []) :
      reduce5(
      (res, [k, a]) => then2(f(a), b => b ? set(res, k, a) : res),
      entriesIter(coll),
      {}) ;
```

## `hasIter()`
함수들의 이터레이터 있는지 여부를 체크해주는 중복코드 제거  
-> 코드가 간결해질뿐만아니라, 의미가 명확해져 가독성도 좋아진다
```js
const hasIter = coll => !!(coll[Symbol.iterator]);
```

## `baseMF()`: map, filter를 만들 베이스함수
f1, f2: map을 만들기위한 보조함수(구조)
f: 사용자가 전달한 함수. 무엇으로 mapping, filter 할것인지 조건함수


아래 코드가 왜 이렇게 돌아가는지 정확히 알았습니다.

for...of 는 내부적으로 for of 가 종료된 후에 받아둔 iterator에 .return() 이 구현되어있다면 .return() 을 실행하도록 되어있네요. 그래서 return으로 for...of를 빠져나가면 .return()을 실행하므로 그렇게 됩니다. 근데 여기서 비동기가 안일어나면 .return()이 실행되기전에 재귀가 먼저 종료되므로 문제가 안생기고 비동기가 일어나면 .return()이 먼저 실행되어, iter.next()가 { done: true }가 되도록 되어있어 더이상 for...of로 순회가 불가능합니다.

그래서 제너레이터로 만든 결과를 return()이 없는 객체로 감싸서 위임하도록 하거나, 파격적으로 .return에 null을 대입해버리는 방법이 있습니다.

조현우님께서 보내주신 for of를 es5로 구현한 코드를 보고 알게 되었습니다. 


에러가 발생했을때 이터레이터를 종료시켜서 제너레이터 객체 자체를 언능 날려버릴 수 있게 하기 위한 목적


---
# 문제 해결 삽질 ! (푸걱)

## 보조함수가 프로미스일때, coll에 Promise.resolve(obj)를 받지 못하는 문제

```js
reduce6(
  (a, b) => Promise.resolve(a + b),
  Promise.resolve({a:1,b:2,c:3})).then(console.log) //3 --> 문제있음
  
reduce6(
  (a, b) => Promise.resolve(a + b),
  {a:1,b:2,c:3}).then(console.log) //3 --> 문제있음
  
reduce6(
  (a, b) => Promise.resolve(a + b),
  [1,2,3]).then(console.log) //6 --> 정상동작
  
reduce6(
  (a, b) => a + b,
  Promise.resolve({a:1,b:2,c:3})).then(console.log) //6--> 정상동작
```


보조함수가 프로미스이면, for문의 `acc = f(acc, v)`의 값은 프로미스이기 때문에 재귀가 일어난다. 

### 이 때, 
1. `coll`이 "배열/배열담은 Promise"일 땐, 재귀를 돌렸을때 for문이 그 자리에서 다시 진행되지만
2. `coll`이 "객체/객체담은 Promise"일 땐, 재귀를 돌렸을때 for문이 종료되어있다  
-> for루프는 종료된 상태이기 때문에 for루프를 1회밖에 순회하지 못한 acc(누적값)이 반환값이 된다

### for루프가 종료되어 있는 이유는 무엇일까?
* 배열역시 제너레이터로 만든 객체이면 오작동한다  
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

## 해결책
>"버그인지는 모르겠는데, generator가 만든 iterator는 for of에 promise가 돌아가면 아예 끝내버린다."

### Generator의 기본동작
* 제너레이터는 제너레이터 객체를 반환한다
  * 제너레이터 객체는 for-of 루프로 순회할 수 있으며 -> 이터러블(iterable)이면서
  * next() 메소드를 가지고 있다 -> 동시에 이터레이터(iterator)이다
* 제너레이터 함수는 호출되어도 즉시 실행되지 않고, 대신 함수를 위한 Iterator 객체(일종의 pointer)가 반환한다
* Iterator의 next() 메서드를 호출하면 제너레이터 함수가 실행되어 yield문을 만날 때마다 value, done 프로퍼티를 갖는 객체를 반환한다

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



### 해결책

1. 제너레이터로 만든 결과를 `.return()`이 없는 객체로 감싸서 위임하도록 하거나  
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

```js
// 해결책
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

---


# 질문 ~.~

## Q: well-formed iterable이 가지는 장점이 있을까요 ?
제너레이터로 생성한 이터러블만 자기자신을 반환하는 well-formed이고,  
기본적으로 내장 iterator를 가지고 있는 "Array, String, NodeList..." 같은 애들은 well-formed가 아닌것 같은데...  

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
* Array 역시도 well-formed가 맞음. 위의 테스트가 잘못되었음
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
```js
const collIter = coll =>
  hasIter(coll) ? // [Symbol.iterator]를 가지고 있다면
    coll[Symbol.iterator]() : // 실행시켜줘야 -> 이터레이터가 된다
    valuesIter(coll); // 제너레이터는 호출하는 순간 실행 -> 이터레이터가 된다
```

### `Well-formed Iterable`가 유용한이유
>[Iterators that are iterable](
http://exploringjs.com/es6/ch_iteration.html#_iterators-that-are-iterable)  
Why is it useful if an iterator is also an iterable? for-of only works for iterables, not for iterators. Because Array iterators are iterable, ***you can continue an iteration in another loop***  

* Iterator이면서 Iterable인 객체를 `"잘정의된(well-formed) Iterable"`라고 부른다
* 제너레이터가 만들어주는 제너레이터객체는 `well-formed Iterable`  
* This is Why ES6 generators are usually much more convenient !

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
} 
// 1

for(const v of fibonacci) {
  console.log(v);
} 
// 1 2 3 5 8 -> Restart iterator



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
} 
// 1

for(const v of fibonacciW) {
  console.log(v);
} 
// 2 3 5 8 -> Continue with same iterator
```
```js
// 훈일님 노트 
var iter = (count = 0, length) => ({
  [Symbol.iterator]() {
    return {
      next() { return { value: count++, done: count > length }; }
    };
  }
});

var iterW = (count = 0, length) => ({
  [Symbol.iterator]() { 
    return this 
  },
  next() {
    return { value: count++, done: count > length };
  }
});


var iterObj = iter(0, 5);
var iterWObj = iterW(0, 5);

for (const v of iterObj) {
  console.log(v);
}

for (const v of iterWObj) {
  console.log(v);
}
```

## 결론  
* Array, String, Map, Set, NodeList는 `[Symbol.iterator]`를 내장메서드로 가지고 있기때문에 기본적으로 Iterable하다.  
* 하지만 well-formed Iterable로 동작하기 위해선 `[Symbol.iterator]()`를 한 번 실행시켜줘야한다

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