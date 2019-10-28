var makerequest = document.querySelector('.create');
var modal = document.querySelector('.bg-modal');
var closemodal = document.querySelector('#cancel');

const btnLogOut = document.getElementById('logout');
const btnLogOutSide = document.getElementById("sidenav-logout");


let viewRequest = document.getElementById('view-request');
let modalView = document.querySelector('.bg-modal-view');
let closeView = document.querySelector('#cancel-view');

let closeupdate = document.querySelector('#cancel-update');
let modalupdate = document.querySelector('.bg-modal-view-update');

/**
 * Toggles Modals
 *
 * @param {string} classname - The classname of the Modal to be toggled
 */
const toggleModal = (classname) => {
  let modal;
  if (classname === '.bg-modal-view') {
    modal = document.querySelector('.bg-modal-view');
    if (modal.style.display === 'flex') {
      modal.style.display = 'none';
    } else {
      modal.style.display = 'flex';
    }
  } else if (classname === '.bg-modal') {
    modal = document.querySelector('.bg-modal');
    if (modal.style.display === 'flex') {
      modal.style.display = 'none';
    } else {
      modal.style.display = 'flex';
    }
  } else if (classname === '.bg-modal-update') {
    modal = document.querySelector('.bg-modal-update');
    if (modal.style.display === 'flex') {
        modal.style.display = 'none';
    } else {
      modal.style.display = 'flex';
    }
  }
};




if (makerequest) {
  makerequest.addEventListener('click', () => toggleModal('.bg-modal'));
}

if (closemodal) {
  closemodal.addEventListener('click', () => toggleModal('.bg-modal'));
}

if (viewRequest) {
  viewRequest.addEventListener('click', () => toggleModal('.bg-modal-view'));
}

if (closeView) {
  closeView.addEventListener('click', () => toggleModal('.bg-modal-view'));
}

if (closeupdate) {
  closeupdate.addEventListener('click', () => toggleModal('.bg-modal-update'));
}

if (btnLogOut) {
  btnLogOut.addEventListener('click', () => {
    localStorage.token = '';
    document.location.replace('login.html');
  });
}
if(btnLogOutSide){
  btnLogOutSide.addEventListener('click',()=>{
    localStorage.token = '';
    document.location.replace('login.html');
  })
}
/**
 * Displays a custom message
 *
 * @param {string} message - The message to be displayed on the alert
 */
const displayAlert = (message, type = 1) => {
  document.getElementById('display').className = 'show';
  const alert = document.getElementById('alert');
  switch (type) {
    case 2:
      document.getElementById('display').style.backgroundColor = '#2ecc71';
      alert.innerHTML = message;
      break;
    case 3:
      document.getElementById('display').style.backgroundColor = '#E74C3C';
      alert.innerHTML = message;
      break;
    default:
      document.getElementById('display').style.backgroundColor = '#3498db';
      alert.innerHTML = message;
      break;
  }
  setTimeout(() => {
    document.getElementById('display').className = '';
  }, 1000);
};