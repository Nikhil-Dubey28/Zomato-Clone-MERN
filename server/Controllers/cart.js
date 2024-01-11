const Cart = require('../Models/Cart'); 
const mongoose = require('mongoose')
const FoodItem = require('../Models/FoodItem');

//add to cart 

const addOneToCart  = async(req,res) => {
    try {
        const userId  = req.userId
        console.log(userId)
        const {restaurantId} = req.params
        const validRestaurantId = new mongoose.Types.ObjectId(restaurantId);
        const foodItemId = req.params.foodItemId
        console.log(foodItemId)
        const {quantity,price} = req.body
    
        let cart = await Cart.findOne({user:userId})
    
        
        
        if(cart.items.length === 0) {
            cart.restaurant = validRestaurantId
        }
    
       
        
    
        if(!cart) {
            cart = new Cart({user: userId, items: [],total: 0, restaurant:validRestaurantId})
        }
        else if (cart.restaurant && cart.restaurant.toString() !== validRestaurantId.toString()) {
       
            cart.restaurant = validRestaurantId;
            cart.items = []; 
        }
    
    
        // const existingItem = cart.items.find(item => item.foodItem.toString() === foodItemId.toString())  
        let existingItemIndex = cart.items.findIndex(item => item.foodItem.toString() === foodItemId.toString())
        console.log(existingItemIndex)
        if(existingItemIndex !== -1) {
                cart.items[existingItemIndex].quantity = quantity
                cart.items[existingItemIndex].price = price * cart.items[existingItemIndex].quantity
        }else {
            if(quantity > 1) {

                cart.items.push({foodItem:foodItemId,quantity,price: price * quantity})
            }else {
                cart.items.push({foodItem:foodItemId,quantity,price})
            }
            
            
        }
    
    
        cart.total = cart.items.reduce((total,item) => total + item.price,0)
        await cart.save()
        res.status(200).json({message: "Items added successfully", cart})
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: 'Failed to add item to cart', message: error.message });
    }
    }

const getItemQuantity = async(req,res) => {
    try {
        const userId = req.userId
        
        const foodItemId = req.params.foodItemId

        const cart = await Cart.findOne({user:userId})

        if(!cart ||cart.items.quantity === 0) {
            return res.status(200).json({quantity:0})
        }

       const item = cart.items.find(item => item.foodItem.toString() === foodItemId)
       console.log(item,'item')
    

       if(!item) {
        return res.status(200).json({quantity:0})
       }
       return res.status(200).json({ quantity: item.quantity , restaurant : cart.restaurant});

    }catch(error) {
        return res.status(500).json({ error: 'internal server error', message: error.message });
}
}

const removeOneFromCart = async(req,res) => {
    try {
        const userId = req.userId
        const foodItemId = req.params.foodItemId
        const {quantity} = req.body

        let cart = await Cart.findOne({user:userId})
        // .populate({path: 'items.foodItem', select: 'name price'})

        if(!cart){
            return res.status(200).json({message: "No cart found"})
        }
        const foodItem = await FoodItem.findById(foodItemId)
        const existingItemIndex = cart.items.findIndex(item => item.foodItem.toString() === foodItemId.toString())
        

        if(existingItemIndex !== -1) {
            const existingItem = cart.items[existingItemIndex]
            if(quantity == 0) {
                cart.items.splice(existingItemIndex,1)
            }
            if(existingItem.quantity === 1) {
                cart.items.splice(existingItemIndex,1)
            }else if(existingItem.quantity === 0) {
                cart.items.splice(existingItemIndex,1)
            }
            
            else {
               existingItem.quantity = quantity
              
                existingItem.price = existingItem.quantity * foodItem.price
            }
        }

        cart.total = cart.items.reduce((total,item) => total + item.price,0)

        if (cart.items.length === 0) {
            cart.restaurant = null;
          }
        await cart.save()
        return res.status(200).json({ message: 'Item removed successfully', cart });
    }catch(error){
        console.log(error)
        return res.status(500).json({message: "internal server error", error : error.message})
    }
}



const getTotalCartQuantity = async(req,res) => {
    try {
        const userId = req.userId

        let cart = await Cart.findOne({user:userId}).populate({path: "restaurant"})
        if(!cart) {
            return res.status(200).json({quantity:0})   
        }

        let totalQuantity = cart.items.reduce((total,item) => total + item.quantity,0)
        return res.status(200).json({quantity:totalQuantity, total: cart.total, restaurant: cart.restaurant})
    }catch(error) {
        console.log(error)
        return res.status(500).json({ error: 'internal server error', message: error.message });
    }
}

const getCartByUserId = async(req,res) => {
    try{
        const userId = req.userId
        const cart = await Cart.findOne({user:userId})
        .populate({
            path: 'restaurant', // Assuming 'restaurant' is the name of the field referencing the Restaurant model
            select: 'name image', // Selecting specific fields from the Restaurant model
          })
          .populate({
            path: 'items.foodItem',
            select: 'name price isVeg',
          });
           
        console.log(cart)


        if (!cart) {
            return res.status(200).json({ message: 'Cart is empty', cart: [] });
        }

        if(cart.items.length === 0) {
            return res.status(200).json({ message: 'Cart is empty', cart: [] });
        }

        // Extract necessary details for each item in the cart
        const formattedCart = cart.items.map(item => ({
            foodItemName: item.foodItem.name,
            isVeg: item.foodItem.isVeg,
            quantity: item.quantity,
            price: item.price,
            
        }));
        
        const totalCost = cart.total;
        const restaurant =  {
            id : cart.restaurant._id  ,
            name : cart.restaurant.name ,
            img : cart.restaurant.image
        }
        
        
        return res.status(200).json({ cart: formattedCart, totalCost, restaurant });
    }catch(error) {
        console.log(error)
        return res.status(500).json({ error: 'internal server error', message: error.message });
    }
}
module.exports = {
    addOneToCart,
    getItemQuantity,
    removeOneFromCart,
    getTotalCartQuantity,
    getCartByUserId
}
// const formattedCart = cart.items.map((item) => {
//     const foodItemName = item.foodItem.name;
//     const quantity = item.quantity;
//     const price = item.price;

//     let restaurantName = '';
//     let restaurantImage = '';

//     if (item.foodItem && item.foodItem.restaurant) {
//         restaurantName = item.foodItem.restaurant.name || '';
//         restaurantImage = item.foodItem.restaurant.image || '';
//     }

//     return {
//         foodItemName,
//         quantity,
//         price,
//         restaurantName,
//         restaurantImage,
//     };
// });