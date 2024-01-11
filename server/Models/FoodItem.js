const mongoose = require('mongoose')


const foodItemsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    category : {
        type: String
    },
//     category: {
        
        
//             id: {
//             type: mongoose.Schema.Types.ObjectId ,
//              ref: 'Category',
//              required: true
//             },
//         name:{
//             type: String,
//             required: true,
//         }
    
    
// },
//     restaurant: {
//         id: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: 'Restaurant',
//             required: true,
//         },
//         name: {
//             type: String,
//             required: true,
//         },
//     },
   restaurant : {type: mongoose.Schema.Types.ObjectId},

    image: {
        type: String,
        
    },
    description: {
        type: String,
        // required: true,
        
    },
    isVeg: {
        type: Boolean
    }
    
})

const FoodItem = mongoose.model('FoodItem', foodItemsSchema)

module.exports = FoodItem