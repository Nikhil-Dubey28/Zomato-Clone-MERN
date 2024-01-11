const Category = require('../Models/Category')
const Restaurant = require('../Models/Restaurant')  

const addCategory = async (req, res) => {
    try{

        const { name } = req.body
        const category = new Category({
            name
        })
        await category.save()
        res.status(200).json(category)
    }catch(err) {
        console.log(err)
        res.status(500).json({
            message: 'Error adding category'
        })
    }
}



const updateCategory = async (req, res) => {
    try {

        const restaurants = await Restaurant.find()
        const { name} = req.body
        const category = await Category.findOne({name})

        if(category) {
            category.restaurants = restaurants.map((r) => r._id)
            await category.save()
            res.status(200).json(category)
        }else {
            res.status(404).json({
                message: 'Category not found'
            })
        }

        




        
    }catch(err) {
        console.log(err)
        res.status(500).json({
            message: 'Error adding category'
        })
    }
}
   
// const getRestaurantCategories = async (req, res) => {
//     try{

//         const {restaurantId} = req.params 
//         const category = await Category.find({restaurant: restaurantId})
//         res.status(200).json(category)
//     }catch(err) {
//         console.log(err)
//         res.status(500).json({
//             message: 'Error getting category'
//         })
//     }
// }
const getRestaurantCategories = async (req, res) => {
    try {
        const { id } = req.params;
        const restaurant = await Restaurant.findById(id).populate({
          path: 'foodItems.category',
           // Excluding _id from the result
        });
    
        if (restaurant) {
          const categories = restaurant.foodItems.map(item => item.category);
          console.log(categories)
          return res.status(200).json(categories);
        } else {
          return res.status(404).json({
            message: 'Restaurant not found'
            
          });
        }
      } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' });
      }
}

module.exports = {
        addCategory,
        updateCategory,
        getRestaurantCategories
    }


