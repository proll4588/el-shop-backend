const express = require('express')

const app = express()
app.use(express.json({extended:true}))


//---Подключение файлов с обработкой api запросов---//

app.use('/api/auth', require('./routes/auth.routes'))
/*
*
* /api/auth/register    - Регистрация пользователя
* type = post
* req = {login, email, password}
*   login - логин пользователя
*   email - адрес почты пользователя
*   password - пароль пользователя
*
* /api/auth/login       - Вход в систему
* type = post
* req = {login, password}
*   login - логин пользователя
*   password - пароль пользователя
*
*/

app.use('/api/goods', require('./routes/goods.routes'))
/*
*
* /api/goods/getGoods   - Отправка всех товаров
* type = get
* req = {}
*
* /api/goods/getGoodsByType - Отправка товаров опр. типа
* type = post
* req = {IDtg}
*   IDtg - ID типа товара
*
* /api/goods/getCart    - Отправка всех товаров корзины пользователя
* type = post
* req = {pID}
*   pID - ID пользователя
*
* /api/goods/postCart   - Добавление товара в карзину пользователя
* type = post
* req = {pID, IDgc, num}
*   pID - ID пользователя
*   IDgc - ID товара
*   num - кол-во товара
*
* /api/goods/setNumCartGood - Изменение кол-во товара в корзине
* type = post
* req = {pID, IDgc, cNum}
*   pID - ID пользователя
*   IDgc - ID товара
*   cNum - кол-во товара
*
* /api/goods/removeCartGood - Удаление товара из корзины
* type = post
* req = {pID, IDgc}
*   pID - ID пользователя
*   IDgc - ID товара
*
* /api/goods/getType - Отправка всех типов товара
* type = get
*
* /api/goods/getParamGood - Отправка параметров товара
* type = post
* req = {IDgc}
*   IDgc - ID товара
*
* /api/goods/getParam - Отправка параметров товара опр. типа
* type = post
* req = {IDpar, IDtg}
*   IDtg - ID тип товара
*   IDpar - ID параметра
*
*/


// Запуск сервера
app.listen(5000,()=> {
    console.log("app started")
})