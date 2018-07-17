# 1강. map, filter 계열 함수 만들기

## # `values()`: 값을 추출하는 함수 (다형성 지원)
객체 안의 값들만 꺼내는 함수. ES8 `Object.values`보다 다형성을 더 지원할 수 있도록
* ES8 `Object.values`
  * 객체의 값만 추출가능
  * 내부적으로 for...in처럼 순회하기 때문에 Set, Map에 사용불가
  
### 1. 기본
```js
const values1 = coll => map(a => a, coll);

console.log( values1( new Set([1, 2, 3, 4]) ) ); 
// [1, 2, 3, 4]
console.log( values1( new Map([['a', 1], ['b', 2]]) ) ); 
// [["a", 1], ["b", 2]] --> 오작동

```
기존의 `map()`함수를 이용하면 Set은 잘 동작하지만, Map은 디폴트 `[Symbol.iterator]`로 entries를 사용하기 때문에 객체형태로 출력된다
```js
Map.prototype[Symbol.iterator] // ƒ entries() { ... }
Set.prototype[Symbol.iterator] // ƒ values() { ... }
```
### 2. Map이 들어오면 `[Symbol.iterator]`로 values를 사용하도록
```js
const values2 = coll =>
  coll instanceof Map ?
  map(a => a, coll.values()) :
  map(a => a, coll);

console.log( values2( new Map([['a', 1], ['b', 2]]) ) );
// [1, 2]
console.log( values2( { a: 1, b: 2 } ) );
// {a: 1, b: 2} -> 값만 추출해야함
```
### 3. Plain Object도 지원할 수 있도록
```js
const values3 = coll =>
  coll instanceof Map ?
  map(a => a, coll.values()) :
  map(a => a, collIter(coll));

console.log( values3( { a: 1, b: 2 } ) );
// [1, 2] -> OK ! collIter에서 valuesIter() 동작
```

### 4. 완성
`values()`는 단순히 값을 추출하는 역할을 넘어, 값을 평가하는 확장성 있는 함수이다
```js
const values = coll =>
  map( identity, coll instanceof Map ? coll.values() : collIter(coll) );

console.log(
  values(function *() {
    yield 1;
    yield 2;
    yield 3;
  } ())
);
// [1, 2, 3] -> 값을 평가하는 확장성
```

---

## `entries()`: key, value를 추출하는 함수
```js
const entries = coll => {
  // hasIter(coll) ? coll.entries() : entriesIter(coll);
  return map(a => a, hasIter(coll) ? coll.entries() : entriesIter(coll))
}

console.log( entries([1, 2]) );
// [[0, 1], [1, 2]]
console.log( entries({ a: 1, b: 2 }) );
// [["a", 1], ["b", 2]]
console.log( entries(new Map([['a', 1], ['b', 2]])) );
// [["a", 1], ["b", 2]]
```

---

## `reject()`: falsy한 값을 추출하는 함수
* reject는 falsy한 값을
* filter는 truthy한 값을 추출

1. filter를 활용하여 falsy한 값을 뽑는 함수 만들어보기
```js
const reject = (f, coll) => filter(a => !f(a), coll);

console.log(filter(a => a % 2, [1, 2, 3, 4])); // [1, 3]
console.log(reject(a => a % 2, [1, 2, 3, 4])); // [2, 4]
```

2. 보조함수에서 프로미스를 리턴했을 때, `!f(a)` 값을 부정할 수 없는 문제  
-> 비동기가 일어날 수 있는 곳이라면 한가지 값에 하나의 평가만 이루어지도록하자

* `not()`  
보조함수 `f(a)`의 값을 then함수로 동기/비동기 모두 평가할 수 있도록  
```js
const not = a => then2(a, a => !a);
const reject = (f, coll) => filter(a => not(f(a)), coll);

filter(a => Promise.resolve(a % 2), [1, 2, 3, 4]).then(console.log);
// [1, 3]
reject(a => Promise.resolve(a % 2), [1, 2, 3, 4]).then(console.log);
// [2, 4]
```

* filter가 다형성을 지원하면 reject역시 당연히 다형성을 지원하는 범위가 늘어날 뿐만아니라
* 위에있는 부모격의 함수가 수정되었을때, 자식 함수가 오작동할 리가 없다는 보장


## `compact()`: truthy한 값만 남게하는 함수
```js
const compact = coll => filter(a => a, coll);

console.log(compact([ 0, false, {}, 10, null ])); // [{ }, 10]
```

### 의존성이 없는 함수형프로그래밍
형을 정확히 다루면서. 계열중심의 함수(map, filter..)들을 사용하여 함수형 프로그래밍을 하면  
-> 계층구조가 있는 함수라도 서로 절대 의존성이 없다는 보장을 할 수 있다 
* 반면에, 객체지향에선 상위 객체를 고치면 하위의 객체들은 거의 영향을 받는다


---


# 2강. 코드를 컬렉션으로 다루기 - go, pipe, curry, 실무적 사례

## `go()`: 함수세트를 중첩적으로 실행시켜 **값**을 리턴
* 부모함수 reduce가 비동기 지원하기 때문에, 비동기문제를 신경쓰지 않아도 된다
* then보다 쉬운 go  
then2는 함수를 하나만, go는 여러 함수를 중첩적으로 받을 수 있기때문에 확장서이 더 크다 (비동기까지 되닌깐 then은 빠이~~)  
* reduce가 acc가 공백일 경우 coll의 첫번째 인자를 acc로 쓰기 때문에 인자 네이밍을 더 간단하게 할 수 있다  
`(arg, ...fs)` -> `(...coll)`

```js
/*
const go = (arg, ...fs) => reduce((arg, f) => f(arg), fs, arg); */
const go = (...coll) => reduce((arg, f) => f(arg), coll);

go(Promise.resolve(10),
  a => a + 10,
  a => Promise.resolve(a + 10),
  console.log); // 30
```

## `pipe()`: 함수세트를 중첩적으로 실행시킨 **함수**를 리턴
go와다르게 인자는 받지않고, 함수만 받는다 -> 함수리턴

### 1. `go()`를 활용
`go(arg, ...fs)`를 쓰면 pipe에서 받은 fs를 한 번 더 펼쳐줘야한다.
`go(arg, fs)`로 쓰면 "arg, [f, f, f]" 배열 뭉치로 들어
```js
const pipe = (...fs) =>
  arg => go(arg, ...fs); // 함수를 리턴
//arg는 리턴된 함수가 나중에 받을 인자
```
* 함수를 리턴해야하면, 화살표를 한 번 더 쓰면되 (심플하게 생각하자)
* go를 활용할 수도 있겠지만, spread연산자를 써서 배열의길이가 만오천개이상되면 maximum callstack에러가 날 수도 있음  
(아마 이걸해본사람은 없을거야. 그러면 변태야. 나해봄 ㅠㅠ 20000까지는 되는데 30000부터 안됨)

### 2. `reduce()`를 활용하여, spread연산자를 쓰지 않도록
이렇게 하면 절대 콜스택 에러 안난다 ^^
```js
const pipe2 = (...fs) => arg => reduce((arg, f) => f(arg), fs, arg);
```

### 3. `call(), call2()`: 함수를 호출하는 함수
둘을 이용하여 `go()`, `pipe()`의 코드를 간결하게 만들어보자 
```js
const call = (f, a) => f(a);
const call2 = (a, f) => f(a);

const go = (...coll) => reduce(call2, coll);
const pipe = (...fs) => arg => reduce(call2, fs, arg);
```

---

### Rest vs Spread Opreator
> Rest operator와 Spread opertor는 생김새는 같지만 명확히 반대의 기능이다.

* Rest operator: *iterable -> collection*  
collects the remaining items of an iterable into an Array and is used for rest parameters and destructuring.
* Spread operator  : *collection -> iterable*  
turns the items of an iterable into arguments of a function call or into elements of an Array

`for-of loop` & `Spread operator` only works for iterable values

"Array-like or Object(has property length)", you can use `Array.from()` to convert it to an Array
```js
// Example
const arrayLike = {
    '0': 'a',
    '1': 'b',
    '2': 'c',
    length: 3
};

const arr2 = Array.from(arrayLike); // ['a', 'b', 'c']
```

---

### 인자가 없는 함수?
* 객체지향에선 인자가 적을수록 좋다고도 얘기하지만
* 함수형프밍에선 인자가 없으면 부수효과가 있을수 있다는 **의심**을하고봐야한다
```js
// 함수형에서 유일하게 인정해주는 인자가 없는 함수
const always10 = _ => 10;
const noop = _ => undefined;
```

## `curry()`: 함수의 인자를 받는 방식을 다양하게 만들어 주는 함수
curry가 있다면 함수들을 인자를 받는 방식을 다양하게 만들어 줄 수 있다  
```js
const curry = f => (a, ..._) =>
  _.length == 0 ? (..._2) => f(a, ..._2) : f(a, ..._);

var add = curry((a, b, c) => a + b + c);
console.log(add(10, 10, 10));
console.log(add(10)(10, 10));
```
-> 일반적으로 보기에 `( , )` 이런식으로 인자를 받는게 `( )( )` 이것보다 피곤하다고 생각한다

### `curry()`를 활용한 cmap, cfilter  
`coll`은 go함수를 통해 내려오면 받을것이니, 보조함수만 먼저 인자로 넣어 둘 수 있게된다  
기존의 map, filter를 사용하는 것 보다 코드가 깔끔해진다
```js
const cfilter = curry(filter);
const cmap = curry(map);

var nums = [1, 2, 3, 4, 5, 6];
go(
  nums,
  nums => filter(a => a % 2, nums), //[1, 3, 5]
  nums => map(a => a * 2, nums), //[2, 6, 10]
  log
);

go(
  nums,
  cfilter(a => a % 2),
  cmap(a => a * 2),
  log
)
```

---

## `curry(), go()`로 `baseMF()` 리팩토링
* `curry()`로 리팩토링 하면 기존의 map, filter이 인자를  
  * `map(f, coll)`로 한 번에 받던 방식뿐만아니라,  
  * `map(f)(coll)`로 coll은 나중에 받는 방식도 가능해진다
* `go()`로 `then2()`를 대체하면 코드가 간결해진다  

```js
/*
const baseMF = (f1, f2) => curry((f, coll) =>
  hasIter(coll) ? 
    reduce((res, a) => then2(f(a), b => f1(res, a, b)), coll, []) :
    reduce((res, [k, a]) => then2(f(a), b => f2(res, k, a, b)), entriesIter(coll), {}));*/
  
const baseMF = (f1, f2) => curry((f, coll) =>
  hasIter(coll) ? 
    reduce((res, a) => go(a, f, b => f1(res, a, b)),  coll, []) :
    reduce((res, [k, a]) => go(a, f, b => f2(res, k, a, b)), entriesIter(coll), {}));

const map = baseMF(
  (res, a, b) => push(res, b),
  (res, k, a, b) => set(res, k, b));

const filter = baseMF(
  (res, a, b) => b ? push(res, a) : res,
  (res, k, a, b) => b ? set(res, k, a) : res);
  
var nums = [1, 2, 3, 4, 5, 6];

// 인자받는 방법 1.
go(
  nums,
  nums => filter(a => a % 2, nums),
  nums => map(a => a + 10, nums),
  log
)

// 인자받는 방법 2.
go(
  nums,
  filter(a => a % 2),
  map(a => a + 10),
  log
)
//[11, 13, 15]
```

개발자로서 사용자의 입장에 있으면, underscore, lodash의 체이닝이 편할 수 없다
하지만 여기서 지원하지 않는 기능이 있다면, 이게 어떻게 동작하는지 알고 mixin을 덧데어줄 수 있다

### filter와 map을 활용한 함수들 리팩토링
`curry()`로 `baseMF()`를 리팩토링한 후엔, filter와 map이 인자를 방식이 다양해진다. 이를 바탕으로 filter와 map을 활용한 함수도 리팩토링 해본다

```js
/*
const compact = coll => filter(a => a, coll);*/
const compact = filter(identity);
```

---

## `go()`로 `reject()`를 리팩토링하면서, `not()`를 단순한함수로
### `reject()`의 보조함수 리팩토링
```js
not(f(a))
go(a, f, not)
```
* 코드해석이 쉬워질 뿐만아니라
* `go()`가 reduce로 빌드되었기 때문에 비동기 처리를 할 수 있으므로  

### `not()`함수가 비동기대응을 하지 않는, 단순히 값만 부정하는 함수가 될 수 있다
```js
/* 
const not = a => then2(a, a => !a);
const reject = (f, coll) => filter(a => not(f(a)), coll); */

const not = a => !a;
const reject = (f, coll) => filter(a => go(a, f, not), coll);
```

---

>이런식으로 함수를 짜놓으면, 조합해서 쓰면서  
>내 코드의 어디에도 비동기가 나타지 않기 때문에  
>비동기처리에 골머리 쓰지않고, **코드를 해결하는 것에만 사고**를 하면된다

### 함수형프밍은 대입문이 없는 프로그래밍이다
* 대입이생기면 문장이 생기고,  
* 문장이 생기면 부수효과가 생겨 오류가 생길 여지가 생기는데,  
* **함수형은 부수효과를 일으키지 않는 컨셉이 중점이다 !! -> 항상 동일하게 동작하는 프밍**
* 부수효과가 없는 함수들을 조합해서만, 대입도 문장도 만들지 않으며 코드를 짠다

---

## `negate()`: 함수를 반대로 동작하게하는 함수
> negate [동]: 무효화하다, 효력이 없게 만들다

* reject의 보조함수는 go와 pipe로 리팩토링할 수 있다
* 함수를 반대로 동작하게 하는 `pipe(f, not)`을 `negate()`로 묶어보자
```js
const reject = (f, coll) => filter(a => go(a, f, not), coll);
const reject = (f, coll) => filter(pipe(f, not), coll);

const negate = f => pipe(f, not);
const reject = (f, coll) => filter(negate(f), coll);
```

----

# 3강

## `findVal()`: 원하는 값을 찾아 중간에 break

* 이곳에서도 역시 undefined가 구분자가 된다
* 멈추어야하는 함수를 만드는 뼈대가 될 함수 (부모함수)이기 때문에, 비동기 제어 가능하게 하면 이후에 자식함수들을 만들기 편해진다


### 동작방식

동기
1. `a > 4` 조건에 true라 `res = '끗'`이면 
2. go로 들어가서 `'끗'`이 반환된다

비동기 대응 -> 재귀, `go()`
1. res가 프로미스인 경우 (Promies는 undefined가 아니라는 사실하에)
2. go로 들어가서 프로미스에 값이 차있다면 그 값을 반환하고, undefined라면 다음 iter를 확인하기위해 재귀를 돈다

```js
const findVal2 = (f, coll) => {
  const iter = collIter(coll);
  return function recur(res) { // res 선언
    for (const a of iter) {
      res = f(a);
      if (res !== undefined) //--> 1
        return go(res, res => res !== undefined ? res : recur()); //--> 2
    }
  } ();
};

findVal2(a => Promise.resolve(a > 4 ? '끗' : undefined), nums).then(log); // 끗
```

## `find()`: 원하는 값을 찾으면, 그 값을 리턴
```js
/*
const find1 = (f, coll) => findVal2(a => f(a) ? a : undefined, coll);*/
const find2 = (f, coll) => findVal2(a => go(a, f, bool => bool ? a : undefined), coll);

console.log(find2(a => a > 5, nums));//6 동기
find2(a => Promise.resolve(a > 5), nums).then(log); //6 비동기
```

## `none()` : 참인 값이 하나도 없는지 T/F
## `some()` : 참인 값이 하나라도 있는지 T/F
```js
const isUndefined = a => a === undefined;
const none = (f, coll) => go(find(f, coll), isUndefined);
const some = (f, coll) => go(none(f, coll), not);

log( none(a => a > 10, nums) ); // true
log( some(a => a > 10, nums) ); // false
some(a => Promise.resolve(a > 10), nums).then(log); //false
```

## `every()`: 거짓 값이 하나도 없는지 T/F 
즉, 모든 값이 참인지를 검사
* `negate()`: 함수를 반대로 동작하게하는 함수
* none의 보조함수 반대로 뒤집기  
`f` -> `negate(f)` (해당되는 값이 있는지 -> 해당 안되는 값이 있는지)
```js
const every = (f, coll) => go(find(negate(f), coll), isUndefined);

log( every(a => a > 10, nums) ); // false
log( every(a => a < 10, nums) ); // true
```

----

# 4강. 병렬적으로 동시성 다루기 - mapC, 배경 및 개요

>지금까지는 순서대로 돌아가는 함수를 제어했다면, 이제부터는 병렬적으로 일처리를 하는방법을 배울거다 (어려움)

## 자바스크립트 비동기의 아름다운 이유?
### 1. 브라우저를 안 죽게한다  
서버에 오래걸리는 작업을 요청했을 때 -> 알아서 비동기적으로 처리하기 때문에, 브라우저 기본 기능(스크롤, 클릭..)을 문제 없이 사용할 수 있다  
*-> iphone개발일 경우 데이터를 가져오는 thread를 따로 열어서 병렬적으로 작업해야, 기본 기능에 문제가 안생긴다*
### 2. 서버의 요청처리 방식
>노트 그림 Time
* 기존의 서버 (Multi Thread)
  * 한 user에, 하나의 thread를 할당 (비쌈)
  * 요청을 처리하는 동안 나머지 CPU는 놀고있음
  * 보통 컴퓨터 한 대가, 500명 정도만 동시 처리가능
* NodeJS (Single Thread)
  * 모바일 웹세계가 시작되면서 서버트래픽이 급증하여 기존의 서버시스템으로 감당이 힘들어짐
  * 하나의 Thread를 분할해서 병렬적으로 일을 처리  
  * CPU가 노는부분없이 다 일을하기 때문에, "500명 -> 2만명" 처리가 가능해짐  
  * JAVA서버보다 느릴지라도, 동시성을 잘 지원 (게임, 채팅, 페이스북 댓글 UX에서 아주 중요한 부분)
  * 프로그래머가 구간별로 동시성을 다룰 수 있게 동기/비동기 코드를 설계 관건  
    * 비동기가 일어나면 콜스택이 비워져 디버깅이 어려워지기 때문 (callback이 콜스택에서 WebAPI로 이동한다)  
    * 반면에 JAVA는 모든 I/O를 콜스택에 쌓기때문에, 디버깅이 쉽다
  
### 3. 함수형프로그래밍의 동시성
CPU는 더이상 물리적으로 빨라질 수 없기때문에, 거대한 트래픽처리를 위해 **언제 평가해도 상관없는 순수함수들**로 코드를 설계하여 CPU를 최대한 안놀게하려는 프로그래밍의 방향성이다

---


## `mapC`: 비동기작업을 병렬적으로 처리하는 map
>C의 의미: concurrency

* 기존의 map은 `f(a)`값이 프로미스이면, 그 값을 까서 재귀로 전달해주는 **순차적**처리 방식으로 시간을 많이 소요했지만
* 하지만 mapC는 비동기작업을 **병렬적**으로 처리하기 때문에, 기존의 map보다 훨씬 빠르다  
* ex) http2에서 이미지요청시, mapC로 여러개를 로드 해놓고 한 번에 **부드럽게** 그릴 수 있도록 해줌.

### 1. Promise.all을 사용하는 방법 -> Plain Object 지원 X
```js
function time(a) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(a);
    }, 1000);
  });
}

//1. Promise.all을 사용하는 방법 -> Plain Object 지원 X
const mapC1 = curry((f, coll) => {
  const res = [];
  for (const a of coll) {
    res.push(f(a));
  }
  return Promise.all(res);
});

go([1, 2, 3],
  map(time),
  log); // 3초


go([10, 20, 30],
  mapC1(time),
  log); // 1초
```


### 2. Promise들을 객체 안에 받아놓고 나중에 까주기 -> 배열/객체 모두 지원

1. 출발선상에서 모든 인자들을 프로미스로 만들어 세워놓는다
    * 프로미스 아닌척하기 위해 리턴값을 `{ }` 객체괄호 한 번 싸주면,
    * map의 reduce가 `acc`를 객체로 인지하기 때문에 (속았음 ㅋㅋ), 프로미스 값을 풀어서 `recur(acc)` 전달하기위한 시간소요를 하지 않아도 된다
2. 값이 다 모이면, 프로미스를 까주는 2번째 map함수를 실행시킨다

```js
const mapC2 = curry((f, coll) =>
  go(coll,
    map(a => ({ val: f(a) })), //--> 1. { a: { val: Promise(1) }, b: { val: Promise(2) } }
    map(b => b.val))); //--> 2. { a: 1, b: 2 }

go({ a: 1, b: 2 },
  mapC2(time),
  log); // 1초
```

### 3. `limit` 성능튜닝을 위해
* 근데 만약 coll이 너무크면, 오히려 성능이 안좋아지거나 서버가 죽을 수 있기때문에 `limit`을 걸어줘야한다

---

# 5강. 병렬적으로 동시성 다루기 - findValC

### Q: NodeJs가 Single Thread닌깐 Multi Thread를 쓰는 서버보다 느리지 않은가요 ?
예전엔 개개인이 0.1초라도 빠른게 중요했다. 하지만 요즘시대는 개개인이 빠른것보단, 조금 느리더라도 모든 유저가 동시성을 가질 수 있는게 중요하다. (모두가 평균적으로 적당히 빠르게)  

*ex) 페이스북에서 동시에 피드를 봐야 잼, 채팅서버에서 동시에 대화가 보여져야 대화가능*

* 코어를 하나 쓴다는 가정하에, 동시에 접속한 유저가 적을경우, JAVA나 컴파일언어로 만든 서버의 속도를 따라갈 수 없지만
* NodeJs는 2만명의 유저의 동시성을 지켜줄 수 있다는점에서 우수하다

## `findValC`: 비동기처리를 병렬적으로 처리하여 값을 찾기
* 기존의 findVal처럼 프로미스 값을 풀어서 `recur(acc)` 전달하기위한 시간소요를 하지 않도록, Promise내에 다 출발시켜 놓고 처음들어온 값을 리턴
* map계열의 함수보다, find계열의 함수에`limit`이 유용하다  
=> map은 모든 요소를 순회하며 mapping해야하지만, find계열 함수는 값을 찾으면 바로 함수를 종료할 수 있도록 **`limit` 필수**로 가져야한다

### 1. Promise.resolve에 처음 찾은 값을 Keep
Promise는 resolve에 처음으로 채워지는 값이 최종값이 된다. 그 이후의 resolve는 무시된다. for문을 돌며 처음으로 찾은 값을 프로미스에 Keep해두고, 루프가 종료되면 리턴해주자

```js
// 기존의 findVal
const findVal = (f, coll) => {
  const iter = collIter(coll);
  return function recur(res) { // res 선언
    for (const a of iter) {
      res = f(a);
      if (res !== undefined) 
        return go(res, res => res !== undefined ? res : recur());
    }
  } ();
};

const findValC = curry((f, coll, limit = Infinity) => {
  const iter = collIter(coll);
  return new Promise(resolve => {
    for (const a of iter) {
      go(a, f, b => b === undefined ? undefined : resolve(b));
    }
  });
});

go(nums,
  findVal(a => time(a > 3 ? "중간에 나옴" : undefined)),
  log); // 비동기의 순차적 실행 -> 3초 소요.
  
go(nums,
  findValC(a => time(a > 3 ? a : undefined)),
  log); // 비동기의 병렬적 실행 -> 1초 소요.
```

### 2. 조건에 해당되는 값이 없는 경우
* coll에 조건에 해당값이 없으면 응답이 안와서 프로미스는 pending 상태가 된다
* 플래그 i와 j를 심어주자: coll을 다 순회했는지 체크하여 해당이 없으면 undefined를 반환  
  * coll로 배열이 온다면 i대신 arr.length를 쓸 수도 있겠지만, coll에는 length속성이 없는 여러가지의 컬렉션들이 오기 때문에 i를 플래그로 삼는게 좋다

### 3. `stepIter`: iterator의 done프로퍼티 활용하여 limit 심어주기
* limit까지 findVal해본다 => `{done: true}`로 limit에 도달하면 이터레이터 일시정지
* iter를 다 순회하지 못했다면 한번 더 findVal한다 => `remain`플래그


### 4. 잘 동작하는지 확인하기
[1,2,3,4,5,6,7,8,9,10]
a > 8 ? a : undefined
limit 10 -> 1초소요
limit 5 -> 2초소요
limit 4 -> 3초소요
limit 3 -> 4초소요





----

Promise.all()은 전달한 객체의 상태가 모 두 Fulfilled될 때까지 기다리지만
Promise.race()는 전달한 객체 중 하나만 완 료되어도 다음 동작으로 넘어간다. 
 
---
# 6강

하스켈 0




---

# 질문

## 리팩토링 전이면, go 함수에 전개연산자를 쓰지 않아도 되지 않을까?

## Array.from이 아니라 제너레이터를 쓴 이유?
받은 Object의 length를 `Object.keys(obj).length`로 해서 `Array.from`을 이용하는게 성능상 더 좋지 않을까?
>>>> 아 내가 만든게 아니면 

```js
function makeObj(n) {
  const obj = {};
  for (let i = 0; i < n; i++) {
    obj[i] = i
  }
  obj['length'] = n;
  return obj;
}

function arrFrom(a) {
  console.time("test1");
  const iter = Array.from(a);
  console.timeEnd("test1");
  return iter;
}

function genIter(iter) {
	const res = [];
	console.time("test2");
	for(const v of iter) {
		res.push(v)
	}
	console.timeEnd("test2");
	return res;
}

var obj15000 = makeObj(15000); 

arrFrom(obj15000); // [ 0, 1, 2 ... 14999 ]
// test1: 3.47216796875ms
genIter(valuesIter(obj15000)) // [ 0, 1, 2 ... 14999 ]
// test2: 11.0087890625ms
```

## spread연산자와 콜스택


## reduce함수 만들때의 then2를 go로대체하면 콜스택에러 나지만,
reduce의 보조함수로 go를 넣는건 콜스택 에러가 나지 않음. 왜? ㅠㅠ
-> 아마도 recur때문인거 같긴한데
-> 2강 57분참고

## undefined가 구분자로 사용되는 이유?
json에 undefined가 데이터로 못들어간다고 들었었음
왜 findVal함수에서 보조함수 리턴값 true/false를 활용해 리턴하지 않고, 굳이 삼항연산자를 활용하여 false값을 undefined로 만들어주는걸까?

## findVal에 불필요 코드가 있는듯
```js
const findVal2 = (f, coll) => {
  const iter = collIter(coll);
  return function recur(res) { // res 선언
    for (const a of iter) {
      res = f(a);
      // if ((res = f(a)) !== undefined) // Promies는 undefined가 아니라는 사실하에
        return go(res, res => res !== undefined ? res : recur()); // recur하여 다음 iter요소를 체크
    }
  } ();
};
```

## 이거 책으로 좀더 읽어보기
### 3. 함수형프로그래밍의 동시성
CPU는 더이상 물리적으로 빨라질 수 없기때문에, 거대한 트래픽처리를 위해 **언제 평가해도 상관없는 순수함수들**로 코드를 설계하여 CPU를 최대한 안놀게하려는 프로그래밍의 방향성이다


## http1에선 안되던, ex) http2에서 이미지요청시, mapC로 로드를 해놓고 여러개를 한 번에 그릴 수 있도록 해줌. 사례 더 알아보깅
