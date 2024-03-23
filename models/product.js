const mongoose = require('mongoose');   
const ratingSchema = require('./rating');
 const productSchema = new mongoose.Schema({
    name: {
        required: true,
        type: String,
        trim: true,
    },
    description:{
        required: true,
        type: String,
        trim: true,
    },
    price:{
        required: true,
        type: Number,
        trim: true,
    },
    images:[{ 
        type: String,
        required: true,
     }],
     quantity:{
        required: true,
        type: Number,
    },
    category:{
        required: true,
        type: String,
    },
    ratings: [
        ratingSchema
    ],
 });

 const Product = mongoose.model('Product', productSchema);
 module.exports = {Product, productSchema};
