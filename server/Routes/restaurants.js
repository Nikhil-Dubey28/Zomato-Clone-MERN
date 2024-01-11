const router = require('express').Router()
const restaurantController = require('../Controllers/restaurant')

router.post('/restaurants', restaurantController.addRestaurant)


router.get('/restaurants', restaurantController.getRestaurants)
router.get('/restaurants/:id',restaurantController.getRestaurantById)
router.get('/restaurants/categories/:id', restaurantController.getRestaurantCategories)
router.get(`/restaurants/specialty/:name`,restaurantController.getRestaurantsBySpecialty)



module.exports = router