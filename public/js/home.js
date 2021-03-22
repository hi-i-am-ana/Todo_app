const radioStatusList = document.getElementsByClassName('radio-status');

for (let radio of radioStatusList) {
  radio.onchange = () => {
    const submitButtonId = `change-todo-status-button-${radio.id.slice(-2)}`;
    const submitButton = document.getElementById(submitButtonId);
    submitButton.click();
  };
};



// const form = document.getElementById('form');

// // Select input fields
// const day = document.getElementById('day');
// const startTime = document.getElementById('start_time');
// const endTime = document.getElementById('end_time');

// // Select validation alerts
// const dayEmptyAlert = document.getElementById('day-empty-alert');
// const startTimeEmptyAlert = document.getElementById('start-time-empty-alert');
// const endTimeEmptyAlert = document.getElementById('end-time-empty-alert');
// const timeInvalidAlert = document.getElementById('time-invalid-alert');

// // Create variable to save validation status
// let validForm;

// form.onsubmit = (event) => {
//   // Get values of input fields
//   const dayValue = day.value;
//   const startTimeValue = startTime.value;
//   const endTimeValue = endTime.value;

//   clearValidation();

//   // Validate day (must not be empty)
//   if (!inputNotEmpty(dayValue)) {
//     setInvalid(dayEmptyAlert, day);
//   };

//   // Validate start time (must not be empty)
//   if (!inputNotEmpty(startTimeValue)) {
//     setInvalid(startTimeEmptyAlert, startTime);
//   };

//   // Validate end time (must not be empty)
//   if (!inputNotEmpty(endTimeValue)) {
//     setInvalid(endTimeEmptyAlert, endTime);
//   };

//   // Validate time (end time must be later than start time)
//   if (!timeValid(startTimeValue, endTimeValue) && inputNotEmpty(startTimeValue) && inputNotEmpty(endTimeValue)) {
//     setInvalid(timeInvalidAlert, endTime);
//   };

//   if (!validForm) {
//     event.preventDefault();
//   };
// };

// const inputNotEmpty = (inputValue) => inputValue !== '';

// const  timeValid = (startTimeValue, endTimeValue) => startTimeValue < endTimeValue;

// const setInvalid = (inputAlert, input) => {
//   inputAlert.style.display = 'inline';
//   input.style.border = 'solid 1px red';
//   validForm = false;
// };

// const clearValidation = () => {
//   validForm = true;

//   dayEmptyAlert.style.display = 'none';
//   startTimeEmptyAlert.style.display = 'none';
//   endTimeEmptyAlert.style.display = 'none';
//   timeInvalidAlert.style.display = 'none';

//   day.style.border = '';
//   startTime.style.border = '';
//   endTime.style.border = '';
// };