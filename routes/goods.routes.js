const {Router} = require('express')
const mysql = require('mysql');

const router = Router()

// /api/goods/getGoods
router.get('/getGoods', async (req, res) => {
    const connection = mysql.createConnection({
        host: '',
        user: '',
        password: '',
        database: 'GoodsManager'
    })
    connection.connect()

    connection.query(`SELECT * FROM GoodsManager.view_goods_catalog_info`, (error, results, fields) => {
        res.status(200).json(results)
    })
})

// /api/goods/getGoodsByType
router.post('/getGoodsByType', async (req, res) => {
    try {
        const {IDtg} = req.body

        const connection = mysql.createConnection({
            host: '',
            user: '',
            password: '',
            database: 'GoodsManager'
        })
        connection.connect()

        connection.query(`SELECT * FROM GoodsManager.view_goods_catalog_info WHERE IDtg LIKE ${IDtg}`, (error, results, fields) => {
            res.status(200).json(results)
        })
    } catch (e) {
        res.status(500).json({message: `Что-то не так (${e.message})`})
    }
})


// /api/goods/getCart
router.post('/getCart', async (req, res) => {
    try {
        const {pID} = req.body

        const connection = mysql.createConnection({
            host: '',
            user: '',
            password: '',
            database: 'GoodsManager'
        })
        connection.connect()

        connection.query(`SELECT * FROM GoodsManager.view_cart_goods WHERE pID LIKE '${pID}'`, (error, results, fields) => {
            res.status(200).json(results)
        })
    } catch (e) {
        res.status(500).json({message: `Что-то не так (${e.message})`})
    }
})

// /api/goods/postCart
router.post('/postCart', async (req, res) => {
    try {
        const {pID, IDgc, num} = req.body

        const connection = mysql.createConnection({
            host: '',
            user: '',
            password: '',
            database: 'GoodsManager'
        })
        connection.connect()

        connection.query(`SELECT * FROM GoodsManager.cart WHERE IDgc LIKE ${IDgc}`, (error, results, fields) => {
            if (results.length) {
                connection.query(`UPDATE GoodsManager.cart SET cNum = ${results[0].cNum + 1} WHERE pID = ${pID} AND IDgc = ${IDgc}`)
                res.status(200).json({message: "ok"});
            } else {
                connection.query(`INSERT GoodsManager.cart(IDgc, pID, cNum) VALUES ('${IDgc}', '${pID}', '${num}');`)
                res.status(201).json({message: "ok"});
            }
        })
    } catch (e) {
        res.status(500).json({message: `Что-то не так (${e.message})`})
    }
})

// /api/goods/setNumCartGood
router.post('/setNumCartGood', async (req, res) => {
    try {
        const {pID, IDgc, cNum} = req.body

        const connection = mysql.createConnection({
            host: '',
            user: '',
            password: '',
            database: 'GoodsManager'
        })
        connection.connect()

        connection.query(`UPDATE GoodsManager.view_cart_goods SET cNum = ${cNum} WHERE IDgc LIKE ${IDgc} AND pID LIKE ${pID}`)
        res.status(200).json({message: "ok"})
    } catch (e) {
        res.status(500).json({message: `Что-то не так (${e.message})`})
    }
})

// /api/goods/removeCartGood
router.post('/removeCartGood', async (req, res) => {
    try {
        const {pID, IDgc} = req.body

        const connection = mysql.createConnection({
            host: '',
            user: '',
            password: '',
            database: 'GoodsManager'
        })
        connection.connect()

        connection.query(`DELETE FROM GoodsManager.cart WHERE IDgc LIKE ${IDgc} AND pID LIKE ${pID}`)
        res.status(200).json({message: "ok"})
    } catch (e) {
        res.status(500).json({message: `Что-то не так (${e.message})`})
    }
})

// /api/goods/getType
router.get('/getType', async (req, res) => {
    const connection = mysql.createConnection({
        host: '',
        user: '',
        password: '',
        database: 'GoodsManager'
    })
    connection.connect()

    connection.query(`SELECT * FROM GoodsManager.type_goods`, (error, results, fields) => {
        res.status(200).json(results)
    })
})


router.get('/getParamName', async (req, res) => {
    const connection = mysql.createConnection({
        host: '',
        user: '',
        password: '',
        database: 'GoodsManager'
    })
    connection.connect()

    connection.query(`SELECT * FROM GoodsManager.param_name`, (error, results, fields) => {
        res.status(200).json(results)
    })
})

// /api/goods/getParamGood
router.post('/getParamGood', async (req, res) => {
    try {
        const {IDgc} = req.body

        const connection = mysql.createConnection({
            host: '',
            user: '',
            password: '',
            database: 'GoodsManager'
        })
        connection.connect()

        connection.query(`SELECT * FROM GoodsManager.view_goods_param WHERE IDgc = ${IDgc}`, (error, results, fields) => {
            res.status(200).json(results)
        })
    } catch (e) {
        res.status(500).json({message: `Что-то не так (${e.message})`})
    }
})

// /api/goods/getParam
router.post('/getParam', async (req, res) => {
    try {
        const {IDpar, IDtg} = req.body

        const connection = mysql.createConnection({
            host: '',
            user: '',
            password: '',
            database: 'GoodsManager'
        })
        connection.connect()

        connection.query(`SELECT gpVal FROM GoodsManager.view_goods_param WHERE IDpar LIKE ${IDpar} AND IDtg LIKE ${IDtg}`, (error, results, fields) => {
            res.status(200).json(results)
        })
    } catch (e) {
        res.status(500).json({message: `Что-то не так (${e.message})`})
    }
})

router.post('/postGood', async (req, res) => {
    try {
        const {gcParams, mainParams} = req.body
        let query = '';

        const connection = mysql.createConnection({
            host: '',
            user: '',
            password: '',
            database: 'GoodsManager'
        })
        connection.connect()

        connection.query(`INSERT GoodsManager.goods_catalog(gcName, IDtg, gcDescription, gcPhoto, gcCost) VALUES ('${gcParams.gcName}', '${gcParams.IDtg}', '${gcParams.gcDescription}', '${gcParams.gcPhoto}', '${gcParams.gcCost}')`, (error, results, fields) => {
            mainParams.forEach(el => {
                query += `('${results.insertId}', '${Number(el.IDpar)}', '${el.gpVal}'),`
            })
            query = query.slice(0, -1) + ";"
            // connection.query(`INSERT GoodsManager.storage(IDgc, sCount) VALUES ('${results.insertId}', '${Number(gcParams.sCount)}')`, (error, results, fields) => {
            connection.query(`INSERT GoodsManager.goods_param(IDgc, IDpar, gpVal) VALUES ` + query, (error, results, fields) => {
                res.status(200).json(results)
            })
            // })
        })
    } catch (e) {
        res.status(500).json({message: `Что-то не так (${e.message})`})
    }
})

router.post('/postOrder', async (req, res) => {
    try {
        const {pID, date} = req.body

        const connection = mysql.createConnection({
            host: '',
            user: '',
            password: '',
            database: 'GoodsManager'
        })
        connection.connect()

        connection.query(`INSERT GoodsManager.orders(pID, orDate) VALUES ('${pID}', '${date}')`, (error, results, fields) => {
            res.status(201).json({message: "ok"});
        })
    } catch (e) {
        res.status(500).json({message: `Что-то не так (${e.message})`})
    }
})

router.post('/IsOrder', async (req, res) => {
    try {
        const {pID} = req.body

        const connection = mysql.createConnection({
            host: '',
            user: '',
            password: '',
            database: 'GoodsManager'
        })
        connection.connect()

        connection.query(`SELECT * FROM GoodsManager.orders WHERE pID LIKE ${pID}`, (error, results, fields) => {
            if (results.length) {
                res.status(201).json({res: true});
            } else {
                res.status(201).json({res: false});
            }

        })
    } catch (e) {
        res.status(500).json({message: `Что-то не так (${e.message})`})
    }
})

router.get('/getOper', async (req, res) => {
    const connection = mysql.createConnection({
        host: '',
        user: '',
        password: '',
        database: 'GoodsManager'
    })
    connection.connect()

    connection.query(`SELECT * FROM GoodsManager.view_operation`, (error, results, fields) => {
        res.status(200).json(results)
    })
})

router.get('/getAllOrders', async (req, res) => {
    try {
        const connection = mysql.createConnection({
            host: '',
            user: '',
            password: '',
            database: 'GoodsManager'
        })
        connection.connect()

        connection.query(`SELECT * FROM GoodsManager.view_person_order_info`, (error, results, fields) => {
            res.status(200).json(results)
        })
    } catch (e) {
        res.status(500).json({message: `Что-то не так (${e.message})`})
    }
})

router.get('/getSuppliers', async (req, res) => {
    try {
        const connection = mysql.createConnection({
            host: '',
            user: '',
            password: '',
            database: 'GoodsManager'
        })
        connection.connect()

        connection.query(`SELECT * FROM GoodsManager.suppliers_catalog`, (error, results, fields) => {
            res.status(200).json(results)
        })
    } catch (e) {
        res.status(500).json({message: `Что-то не так (${e.message})`})
    }
})

router.post('/sale', async (req, res) => {
    try {
        const {IDor, date} = req.body

        const connection = mysql.createConnection({
            host: '',
            user: '',
            password: '',
            database: 'GoodsManager'
        })
        connection.connect()

        connection.query(`update GoodsManager.storage s, GoodsManager.cart c set s.sCount = s.sCount - c.cNum where s.IDgc IN (select IDgc from GoodsManager.cart where cart.pID = (SELECT pID from orders where IDor = ${IDor})) and c.cNum IN (select cNum from cart nc where nc.IDgc = s.IDgc);`, (error, results, fields) => {
            connection.query(`INSERT into GoodsManager.operations(oDateTime, oIsSale) VALUES ('${date}', 1)`, (error, results, fields) => {
                connection.query(`select IDgc, cNum from GoodsManager.cart where pID = (select pID from GoodsManager.orders where IDor = ${IDor})`, (error, results, fields) => {
                    let qString = []
                    results.forEach(id => {
                        qString.push(`((select IDoperation from operations where oDateTime = '${date}'), ${id.IDgc}, ${id.cNum})`)
                    })
                    qString = qString.join(', ')
                    // console.log(qString)

                    connection.query(`insert into GoodsManager.op_goods_list(IDoperation, IDgc, ocCount) values ${qString}`, (error, results, fields) => {
                        connection.query(`DELETE from GoodsManager.cart where pID = (SELECT pID from orders where IDor = ${IDor})`, (error, results, fields) => {
                            connection.query(`DELETE from GoodsManager.orders where IDor = ${IDor}`, (error, results, fields) => {
                                res.status(201).json({res: true})
                            })
                        })
                    })
                })
            })
        })
    } catch (e) {
        res.status(500).json({message: `Что-то не так (${e.message})`})
    }
})

router.post('/supply', async (req, res) => {
    try {
        const {date, goodsInfo, sup} = req.body

        const connection = mysql.createConnection({
            host: '',
            user: '',
            password: '',
            database: 'GoodsManager'
        })
        connection.connect()

        connection.query(`INSERT into GoodsManager.operations(oDateTime, oIsSale, IDsc) VALUES ('${date}', 0, ${sup.IDsc})`, (error, results, fields) => {
            let qString = []
            goodsInfo.forEach(good => {
                qString.push(`((select IDoperation from operations where oDateTime = '${date}'), ${good.IDgc}, ${good.cNum})`)
            })
            qString = qString.join(', ')

            connection.query(`insert into GoodsManager.op_goods_list(IDoperation, IDgc, ocCount) values ${qString}`, (error, results, fields) => {
                let qCase = []
                let id = []
                goodsInfo.forEach(good => {
                    qCase.push(`when ${good.IDgc} then sCount + ${good.cNum}`)
                    id.push(`${good.IDgc}`)
                })
                qCase = qCase.join(' ')
                id = id.join(', ')

                connection.query(`update GoodsManager.storage set sCount = case IDgc ${qCase} else null end where IDgc in (${id})`, (error, results, fields) => {
                    res.status(201).json({res: true})
                })
            })
        })
    } catch (e) {
        res.status(500).json({message: `Что-то не так (${e.message})`})
    }
})

module.exports = router