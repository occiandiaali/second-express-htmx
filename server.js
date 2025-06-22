const fs = require('fs');
const path = require('path');
const express = require('express');
const ejs = require('ejs');
const users = require('./data/_mock_users');
const { title } = require('process');

const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));


const renderWithLayout = (res, view, title) => {
  res.render('layout', {
    title,
    body: ejs.render(fs.readFileSync(__dirname + `/views/pages/${view}.ejs`, 'utf8'))
  });
};

app.get('/', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 8;
  const start = (page - 1) * limit;
  const end = start + limit;
  const paginatedUsers = users.slice(start, end);
  const totalPages = Math.ceil(users.length / limit);

  const homeTemplate = fs.readFileSync(path.join(__dirname, 'views/pages/home.ejs'), 'utf-8');
  const body = ejs.render(homeTemplate, {
    users: paginatedUsers,
    currentPage: page,
    totalPages
  });

//   res.render('layout', {
//     title: 'Home',
//     body: ejs.render(
//       fs.readFileSync(__dirname + '/views/pages/home.ejs', 'utf8'),
//       { users: paginatedUsers, currentPage: page, totalPages }
//     )
//   });
  res.render('layout', {
    title: 'Home',
    body
  })
});

app.get('/about', (req, res) => renderWithLayout(res, 'about', 'About'));
app.get('/notifications', (req, res) => renderWithLayout(res, 'notifications', 'Notifications'));
app.get('/settings', (req, res) => renderWithLayout(res, 'settings', 'Settings'));

app.get('/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  res.render('partials/user-modal', { user });
});


const PORT = 3000;
app.listen(PORT, () => console.log('Server started on http://localhost:',PORT, '...'));
