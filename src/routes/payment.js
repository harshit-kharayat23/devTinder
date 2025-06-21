const express=require("express");
const { userAuth } = require("../middlewares/auth");
const { instance } = require("../utils/razorpay");
const paymentRouter=express.Router();
const Payment=require('../models/payment');
const memberShipAmount = require("../utils/constants");
const { validateWebhookSignature } = require("razorpay/dist/utils/razorpay-utils");
const User=require("../models/user")



paymentRouter.post("/payment/create",userAuth,async(req,res)=>{


    try{

        const {memeberShipType}=req.body;
        const {firstName,lastName,emailId}=req.user
        var options={
        amount:memberShipAmount[memeberShipType]*100,
        currency:"INR",
        receipt: "order_rcptid_11",
        notes:{
            firstName,
            lastName,
            emailId,
            memeberShipType:memeberShipType,
        }
    }

       const order= await instance.orders.create(options)


       // save in Database
       const paymentDetails = new Payment({
        userId: req.user._id,
        orderId: order.id,   
        amount:order.amount,         
        paymentId: null,            
        currency: order.currency,
        status: order.status,
        receipt: order.receipt,
        notes: order.notes,
        });

        await paymentDetails.save(); 


       // return back my order details to front end

       return res.status(200).json({
        sucess:true,
        message:"Order created",
        ...paymentDetails.toJSON(),
        keyId:process.env.RAZORPAY_ID,
       })

    }
    catch(err){
        return res.status(500).json({
            sucess:false,
            message:"Error: "+err.message,
        })
    }
    



})

paymentRouter.post("/payment/webhook",async(req,res)=>{

        try{
            const webhookSignature=req.get("X-Razorpay-Signature");

            const isWebhookValid=validateWebhookSignature(
                JSON.stringify(req.body),
                webhookSignature,
                process.env.RAZORPAY_WEBHOOK_SECRET);
            if(!isWebhookValid){
                return res.status(400).json({
                    sucess:false,
                    message:"Webhook signature is invalid"
                })
            }
            // update payment status in db 
            const paymentDetails=req.body.payload.payment.entity;

            const payment=await Payment.findOne({orderId:paymentDetails.order_id});
           
            payment.status=paymentDetails.status;

            await payment.save();

             // make the user premium
             const user=await User.findOne({
                _id:payment.userId,
             })
             user.isPremium=true;
             user.memebershipType=payment.notes.membershipType;

             await user.save();


            // successfull to razorpay
            return res.status(200).json({
                sucess:false,
                message:"Web Hook recieved successfully"
            })

            
        }catch(err){
            return res.status(500).json({
                sucess:false,
                message:"ERROR: "+err.message,
            })
        }

})


paymentRouter.get("/premium/verify",userAuth,async(req,res)=>{

    try{
        const user=req.user;
        console.log(user)
        if(user.isPremium){
            return res.status(200).json({
                sucess:true,
                isPremium:true,
                
            })
        }
        
        else{
            return res.status(200).json({
                sucess:true,
                isPremium:false,
                
            })
        }

    }catch(err){
        return res.status(500).json({
                sucess:false,
                message:"ERROR: "+err.message,
            })
    }
       




})

module.exports=paymentRouter;


