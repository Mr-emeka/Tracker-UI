var makerequest = document.querySelector('.create');
var modal = document.querySelector('.bg-modal');

var close = document.querySelector('#cancel');

makerequest.addEventListener('click', (e) => {
  e.preventDefault();
  modal.style.display = "flex";
})

close.addEventListener('click', (e) => {
  e.preventDefault();
  modal.style.display = "none";
})