const { query } = require('../database/conection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cache = require('../cache');

const login = async (req, res) => {
    const { email, password } = req.body;
    // console.log(password)

    if (!email || !password) {
        return res.status(400).json({ message: "E-mail e senha são obrigatórios." });
    }

    try {
        const { rowCount, rows } = await query('select * from users where email = $1', [email]);

        if (rowCount <= 0) {
            return res.status(400).json({ message: "E-mail ou senha estão incorretos." })
        }

        const [user] = rows;
        // console.log(rows)

        const correctPassword = await bcrypt.compare(password, user.password); // retorna true ou false
        // console.log(correctPassword)
        // console.log(user.password)

        if (!correctPassword) {
            return res.status(400).json({ message: "E-mail ou senha estão incorretos." });       
        }

        const token = jwt.sign({ id: user.id }, 'securePasswordForToken', { expiresIn: '6h' });


        /////////    buscando a informações da cache para retorná-las    ////////

        const cached = await cache.get(user.id)

        if (cache) {
            return cached;
        }

        /////////    buscando a informações da cache para retorná-las    ////////


        const { password: _, ...dataUser } = user;

        /////////    passando os parâmetros do set cache     ////////

        cache.set(rows, dataUser, 60 * 15); // definido tempo de 15 minutos

        /////////     passando os parâmetros do set cache     ////////

        return res.status(200).json({
            user: dataUser,
            token
        });
        
    } catch (error) {
        return res.status(500).json({ message: `Internal error: ${error.message}` }); 
    }
}

module.exports = {
    login
}