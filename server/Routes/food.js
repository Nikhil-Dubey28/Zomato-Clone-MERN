const router = require('express').Router()

const foodController = require('../Controllers/food')

router.post('/food', foodController.addFood)
router.get('/food/:restaurantId/:categoryId', foodController.getFoodByCategoryAndRestaurant)
router.get('/food/:restaurantId', foodController.getFoodItemsByRestaurant)



module.exports = router