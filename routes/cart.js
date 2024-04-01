const express = require('express');
const cartRouter = express.Router();
const auth = require('../middlewares/auth');
const  Cart  = require('../models/cart');
const { Product } = require("../models/product");

cartRouter.get('/api/get-cart',auth, async (req, res) => {
    try{
          
          let cart = await Cart.findOne({userId: req.user});
          res.json(cart);
    }catch(e){
          res.status(500).json({error: e.message});
    }     
});
cartRouter.delete('/api/remove-from-cartt', auth, async (req, res) => {
    try {
        const { id } = req.body;
        let cart = await Cart.findOne({ userId: req.user });

        if (!cart) {
            return res.status(404).json({ message: "No cart found for this user." });
        } else {
            // cart exists for user
            let itemIndex = cart.products.findIndex(p => p.product._id.equals(id));

            if (itemIndex > -1) {
                // product exists in the cart, update the quantity or remove it
                let productItem = cart.products[itemIndex];
                productItem.quantity--;
                if (productItem.quantity <= 0) {
                    cart.products.splice(itemIndex, 1);
                } else {
                    cart.products[itemIndex] = productItem;
                }
            } else {
                return res.status(404).json({ message: "Product not found in cart." });
            }
        }
        cart = await cart.save();
        res.json(cart);
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
});

cartRouter.post('/api/add-to-cartt', auth, async (req, res) => {
    try {
        const { id } = req.body;
        const product = await Product.findById(id);
        let cart = await Cart.findOne({ userId: req.user });

        if (!cart) {
            // no cart for user, create new cart
            cart = new Cart({
                userId: req.user,
                products: [{ product, quantity: 1 }]
            });
        } else {
            // cart exists for user
            let itemIndex = cart.products.findIndex(p => p.product._id.equals(product._id));

            if (itemIndex > -1) {
                // product exists in the cart, update the quantity
                let productItem = cart.products[itemIndex];
                productItem.quantity++;
                cart.products[itemIndex] = productItem;
            } else {
                // product does not exist in the cart, add new item
                cart.products.push({ product, quantity: 1 });
            }
        }
        cart = await cart.save();
        res.json(cart);
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
});

    module.exports = cartRouter;