const router = require('express').Router()
const auth = require('../middleware/authenticate')
const paymentController = require('../Controllers/payment')

router.post('/checkout',auth,paymentController.checkout)
router.post('/updateTransactionStatus',auth,paymentController.updatePayment)



module.exports = router