
const express = require("express")
const Razorpay = require("razorpay")
let dotenv = require('dotenv');
dotenv.config();
let port = process.env.PORT || 5050
const app = express();
const cors = require('cors');
const shortid = require("shortid");


app.use(cors());




app.get("/",(req,res)=>{  
    res.send("Every thing is fine :-)" );
});

const instance = new Razorpay({
    key_id : 'rzp_test_2EqXXeOXSUYTR4',
    key_secret :'TO5IaCNYTgavoViTsLZTsBG4',
});


app.get("/payment/:amount",(req,res)=>{
    

    const amount =req.params.amount * 100;
	const currency = "INR";
    const receipt = shortid.generate()

		instance.orders.create( { amount,currency,receipt}
            ,(error,order)=>{
            if(error){
                return res.status(500).json(error);;
            }
            return res.status(200).json(order),console.log(order);
        })
	
    
});

app.listen(port,() => {
    console.log(`listening on port ${port}`)
})