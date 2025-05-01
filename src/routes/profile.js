const express=require("express")
const validator=require("validator")
const profileRouter=express.Router();
const {userAuth}=require("../middlewares/auth")
const {validateEditProfile}=require("../utils/validation")
const bcrypt=require("bcrypt")


profileRouter.get("/profile/view",userAuth,async(req,res)=>{
    try{
        const user=req.user;

        res.send(user);

    }catch(err){
        res.status(401).send('Please Login!' +err.message);
    }  
    
})

profileRouter.patch("/profile/edit",userAuth,async(req,res)=>{

        try{
            if(!validateEditProfile(req)){
                    throw new Error("Invlaid Edit changes");
            
            }else{
                const loggedInUser=req.user;

                Object.keys(req.body).forEach((key)=> loggedInUser[key]=req.body[key])
                await loggedInUser.save();
              res.json({
                message:`${loggedInUser.firstName},your profile edited Successfully!`,
                data:{loggedInUser}
              })



            }

        }catch(err){
            res.status(400).send("ERROR :"+err.message)
        }
})

profileRouter.post("/profile/password",userAuth,async(req,res)=>{

    try{
    const user=req.user;
    const {currentPassword,newPassword}=req.body;
    if(!validator.isStrongPassword(newPassword))
        throw new Error("Enter a Strong Password!");
    const match=await bcrypt.compare(currentPassword,user.password)
    if(!match){
        throw new Error("Current Password is incorrect")
    }
    const newhashPassword=await bcrypt.hash(newPassword,10)
    user.password=newhashPassword;
    await user.save();
    res.send("Password Changed SuccessFully")
    }
    catch(err){
        res.status(400).send("Something Went Wrong :"+err.message)
    }
    


})

module.exports=profileRouter;