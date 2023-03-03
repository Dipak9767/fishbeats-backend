const mongoose = require('mongoose')

const CartSchema = new mongoose.Schema({
    userid: { type: String, unique: true },
    cartItems: [
        {
            productId: String,
            quantity: Number,
            imgUrl:String,
            name: String,
            price: Number
        }
    ]
})

const CartModel = mongoose.model('cart', CartSchema)
module.exports = CartModel;