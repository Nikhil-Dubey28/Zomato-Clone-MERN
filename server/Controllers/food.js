const FoodItem = require('../Models/FoodItem')
const Category = require('../Models/Category')
const Restaurant = require('../Models/Restaurant')

// const addFood = async (req, res) => {
//     try {
//         const {name, price, category, restaurant, image, description} = req.body

//         const food = new FoodItem({
//             name,
//             price,
//             category,
//             restaurant,
//             image,
//             description
//         })

//         await food.save()
//         res.status(200).json(food)

//     } catch (error) {
//         console.log(error)
//         res.status(500).json({
//             message: 'Error adding food'
//         })
//     }
// }




// Assuming you're using Express
const addFood = async (req, res) => {
  try {
    const {
      name,
      price,
      category,
      image,
      description,
      isVeg
    } = req.body;

    // Create a new food item
    const newFoodItem = await FoodItem.create({
      name,
      price,
      image,
      category,
      restaurant : req.body.restaurantId,
      description,
      isVeg
    });

    // Find the restaurant by ID (assuming you have the restaurant ID in req.body.restaurantId)
    const restaurant = await Restaurant.findById(req.body.restaurantId);

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    // Check if the category already exists in restaurant's foodItems array
    const categoryIndex = restaurant.foodItems.findIndex(item => item.category === category);

    if (categoryIndex === -1) {
      // If category does not exist, create a new category and add the food item
      restaurant.foodItems.push({
        category,
        items: [newFoodItem._id]
      });
    } else {
      // If category exists, add the food item to the existing category
      restaurant.foodItems[categoryIndex].items.push(newFoodItem._id);
    }

    // Save the updated restaurant
    await restaurant.save();

    return res.status(201).json({ message: 'Food item added successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server Error' });
  }
};


const getFoodByCategoryAndRestaurant = async(req,res)=> {
    try {
        const {restaurantId} = req.params  
        const{categoryId} = req.params
        
        console.log(categoryId)
        console.log(restaurantId)
        const food = await FoodItem.find({'restaurant.id': restaurantId, 'category.id':categoryId})

        // const foodItems = await FoodItem.find({ 'restaurant.id': restaurantId, 'category.id': categoryId });

        


        res.status(200).json(food)
    }catch(err) {
        console.log(err)
        res.status(500).json({
            message:"something went wrong"
        })
    }

    
}

// const  getFoodItemsByRestaurant = async(req,res) => {
// try {
//     const {restaurantId} = req.params
//     // const restaurant = await Restaurant.findById( restaurantId)

// //     const food = await FoodItem.find({'restaurant.id': restaurantId})
// //         console.log(food)
// //    return res.status(200).json(food)



       

// }catch(err){
//     console.log(err)
// }

// }
const  getFoodItemsByRestaurant = async(req,res) => {
    const { restaurantId } = req.params;

    try {
      // Find the restaurant by its ID
      const restaurant = await Restaurant.findById(restaurantId).populate({
        // path: 'foodItems.category foodItems.items',
        path: 'foodItems.items',
      });
  
      if (!restaurant) {
        return res.status(404).json({ message: 'Restaurant not found' });
      }

      const foodItems = restaurant.foodItems;
  
      res.status(200).json(foodItems);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server Error' });
    }

}


module.exports = {
    addFood,
    getFoodByCategoryAndRestaurant,
    getFoodItemsByRestaurant
}