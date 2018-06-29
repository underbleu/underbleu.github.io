# 4강. 템플릿 리터럴, 태그, 비동기 템플릿 엔진 (1시간 4분 19초)

## 템플릿 리터럴, 태그

### # 템플릿함수
` (Back tick): 표현식이 평가되는영역
* 어떤 js도 만들어낼 수 있다
* for문을 돌릴 수도있고, 함수를 실행할 수 도 있다
* 함수를 실행 할 때, 헬퍼함수들을 쉽게 등록할 수 있다

### # 함수형 프로그래밍을 가능하게 하는 핵심 2가지
* 일급함수
* 클로저  
*Promise는 필수는 아니다*

## Tagged Template Literal
> Tags allow you to parse template literals with a function.
중간에 평가된 값들을 가로채서, 중간에 값을 가공하는 기법

### # 태그를 사용하면 템플릿 리터럴을 함수로 파싱 할 수 있다
1. 첫 번째 인수는 문자열 값들을 배열로
2. 나머지 인수는 표현식관련 값들을 배열로
```js
function victory(str, ...val) {
	console.log("str: ", str);
	console.log("val: ", val);
}

victory`Hi${bong}. You will ${win}`
// str: (3) ["Hi", ". You will ", "", raw: Array(3)]
// val: (2) ["boyoung", "Win!!"]
```

## `html()`: 표현식을 HTML로 파싱해주는 함수
* `go()`: 함수세트를 중첩적으로 실행시켜 **값**을 리턴
* `map()`: 배열은 join해주고, `undefined` 걸러주고  
null과 NaN은 출력되도록 하되, 우리 프로그래밍에서 구분자로 사용하는 `undefined`는 걸러주도록 하자


```js
function html(strs, ...vals) {
  return go(
    vals,
    map(v => isArray(v) ? v.join('') : isUndefined(v) ? '' : v),
    (vals, i = 0) => reduce((res, str) => `${res}${vals[i++]}${str}`, strs)
  );
}

log(html`${1}a${[1,2,3,4]}b${undefined}`;); // 1a1234b
```

### 비동기 지원
`go()`와 `map()`의 부모함수 reduce가 **비동기 지원**하기 때문에, 비동기문제를 신경쓰지 않아도 된다 (대박 ㅠㅠ 만들어놓기 잘했다)

```js
const users = [
      { name: "bong", age: "14" },
      { name: "ria", age: "21" },
      { name: "andy", age: "15" },
      { name: "boram", age: "30"}
  ];
    
  function getUsers() {
    return new Promise(resolve => {
      setTimeout(function() {
        resolve(users); 
      }, 1500) // DB에서 가져오는 시간을 1.5초라고 가정해보자
    });
  }

  go(
    html`
      <ul>
        ${go(
          getUsers(),
          filter(u => u.age < 20),
          map(u => `<li>${u.name}</li>`)
        )}
      </ul>
    `,
    html => document.querySelector("#container").innerHTML += html
  )
  // bong andy
  
  async function render() {
    document.querySelector("#container").innerHTML += await html`
      <ul>
        ${go(
          getUsers(),
          filter(u => u.age > 20),
          map(u => `<li>${u.name}</li>`)
        )}
      </ul>
    `;
  }
  
  render(); // ria boram
```

# 4-ex. 얼럿창과 컨펌창 만들기, 프로미스의 새로운 응용 (47분 38초)

lib폴더의 js 함수들은 window에 붙어있다는 규칙

## JS 모듈화

JS를 클라이언트에서만 사용할 경우, 브라우저에서 지원하는 `import export` 자바스크립트 모듈 패턴을 사용하면 된다. 하지만 서버와 프론트엔드에서 JS로 작성되어 공유할 코드가 있다고 한다면, `require`함수를 사용하는등 조금 다른 패턴이 필요하다


* 함수형에서 클로저의 경우 항상 값을 immutable하게 다루기때문에, 원본 값에 접근한다 해도 값이 변경되지 않는다. **여러함수가 동시에 어떤값에 접근을해도, 모든 값이 global환경에 노출**되어있어도 문제가 되지 않는다
* 객체지향에서 값들을 class/객체안에 지역화/은닉화하여 값이 변형되는 문제를 차단한다

>Name Space: 객체안에 이름 구분이 가능하도록 정해놓은 공간. 이 안에 변수를 선언하면 외부에 같은 이름의 변수가 있더라도 변수명 충돌을 방지할 수 있다

현재 만들어놓은 functional.js를 모듈화 시켜보자
* `baseMF`같은 굳이 외부로 노출하지 않아도 되는 함수들은 네임스페이스에 두고
* `map, filter`처럼 프로그래밍을 하며 직접 사용할 함수들만 선택적으로 노출시킨다

---

## alert

### 1. 문자열 html을 엘리먼트로 만들기
* createElement
* innerHTML
* `parentNode.children`: 부모 아래있는 엘리먼트들을 유사배열로 뽑아준다
* 유사배열의 첫번째 인자를 뽑아, 이를 body에 `appendChild`해주면 HTML로 박힌다


### 2. 버튼동작 
* addEventListener를 달아서 버튼을 눌렀을때 alert창이 삭제되게 해준다
* confirm에서 "확인"을 눌렀을땐 다음코드가 실행되게, "취소"를 눌렀을 땐 그자리에서 함수가 종료되도록 해준다


### 3. 버튼을 누르기 전까지, 다음코드 실행을 막아주기 (비동기처럼)
자바스크립트에서 동기상황에서 다음 코드를 강제로 막아주는건 (밑으로 안내려가게 하는) alert, prompt, confirm밖에 없다

UI.alert의 반환값을 프로미스를 만들고 '확인'버튼이 눌리면 `resolve()`를 하여 alert를 종료시키고 다음코드로 넘어갈 수 있도록 해준다  
-> 버튼을 누르기 전까진 프로미스에 값이 차지 않았으니 다음코드로 넘어가지 않는다
```js
Ui.alert = msg => {
  return new Promise(resolve => {
    go(
      `
      <div class="alert_ui">
        <div class="body">
          <div class="msg">${msg}</div>
          <div class="buttons">
            <button type="button" class="done">확인</button>
          </div>
        </div>
      </div>
      `,
      htmlStr => {
        const container = document.createElement('div');
        container.innerHTML = htmlStr;
        return container.children;
      },
      els => els[0],
      el => document.querySelector('body').appendChild(el),
      alertEl => alertEl.querySelector('.done').addEventListener('click', e => {
        alertEl.parentNode.removeChild(alertEl);
        resolve()
      })
    );
  })
}

Ui.confirm = msg => {
  return new Promise(resolve => {
    go(
      `
    <div class="confirm_ui">
      <div class="body">
        <div class="msg">${msg}</div>
        <div class="buttons">
          <button type="button" class="done">확인</button>
          <button type="button" class="cancel">취소</button>
        </div>
      </div>
    </div>
    `,
      htmlStr => {
        const container = document.createElement('div');
        container.innerHTML = htmlStr;
        return container.children;
      },
      els => els[0],
      el => document.querySelector('body').appendChild(el),
      confirmEl => {
        confirmEl.querySelector('.done').addEventListener('click', e => {
          confirmEl.parentNode.removeChild(confirmEl);
          resolve(true);
        });
        confirmEl.querySelector('.cancel').addEventListener('click', e => {
          confirmEl.parentNode.removeChild(confirmEl);
          resolve(false);
        });
      }
    );
  })
};

function test1() {
  if(!confirm('삭제하시겠습니까?')) return;
  alert('삭제되었습니다');
  log('끗');
}

async function test2() {
  if(!await Ui.confirm('삭제하시겠습니까?')) return;
  await alert('삭제되었습니다');
  log('끗');
}

async function test3() {
  await Ui.alert('버튼을 누르면'); 
  log('출력이된다');
}
```

### 4. match를 활용하여 함수를 호출하면 비동기문제를 신경쓰지 않아도되기 때문에 코드가 간결해진다

* 패턴매칭: 함수형프로그래밍에서 if...else대신 사용하는 유명한 기법 
* `match()`: 문장이 아닌, 표현식이라는 점에서 if...else보다 낫다 

```js
match()
  .case(_ => Ui.confirm('삭제할래?'))(
    // 확인을 누른경우
    _ => Ui.alert('삭제되었슴'),
    _ => log('끗'))
  .else(
    // 취소를 누른경우
    _ => log('삭제 안됨'))
```

---

# 4-ex. DOM 조작 코드 분리, 클래스를 대신하는 함수 추상화로 얼랏창과 컨펌창 중복 없애기


## 제이쿼리를 대체할 DOM조작 라이브러리 만들기

1. `document.querySelector`를 `$`로 간략하게 코딩할 수 있도록
2. `$.find()`
3. htmlStr을 엘리먼트로 만들어주는 중복코드, `$.els()`로 만들기
4. 배열의 첫번째 요소를 꺼내주는 `first()`
5. body에 생성한 엘리먼트를 넣어주는 `append()`. curry활용
6. `$el()`로 위에 리팩토링해놓은 `$els`, `first`를 하나로 묶어주기. pipe활용
7. `$on(el, event, f)`로 addEventListener코드를 간결하게
8. `$on(el, event, f)`의 el을 재귀를 이용하여 커링처럼 나중에도 받을 수 있도록 
9. `$.remove(el)` 버튼이 눌러주고 창닫아주는 코드 함수로

### `tap(...fs)(arg)`
인자를 받아 함수모음을 거친 반환값과 원본값 리턴. go활용


## `each()`
함수형프로그래밍에서 부수효과를 낳는 함수는, 함수내부에서만 받은 인자들로 값을 계산하여 값의 변형을 허용하고, 리턴값으론 원본인자를 다시 반환해주도록 한다
```js
each(a => a * 2, [1, 2, 3]); 
// 2
// 4
// 6
// [1, 2, 3] --> 다시 원본을 리턴
```

---

# 4-ex. 주소록에서 가져오기등급 미정 (1시간 11분 16초)

1. (실행) "주소록가져오기 버튼"을 눌러 `AddressBook.import()`를 실행하면
2. `getAddress()`로 DB에서 주소를 가져온다  
이때 서버에서 데이터를 가져오는데 시간이 소요되므로 Promise로 값을 받도록한다
3. 받아온 주소 Data를 주소선택창에 띄울 html코드로 만들고
4. 이를 엘리먼트화하여
5. body에 append해준다
6. 주소선택창 버튼 컨트롤: `tap()`을 이용하여 원본값 `windowEl`을 반환해줘야 다음 버튼에서도 이를 셀렉할 수 있다
  * "닫기" 버튼을 누르면 `resolve()`에 아무것도 채우지 않은채로 창을 닫아준다
  * "선택" 버튼을 누르면 해당버튼의 가장 가까이 있는 li에 담겨있는 postcode와 address를 `resolve()`에 담아주고 창을 닫는다
7. (실행) Address.import가 종료되고 `resolve(..)`에 데이터가 없으면 함수를 종료하고, postcode/address 데이터가 있다면 해당 인풋에 데이터를 `setVal()` 해준다

```js
!function() {
  const { log, go, map, tap, each } = Functional;

  const getAddresss = _ => new Promise(resolve => {
    setTimeout(function() {
      resolve([
        { id: 1, postcode: '1000', address: '경기도 고양시' },
        { id: 2, postcode: '2000', address: '경기도 성남시' },
        { id: 3, postcode: '3000', address: '경기도 용인시' },
      ]);
    }, 1000);
  });

  const AddressBook = {};
  AddressBook.import = _ => new Promise(resolve => go(
    null,
    getAddresss,
    addresss => html`
      <div class="address_book window">
        <div class="container">
          <ul class="address_list">
          ${map(a => `
            <li>
              <div class="postcode">${a.postcode}</div>
              <div class="address">${a.address}</div>
              <button type="button" class="select">선택</button>
            </li>
          `, addresss)}
          </ul>
          <div class="options">
            <button type="button" class="close">Close</button>
          </div>
        </div>
      </div>
    `,
    $.el,
    $.append($('body')),
    tap(windowEl => go(windowEl, // 클로저: 외부함수의 변수를 immutable하게 호출
      $.find('.options .close'),
      $.on('click', _ => {
        resolve();
        $.remove(windowEl); 
      })
    )),
    tap(windowEl => go(windowEl,
      $.findAll('.address_list .select'),
      each($.on('click', e => go(
        e.currentTarget,
        $.closest('li'),
        el => ({
          postcode: go(el, $.find('.postcode'), $.text),
          address: go(el, $.find('.address'), $.text)
        }),
        resolve,
        _ => $.remove(windowEl)
      )))
    ))
  ));

  window.App.AddressBook = AddressBook;
} ();
```

















# 1강. 

## Kleisli 화살표
함수를 합성하는과정에 에러가 나면, 그 함수는 적용안한 것처럼 지나감 (pipe함수와의 차이)

## try...catch
컴파일 언어에선 에러를 미리알 수 있지만, 런타임언어에선 알 수 없었다.
하지만 요즘시대엔 에디터와 커밋프로그램에서 미리 알려준다.


## 에러 핸들링
진짜 문제는 컴파일언어에서도 알 수 없는 에러 !
```js
// 일반 클라이언트에선 생기지 않을 에러이지만, 
// 개발자가 쓰는 서비스, 아이폰 SDK... 에서는 일어날 수 있는 에러이다
ex. `JSON.parse("{");`
```
-> 고로 일반적인 서비스를 만들때는 에러핸들링 할 일 이없지만, 개발과정에 내 코드의 작은에러들을 잡아내기 위해 사용한다

throw
Promise.reject
일반데이터

유저가 로그인을 시도하는데 해당아이디가 없는경우
null값 혹은 404에러로 오는경우들이 있다. 에러를 바라보는 관점을 가져야한다


## 에러도 RESTful하게
ex) 구글 크롤러가 GET으로 데이터를 끌어모으는데, GET방식으로도 데이터 수정이 가능해지면 해당페이지가 망가진다


## 비동기에러는 try...catch만으로 잡을 수 없다
콜백 방식의 비동기 처리가 갖는 문제점 중에서 가장 심각한 것은 에러 처리가 곤란하다는 것
에러나는 코드가 프로미스 함수내부에 있으면 에러 핸들링이 되지만
그 안에서 비동기코드(setTimeout) 안에 들어있으면 핸들링이 안된다

* 비동기 catch 내부의 `throw(e)`: 동작 X
* 비동기 catch 내부의 `reject(e)`: 동작 O


## 에러핸들링의 중요성
에러 로그도 계속 쌓이면, 하드가 차서 언젠가 서버가 죽을수도 있다
따라서 에러를 핸들링해줘야한다

----
# 쉬는시간

모나드: 함수합성을 연속적으로 하기위한 개념
>>> Egg Head. Professor Frisby강의 추천해주심 120분

모나드가 있어야하는 이유? 강타입. 어떤타입의 성질을 말하기 위해 있는 개념
map을 적용할 수 있는 것: Functor 
타입이 필요하닌깐 모나드가 필요한것

---

# 2강

오류가 날 수 있는 함수세트들을 리팩토링


>ES의 방향은 튜플이 아닌 구조분해쪽인것같다

## `pipe`: 인자를 여러개 받을 수 있도록 리팩토링
1. pipe도 go처럼 다항함수로 만들어주자
arg -> ..._
2. 리팩토링한 pipe를 이용하여 (f, coll)형태로 인자를 받고 있는 함수들을 리팩토링 할 수 있다


>추상화레벨을 높여 reduce, map, filter, find 함수세트를 만들었듯이
에러핸들링 함수도 추상화레벨을 높여, 모든 형태의 에러를 하나의 함수로 관리할 수 있도록 해보자

## `intercept`
일종의 pipe같은 함수이지만, 에러를 처리할 수 있는 pipe라고 볼 수 있다
* pipe 절대 에러안날 함수들을 합성하기위해
* intercept 외부세상과 연결이 있는 함수가 있을경우

전략을 undefined를 구분자로 쓸 수도있고, Nullable로 할 수도 있다

---

# 4강. 


## 비동기지원 템플릿 엔진
추후의 백엔드에서 SQL문을 만드는데에도 이용할 예정

클로져가 된다는 점이 중요하다!!

map후에 join을 하는 함수

## Taged 템플릿리터럴
오 짱신기하다

`date-fns` -> moment.js는 객체로. 이건 함수형으로 쓸 수 있는 날짜 라이브러리


---

# 5강.

## 클로저가 위험하지 않은 이유
참고하고 있는 글로벌스테이트의 값을 읽을 수 있어도. 변경은 불가하기 때문

이것과 비슷한 이야기를 해주신듯
```
## # CSS모듈의 역할  
같은 클래스명을 가진 요소들이 중복문제를 가지지않도록, 고유한 클래스명을 만들어준다.   

`.컴포넌트이름__클래스명__랜덤숫자(hash)`
```

클라이언트와 백엔드에서 공용할 수 있는 함수

모든 functional.js를 함수로 즉시실행하여

## 모듈의 경우 네이밍을 대문자로 하는게 좋다

## Delegate 이벤트리스너
>>>> 드래그앤드롭 다시 구현해보기. 캡쳐링/버블링

Delegate. 글로벌에있는 함수를 이벤트리스너의 콜백으로 사용 -> 부하 없음

Delegate를 잘 구현해놓은 라이브러리가 없다
리액트도 마찬가지

## 제이쿼리의 위대함?
stopPropagation, preventDefalut 가 완벽히 사용해서 구현한 라이브러리는 전세계에 제이쿼리밖에 없다
선생님이 만드신 라이브러릴 done.js






















