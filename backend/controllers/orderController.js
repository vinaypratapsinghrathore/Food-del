import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";

// Set the API key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const placeOrder = async (req, res) => {
    const frontend_url = "http://localhost:5173";

    try {
        // Save the new order
        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address,
        });
        await newOrder.save();

        // Clear user's cart
        await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

        // Prepare line items for payment
        const line_items = req.body.items.map((item) => ({
            price_data: {
                currency: "inr",
                product_data: {
                    name: item.name, // Assuming `item.name` exists
                },
                unit_amount: item.price * 100, // Adjust scaling as needed
            },
            quantity: item.quantity,
        }));

        // Add delivery charge
        line_items.push({
            price_data: {
                currency: "inr",
                product_data: {
                    name: "Delivery Charge",
                },
                unit_amount: 200 * 100, // Delivery charge in base units (e.g., ₹200)
            },
            quantity: 1,
        });

        // Create Stripe session
        const session = await stripe.checkout.sessions.create({
            line_items: line_items,
            mode: "payment",
            success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
        });

        // Send session URL to the frontend
        res.json({ success: true, session_url: session.url });
    } catch (error) {
        console.error("Error creating payment session:", error);
        res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
    }
};
const  verifyOrder = async (req,res) =>{
    const{ orderId,success} =req.body;
    try{
        if(success=="true") {
            await orderModel.findByIdAndUpdate(orderId,{payment:true});
            res.json({success:true, message:"Paid"})
        }
        else{
            await orderModel.findByIdAndDelete(orderId);
            res.json({success:false,message:"Not Paid"})
        }
    }
catch(error){
    console.log(error);
    res.json({success:false,message:"Error"})

}

}

//use order for frontend 
const userOrders = async(req,res)=>{
    try {
        const ordres = await orderModel.find({userId:req.body.userId});
        res.json({success:true,data:ordres})
        
    } catch (error) {
        console.log(error)
        res.json({success:false,message:"Error"})
        
    }
}

// listing orders for admain panel 
const listOrders = async(req,res)=>{
    try {
        const orders = await orderModel.find({});
        res.json({success:true,data:orders})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
        
    }

}


//api for updating order status
const updateStatus = async(req,res)=>{
    try {
        await  orderModel.findByIdAndUpdate(req.body.orderId,{status:req.body.status})
        res.json({success:true,message:"Status Updated"})
        
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
        
    }

}

export { placeOrder, verifyOrder, userOrders,listOrders,updateStatus };

