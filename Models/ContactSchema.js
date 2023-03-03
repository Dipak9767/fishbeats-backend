
const mongoose = require('mongoose')

const ContactSchema = mongoose.Schema({
    name:String,
    email:String,
    message:String
})

 const ContactModel = mongoose.model('contact',ContactSchema)
 module.exports = ContactModel; 