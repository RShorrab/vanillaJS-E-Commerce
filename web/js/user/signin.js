import 'bootstrap/dist/css/bootstrap.min.css'; 
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { fetchData } from '../fetch/fetch';
import { endpoints } from '../fetch/endpoints';
import { isLogged, pass } from './userContext';


if(isLogged())
{
  window.location.href = '/index.html'
}

const emailField = document.querySelector('.email-signin-input');
const passwordField = document.querySelector('.pwd-signin-input');
const loginBtn = document.querySelector('.login-btn');
const validation_alert = document.getElementById("validation-alert")

loginBtn.addEventListener('click', async e => {
  e.preventDefault();
  try 
  {
    const res = await fetchData(endpoints.loginUser.url, endpoints.loginUser.method, {
      email: emailField.value,
      password: passwordField.value,
    });
    
    if(!res.token)
    {
      validation_alert.classList.remove("d-none")
      validation_alert.innerHTML = ''
      res.errorList[0].map(error=> validation_alert.innerHTML += `- ${error.message} <br>`)
    }
    else
    {
      pass(res.token, res.email, res._id);
      window.location.href = '/index.html'
    }

  } 
  catch (error) 
  {
    console.log(error);
  }
});
