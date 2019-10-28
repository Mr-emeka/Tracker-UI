// const baseUrl = 'http://localhost:8080/api/v1';
const baseUrl = 'https://maintenance-tracker-pro.herokuapp.com/api/v1';
const adminPage = document.getElementById('admin-page');
const userRequestDash = document.querySelector('.admin-request-dash');
const adminPreviewPanel = document.querySelector('.admin-preview');
let btnPrev = document.getElementById('previous-btn');
let btnNext = document.getElementById('next-btn');
let btnSection = document.querySelector('.btn-section');
let changeByStatus = document.querySelector('#change_status');
let changeByType = document.querySelector('#change_type');


btnSection.style.display = 'none';
userRequestDash.style.display = 'none';
adminPreviewPanel.style.display = 'none';

let userRequestsArr;
let currentFilter = 'all';
let currentPage = 1;

/**
 * Changes the font color of the a request's status text on display, according to the status
 *
 * @param {String} status - The state of the request
 *
 * @returns {Object} - The span element that has been formated to fit the request state
 */
const formatStatus = (status) => {
  const statusElement = document.createElement('span');
  statusElement.textContent = status;
  statusElement.style.fontWeight = 'bold';
  switch (status) {
    case 'approved':
      statusElement.style.color = '#f39c12';
      break;
    case 'disapproved':
      statusElement.style.color = '#E74C3C';
      break;
    case 'resolved':
      statusElement.style.color = '#2ecc71';
      break;
    default:
      statusElement.style.color = '#3498db';
      break;
  }
  return statusElement;
};
/**
 * Evaluates and formats the action buttons a request is entitled from the request's status
 *
 * @param {Number} requestId - The id of the request, the button deletes
 * @param {String} status - The status of the request, the button deletes
 *
 * @returns {HTMLCollection} - The formated buttons
 */
const formatButtons = (status, requestId) => {
  let buttons;
  switch (status) {
    case 'approved':
      buttons = `
      <button class="view-btn" onclick="modifyRequest(${requestId},  'resolve')">Resolve</button>`;
      break;
    case 'disapproved':
      buttons = '<button class="view-btn" onclick="back()">Back</button>';
      break;
    case 'resolved':
      buttons = '<button class="view-btn" onclick="back()">Back</button>';
      break;
    default:
      buttons = `
      <button class="view-btn" onclick="modifyRequest(${requestId}, 'approve')">Approve</button>
      <button class="view-btn disapprove-btn" onclick="modifyRequest(${requestId}, 'disapprove')">disapprove</button>`

      break;
  }
  return buttons;
};


const append = (data) => {
  userRequestDash.innerHTML = '';
  data.map((request) => {
    const currentRequest = document.createElement('ul');
    currentRequest.setAttribute('onclick', `getRequest(${request.request_id})`);
    // currentRequest.setAttribute('onclick', `getRequest(${request.request_id})`);
    const titleCell = document.createElement('li');
    const dateCell = document.createElement('li');
    const statusCell = document.createElement('li');
    const usernameCell = document.createElement('li');

    titleCell.innerText = request.title.toUpperCase();
    usernameCell.innerText = `${request.firstname} ${request.lastname}`;
    dateCell.innerText = new Date(request.createdat).toLocaleString('en-GB', {
      hour12: true
    });
    statusCell.appendChild(formatStatus(request.status));

    currentRequest.appendChild(titleCell);
    currentRequest.appendChild(dateCell);
    currentRequest.appendChild(statusCell);
    currentRequest.appendChild(usernameCell)
    userRequestDash.style.display = 'grid';
    userRequestDash.appendChild(currentRequest);
    btnSection.style.display = 'grid';

  })
}

/**
 * Gets a list of requests on the system using fetch api
 * 
 * 
 */
const getRequests = (filterType, pageNo = 1) => {
  fetch(`${baseUrl}/requests?filterType=${filterType}&pageNo=${pageNo}&cache-bust=${Date.now()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': `${localStorage.token}`
      }
    })
    .then(res => res.json()).then((res) => {
      console.log(res);
      if (res.code === 200) {
        userRequestsArr = res.data;
        append(userRequestsArr);
      }
      if (res.code === 201) {
        displayAlert(res.message, 1);
      }
      if (res.code === 401) {
        setTimeout(() => {
          window.location.replace('login.html');
        }, 1);
      } else if (res.code === 403) {
        setTimeout(() => {
          window.location.replace('user.html');
        }, 1);
      }
    })
    .catch(() => {
      displayAlert('Error connecting to the network, please check your Internet connection and try again');
    });
};
/**
 * Displays information for a single user's request
 *
 * @param {Object} data - The request to be displayed
 */
const displayPreview = (data) => {
  btnSection.style.display = 'none';
  adminPreviewPanel.style.display = 'grid';
  document.getElementById('displayUser').innerText = `${data.firstname} ${data.lastname}`;
  document.getElementById('displayEmail').innerText = data.email;
  document.getElementById('displayTitle').innerText = data.title;
  document.getElementById('displayDate').innerText = new Date(data.createdat).toLocaleString('en-GB', {
    hour12: true
  });
  document.getElementById('displayType').innerText = data.type;
  document.getElementById('displayDescription').innerText = data.description;
  document.getElementById('displayStatus').innerHTML = '';
  document.getElementById('displayStatus').appendChild(formatStatus(data.status));
  document.getElementById('buttons').innerHTML = formatButtons(data.status, data.request_id);
  userRequestDash.style.display = 'none';
  // adminPreviewPanel.style.display = 'block';
};

/**
 * Gets the details of a single user object
 *
 * @param {Number} data - The id of the request to be fetched
 */
const getRequest = (requestId) => {
  const request = userRequestsArr
    .find(requestItem => requestItem.request_id === parseInt(requestId, 10));
  displayPreview(request);
};
const back = () => {
  window.location.replace('admin.html');

}
/**
 * Modifies the status of a user's request
 *
 * @param {Number} requestId - The request id of the request to be modified
 * @param {String} actionType - The type of modification action to be performed
 * (Approve, Disapprove, Resolve)
 */
const modifyRequest = (requestId, actionType) => {
  setTimeout(() => {
    adminPreviewPanel.style.display = 'none';
    userRequestDash.style.display = 'grid';
  }, 100);
  fetch(`${baseUrl}/${requestId}/${actionType}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': `${localStorage.token}`
      },
      cache: 'reload',
    })
    .then(res => res.json()).then((res) => {
      displayAlert(res.message);
      if (res.code === 200) {
        getRequests();
      }
      if (res.code === 401) {
        setTimeout(() => {
          window.location.replace('signin.html');
        }, 10);
      } else if (res.code === 401) {
        setTimeout(() => {
          window.location.replace('user.html');
        }, 10);
      }
    })
    .catch(() => {
      displayAlert('Error connecting to the network, please check your Internet connection and try again');
    });
};
changeByStatus.addEventListener('change', (e) => {
  e.preventDefault();
  getRequests(e.target.value);
})
changeByType.addEventListener('change', (e) => {
  e.preventDefault();
  getRequests(e.target.value);
})
btnPrev.addEventListener('click', () => {
  if (currentPage > 1) {
    displayAlert('loading previous');
    currentPage -= 1;
    getRequests(currentFilter, currentPage)

  } else {
    displayAlert('This is the first page', 3);
  }
})
btnNext.addEventListener('click', () => {
  if (userRequestsArr.length < 12) {
    displayAlert('This is the last page', 3);
  } else {
    displayAlert('loading Next....');
    currentPage += 1;
    getRequests(currentFilter, currentPage)
  }
})
adminPage.addEventListener('load',
  getRequests());