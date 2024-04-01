const express = require('express');
const userRouter = express.Router();
const auth = require('../middlewares/auth');
const { Product } = require("../models/product");
const User = require("../models/user");
const Order = require('../models/order');
const  Cart  = require('../models/cart');

userRouter.post('/api/add-to-cart', auth, async (req, res) => {
    try {
        const { id } = req.body;
        const product = await Product.findById(id);
        let user = await User.findById(req.user);
        if (user.cart.length == 0) {
            user.cart.push({ product, quantity: 1 });
        } else {
            let isProductFound = false;
            for (let i = 0; i < user.cart.length; i++) {
                if (user.cart[i].product._id.equals(product._id)) {
                    isProductFound = true;
                }
            }
            if (isProductFound) {
                let productt = user.cart.find((cartItem) => cartItem.product._id.equals(product._id));
                productt.quantity++;
            } else {
                user.cart.push({ product, quantity: 1 });
            }
        }
        user = await user.save();
        res.json(user);
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
});

userRouter.get('/api/cart', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        let totalAmount = 0;
        user.cart.forEach(item => {
            totalAmount += item.product.price * item.quantity;
        });

        res.json({ cart: user.cart, totalAmount });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

userRouter.delete('/api/remove-from-cart/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);
        let user = await User.findById(req.user);

        for (let i = 0; i < user.cart.length; i++) {
            if (user.cart[i].product._id.equals(product._id)) {
                if (user.cart[i].quantity == 1) {
                    user.cart.splice(i, 1);
                } else {
                    user.cart[i].quantity--;
                }
            }
        }
        user = await user.save();
        res.json(user);
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
});
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

userRouter.post('/api/order', auth, async (req, res) => {
    try {
        const { cartItems, totalPrice, address } = req.body;
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
        let order = new Order({
            products,
            totalPrice,
            address,
            userId: req.user,
            orderedAt: new Date().getTime(),
        });
        order = await order.save();

        let cart = await Cart.findOne({userId: req.user});
        cart.products = [];
        cart = await cart.save();

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
