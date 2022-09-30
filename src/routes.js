const express = require('express');
const { login } = require('./controllers/login');
const { registerUser } = require('./controllers/user');
const { authenticationFilter } = require('./middleware/authentication');

const routes = express();

routes.post('/user', registerUser);
routes.post('/login', login);

routes.use(authenticationFilter);

module.exports = {
    routes
};