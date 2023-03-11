const express = require('express');
const mongoose = require('mongoose')
const app = express()
const cors = require('cors')
const User = require('./Models/UserSchema');
const ProductModel = require('./Models/Product');
const CartModel = require('./Models/CartSchema');
const ContactModel = require('./Models/ContactSchema');
const FeedBackModel = require('./Models/FeedBackSchema');

app.use(cors())
app.use(express.json())

app.listen(process.env.PORT || 5000, () => {
    console.log(`Server started on port`);
});


mongoose.connect('mongodb+srv://dipakfirake9767:Firake9767@cluster0.s0iws4o.mongodb.net/fishbeats?retryWrites=true&w=majority')
    .then(() => console.log('connected'))

app.post('/signup', async (req, res) => {
    const { username, id, password, email, imgUrl, number, address } = req.body
    const isUserExits = await User.findOne({ email })
    if (isUserExits) {
        res.json({ message: 'email exits' })
    }
    else {
        try {
            const userDoc = await User.create({
                username,
                id,
                password,
                email,
                imgUrl,
                number,
                address
            });
            res.json({ message: 'success', data: userDoc });
        } catch (e) {
            console.log(e);
            res.status(400).json(e);
        }
    }

})

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const isUserExits = await User.findOne({ email })

    if (isUserExits) {
        if (isUserExits.password === password) {

            res.json({ message: "login Success", data: isUserExits })
        } else {
            res.json({ message: "wrong password" })
        }
    } else {
        res.json({ message: "username does't exits" })
    }
})

app.get('/',async(req,res)=>{
    res.json({message:'started'})
})

app.post('/addproduct', async (req, res) => {
    const { id, name, desc, price, category, quantity, imgUrl } = req.body
    try {

        const productDoc = await ProductModel.create({
            name,
            id,
            price,
            quantity,
            desc,
            category,
            imgUrl
        })
        res.json({ data: productDoc })
    }
    catch (e) {
        console.log(e)
    }
})


app.get('/products', async (req, res) => {
    try {
        const products = await ProductModel.find();
        res.json({ data: products })
    }
    catch (e) {
        console.log(e)
    }
})


app.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json({ data: users })
    }
    catch (e) {
        console.log(e)
    }
})

app.post('/addtocart', async (req, res) => {
    try {
        const userid = req.body.userid
        const { cartItems } = req.body
        const isCart = await CartModel.findOne({ userid });

        if (isCart) {
            const newItems = [...isCart.cartItems, cartItems]
            const { _id } = isCart;
            const result = await CartModel.findByIdAndUpdate(_id, { cartItems: newItems })
            res.json({ data: result })
        } else {
            const addToCart = await CartModel.create({ userid, cartItems })
            res.json({ data: addToCart })
        }
    } catch (e) {
        console.log(e)
    }
})

app.put('/cart/quantity', async (req, res) => {
    try {
        const { userid, productid, type } = req.body
        const isCart = await CartModel.findOne({ userid });
        let filteredData = null;
        if (type === 'delete') {
            filteredData = isCart.cartItems.filter((item) => item.productId !== productid)
        } else {
            filteredData = isCart.cartItems.map((item) => {
                if (item.productId === productid) {
                    if (type === 'increament') {
                        item.quantity += 1;
                    } else if (type === 'decreament' && item.quantity > 1) {

                        item.quantity -= 1
                    }
                    return item;
                }
                return item
            })
        }
        const { _id } = isCart;
        const result = await CartModel.findByIdAndUpdate(_id, { cartItems: filteredData })
        res.json({ data: result })
    } catch (e) {
        console.log(e)
    }
})
app.put('/editproduct/:id', async (req, res) => {
    try {
        const _id = req.params.id
        const { imgUrl, userId } = req.body
        const { name, desc, price, category, quantity, id } = req.body.editData
        const updatedProduct = await ProductModel.findByIdAndUpdate(_id, { name, desc, price, category, quantity, imgUrl });

        const cart = await CartModel.findOne({ userid: userId })
        const { _id: cartId } = cart;
        const updatedcart = cart.cartItems.map((item) => {
            if (item.productId === id) {
                item.price = price;
                item.name = name;
                item.imgUrl = imgUrl
            }
            return item;
        })
        const result = await CartModel.findByIdAndUpdate(cartId, { cartItems: updatedcart })
        res.json(updatedProduct);

    } catch (e) {
        console.log(e)
    }
})

app.put('/deleteproduct/:id', async (req, res) => {
    try {
        const _id = req.params.id
        const { userId, id } = req.body
        const updatedProducts = await ProductModel.findByIdAndDelete(_id)

        const cart = await CartModel.findOne({ userid: userId })
        const { _id: cartId } = cart;
        const updatedcart = cart.cartItems.filter((item) => item.productId !== id)
        const result = await CartModel.findByIdAndUpdate(cartId, { cartItems: updatedcart })
    } catch (e) {
        console.log(e)
    }
})
app.get('/cart/:id', async (req, res) => {

    const id = req.params.id;
    try {
        const cart = await CartModel.findOne({ userid: id })
        res.json({ data: cart })
    } catch (e) {

    }
})

app.get('/product/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const product = await ProductModel.findOne({ id });
        res.json({ data: product })
    }
    catch (e) {
        console.log(e);
        res.status(400).json({ data: e })
    }
})

app.post('/contact/submit', async (req, res) => {
    const { name, email, message } = req.body;

    try {
        const contact = await ContactModel.create({ name, email, message })
        res.json(contact)
    }
    catch (e) {
        console.log(e)
    }
})


app.post('/feedback/submit', async (req, res) => {
    const { username, userId, imgUrl, message } = req.body;

    try {
        const feedback = await FeedBackModel.findOne({ userId })
        if (feedback) {
            const _id = feedback._id
            const updatedFeedBack = await FeedBackModel.findByIdAndUpdate(_id, { message })
            res.json(updatedFeedBack)
        } else {
            const updatedFeedBack = await FeedBackModel.create({ username, userId, imgUrl, message })
            res.json(updatedFeedBack)
        }

    }
    catch (e) {
        console.log(e)
    }
})


app.get('/feedbacks', async (req, res) => {
    const feedbacks = await FeedBackModel.find();
    res.json(feedbacks)
})
