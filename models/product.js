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
    selectedFrangrance:{
        required: false,
        type: String,
    },
    category:{
        required: true,
        type: String,
    },
    waxType:{
        required: false,
        type: String,
    },
    burnTime:{
        required: false,
        type: String,
    },
    availableFragrances:[{
        required: false,
        type: String,
    }],
    netWeight:{
        required: false,
        type: String,
    },
    ratings: [
        ratingSchema
    ],
 });

 const Product = mongoose.model('Product', productSchema);
 module.exports = {Product, productSchema};
