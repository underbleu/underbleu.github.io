function random255(){
  return Math.floor(Math.random() * 256);
}
function randomColor(){
  return `rgb(${random255()}, ${random255()}, ${random255()})`;
}

let stage = 0;
let problem = [randomColor(), randomColor(), randomColor()]'-;'
let correctAnswer = 0;


document.querySelectorAll('.box').forEach(box =>{
  box.style.backgroundColor = randomColor();
});

// document.querySelector('.rgb-text').textContent = ;
