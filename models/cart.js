const mongoose = require('mongoose');
const { productSchema } = require('./product');
const cartSchema = new mongoose.Schema({  
    userId:{
        type: String,
        required: true,
    },
    products: [
        {
            product: productSchema,
            quantity: {
                type: Number,
                required: true,
            },
        },
    ],
    },{
        timestamps: true,
    });

    const Cart = mongoose.model('cart', cartSchema);
    module.exports = Cart;