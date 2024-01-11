const mongoose = require('mongoose')


const specialtySchema  = new mongoose.Schema({
    name: {
        type:String
    },
    image: {
        type:String
    },
    restaurant: [{type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant'}]
})


const Specialty = mongoose.model('Specialty', specialtySchema)

module.exports = Specialty




























