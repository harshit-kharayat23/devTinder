const express=require("express");
const Chat=require("../models/chat");
const { userAuth } = require("../middlewares/auth");
const chatRouter=express.Router();



chatRouter.get("/chat/:targetUserId",userAuth,async(req,res)=>{

    

    try{
        const {targetUserId}=req.params;
        const userId=req.user._id;

        let chat=await Chat.findOne({
            participants:{$all:[userId,targetUserId]},
        }).populate({
            path:"messages.senderId",
            select:"firstName lastName",
        })
        if(!chat){
            chat=new Chat({
                participants:[userId,targetUserId],
                messages:[],
            })
        }
        await chat.save();

        res.json(chat);



    }catch(err){
        res.status(500).json({
            success:false,
            message:"Error: "+err.message
        })
    }




})


module.exports=chatRouter;