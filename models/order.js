const mongoose = require("mongoose");
const { productSchema } = require("./product");

const orderSchema = mongoose.Schema({
    products: [
        {
            product: productSchema,
            quantity: {
                type: Number,
                required: true,
            },
        },
    ],
    totalPrice: {
        type: Number,
        required: true,
    },
    userId: {
        required: true,
        type: String,
    },
    orderedAt: {
        type: Number,
        required: true,
    },
    status: {
        type: Number,
        default: 0,
    },
    transactionId: {
        type: String,
        required: false,
    },
    paymentState: {
        type: String,
        required: false,
    },
    customerName: {
        type: String,
        required: false,
    },
    customerAddressLine: {
        type: String,
        required: false,
    },
    customerCity: {
        type: String,
        required: false,
    },
    customerState: {
        type: String,
        required: false,
    },
    customerPincode: {
        type: String,
        required: false,
    },
    customerNumber: {
        type: String,
        required: false,
    },
});

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;