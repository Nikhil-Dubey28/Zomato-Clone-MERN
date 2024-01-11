const router = require('express').Router()

const auth = require('../middleware/authenticate')

const orderController = require('../Controllers/order')


router.post('/order', auth, orderController.createOrder)
router.get('/order/:orderId',auth,orderController.getOrderById)
router.get('/order',auth,orderController.getOrderByUserId)


module.exports = router 


