function random255(){
  return Math.floor(Math.random() * 256);
}

function randomColor(){
  return `rgb(${random255()}, ${random255()}, ${random255()})`
}

document.querySelectorAll('.box').forEach(el => {
  el.style.backgroundColor = randomColor();
})
// 정답

