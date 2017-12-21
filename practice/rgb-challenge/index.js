function random255(){
  return Math.floor(Math.random() * 256);
}

function randomColor(){
  return `rgb(${random255()}, ${random255()}, ${random255()})`
}

// document.querySelectorAll('.box').forEach(el => {
//   el.style.backgroundColor = randomColor();
// })

let stage = 0;
let problem = [randomColor(), randomColor(), randomColor()];
let correctAnswer = 0;

// nodelist.forEach 사용
document.querySelectorAll('.box').forEach((el, index) => {
  el.style.backgroundColor = problem[index];
  el.addEventListener('click', e => {
    if(index === correctAnswer){
      // 다음단계로 전환
      stage++;
      problem = [randomColor(), randomColor(), randomColor()];
      // 화면 다시그리기
      document.querySelectorAll('.box').forEach((el, index) => {
        el.style.backgroundColor = problem[index];
      })

      document.querySelector('.rgb-text').textContent = problem[correctAnswer];
    }else{
      //재시작

    }
  });
})

document.querySelector('.rgb-text').textContent = problem[correctAnswer];
document.querySelector('.rgb-score').textContent = stage;





