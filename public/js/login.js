// TODO: Use shared login validation here (module should be added with script tag)
const form = document.getElementById('form');

// Select input fields
const email = document.getElementById('email');
const password = document.getElementById('password');

// Select validation alerts
const emailEmptyAlert = document.getElementById('email-empty-alert');
const passwordEmptyAlert = document.getElementById('password-empty-alert');
const emailInvalidAlert = document.getElementById('email-invalid-alert');
const passwordInvalidAlert = document.getElementById('password-invalid-alert');

// Select email missing and unconfirmed and password incorrect alerts - only to clear server-side validation
const emailMissingAlert = document.getElementById('email-missing-alert');
const emailUnconfirmedAlert = document.getElementById('email-unconfirmed-alert');
const passwordIncorrectAlert = document.getElementById('password-incorrect-alert');

// Create variable to save validation status
let validForm;

form.onsubmit = (event) => {
  // Get values of input fields
  const emailValue = email.value;
  const passwordValue = password.value;

  clearValidation();

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

  if (!validForm) {
    event.preventDefault();
  };
};

const inputNotEmpty = (inputValue) => inputValue !== '';

const emailValid = (inputValue) => {
  const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailRegex.test(inputValue);
};

const passwordValid = (inputValue) => {
  const passwordRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=\S+$).{8,}$/;
  return passwordRegex.test(inputValue);
};

const setInvalid = (inputAlert, input) => {
  inputAlert.classList.add('visibility-visible');
  input.classList.add('red-border');
  validForm = false;
};

const clearValidation = () => {
  validForm = true;

  emailEmptyAlert.classList.remove('visibility-visible');
  passwordEmptyAlert.classList.remove('visibility-visible');

  emailInvalidAlert.classList.remove('visibility-visible');
  passwordInvalidAlert.classList.remove('visibility-visible');

  emailMissingAlert.classList.remove('visibility-visible');
  emailUnconfirmedAlert.classList.remove('visibility-visible');
  passwordIncorrectAlert.classList.remove('visibility-visible');

  email.classList.remove('red-border');
  password.classList.remove('red-border');
};