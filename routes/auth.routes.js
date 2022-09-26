const {Router} = require('express')
const bcrypt = require('bcrypt')
const mysql = require('mysql');
const jwt = require('jsonwebtoken')

const router = Router()
const salt = "";

// /api/auth/register
router.post('/register', async (req, res) => {
    try {
        const {login, email, password} = req.body
        const hashPass = bcrypt.hashSync(password, salt)

        const connection = mysql.createConnection({
            host: '',
            user: '',
            password: '',
            database: 'GoodsManager'
        })
        connection.connect()

        connection.query(`SELECT * FROM GoodsManager.people WHERE pLogin LIKE '${login}'`, (error, results, fields) => {
            if (results.length)
                res.status(400).json({message: 'Такой пользователь уже существует'})
            else
                connection.query(`SELECT * FROM GoodsManager.people WHERE pEmail LIKE '${email}'`, (error, results, fields) => {
                    if (results.length)
                        res.status(400).json({message: 'Такой пользователь уже существует'})
                    else {
                        connection.query(`INSERT GoodsManager.people(pLogin, pPassword, pEmail) VALUES ('${login}', '${hashPass}', '${email}');`)
                        res.status(201).json({message: "Пользователь создан"})
                    }
                })
        })
    } catch (e) {
        res.status(500).json({message: `Что-то не так (${e.message})`})
    }
})


// /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const {login, password} = req.body
        const hashPass = bcrypt.hashSync(password, salt)

        const connection = mysql.createConnection({
            host: '',
            user: '',
            password: '',
            database: 'GoodsManager'
        })
        connection.connect()

        connection.query(`SELECT * FROM GoodsManager.people WHERE pLogin LIKE '${login}';`, (error, results, fields) => {
            if(results.length) {
                if(results[0].pPassword === hashPass) {
                    const token = jwt.sign(
                        {userId: results[0].pID},
                        "secret",
                        {expiresIn: '1h'}
                    )
                    res.status(201).json({message: "Пользователь есть и пароль совпадает", token, userId: results[0].pID, login:results[0].pLogin})
                }
                else
                    res.status(400).json({message: "Пользователь есть но пароль не совпадает"})
            }
            else
                res.status(400).json({message: 'Пользователя не существует'})
        })
    } catch (e) {
        res.status(500).json({message: 'Что-то не так'})
    }
})

router.post('/token',async (req, res) => {
    try {
        const {token} = req.body

        jwt.verify(token, 'secret', (err, decoded) => {
            if(!err) {
                res.status(200).json({res: true})
            } else {
                res.status(200).json({res: false})
            }
        });
    } catch (e) {
        res.status(500).json({message: 'Что-то не так'})
    }
})

module.exports = router
