const express = require('express');
const querystring = require('querystring');
const db = require('../db/database.js');
const loggedOutCheck = require('../middleware.js').loggedOutCheck;

const router = express.Router();

// GET todos
router.get('/', loggedOutCheck, (req, res) => {
  db.each(`SELECT todo_id, name, TO_CHAR(due_date, 'Mon dd, yyyy') due_date, status, priority FROM todos WHERE user_id = $1 ORDER BY due_date ASC, priority ASC;`, req.session.user, row => {
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
    res.render('pages/home', {
      todos: todos,
      title: 'Home | TODO',
      currentUser: req.session.user,
    });
  })
  .catch((err) => res.render('pages/error', {
    err: err,
    title: 'Error | TODO',
    currentUser: req.session.user
  }));
});

// POST new todo
router.post('/', (req, res) => {
  newTodo = {
    user_id: req.session.user,
    name: req.body.name,
    due_date: req.body.due_date,
    status: req.body.status,
    priority: req.body.priority
  };
  db.none('INSERT INTO todos (user_id, name, due_date, status, priority) VALUES (${newTodo.user_id}, ${newTodo.name}, ${newTodo.due_date}, ${newTodo.status}, ${newTodo.priority});', {newTodo})
  // Redirect back to home page with modal opened
  .then(() => {
    const query = querystring.stringify({modal: 'opened'});
    res.redirect(`/?${query}`);
  })
  .catch((err) => res.render('pages/error', {
    err: err,
    title: 'Error | TODO',
    currentUser: req.session.user
  }));
});

// DELETE todo
router.delete('/:id', (req,res) => {
  // console.log(req.body);
  // console.log(req.method);
  // console.log(req.originalMethod);
  db.none('DELETE FROM todos WHERE todo_id = $1;', req.params.id)
  .then(() => res.redirect('/#todo-container'))
  .catch((err) => res.render('pages/error', {
    err: err,
    title: 'Error | TODO',
    currentUser: req.session.user
  }));
});

// Change todo status
router.put('/:id', (req,res) => {
  // console.log(req.body);
  // console.log(req.method);
  // console.log(req.originalMethod);
  db.none('UPDATE todos SET status = $1 WHERE todo_id = $2;', [req.body.status, req.params.id])
  .then(() => res.redirect(`/#todo-${req.params.id}`))
  .catch((err) => res.render('pages/error', {
    err: err,
    title: 'Error | TODO',
    currentUser: req.session.user
  }));
});

module.exports = router;