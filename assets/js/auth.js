// const baseUrl = 'http://localhost:8080/api/v1';
const baseUrl = 'https://maintenance-tracker-pro.herokuapp.com/api/v1';

const formSignup = document.getElementById('signup-form');
const formLogin = document.getElementById('login-form');

/**
 * Redirects the signed up or logged in user based on the server response
 */
const isAdmin = () => {
  fetch(`${baseUrl}/requests`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': `${localStorage.token}`
    },
  }).then(response => response.json()).then((res) => {
    console.log(res);
    if (res.status === "fail") window.location.replace('user.html');
    displayAlert('Welcome', 2);
    if (res.code === 200) window.location.replace('admin.html');
  }).catch(() => {
    displayAlert('Error connecting to the network, please check your Internet connection and try again');
  });
};

/**
 * Assigns an event-listener to formSignup if it exists in the window
 *
 * @param {object} submitEvent - The event parameter
 */
if (formSignup) {
  formSignup.addEventListener('submit', (e) => {
    e.preventDefault();
    const firstname = document.querySelector('.firstname').value.toLowerCase();
    const lastname = document.querySelector('.lastname').value.toLowerCase();
    const email = document.querySelector('.email').value.toLowerCase();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (password.length <= 4 && confirmPassword.length <= 4) {
      displayAlert('Weak Password', 3);
    } else if (password !== confirmPassword) {
      displayAlert('Passwords do not match', 3);
    } else {
      fetch(`${baseUrl}/auth/signup`, {
          method: 'POST',
          body: JSON.stringify({
            firstname,
            lastname,
            email,
            password
          }),
          headers: {
            'Content-Type': 'application/json'
          }
        }).then(response => response.json())
        .then((res) => {
          if (res.status === 'success') {
            window.localStorage.token = res.token;
            displayAlert(`your signup was Successful`, 2);
            setTimeout(() => {
              window.location.replace('login.html');
            }, 1000);
          } else if (res.code === 400) {
            displayAlert(response.message, 3);
          } else {
            displayAlert(response.message, 3);
          }
        }).catch(() => {
          displayAlert('Error connecting to the network, please check your Internet connection and try again');
        })
    }
  })
}

if (formLogin) {
  formLogin.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.querySelector('.email').value.toLowerCase();
    const password = document.getElementById('login-password').value;
    fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      body: JSON.stringify({
        email,
        password
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => response.json()).then(res => {
      console.log(res)
      if (res.status === 'success') {
        window.localStorage.token = res.token;
        displayAlert('login Successful', 2);
        isAdmin();
      } else {
        displayAlert(res.message, 3);
      }
    }).catch(() => {
      displayAlert('Error connecting to the network, please check your Internet connection and try again');
    });
  });
}