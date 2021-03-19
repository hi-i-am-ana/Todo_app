const express = require('express');
const querystring = require('querystring');
const db = require('../db/database.js');
// const loggedOutCheck = require('../middleware.js').loggedOutCheck;
const router = express.Router();

// Get todos
router.get('/', (req, res) => {
  db.each('SELECT * FROM todos ORDER BY status ASC, priority ASC, due_date ASC;', [], row => {
    const priorities = {
      1: 'High',
      2: 'Medium',
      3: 'Low'
    };
    const statuses = {
      1: 'Todo',
      2: 'In progress',
      3: 'Review',
      4: 'Done'
    };
    row.priority = priorities[row.priority];
    row.status = statuses[row.status];
  })
  .then((todos) => {
    console.log(todos)
    res.render('pages/home', {
      todos: todos,
      title: 'Home | TODO',
      // current_user: req.session.user,
      // modal: req.query.modal
    });
  })
  .catch((err) => res.render('pages/error', {
    err: err,
    title: 'Error | TODO',
    // current_user: req.session.user
  }));
});

// Post new schedule
router.post('/', (req, res) => {
  console.log(req.body.due_date);
  newTodo = {
    // user_id: req.session.user.user_id,
    user_id: req.body.user_id,
    name: req.body.name,
    due_date: req.body.due_date,
    status: req.body.status,
    end_time: req.body.priority
  };
  db.none('INSERT INTO todos (user_id, name, due_date, status, priority) VALUES (${newTodo.user_id}, ${newTodo.due_date}, ${newTodo.status}, ${newTodo.priority});', {newTodo})
  // Redirect back to home page with modal opened
  .then(() => {
    const query = querystring.stringify({modal: 'opened'});
    res.redirect(`/?${query}`);
  })
  .catch((err) => res.render('pages/error', {
    err: err,
    title: 'Error | TODO',
    // current_user: req.session.user
  }));
});

// Delete todo
router.delete('/:id', (req,res) => {
  // console.log(req.body);
  // console.log(req.method);
  // console.log(req.originalMethod);
  db.none('DELETE FROM todos WHERE todo_id = $1;', req.body.todo)
  .then(() => res.redirect('/'))
  .catch((err) => res.render('pages/error', {
    err: err,
    title: 'Error | TODO',
    // current_user: req.session.user
  }));
});

module.exports = router;