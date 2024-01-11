const router = require('express').Router()

const addressController = require('../Controllers/address')
const auth = require('../middleware/authenticate')

router.post('/address', auth, addressController.createAddress)
router.get('/address', auth, addressController.getAddress)
router.put('/address', auth, addressController.editAddress)
router.delete('/address/:addressId', auth , addressController.deleteAddress)


module.exports = router