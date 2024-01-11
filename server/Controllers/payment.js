const Razorpay = require('razorpay');
const orderController = require('./order')
const Order = require('../Models/Order')
const dotenv = require('dotenv')
const Cart = require('../Models/Cart')

dotenv.config()





const checkout = async (req, res) => {
    try {

        console.log(process.env.RAZORPAY_KEY_ID, process.env.RAZORPAY_KEY_SECRET)
        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });



        const userId = req.userId
        const paymentMode = 'online'
        const {addressId} = req.body

        const options = {
            amount: Number(req.body.amount * 100), // amount in the smallest currency unit
            currency: 'INR',
        };
        console.log(options.amount)

        const order = await razorpay.orders.create(options);

        const newOrder = await orderController.createOrderRazorpay(userId, addressId,paymentMode, order.id)

        res.status(200).json({
            success: true,
            order,
            newOrder,
            key_id: razorpay.key_id
        });
    } catch (err) {
        console.log(err)
        res.status(500).json({
            success: false,
            error: 'Failed to create Razorpay order',
        });
    }
}


const updatePayment = async (req, res) => {
    try {
        console.log(req.body)

        const userId = req.userId

        const { order_id, payment_id, signature_id } = req.body

        const order = await Order.findOne({ razorpayOrderId: order_id })

        if (order) {
            await Order.updateOne(
                { razorpayOrderId: order_id },
                {
                    $set: {
                        status: 'SUCCESS',
                        razorpayPaymentId: payment_id,
                        razorpaySignatureId: signature_id,
                    },
                }
            );
        }
        await Cart.findOneAndUpdate(
            { user: userId },
            { $set: { items: [], restaurant: null, total: 0 } },
            { new: true }
        );
        res.status(200).json({
            success: true,
            message: "payment successful"
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}




module.exports = {
    checkout,
    updatePayment
}