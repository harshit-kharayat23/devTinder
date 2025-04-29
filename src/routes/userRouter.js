const express=require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest=require("../models/connectionReq")
const userRouter=express.Router()
const User=require("../models/user")

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
        ).populate("fromUserId","firstName lastName age  skills").populate("toUserId","firstName lastName age  skills")
        if(connections.length==0){
            return res.status(404).json({message:"No Connections found !"});

        }
        const userConnections=connections.map((row)=>{
            
            if(row.fromUserId._id.toString()===loggedInUser._id.toString()){
                return row.toUserId;
            }
           
           return  row.fromUserId;
        
        
        });
        res.json({
            message:"Connection Requests are :",
            data:userConnections,
        
        })

    }catch(err){
        res.status(400).send("Something went wrong ! "+err.message)
    }
        



})


userRouter.get("/user/feed",userAuth,async(req,res)=>{

    try{
        const loggedInUser=req.user;
        // find all connection request either sent or recieved they should not be in the feed
        const connectionRequests=await ConnectionRequest.find({
            $or:[
                {fromUserId:loggedInUser._id},
                {toUserId:loggedInUser._id},

            ]
        }).select("toUserId fromUserId")

        const hideUsers=new Set();
        const USER_SAFE_DATA="firstName lastName age skills"
        connectionRequests.forEach((id)=>{
            hideUsers.add(id.fromUserId.toString());
            hideUsers.add(id.toUserId.toString());
        })
        console.log(hideUsers);
        const feedUsers=await User.find({
            $and:[
               { _id:{$nin :Array.from(hideUsers)}},
               {_id:{$ne:loggedInUser._id}}
            ]
        }).select(USER_SAFE_DATA)
        
        res.send(feedUsers)
    
    }
    catch(err){
        res.status(400).json({
            message:"Something went wrong! "+err.message,
        })
    }

    

})
module.exports=userRouter;
         