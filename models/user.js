const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        required: true,
        type: String,
        trim: true,
    },
    email: {
        required: true,
        type: String,
        trim: true,
        validate: {
            validator:  (value)=>{
                const re =  /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
                 return value.match(re);
            },
            message: `is not a valid email!`
        },
    },
    password: {
        required: true,
        type: String,
    },
    type: {
        type: String,
        default: "user",
    },
});

const User = mongoose.model('User', userSchema);
module.exports = User;