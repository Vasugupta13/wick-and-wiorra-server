const express = require('express');
const phonePeRouter = express.Router();
const axios = require('axios');
const auth = require('../middlewares/auth');
const uniqid = require('uniqid');
const sha256 = require('sha256');
const PHONE_PE_HOST_URL = "https://api-preprod.phonepe.com/apis/hermes";
const merchantId = "PGTESTPAYUAT";
const saltKey = "099eb0cd-02cf-4e2a-8aca-3e6c6aff0399";
const saltIndex = 1;

phonePeRouter.post('/pay',auth, async (req, res) => {
    const payEndpoint = '/pg/v1/pay';
    const merchantTransactionId = uniqid();
    const { id, amount } = req.body;
    const payLoad = {
        "merchantId": merchantId,
        "merchantTransactionId": merchantTransactionId,
        "merchantUserId": id,
        "amount": amount * 100, //in paise
        "redirectUrl": `https://amazon-clone-server-vvb5.onrender.com/redirect-url/${merchantTransactionId}`,
        "redirectMode": "REDIRECT",
        "mobileNumber": "9999999999",
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

phonePeRouter.get('/redirect-url/:merchantTransactionId',auth, async (req, res) => { 
    const { merchantTransactionId }= req.params;
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
      axios
        .request(options)
            .then(function (response) {
                console.log(response.data);
             res.send(response.data);
        })
        .catch(function (error) {
          console.error(error);
        });
    }else{
        res.send('Payment failed');
    }
    
 });

module.exports = phonePeRouter;