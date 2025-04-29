const express=require("express")

const {userAuth}=require("../middlewares/auth");
const ConnectionRequest=require("../models/connectionReq")
const reqRouter=express.Router();
const User=require("../models/user")

reqRouter.post("/request/send/:status/:toUserId",userAuth,async(req,res)=>{

    try{

        const fromUserId=req.user._id;
        const toUserId=req.params.toUserId;
        const status=req.params.status

        if(toUserId==fromUserId){
            return res.json({message:"Cannot sent connection request to yourself!"})
        }
        const allowedStatus=["ignored","interested"];
        if(!allowedStatus.includes(status)){
            return res.status(400).json({
                message:"Invalid Status Type :"+status,
            })
        }
        const toUser=await User.findById(toUserId)
        if(!toUser){
            return res.status(404).json({message:"User not Found!"});
        }

        // either our connection request is sent again or a request is sent from other user whose satus is is pending for that person 
        const existingConnection=await ConnectionRequest.findOne({
                $or:[
                    {fromUserId,toUserId},
                    {fromUserId:toUserId,toUserId:fromUserId},
                ],
        })
        if(existingConnection){
            return res.status(400).json({message:"Connection Request Already Exist! "})
        }

        const connectionRequest=new ConnectionRequest({
            fromUserId,
            toUserId,
            status,
        })

        const data=await connectionRequest.save();

        res.json({
            message:"Connection Request sent successfully!",
            data
        })
   
    }catch(err){
        res.status(400).send("Something went wrong ! "+err.message);
    }


})

reqRouter.post("/request/review/:status/:requestId",userAuth,async(req,res)=>{
    try{    
        const loggedInUser=req.user;
        const {status,requestId}=req.params;
        const allowedStatus=["accepted","rejected"];


        if(!allowedStatus.includes(status)){
            return res.status(400).send("Invalid Status Type :"+status);
        }
        const connectionRequest=await ConnectionRequest.findOne({
            _id:requestId,
            toUserId:loggedInUser._id,
            status:"interested",
        })
        if(!connectionRequest){
            return res.status(404).json({message:"Connection Request not found"});
        }
        connectionRequest.status=status;
        const data=await connectionRequest.save();
        res.json({
            message:"Connection Request "+status,
            data,
        })
         



    }catch(err){
        res.status(400).send("Something  went wrong !"+err.message)
    }  
    


})

module.exports=reqRouter