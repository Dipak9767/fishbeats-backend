const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema({
    id:{type:String , unique:true},
    name:String,
    desc:String,
    price:String,
    category:String,
    quantity:String,
    imgUrl:String
})

const ProductModel = mongoose.model('product',ProductSchema)
module.exports = ProductModel;