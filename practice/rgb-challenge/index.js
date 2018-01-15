function random255(){
  return Math.floor(Math.random() * 256);
}

function randomColor(){
  return `rgb(${random255()}, ${random255()}, ${random255()})`
}

let stage;
let problem;
let correctAnswer;

// 다음단계로 전환
function nextStage(){
  stage++;
  problem = [randomColor(), randomColor(), randomColor()];
  correctAnswer = Math.floor(Math.random() * 3);
}

// 화면 그리기
function draw(){
  document.querySelectorAll('.box').forEach((el, index) => {
    el.style.backgroundColor = problem[index];
  })
  document.querySelector('.rgb-text').textContent = problem[correctAnswer];
  document.querySelector('.score').textContent = 'SCORE: ' + stage;
}

// 초기화 -> 맨처음, 틀렸을때 사용
function init(){
  stage = 0;
  problem = [randomColor(), randomColor(), randomColor()];
  correctAnswer = Math.floor(Math.random() * 3);
}

document.querySelectorAll('.box').forEach((el, index) => {
  el.addEventListener('click', e => {
    if(index === correctAnswer){
      document.querySelector('.correct').classList.add('show');
    }else{
      document.querySelector('.wrong').classList.add('show');
      document.querySelector('.modal-score').textContent = 'SCORE: ' + stage;
    }
    el.classList.add('show');
  });
})

document.querySelector('.correct .modal-button').addEventListener('click', e => {
  nextStage();
  draw();
  document.querySelector('.correct').classList.remove('show');
  document.querySelectorAll('.box').forEach(el => {
    el.classList.remove('show');
  })
})

document.querySelector('.wrong .modal-button').addEventListener('click', e =>{
  init();
  draw();
  document.querySelector('.wrong').classList.remove('show');
  document.querySelectorAll('.box').forEach(el => {
    el.classList.remove('show');
  })
})

init();
draw();




