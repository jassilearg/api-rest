const { query } = require('../database/conection');
const bcrypt = require('bcrypt');

const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name) return res.status(400).json({ message: "Por favor, preencha o campo nome." });
    if (!email) return res.status(400).json({ message: "Por favor, preencha o campo e-mail." });
    if (!password) return res.status(400).json({ message: "Por favor, preencha o campo senha." });

    try {
        const user = await query('select * from users where email = $1', [email]);

        if (user.rowCount > 0) {
            return res.status(400).json({ message: "Esse e-mail já está cadastrado." });
        }

        const encryptedPassword = await bcrypt.hash(password, 10);

        const registerQuery = 'insert into users (name, email, password) values ($1, $2, $3) returning *';
        const registerParam = [name, email, password];
        const registeredUser = await query(registerQuery, registerParam);

        if (registeredUser <= 0) {
            return res.status(500).json({ message:` Erro interno: ${error.message}` });
        }

        const { password: _, ...register } = registerUser.rows[0]; 

        return res.status(201).json(register);


    } catch (error) {
        return res.status(500).json({ message:` Erro interno: ${error.message}` });
    }
}

module.exports = {
    registerUser
};