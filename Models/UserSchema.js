const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    id:{type:String , unique:true},
    username:{type:String},
    email:{type:String , unique:true},
    password:String,
    imgUrl:String,
    number:Number,
    address:String
})

const UserModel = mongoose.model("User",UserSchema)
module.exports = UserModel;