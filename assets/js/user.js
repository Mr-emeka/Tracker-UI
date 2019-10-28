// const baseUrl = 'http://localhost:8080/api/v1';
const baseUrl = 'https://maintenance-tracker-pro.herokuapp.com/api/v1';
const userPage = document.getElementById('user-page');
const requestdash = document.querySelector('.user-request-dash');
const requestForm = document.querySelector('.request-form');
const updateRequestForm = document.querySelector('.update-request-form');
const requestlink = document.querySelector('.create');


let userRequestsArr;

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
      statusElement.style.color = 'dark-yellow';
      break;
  }
  return statusElement;
};

const append = (data) => {
  requestdash.innerHTML = ``;
  data.map(request => {
    const currentRequest = document.createElement('ul');
    currentRequest.setAttribute('onClick', `getRequest(${request.id}, 'preview')`);
    currentRequest.setAttribute('class', `${request.status}`);
    const titleCell = document.createElement('li');
    const dateCell = document.createElement('li');
    const statusCell = document.createElement('li');
    const typeCell = document.createElement('li');
    titleCell.innerText = request.title;
    typeCell.innerText = request.type;
    statusCell.appendChild(formatStatus(request.status));
    dateCell.innerText = new Date(request.createdat).toLocaleString('en-GB', {
      hour12: true
    });
    currentRequest.appendChild(titleCell);
    currentRequest.appendChild(dateCell);
    currentRequest.appendChild(statusCell);
    currentRequest.appendChild(typeCell);
    requestdash.appendChild(currentRequest);
  })
}

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
      buttons = '<button class="view-btn" disabled="true">Review in progress</button>';
      break;
    case 'disapproved':
      buttons = `<button class="view-btn-del" onclick="deleteRequest(${requestId})">Delete</button>`;
      break;
    case 'resolved':
      buttons = `<button class="view-btn-del" onclick="deleteRequest(${requestId})">Delete</button>`;
      break;
    default:
      buttons = `<button class="view-btn btn-update" onclick="getRequest(${requestId}, 'update')">Update</button>`;
      break;
  }
  return buttons;
};

/**
 * Displays information for a single user's request
 *
 * @param {Object} data - The request to be displayed
 */
const displayPreview = (data) => {
  document.getElementById('displayTitle').innerText = data.title;
  document.getElementById('displayType').innerText = data.type;
  document.getElementById('displayDescription').innerText = data.description;
  document.getElementById('buttons').innerHTML = formatButtons(data.status, data.id);
  document.getElementById('displayStatus').innerText = data.status;
  // document.getElementById('displayStatus').appendChild(formatStatus(data.status));
  document.getElementById('displayDate').innerText = new Date(data.createdat).toLocaleString('en-GB', {
    hour12: true
  });

  toggleModal('.bg-modal-view');
};


/**
 * Displays information from a single user request on the update request modal
 *
 * @param {object} data - The request to be displayed on the request modal
 */
const displayUpdate = (data) => {
  currentRequestId = data.id;
  toggleModal('.bg-modal-view');
  document.getElementById('update-title').value = data.title;
  document.getElementById('update-type').value = data.type;
  document.getElementById('update-description').value = data.description;
  toggleModal('.bg-modal-update');
};

// /**
//  * Gets the details of a single user object, to be previewed or updated
//  *
//  * @param {number} data - The id of the request to be fetched
//  */
const getRequest = (requestId, displayType) => {
  const request = userRequestsArr.find(requestItem => requestItem.id === parseInt(requestId, 10));
  if (displayType === 'preview' && request) {
    displayPreview(request);
  } else if (displayType === 'update' && request) {
    displayUpdate(request);
  } else {
    displayAlert('Could not get details of the request');
  }
};

const getRequests = () => {
  fetch(`${baseUrl}/users/requests`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': `${localStorage.token}`
      }
    })
    .then(res => res.json()).then((res) => {
      console.log('here')
      if (res.code === 200 && res.data) {
        userRequestsArr = res.data;
        console.log(userRequestsArr)
        append(res.data);
      } else if (res.code === 201 && !res.data) {
        displayAlert('You don\'t have requests, click the New Request button to create a request');
      } else if (res.code === 401 && !res.data) {
        window.location.replace('admin.html');
      } else if (res.code === 400 || res.status === 400) {
        setTimeout(() => {
          window.location.replace('login.html');
        }, 10);
      }
    })
    .catch(() => {
      displayAlert('Error connecting to the network, please check your Internet connection and try again');
    });
};
requestForm.addEventListener('submit', (e) => {
  e.preventDefault();
  let title = document.getElementById('title').value;
  let type = document.getElementById('type').value;
  let description = document.getElementById('description').value;

  fetch(`${baseUrl}/users/requests`, {
      method: 'POST',
      body: JSON.stringify({
        title,
        type,
        description
      }),
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': `${localStorage.token}`
      },
      cache: 'reload',
    }).then(res => res.json())
    .then((res) => {
      if (res.code === 200) {
        requestlink.setAttribute('clickable', 'true');
        document.getElementById('title').value = '';
        document.getElementById('type').value = '';
        document.getElementById('description').value = '';
        // console.log(res.message)
        displayAlert(res.message);
        toggleModal('.bg-modal');
        setTimeout(() => {
          getRequests();
        }, 10)
      } else {
        requestlink.setAttribute('clickable', 'false');
        displayAlert(res.message);
        toggleModal('.bg-modal');
      }
    }).catch(() => {
      requestlink.setAttribute('clickable', 'false');
      displayAlert('Error connecting to the network, please check your Internet connection and try again');
      toggleModal('.bg-modal');
    });
});

updateRequestForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const title = document.getElementById('update-title').value;
  const type = document.getElementById('update-type').value;
  const description = document.getElementById('update-description').value;
  console.log(title, type, description);
  fetch(`${baseUrl}/users/requests/${currentRequestId}`, {
      method: 'PUT',
      body: JSON.stringify({
        title,
        type,
        description
      }),
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': `${localStorage.token}`
      },
      cache: 'reload',
    })
    .then(response => response.json())
    .then((res) => {
      if (res.code === 200) {
        toggleModal('.bg-modal-update');
        displayAlert(res.message);
        setTimeout(() => getRequests(), 10);
      } else {
        displayAlert(res.message);
        toggleModal('.bg-modal-update');
      }
    }).catch(() => {
      displayAlert('Error connecting to the network, please check your Internet connection and try again');
      toggleModal('.bg-modal-update');
    });
})


/**
 * Deletes a request on the server belonging to the authenticated user
 *
 * @param {Number} requestId - The id of the request to be deleted on the server
 */
const deleteRequest = (requestId) => {
  console.log('called');
  fetch(`${baseUrl}/users/requests/${requestId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': `${localStorage.token}`
    },
    cache: 'reload',
  }).then(response => response.json()).then((res) => {
    if (res.code === 200) {
      toggleModal('.bg-modal-view');
      displayAlert(res.message);
      getRequests();
    } else {
      toggleModal('.bg-modal-view');
      displayAlert('Could not delete request');
    }
  }).catch(() => {
    displayAlert('Error connecting to the network, please check your Internet connection and try again');
  });
};

userPage.addEventListener('load', getRequests());