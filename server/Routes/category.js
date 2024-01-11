const router = require('express').Router()

const categoryController = require('../Controllers/category')

router.post('/categories', categoryController.addCategory)
router.put('/categories', categoryController.updateCategory)
router.get('/categories/:id', categoryController.getRestaurantCategories)

module.exports = router