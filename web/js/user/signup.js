import 'bootstrap/dist/css/bootstrap.min.css'; 
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { fetchData } from '../fetch/fetch';
import { endpoints } from '../fetch/endpoints';
import { isLogged, pass } from './userContext';

if(isLogged()){
  window.location.href = '/index.html'
}

const firtNameField = document.querySelector('.first-signup-input')
const lastNameField = document.querySelector('.last-signup-input')
const emailField = document.querySelector('.email-signup-input');
const passwordField = document.querySelector('.pwd-signup-input');
const loginBtn = document.querySelector('.signup-btn');
const validation_alert = document.getElementById("validation-alert")

loginBtn.addEventListener('click', async e => {
  e.preventDefault();
  try {
    const res = await fetchData(endpoints.registerUser.url, endpoints.registerUser.method, {
      first_name: firtNameField.value,
      last_name: lastNameField.value,
      email: emailField.value,
      password: passwordField.value,
    });

    console.log(res);
    if(!res.token)
    {
      validation_alert.classList.remove("d-none")
      validation_alert.innerHTML = ''
      if(res.error)
      {
        validation_alert.innerHTML = `- ${res.error} <br>`
        return false;        
      }
      res.errorList[0].map(error=> validation_alert.innerHTML += `- ${error.message} <br>`)
    }
    else
    {
      pass(res.token, res.email, res._id);
      window.location.href = '/index.html'
    }

  } catch (error) {
    console.log(error);
  }
});
