const express = require('express');
const addressRouter = express.Router();
const auth = require('../middlewares/auth');
const Address = require('../models/address');

addressRouter.get('/api/get-all-address',auth, async (req, res) => {
    try{
          let address = await Address.findOne({userId: req.user});
          res.json(address);
    }catch(e){
          res.status(500).json({error: e.message});
    }     
});

addressRouter.post('/api/add-address', auth, async (req, res) => {
    try {
        const { addressLine, city, state, pincode, name, userNumber } = req.body;
        let address = await Address.findOne({ userId: req.user });

        if (!address) {
            address = new Address({
                userId: req.user,
                addressList: [{
                    addressLine,
                    city,
                    state,
                    pincode,
                    name,
                    userNumber
                }],
            });
        } else {
            if (address.addressList.some(addr => addr.name === name)) {
                return res.status(400).json({ error: 'Address for the name already exists' });
            }else if (address.addressList.some(addr => addr.name === name)){
                return res.status(400).json({error: 'Address for the number already exists'});
            }
            address.addressList.push({
                addressLine,
                city,
                state,
                pincode,
                name,
                userNumber
            });
            console.log(address);
        }
        address = await address.save();
        res.json(address);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

module.exports = addressRouter;