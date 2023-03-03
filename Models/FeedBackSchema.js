const mongoose = require('mongoose')

const FeedBackSchema = mongoose.Schema({
    username:String,
    userId:String,
    imgUrl:String,
    message:String
})

 const FeedBackModel = mongoose.model('feedback',FeedBackSchema)
 module.exports = FeedBackModel; 