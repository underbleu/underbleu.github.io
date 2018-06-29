##  iterator이면서iterable 에 대한 개념

### next메소드의 반환값에 done, value 속성이 모두 포함되어야 하지 않나요?
네 맞습니다! 기본적으로 done: false까지 넣어주기도 하는데요, done 이 정의 안되어있는것과 done: false 되어있는거를 처리하는게 동일해서 done: true일때만 명시해줘도 무방합니다 !

//

"Iterator(반복자)의 작업이 남아있을 경우 false. Iterator(반복자)에 done 프로퍼티 자체를 특정짓지 않은 것과 동일하다."

그리고 여기서 done이 true라면 value는 정의되지 않아도 되구요 ㅎㅎ

## built-in iterables
String, Array, TypedArray, Map and Set 는 모두 내장 iterable이다. 
* Array
* String

## iterable 
iterable은 value들이 loop 되는 것과 같은 iteration 동작을 정의하거나 사용자 정의하는 것을 허용합니다.
iterable 하기 위해서 object는 @@iterator 메소드를 구현해야 합니다
* object가 Symbol.iterator key 의 속성을 가져야 한다는 것을 의미
* (또는 prototype chain 의 오브젝트 중 하나)
* [Symbol.iterator]	object를 반환하는, arguments 없는 function. iterator protocol 을 따른다.
* obj[Symbol.iterator]() === obj 만 충족하면 well formed iterator라고 보고요

## iterator
iterator는 value들의 sequence 를 만드는 표준 방법을 정의합니다. 
* 규칙에 맞는 next() 메소드를 가지고 있다면 iterator
  * done: boolean
    * done: true 반복작업을 마쳤을경우
    * done: false 작업이 남아있을경우 (프로퍼티 자체를 생략가능)
  * value
    * Iterator(반복자)으로부터 반환되는 모든 자바스크립트 값
    * done이 true일 경우 생략될 수 있다.