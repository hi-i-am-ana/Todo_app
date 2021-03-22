const radioStatusList = document.getElementsByClassName('radio-status');

for (let radio of radioStatusList) {
  radio.onchange = () => {
    const submitButtonId = `change-todo-status-button-${radio.id.slice(-2)}`;
    const submitButton = document.getElementById(submitButtonId);
    submitButton.click();
  };
};

const newTodoForm = document.getElementById('new-todo-form');

// Select input fields
const name = document.getElementById('name');
const dueDate = document.getElementById('due_date');
const priority = document.getElementById('priority');
const status = document.getElementById('status');

// Select validation alerts
const nameEmptyAlert = document.getElementById('name-empty-alert');
const dueDateEmptyAlert = document.getElementById('due_date-empty-alert');
const priorityEmptyAlert = document.getElementById('priority-empty');
const statusEmptyAlert = document.getElementById('status-empty-alert');

// Create variable to save validation status
let validForm;

newTodoForm.onsubmit = (event) => {
  // Get values of input fields
  const nameValue = name.value;
  const dueDateValue = dueDate.value;
  const priorityValue = priority.value;
  const statusValue = status.value;

  clearValidation();

  // Validate name (must not be empty)
  if (!inputNotEmpty(nameValue)) {
    setInvalid(nameEmptyAlert, name);
  };

  // Validate due date (must not be empty)
  if (!inputNotEmpty(dueDateValue)) {
    setInvalid(dueDateEmptyAlert, dueDate);
  };

  // Validate priority (must not be empty)
  if (!inputNotEmpty(priority)) {
    setInvalid(priorityEmptyAlert, priority);
  };

  // Validate status (must not be empty)
  if (!inputNotEmpty(status)) {
    setInvalid(statusEmptyAlert, status);
  };

  if (!validForm) {
    event.preventDefault();
  };
};

const inputNotEmpty = (inputValue) => inputValue !== '';

const  timeValid = (startTimeValue, endTimeValue) => startTimeValue < endTimeValue;

const setInvalid = (inputAlert, input) => {
  inputAlert.style.display = 'inline';
  input.style.border = 'solid 1px red';
  validForm = false;
};

const clearValidation = () => {
  validForm = true;

  dayEmptyAlert.style.display = 'none';
  startTimeEmptyAlert.style.display = 'none';
  endTimeEmptyAlert.style.display = 'none';
  timeInvalidAlert.style.display = 'none';

  day.style.border = '';
  startTime.style.border = '';
  endTime.style.border = '';
};