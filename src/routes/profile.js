const express=require("express")

const profileRouter=express.Router();
const {userAuth}=require("../middlewares/auth")

profileRouter.get("/profile",userAuth,async(req,res)=>{
    try{
        const user=req.user;
        console.log("User Info :",JSON.stringify(user));
        res.send("reading the cookie  token is valid"+user);

    }catch(err){
        res.status(400).send('something went wrong!' +err.message);
    }  
    
})

module.exports=profileRouter;