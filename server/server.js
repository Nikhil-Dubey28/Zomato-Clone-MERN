const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config()  
const mongoose = require('mongoose')


const categoryRoutes = require('./Routes/category')
const restaurantRoutes = require('./Routes/restaurants')
const foodRoutes = require('./Routes/food')
const cartRoutes = require('./Routes/cart')
const userRoutes = require('./Routes/user')
const addressRoutes = require('./Routes/address')
const orderRoutes = require('./Routes/order')
const paymentRoutes = require('./Routes/payment')
const cors = require('cors');

const app = express()


app.use(cors())
app.use(bodyParser.json())

app.get("/api/getkey", (req, res) =>
  res.status(200).json({ key: process.env.RAZORPAY_KEY_ID })
);

app.use('/api', categoryRoutes)
app.use('/api', restaurantRoutes)
app.use('/api', foodRoutes)
app.use('/api',userRoutes)
app.use('/api',cartRoutes)
app.use('/api',addressRoutes)
app.use('/api',orderRoutes)
app.use('/api', paymentRoutes)
// app.use('/api',addressRoutes)

const dbName = process.env.DB_NAME
const dbUrl = process.env.DB_URL
// Connect to MongoDB
mongoose.connect(dbUrl, { dbName })
    .then(() => {
        console.log(`connected to ${dbName} database`)
    })
    .catch((err) => {
        console.log('error connecting to database', err)
    })
app.listen(process.env.PORT || 3000, () => {
    console.log('Server is running on port 3000')
})

