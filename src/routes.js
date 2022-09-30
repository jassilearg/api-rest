const express = require('express');
const { login } = require('./controllers/login');
const { registerUser } = require('./controllers/user');

const routes = express();

routes.post('/user', registerUser);
routes.post('/login', login)

module.exports = {
    routes
};