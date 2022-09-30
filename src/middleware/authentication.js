const { query } = require('../database/conection');
const jwt = require('jsonwebtoken');

const authenticationFilter = async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({ message: "Não autorizado." });
    }

    try {
        const token = authorization.replace("Bearer ", '').trim();

        const { id } = jwt.verify(token, "securePasswordForToken");

        const { rowCount, rows } = await query('select * from users where id = $1', [id]);

        if (rowCount <= 0) {
            return res.status(401).json({ message: "Não autorizado." });
        }

        const [user] = rows;

        // Permite que se obtenha os dados do usuário logado em qualquer controlador 
        req.user = user;

        // Continuar com a requisição
        next();
        
    } catch (error) {
        return res.status(500).json({ message: `Erro interno: ${error.message}` }); 
    }
}

module.exports = {
    authenticationFilter
}