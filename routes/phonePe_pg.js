const express = require('express');
const phonePeRouter = express.Router();
const axios = require('axios');
const auth = require('../middlewares/auth');
const uniqid = require('uniqid');
const sha256 = require('sha256');
const PHONE_PE_HOST_URL = "https://api-preprod.phonepe.com/apis/pg-sandbox";
const merchantId = "PGTESTPAYUAT";
const saltKey = "099eb0cd-02cf-4e2a-8aca-3e6c6aff0399";
const saltIndex = 1;
let merchantTransactionId = '';
let addressLine;
let city;
let state;
let pincode;
let name;
let cartItems;
let amount;
let userId;
let phoneNumber;
// let transactionId = '';
phonePeRouter.post('/pay', auth, async (req, res) => {
    const payEndpoint = '/pg/v1/pay';
    const merchantTransactionIdGenerator = uniqid();
    merchantTransactionId = merchantTransactionIdGenerator;
    const { id, totalAmount , fullCart , customerNumber , customerName , customerAddressLine , customerCity , customerState , customerPincode } = req.body;
    cartItems = fullCart;
    amount = totalAmount;
    addressLine = customerAddressLine;
    city = customerCity;    
    state = customerState;
    pincode = customerPincode;
    name = customerName;
    phoneNumber = customerNumber;
    userId = id;
    console.log(totalAmount, fullCart, customerNumber, customerName, customerAddressLine, customerCity, customerState, customerPincode,);
    const payLoad = {
        "merchantId": merchantId,
        "merchantTransactionId": merchantTransactionId,
        "merchantUserId": id,
        "amount": amount, //in paise
        "redirectUrl": `http://localhost:3000/redirect-url/`,
        "redirectMode": "REDIRECT",
        "mobileNumber": phoneNumber,
        "paymentInstrument": {
            "type": "PAY_PAGE"
        }
    };
    //   SHA256(“/pg/v1/status/{merchantId}/{merchantTransactionId}” + saltKey) + “###” + saltIndex
    const bufferObj = Buffer.from(JSON.stringify(payLoad), "utf8");
    const base64EncodedPayload = bufferObj.toString("base64");
    const xVerify = sha256(base64EncodedPayload + payEndpoint + saltKey) + "###" + saltIndex;
    const options = {
        method: 'post',
        url: `${PHONE_PE_HOST_URL}${payEndpoint}`,
        headers: {
            accept: 'application/json',
            'Content-Type': 'application/json',
            'X-VERIFY': xVerify
        },
        data: {
            request: base64EncodedPayload
        }
    };
    axios.request(options)
        .then(function (response) {
            console.log(response.data);
            res.send(response.data);
        }).catch(function (error) {
            console.error(error);
        });
});

phonePeRouter.get('/redirect-url/', async (req, res) => {
    const xVerify = sha256(`/pg/v1/status/${merchantId}/${merchantTransactionId}` + saltKey) + "###" + saltIndex;
    console.log(merchantTransactionId);
    if (merchantTransactionId) {
        const options = {
            method: 'get',
            url: `${PHONE_PE_HOST_URL}/pg/v1/status/${merchantId}/${merchantTransactionId}`,
            headers: {
                accept: 'application/json',
                'Content-Type': 'application/json',
                "X-VERIFY": xVerify,
                "X-MERCHANT-ID": merchantTransactionId,
            },
        };
        console.log(merchantTransactionId);
        axios
            .request(options)
            .then(function (response) {
                console.log(response.data);
                if(response.data.code === 'PAYMENT_SUCCESS'){
                    const orderOption =  {
                        method: 'post',
                        url: `http://localhost:3000/api/order`,
                        headers: {},
                        data: {
                           cartItems : cartItems,
                            totalPrice : response.data.data.amount,
                            userId : userId,
                            transactionId : response.data.data.transactionId,
                            paymentState : response.data.data.state,
                            customerName : name,
                            customerAddressLine : addressLine,
                            customerCity : city,
                            customerState : state,
                            customerPincode : pincode,
                            customerNumber : phoneNumber,
                        }
                    };
                    axios.request(orderOption)
                    .then( async function (orderResponse) {
                        console.log(orderResponse.data);
                        res.send({ orderResponse: orderResponse.data, paymentResponse: response.data });
                    }).catch(function (error) {
                        console.error(error);
                    });
                }else{
                    res.send(response.data);
                }
                
            })
            .catch(function (error) {
                console.error(error);
            });
    } else {
        res.send('Payment failed');
    }
});


module.exports = phonePeRouter;