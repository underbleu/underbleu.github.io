# Auth Component

## 1. switch문을 논리연산자로 리팩토링
```js
// Auth/presenter.js

// 1. 기존의 Switch문
<div className="whiteBox">
  {(() => {
    switch(props.action){
      case "login":
        return (
          <p className={styles.text}>
            Don't have an account? {" "}
            <span className={styles.changeLink} onClick={props.changeAction}>
              Sign up
            </span>
          </p>
        );
      case "signup":
        return (
          <p className={styles.text}>
            Have an account? {" "}
            <span className={styles.changeLink} onClick={props.changeAction}>
              Login
            </span>
          </p>
        );
      default:
        return null;
    }
  })()}
</div>
```
```js
// 2. Logical Operator으로 리팩토링
<div className={styles.whiteBox}>
  {props.action === "login" && (
    <p className={styles.text}>
      Don't have an account? {" "}
      <span className={styles.changeLink} onClick={props.changeAction}>
        Sign up
      </span>
    </p>
  )}
  {props.action === "signup" && (
    <p className={styles.text}>
      Have an account? {" "}
      <span className={styles.changeLink} onClick={props.changeAction}>
        Login
      </span>
    </p>
  )}
</div>
```

## 2. AuthForms생성
```js
// Auth.presenter.js
<div className={`${styles.whiteBox} ${styles.formBox}`}>
  {props.action === "login" && <LoginForm />}
  {props.action === "signup" && <SignupForm />}
</div>
```

## 3. 리액트 아이콘 설치
[react-ionicons 문서](https://zamarrowski.github.io/react-ionicons/)  
```
yarn add react-ionicons
```
svg아이콘 모듈. 애니메이션, onClick이벤트 사용가능

### # Ionicons API

Param	| Type | Example
--- | --- | ---
style | Object | icon={...your.style}
icon | String | icon="ion-home"
fontSize | String | fontSize="35px"
color | String | color="#C9C9C9"
rotate | Boolean | rotate={true}
shake | Boolean | shake={true}
beat | Boolean | beat={true}
onClick | Function | onClick={() => console.log('Hi!')}

## 4. 믹스인으로 블루버튼 만들기
```scss
/* config/_mixins.scss */

@mixin blueButton() {
  @content;
  -webkit-appearance: none;
  padding: 0 12px;
  background-color: $light-blue;
  color: #fff;
  border: 1px solid $light-blue;
  border-radius: 3px;
  font-size: $normal-font-size;
  line-height: 26px;
  font-weight: 600;
  text-align: center;
  cursor: pointer;
  &:active,
  &:focus {
    outline: none;
  }
  &:active {
    opacity: 0.9;
  }
}
```
## 5. 반응형작업 데탑, 랩탑, 모바일 완벽하게