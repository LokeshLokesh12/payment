
const express = require("express")
const Razorpay = require("razorpay")
let dotenv = require('dotenv');
dotenv.config();
let port = process.env.PORT || 5050
const app = express();
const cors = require('cors');
const shortid = require("shortid");
const crypto = require("crypto");

let Mongo = require('mongodb');
const { query } = require('express');
let MongoClient = Mongo.MongoClient;
let bodyparser = require('body-parser')
let mongouturl = "mongodb+srv://test:test12345@airtel.xnwpatc.mongodb.net/?retryWrites=true&w=majority";

app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

app.use(cors());




app.get("/",(req,res)=>{  
    res.send("Every thing is fine :-)" );
});

const instance = new Razorpay({
    key_id : 'rzp_test_2EqXXeOXSUYTR4',
    key_secret :'TO5IaCNYTgavoViTsLZTsBG4',
});


app.post("/payment/:amount",(req,res)=>{
    

    const amount =req.params.amount * 100;
	const currency = "INR";
    const receipt = shortid.generate()

		instance.orders.create( { amount,currency,receipt}
            , (error,order)=>{
                console.log(order)

            if(error){
                return res.status(500).json(error);;
            }
            return res.status(200).json(order)
                
        })
	
    
});


app.post("/verify", async (req, res) => {
	try {
		// const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
		// 	req.query;
        console.log(req.query);
        
        const razorpay_order_id = req.query.razorpay_order_id;
        const razorpay_payment_id = req.query.razorpay_payment_id;
        const razorpay_signature  = req.query.razorpay_signature ;
           
		const sign = razorpay_order_id + "|" + razorpay_payment_id;
		const expectedSign = crypto
			.createHmac("sha256", process.env.KEY_SECRET)
			.update(sign.toString())
			.digest("hex");

		if (razorpay_signature === expectedSign) {
			return res.status(200).json({ message: "Payment verified successfully" }),console.log("Payment verified successfully");
            
		} else {
			return res.status(400).json({ message: "Invalid signature sent!" }),console.log("Invalid signature sent!");
		}
	} catch (error) {
		res.status(500).json({ message: "Internal Server Error!" });
		console.log(error);
        console.log(req.query);

	}
});


app.post( '/paymentdb',(req,res)=>{
    const paymentdata = {        
        "name": req.body.name,
        "rechargeTo" : req.body.rechargeTo,
        "plan":req.body.plan,
        "razorpay_order_id" : req.body.razorpay_order_id,
        "razorpay_payment_id" : req.body.razorpay_payment_id,
        "razorpay_signature" : req.body.razorpay_signature,
        "date/time":req.body.time
    }
    db.collection('Payment').insert(paymentdata,(err,result) => {
        if(err){
            throw err,
            res.send({"message":"Something Went Wrong"})
        }
        res.send({"message":"Recharge Successfully"})
    })
})


app.get('/test',(req,res) => {
    User.find({},(err,data) => {
        if(err) throw err;
        // res.send(data)
        res.send("Every thing is fine :-)")
    })
})
app.get('/data',(req,res) => {
    User.find({},(err,data) => {
        if(err) throw err;
        // res.send(data)
        res.send(data)
    })
})

// to get new connection

app.post('/registenewconnection',(req,res)=>{
    console.log(req.body)
    const paymentdata = {        
            "name":req.body.name,
            "phone":req.body.phone,
            "connection":req.body.type,
            "city":req.body.city,
            "plan":req.body.plan, 
            "process":req.body.process?req.body.process:"registered",
            "date/time":req.body.time,
            "tnx_status": "TXN_SUCCESS",
            // "receipt" :req.body.receipt,
            "razorpay_order_id" : req.body.razorpay_order_id,
            "razorpay_payment_id" : req.body.razorpay_payment_id,
            "razorpay_signature" : req.body.razorpay_signature,
    }
    db.collection('connection').insert(paymentdata,(err,result) => {
        if(err){
            throw err,
            res.send({"message":"Error While Register"})
        }
        res.send({"message":"Our customer executive contact you as soon as possible"})
    })
})


app.post('/requestsim',(req,res)=>{
    console.log(req.body)
    const paymentdata = {        
            "name":req.body.name,
            "phone":req.body.mobilenumber,
            "type":req.body.type,
            "location":req.body.location,
            "process":req.body.process?req.body.process:"registered",
            "date/time":req.body.time,
            "pincode":req.body.pincode,
            "house/flat no":req.body.house_no,
    }
    db.collection('connection').insert(paymentdata,(err,result) => {
        if(err){
            throw err,
            res.send({"message":"Error While Register"})
        }
        res.send({"message":"Our customer executive contact you as soon as possible"})
    })
})





MongoClient.connect(mongouturl,(err,client)=>{
    if(err) console.log('err while connect');
    db = client.db('Airtel');
  
    app.listen(port,()=>{
        console.log('servre is runnun in ' + port )
    })
    
})