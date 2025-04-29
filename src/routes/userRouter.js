const express=require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest=require("../models/connectionReq")
const userRouter=express.Router()

// get all pennding requested for looged in user
userRouter.get("/user/requests/recieved",userAuth,async(req,res)=>{

    try{
        const loggedUser=req.user;
        const requests=await ConnectionRequest.find({
            toUserId:loggedUser._id,
            status:"interested",
        
        }).populate("fromUserId",["firstName","lastName"]);
        if(requests.length==0){
            return res.status(400).json({message:"No request Found !"})
        }
        res.json({
            message:"Data fetched Successfully ",
            data :requests,
        })



    }catch(err){
        res.status(400).json({
            message:"Something went Wrong ! "+err.message
        })
    }
    

})


userRouter.get("/user/connections",userAuth,async (req,res)=>{

    try{

        const loggedInUser=req.user;
        const connections=await ConnectionRequest.find({
            $or:[
                {fromUserId:loggedInUser._id , status:"accepted"},
                {toUserId:loggedInUser._id, status:"accepted"}
            ],
               
            
            }
        ).populate("fromUserId","firstName lastName age  skills")
        if(connections.length==0){
            return res.status(404).json({message:"No Connections found !"});

        }
        const userConnections=connections.map((row)=>row.fromUserId);
        res.json({
            message:"Connection Requests are :",
            data:userConnections,
        
        })

    }catch(err){
        res.status(400).send("Something went wrong ! "+err.message)
    }
        



})
module.exports=userRouter;
         