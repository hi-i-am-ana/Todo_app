// TODO: Use shared signup validation here (module should be added with script tag)
const form = document.getElementById('form');

// Select input fields
const firstname = document.getElementById('firstname');
const lastname = document.getElementById('lastname');
const email = document.getElementById('email');
const password = document.getElementById('password');
const confirmPassword = document.getElementById('confirmPassword');

// Select validation alerts
const firstnameEmptyAlert = document.getElementById('firstname-empty-alert');
const lastnameEmptyAlert = document.getElementById('lastname-empty-alert');
const emailEmptyAlert = document.getElementById('email-empty-alert');
const passwordEmptyAlert = document.getElementById('password-empty-alert');
const confirmPasswordEmptyAlert = document.getElementById('confirmPassword-empty-alert');
const firstnameInvalidAlert = document.getElementById('firstname-invalid-alert');
const lastnameInvalidAlert = document.getElementById('lastname-invalid-alert');
const emailInvalidAlert = document.getElementById('email-invalid-alert');
const passwordInvalidAlert = document.getElementById('password-invalid-alert');
const confirmPasswordMatchAlert = document.getElementById("confirmPassword-match-alert");

// Select email exists alert - only to clear server-side validation
const emailExistsAlert = document.getElementById('email-exists-alert');

const passwordInfo = document.getElementById('password-info');

// Show and hide tooltip with password requirements info
password.onfocus = () => {
  passwordInfo.classList.add('display-inline');
}
password.onblur = () => {
  passwordInfo.classList.remove('display-inline');
}

// Create variable to save validation status
let validForm;

form.onsubmit = (event) => {
  // Get values of input fields
  const firstnameValue = firstname.value;
  const lastnameValue = lastname.value;
  const emailValue = email.value;
  const passwordValue = password.value;
  const confirmPasswordValue = confirmPassword.value;

  clearValidation();

  // Validate first name (must not be empty and have valid format)
  if (!inputNotEmpty(firstnameValue)) {
    setInvalid(firstnameEmptyAlert, firstname);
  } else if (!nameValid(firstnameValue)) {
    setInvalid(firstnameInvalidAlert, firstname);
  };

  // Validate last name (must not be empty and have valid format)
  if (!inputNotEmpty(lastnameValue)) {
    setInvalid(lastnameEmptyAlert, lastname);
  } else if (!nameValid(lastnameValue)) {
    setInvalid(lastnameInvalidAlert, lastname);
  };

  // Validate email (must not be empty and have valid format)
  if (!inputNotEmpty(emailValue)) {
    setInvalid(emailEmptyAlert, email);
  } else if (!emailValid(emailValue)) {
    setInvalid(emailInvalidAlert, email);
  };

  // Validate password (must not be empty and have valid format)
  if (!inputNotEmpty(passwordValue)) {
    setInvalid(passwordEmptyAlert, password);
  } else if (!passwordValid(passwordValue)) {
    setInvalid(passwordInvalidAlert, password);
  };

  // Validate confirm password (must not be empty and match password)
  if (!inputNotEmpty(confirmPasswordValue)) {
    setInvalid(confirmPasswordEmptyAlert, confirmPassword);
  } else if (!passwordMatch(passwordValue,confirmPasswordValue)) {
    setInvalid(confirmPasswordMatchAlert, confirmPassword);
  };

  if (!validForm) {
    event.preventDefault();
  };
};

const inputNotEmpty = (inputValue) => inputValue !== '';

const nameValid = (inputValue) => {
  const nameRegex = /^[a-zA-Z][^0-9_.,!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]*$/;
  return nameRegex.test(inputValue);
};

const emailValid = (inputValue) => {
  const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailRegex.test(inputValue);
};

const passwordValid = (inputValue) => {
  const passwordRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=\S+$).{8,}$/;
  return passwordRegex.test(inputValue);
};

const passwordMatch = (passwordValue, confirmPasswordValue) => passwordValue === confirmPasswordValue;

const setInvalid = (inputAlert, input) => {
  inputAlert.classList.add('display-inline');
  input.classList.add('red-border');
  validForm = false;
};

const clearValidation = () => {
  validForm = true;

  firstnameEmptyAlert.classList.remove('display-inline');
  lastnameEmptyAlert.classList.remove('display-inline');
  emailEmptyAlert.classList.remove('display-inline');
  passwordEmptyAlert.classList.remove('display-inline');
  confirmPasswordEmptyAlert.classList.remove('display-inline');

  firstnameInvalidAlert.classList.remove('display-inline');
  lastnameInvalidAlert.classList.remove('display-inline');
  emailInvalidAlert.classList.remove('display-inline');
  passwordInvalidAlert.classList.remove('display-inline');
  confirmPasswordMatchAlert.classList.remove('display-inline');

  emailExistsAlert.classList.remove('display-inline');

  firstname.classList.remove('red-border');
  lastname.classList.remove('red-border');
  email.classList.remove('red-border');
  password.classList.remove('red-border');
  confirmPassword.classList.remove('red-border');
};

// Password:
// At least 8 chars
// Contains at least one digit
// Contains at least one lower alpha char and one upper alpha char
// Contains at least one char within a set of special chars (@#%$^ etc.)
// Does not contain space, tab, etc.