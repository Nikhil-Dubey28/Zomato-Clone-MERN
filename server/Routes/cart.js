const router = require('express').Router();

const cartController = require('../Controllers/cart');
const auth = require('../middleware/authenticate');

router.get('/cart/quantity/:foodItemId', auth,cartController.getItemQuantity);
router.post('/cart/add/:foodItemId/:restaurantId',auth, cartController.addOneToCart);
router.put('/cart/remove/:foodItemId', auth,cartController.removeOneFromCart);
router.get(`/cart/quantity`,auth,cartController.getTotalCartQuantity)
// router.put('/cart/add/:foodItemId', cartController.addOneToCart);
router.get(`/cart`,auth,cartController.getCartByUserId)


module.exports = router;