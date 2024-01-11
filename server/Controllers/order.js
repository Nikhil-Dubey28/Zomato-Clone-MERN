const Order = require('../Models/Order')
const Cart  = require('../Models/Cart')

const createOrder = async (req,res)=> {
try {
    const  userId = req.userId
    const {paymentMode} = req.body
    const {addressId} = req.body
    
    const cart = await Cart.findOne({user:userId})
    .populate({path:"restaurant",select:"_id name image"})
    .populate({path:"items.foodItem",select:"name price isVeg"})
    

    if(!cart) {
        return res.status(404).json({message:"Cart not found"})
    }

    const formattedCart = cart.items.map(item => ({
        foodItemName: item.foodItem.name,
        isVeg: item.foodItem.isVeg,
        quantity: item.quantity,
        price: item.price,
        
    }));

    const restaurant = {
        _id: cart.restaurant._id,
        restaurantName: cart.restaurant.name,
        restaurantImage: cart.restaurant.image
    }

    


    

    const newOrder = new Order ({
        user: userId,
        restaurant: restaurant,
        address: addressId,
        total: cart.total,
        cart: formattedCart,
        paymentMode: paymentMode,
        status: 'SUCCESS'
       
    })


    await newOrder.save()


    res.status(201).json({message:"Order created successfully",newOrder})

    // cart.items = []
    // cart.restaurant = null 
    // cart.total = 0

    // await cart.save()

     await Cart.findOneAndUpdate(
        { user: userId },
        { $set: { items: [], restaurant: null, total: 0 } },
        { new: true }
    );
    


}catch(err) {
console.log(err)
return res.status(500).json({message: "internal server error"})
}
}


const createOrderRazorpay = async (userId,addressId,paymentMode,orderId)=> {
    try {
        
        
        const cart = await Cart.findOne({user:userId})
        .populate({path:"restaurant",select:"_id name image"})
        .populate({path:"items.foodItem",select:"name price isVeg"})
    
        if(!cart) {
            return 
        }
    
        const formattedCart = cart.items.map(item => ({
            foodItemName: item.foodItem.name,
            isVeg: item.foodItem.isVeg,
            quantity: item.quantity,
            price: item.price,
            
        }));
    
        const restaurant = {
            _id: cart.restaurant._id,
            restaurantName: cart.restaurant.name,
            restaurantImage: cart.restaurant.image
        }
    
    
        
    
        const newOrder = new Order ({
            user: userId,
            address: addressId,
            restaurant: restaurant,
            total: cart.total,
            cart: formattedCart,
            paymentMode: paymentMode,
            status:'pending',
            razorpayOrderId : orderId
        })
    
    
        await newOrder.save()
    
        
    
        // res.status(201).json({message:"Order created successfully",newOrder})
    
        // cart.items = []
        // cart.restaurant = null 
        // cart.total = 0
    
        // await cart.save()
    
        //  await Cart.findOneAndUpdate(
        //     { user: userId },
        //     { $set: { items: [], restaurant: null, total: 0 } },
        //     { new: true }
        // );

        console.log(newOrder)
        return newOrder
        
    
    
    }catch(err) {
    console.log(err)
    // return res.status(500).json({message: "internal server error"})
    }
    }


const getOrderById  = async (req,res) => {
    try{
            const {orderId} = req.params

            const order = await Order.findById(orderId).populate({path:"address"})

            

            return res.status(200).json(order)

    }catch(err){
console.log(err)
return res.status(500).json({message: "internal server error"})
    }
}

const getOrderByUserId = async (req,res) => {
    try {
            const userId = req.userId

            const orders = await Order.find({user: userId, status: 'SUCCESS'}).sort({date: -1})

            return res.status(200).json(orders)
    }catch(err) {
console.log(err)
return res.status(500).json({message: "internal server error"})
    }
}

module.exports  = {
    createOrder,
    getOrderById,
    getOrderByUserId,
    createOrderRazorpay
}