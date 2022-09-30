const { query } = require('../database/conection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email) return res.status(400).json({ message: "Por favor, preencha o campo e-mail." });
    if (!password) return res.status(400).json({ message: "Por favor, preencha o campo senha." });


    try {
        const { rowCount, rows } = await query('select * from users where email = $1', [email]);

        if (rowCount <= 0) {
            return res.status(400).json({ message: "E-mail ou senha estão incorretos." });
        }

        const [user] = rows;

        const correctPassword = await bcrypt.compare(password, user.password);

        if (!correctPassword) {
            return res.status(400).json({ message: "E-mail ou senha estão incorretos." });          
        }

        const token = jwt.sign({ id: user.id }, 'securePasswordForToken', { expiresIn: '8h' });

        const { password: _, ...dataUser } = user;

        return res.status(200).json({
            user: dataUser,
            token
        })


    } catch (error) {
        return res.status(500).json({ message: `Erro interno: ${error.message}` });
    }
}

module.exports = {
    login
}