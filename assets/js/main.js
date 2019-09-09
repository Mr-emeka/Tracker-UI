var makerequest = document.querySelector('.create');
var modal = document.querySelector('.bg-modal');

var editModal = document.querySelector('.edit-bg-modal');
var close = document.querySelector('#cancel');
var editClose = document.querySelector('#editcancel');
var edit = document.querySelectorAll('.edit');
edit.forEach(e => {
  e.addEventListener('click', (e) => {
    e.preventDefault();
    editModal.style.display = "flex";
  })
})

makerequest.addEventListener('click', (e) => {
  e.preventDefault();
  modal.style.display = "flex";
})

close.addEventListener('click', (e) => {
  e.preventDefault();
  modal.style.display = "none";
})

editClose.addEventListener('click', (e) => {
  e.preventDefault();
  editModal.style.display = "none";
})
