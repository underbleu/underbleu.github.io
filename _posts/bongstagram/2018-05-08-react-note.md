# context를 이용하여 번역하기 (수동식)
props를 이용하여 내려받던 것을, context를 사용하면 부모에서 바로 불러올 수 있다
모든 단계에 수동으로 props를 내려 받던 것을, “context” API를 사용하면 컴포넌트 트리 어디서든 context에 직접 접근하여 props를 불러올 수 있다
1. context는 설정없이 디폴트로 받아와지지 않는다  
-> context에서 얻고 싶은 함수를 specific하게 정의하여 `this.context`에 담는다
2. context에서 가져온 함수 PropTypes 체크
3. 리덕스에 번역 데이터를 넣어두고, 리액트에서 context의 `t()`함수를 호출하여 요소들을 번역한다
4. devtools로 액션줘서 잘번역되는지 확인해보자


```js
// devtools에서 보낼 액션
{ type: 'REDUX_I18N_SET_LANGUAGE',
  lang: 'ko' }
```

## 1. Stateless 컴포넌트 번역
* State 없는 함수형 컴포넌트는 contextTypes이 정의되어 있어야지만 context 를 참조할 수 있다
* 만약 contextTypes 가 정의되지 않았다면, context 는 빈 객체 된다
```js
// Footer/index.js
const Footer = (props, context) => ( 
  <footer className={styles.footer}>
    <div className={styles.wrapper}>
      <nav className={styles.nav}>
        <ul className={styles.list}>
          <li className={styles.listItem}>{context.t("About Us")}</li>
          <li className={styles.listItem}>{context.t("Support")}</li>
          <li className={styles.listItem}>{context.t("Blog")}</li>
          <li className={styles.listItem}>{context.t("Press")}</li>
          <li className={styles.listItem}>{context.t("API")}</li>
          <li className={styles.listItem}>{context.t("Jobs")}</li>
          <li className={styles.listItem}>{context.t("Privacy")}</li>
          <li className={styles.listItem}>{context.t("Terms")}</li>
          <li className={styles.listItem}>{context.t("Directory")}</li>
          <li className={styles.listItem}>{context.t("Profiles")}</li>
          <li className={styles.listItem}>{context.t("Hashtags")}</li>
          <li className={styles.listItem}>{context.t("Language")}</li>
        </ul>
      </nav>
      <span className={styles.copyright}>&copy; 2018 Bongstagram</span>
    </div>
  </footer>
);

Footer.contextTypes = { 
  t: PropTypes.func.isRequired // --- 1. context의 t함수 불러오기
};
```

## 2. Stateful 컴포넌트 번역
```js
class Footer extends React.Component {
  
  static contextTypes = { // --- 1. context의 t함수 불러오기
    t: PropTypes.func.isRequired
  }
  
  render() {
    return (
      <footer className={styles.footer}>
        <div className={styles.wrapper}>
          <nav className={styles.nav}>
            <ul className={styles.list}>
              <li className={styles.listItem}>{this.context.t("About Us")}</li>
              <li className={styles.listItem}>{this.context.t("Support")}</li>
              <li className={styles.listItem}>{this.context.t("Blog")}</li>
              <li className={styles.listItem}>{this.context.t("Press")}</li>
              <li className={styles.listItem}>{this.context.t("API")}</li>
              <li className={styles.listItem}>{this.context.t("Jobs")}</li>
              <li className={styles.listItem}>{this.context.t("Privacy")}</li>
              <li className={styles.listItem}>{this.context.t("Terms")}</li>
              <li className={styles.listItem}>{this.context.t("Directory")}</li>
              <li className={styles.listItem}>{this.context.t("Profiles")}</li>
              <li className={styles.listItem}>{this.context.t("Hashtags")}</li>
              <li className={styles.listItem}>{this.context.t("Language")}</li>
            </ul>
          </nav>
          <span className={styles.copyright}>&copy; 2018 Bongstagram</span>
        </div>
      </footer>
    );
  }
} 
```

# 클래스 

* 클래스는 함수로 호출될 수 없다
* 클래스 선언은 let과 const처럼 블록 스코프에 선언되며, 호이스팅(hoisting)이 일어나지 않는다
* class 블록은 새로운 블록 스코프를 형성하여, 이 내부에서 사용된 this는 인스턴스 객체(자기자신)를 가리키게 됩니다

## 정적 메소드 (Static Method)
생성자의 속성에 함수를 직접 할당한것을 정적 메소드(static method)라고 한다
* static 키워드를 메소드 이름 앞에 붙여주면 해당 메소드는 정적 메소드
`Person.prototype.메소드`가 아닌 `Person.메소드`가 됨
1. **인스턴스메소드**  
클래스로 생성할 인스턴스 단일객체와 내용상 관계가 있으면 사용
2. **정적메소드**  
클래스로 생성한 객체들을 비교한다던지 하는 포괄적인 관계가 있으면 사용
    * 정적메소드는 인스턴스에서 호출불가


```js
class Person {
  constructor({name, age}) {
    this.name = name;
    this.age = age;
  }
  
  sayHi() { // ---1. instance method
    return "Hi! my name is " + this.name;
  }
  
  static sumAge(...people) { // ---2. static method
    return people.reduce((acc, person) => acc + person.age, 0);
  }
}

const person1 = new Person({name: '윤아준', age: 19});
const person2 = new Person({name: '신하경', age: 20});

person1.sayHi() // 'Hi! my name is 윤아준'
Person.sumAge(person1, person2); // 39
person1.sumAge() // TypeError: 정적메소드는 인스턴스에서 호출불가
```


