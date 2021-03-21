const validation = (firstnameValue, firstnameEmptyAlert, firstnameInvalidAlert, lastnameValue, lastnameEmptyAlert, lastnameInvalidAlert, emailValue, emailEmptyAlert, emailInvalidAlert, passwordValue, passwordEmptyAlert, passwordInvalidAlert, confirmPasswordValue, confirmPasswordEmptyAlert, confirmPasswordMatchAlert, setInvalid) => {
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

  // Validate first name (must not be empty and have valid format)
  if (!inputNotEmpty(firstnameValue)) {
    setInvalid(firstnameEmptyAlert);
  } else if (!nameValid(firstnameValue)) {
    setInvalid(firstnameInvalidAlert);
  };

  // Validate last name (must not be empty and have valid format)
  if (!inputNotEmpty(lastnameValue)) {
    setInvalid(lastnameEmptyAlert);
  } else if (!nameValid(lastnameValue)) {
    setInvalid(lastnameInvalidAlert);
  };

  // Validate email (must not be empty and have valid format)
  if (!inputNotEmpty(emailValue)) {
    setInvalid(emailEmptyAlert);
  } else if (!emailValid(emailValue)) {
    setInvalid(emailInvalidAlert);
  };

  // Validate password (must not be empty and have valid format)
  if (!inputNotEmpty(passwordValue)) {
    setInvalid(passwordEmptyAlert);
  } else if (!passwordValid(passwordValue)) {
    setInvalid(passwordInvalidAlert);
  };

  // Validate confirm password (must not be empty and match password)
  if (!inputNotEmpty(confirmPasswordValue)) {
    setInvalid(confirmPasswordEmptyAlert);
  } else if (!passwordMatch(passwordValue,confirmPasswordValue)) {
    setInvalid(confirmPasswordMatchAlert);
  };
};

module.exports = validation;

// Password:
// At least 8 chars
// Contains at least one digit
// Contains at least one lower alpha char and one upper alpha char
// Contains at least one char within a set of special chars (@#%$^ etc.)
// Does not contain space, tab, etc.