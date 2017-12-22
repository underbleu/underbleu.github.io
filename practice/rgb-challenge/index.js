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
  document.querySelector('.score').textContent = stage;
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
      nextStage();
      draw();
    }else{
      init();
      draw();
    }
  });
})

init();
draw();




