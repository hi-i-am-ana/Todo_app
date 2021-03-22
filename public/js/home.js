// CHANGING STATUS

const radioStatusList = document.getElementsByClassName('radio-status');

for (let radio of radioStatusList) {
  radio.onchange = () => {
    const splittedRadioId = radio.id.split('-');
    const todoId = splittedRadioId[2];
    const submitButtonId = `change-todo-status-button-${todoId}`;
    const submitButton = document.getElementById(submitButtonId);
    submitButton.click();
  };
};

// VALIDATION

const newTodoForm = document.getElementById('new-todo-form');

// Select input fields
const name = document.getElementById('name');
const dueDate = document.getElementById('due_date');
// const priority = document.getElementById('priority');
// const status = document.getElementById('status');

// Select validation alerts
const nameEmptyAlert = document.getElementById('name-empty-alert');
const dueDateEmptyAlert = document.getElementById('due_date-empty-alert');
// const priorityEmptyAlert = document.getElementById('priority-empty');
// const statusEmptyAlert = document.getElementById('status-empty-alert');

// Create variable to save validation status
let validForm;

newTodoForm.onsubmit = (event) => {
  // Get values of input fields
  const nameValue = name.value;
  const dueDateValue = dueDate.value;
  // const priorityValue = priority.value;
  // const statusValue = status.value;

  clearValidation();

  // Validate name (must not be empty)
  if (!inputNotEmpty(nameValue)) {
    setInvalid(nameEmptyAlert, name);
  };

  // Validate due date (must not be empty)
  if (!inputNotEmpty(dueDateValue)) {
    setInvalid(dueDateEmptyAlert, dueDate);
  };

  if (!validForm) {
    event.preventDefault();
  };
};

const inputNotEmpty = (inputValue) => inputValue !== '';

const setInvalid = (inputAlert, input) => {
  inputAlert.classList.add('display-block');
  input.classList.add('red-border');
  validForm = false;
};

const clearValidation = () => {
  validForm = true;

  nameEmptyAlert.classList.remove('display-block');
  dueDateEmptyAlert.classList.remove('display-block');

  name.classList.remove('red-border');
  dueDate.classList.remove('red-border');
};