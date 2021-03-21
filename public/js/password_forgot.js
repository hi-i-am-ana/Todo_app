// TODO: Use shared login validation here (module should be added with script tag)
const form = document.getElementById('form');

// Select input fields
const email = document.getElementById('email');

// Select validation alerts
const emailEmptyAlert = document.getElementById('email-empty-alert');
const emailInvalidAlert = document.getElementById('email-invalid-alert');

// Select email missing and unconfirmed alerts - only to clear server-side validation
const emailMissingAlert = document.getElementById('email-missing-alert');
const emailUnconfirmedAlert = document.getElementById('email-unconfirmed-alert');

// Create variable to save validation status
let validForm;

form.onsubmit = (event) => {
  // Get values of input fields
  const emailValue = email.value;

  clearValidation();

  // Validate email (must not be empty and have valid format)
  if (!inputNotEmpty(emailValue)) {
    setInvalid(emailEmptyAlert, email);
  } else if (!emailValid(emailValue)) {
    setInvalid(emailInvalidAlert, email);
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

const setInvalid = (inputAlert, input) => {
  inputAlert.classList.add('display-inline');
  input.classList.add('red-border');
  validForm = false;
};

const clearValidation = () => {
  validForm = true;

  emailEmptyAlert.classList.remove('display-inline');
  emailInvalidAlert.classList.remove('display-inline');
  emailMissingAlert.classList.remove('display-inline');
  emailUnconfirmedAlert.classList.remove('display-inline');

  email.classList.remove('red-border');
};