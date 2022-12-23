
const express = require("express")
const Razorpay = require("razorpay")
let dotenv = require('dotenv');
dotenv.config();
let port = process.env.PORT || 5050
const app = express();
const cors = require('cors');
let bodyparser = require('body-parser');
const shortid = require("shortid");

app.use(express)
app.use(cors());


app.use(bodyparser.urlencoded({extended:true}))
app.use(bodyparser.json())


app.get("/",(req,res)=>{
    res.send("Every thing is fine :-)");
});

const razorpay = new Razorpay({
    key_id : 'rzp_test_2EqXXeOXSUYTR4',
    key_secret :'TO5IaCNYTgavoViTsLZTsBG4',
});


app.post("/payment", async (req,res)=>{

      
    const payment_capture = 1
	const amount = req.body.amount   
	const currency = req.body.currency

    const options = {
		amount: amount * 100,
		currency,
		receipt: shortid.generate(),
		payment_capture
	}

	try {
		const response = await razorpay.orders.create(options)
		console.log(response)     
		res.json({
			id: response.id,
			currency: response.currency,
			amount: response.amount
		})
	} catch (error) {
		res.status(400)
		console.log(error)
	}
    
});

app.listen(port,() => {
    console.log(`listening on port ${port}`)
})