const express = require('express');
const { login } = require('./controllers/login');
const { registerUser, getUserProfile } = require('./controllers/user');
const { authenticationFilter } = require('./middleware/authentication');

const routes = express();

routes.post('/user', registerUser);
routes.post('/login', login);

routes.use(authenticationFilter); // Rotas abaixo dessa linha passam pelo filtro de autenticação

routes.get('/user', getUserProfile);

module.exports = {
    routes
}