const express = require('express');
const userRouter = express.Router();
const auth = require('../middlewares/auth');
const { Product } = require("../models/product");
const User = require("../models/user");
const Order = require('../models/order');
const  Cart  = require('../models/cart');

userRouter.post('/api/save-user-address', auth, async (req, res) => {
    try {
        const { address } = req.body;
        let user = await User.findById(req.user);
        user.address = address;
        user = await user.save();
        res.json(user);

    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

userRouter.post('/api/order', async (req, res) => {
    try {
        const { cartItems, totalPrice, userId, transactionId, paymentState ,customerNumber , customerName , customerAddressLine , customerCity , customerState , customerPincode } = req.body;
        let order;
       if(paymentState === "COMPLETED"){
         let products = [];
        for (let i = 0; i < cartItems.length; i++) {
            let product = await Product.findById(cartItems[i].product._id);
            if (product.quantity >= cartItems[i].quantity) {
                product.quantity -= cartItems[i].quantity;
                products.push({ product, quantity: cartItems[i].quantity });
                await product.save();
            } else {
                return res.status(400).json({ msg: `${product.name} is out of stock` });
            }
        }
         order = new Order({
            products,
            totalPrice,
            userId: userId,
            transactionId: transactionId,
            paymentState: paymentState,
            customerName: customerName,
            customerAddressLine: customerAddressLine,
            customerCity: customerCity,
            customerState: customerState,
            customerPincode: customerPincode,
            customerNumber: customerNumber,
            orderedAt: new Date().getTime(),
        });
        order = await order.save();
        let cart = await Cart.findOne({userId: userId});
        cart.products = [];
        cart = await cart.save();
    }else{
        let products = [];
        for (let i = 0; i < cartItems.length; i++) {
            let product = await Product.findById(cartItems[i].product._id);
            if (product.quantity >= cartItems[i].quantity) {
                product.quantity -= cartItems[i].quantity;
                products.push({ product, quantity: cartItems[i].quantity });
                await product.save();
            } else {
                return res.status(400).json({ msg: `${product.name} is out of stock` });
            }
        }
        order = new Order({
            products,
            totalPrice,
            userId: userId,
            transactionId: transactionId,
            paymentState: paymentState,
            customerName: customerName,
            customerAddressLine: customerAddressLine,
            customerCity: customerCity,
            customerState: customerState,
            customerPincode: customerPincode,
            customerNumber: customerNumber,
            orderedAt: new Date().getTime(),
        });
        order = await order.save();
    }
        res.json(order);
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
});

userRouter.get('/api/orders/me', auth, async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user });
        res.json(orders);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});
module.exports = userRouter;
