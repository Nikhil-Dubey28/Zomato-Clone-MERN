const mongoose = require('mongoose')

const restaurantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        default: 0,
    },
    averageCost : {
        type: Number,
        // default: 0
    },
    categories : [{type: mongoose.Schema.Types.ObjectId, ref: 'Category'}],
    foodItems:[
        {
            // category : {type: mongoose.Schema.Types.ObjectId, ref: 'Category'},
            category : {type: String},
            items: [{type: mongoose.Schema.Types.ObjectId, ref: 'FoodItem'}]
        
        }
    
    ],
    image: {
        type: String
    },
    restaurantType : {
        type: String
    },
    logo: {
        type: String
    }
    

    
})

const Restaurant = mongoose.model('Restaurant', restaurantSchema)

module.exports = Restaurant