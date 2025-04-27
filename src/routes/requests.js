const express=require("express")

const {userAuth}=require("../middlewares/auth")

const reqRouter=express.Router();

reqRouter.post("/sendConnectionReq",userAuth,async(req,res)=>{

    const user=req.user; 

    res.send(user.firstName +" sent the request succesfully!");
})


module.exports=reqRouter