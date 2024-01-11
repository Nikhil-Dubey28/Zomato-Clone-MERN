const Restaurant = require('../Models/Restaurant')
const Category = require('../Models/Category')  

const addRestaurant = async (req, res) => {
    try{

        const categories = await Category.find()

        const { name, rating, } = req.body
        const restaurant = new Restaurant({
            name,
            rating : rating || 0,
            categories : categories.map((c) => c._id)
        })
        await restaurant.save()
        res.status(200).json(restaurant)
    }catch(err) {
        console.log(err)
        res.status(500).json({
            message: 'Error adding restaurant'
        })
    }
}

// const getRestaurant = async(req,res) => {
//     try{
//         const restaurants = await Restaurant.find()

//         res.status(200).json(restaurants)
//     }catch(err) {
//         console.log(err)
//         res.status(500).json({
//             message: "error"
//         })
        
//     }
// }

const getRestaurants = async (req,res) => {
    try {
        let sortBy = 'rating'
        let sortOrder = -1


        if(req.query.sortBy){
            sortBy = req.query.sortBy.toLowerCase() === 'rating' ? 'rating' :
            sortBy = req.query.sortBy.toLowerCase() === 'cost' ? 'averageCost' : 'name'
        }
        if (req.query.sortOrder) {
            sortOrder = req.query.sortOrder.toLowerCase() === 'desc' ? -1 : 1;
        }
        

        const restaurants = await Restaurant.find()
        .sort({[sortBy] : sortOrder})
        .exec()

        return res.status(200).json(restaurants)
    }catch(error) {
        console.log(error)
        res.status(500).json({
            message: 'Error getting restaurants'
        })
    }
}

const getRestaurantById = async (req, res) => {
    try {
        const { id } = req.params
        const restaurant = await Restaurant.findOne({_id: id})
        if(restaurant) {
            res.status(200).json(restaurant)
        }else {
            res.status(404).json({
                message: 'Restaurant not found'
            })
        }
    }catch(err) {
        console.log(err)
        res.status(500).json({
            message: 'Error getting restaurant'
        })
    }
}

// const getRestaurantCategories = async (req, res) => {
//     try {
//         const { id } = req.params
//         const restaurant = await Restaurant.findById(id)
//         if(restaurant) {
//             const categoryNames = restaurant.categories; // Assuming restaurant.categories contains category names
//             // const categories = await Category.find({ name: { $in: categoryNames } });
//             const categories = await Category.aggregate([
//                 { $match: { name: { $in: categoryNames } } },
//                 {
//                     $addFields: {
//                         order: {
//                             $indexOfArray: [categoryNames, '$name']
//                         }
//                     }
//                 },
//                 { $sort: { order: 1 } }
//             ]);
//            return res.status(200).json(categories)
//         }else {
//            return res.status(404).json({
//                 message: 'Restaurant not found'
//             })
//         }
//     }catch(err) {
//         console.log(err)
//         res.status(500).json({
//             message: 'Error getting restaurant'
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


const getRestaurantsBySpecialty = async (req,res) => {
    try{

        let sortBy = 'rating'
        let sortOrder = 1


        if(req.query.sortBy){
            sortBy = req.query.sortBy.toLowerCase() === 'rating' ? 'rating' : 'name'
        }
        if (req.query.sortOrder) {
            sortOrder = req.query.sortOrder.toLowerCase() === 'desc' ? -1 : 1;
        }
            const {name} = req.params
            
            const restaurants = await Restaurant.find({specialty : {$in : [name]}})
            .sort({[sortBy] : sortOrder})
            .exec()

            if (restaurants.length > 0) {
                return res.status(200).json(restaurants);
            } else {
                return res.status(404).json({
                    message: `No restaurants found with '${name}' as a specialty.`
                });
            }
    }catch(err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' });
    }
}
module.exports = {
    addRestaurant,
    getRestaurantById,
    getRestaurants,
    getRestaurantCategories,
    getRestaurantsBySpecialty
}