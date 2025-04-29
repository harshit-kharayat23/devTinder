const express=require("express");
const {validateSignUp}=require("../utils/validation")
const authRouter=express.Router();
const validator=require("validator")
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken")
const User=require("../models/user")


authRouter.post("/signup",async (req,res)=>{

    // creating new instance of user model
    try{
        // validation
        validateSignUp(req)

        // encryption of password
        const {firstName,lastName,password,emailId,skills = [],age }=req.body;
        const hashPass =await bcrypt.hash(password,10);
        // creating a new instance of user

        const user=new User({
            firstName,
            lastName,
            emailId,
            password:hashPass,
            skills,
            age
    
        })
        console.log(hashPass);


        if(user?.skills.length>10){
            throw new Error("Dont add more than 10 skills!")
           }
    await user.save();
    res.send("Data added Successfully!");
    
    }catch(err){
        res.status(400).send(err.message || "Something went wrong!");
    }



})

authRouter.post("/login",async(req,res)=>{
        try{
            const {emailId,password}=req.body;
            if(!validator.isEmail(emailId)){
                throw new Error("Invalid Email Id "+emailId)
            }
            const user= await User.findOne({emailId:emailId})
            if(!user){
                throw new Error("User Does not Exist with this email : ",emailId);
            }

            const isvalidPass= await bcrypt.compare( password,user.password)
            if(isvalidPass){
                // createing a JWT token 
                const token=jwt.sign({_id:user._id},"Harsh@2394",{expiresIn:"2d"})
                // add the token inside the cookie
                res.cookie("token",token) 


                res.send("Logged In ");
            }
            else{
                throw new Error("Password is Incorrect");
            }


        }catch(err){
        res.status(400).send(err.message || "Something went wrong!");

    }



})

authRouter.post("/logout",async(req,res)=>{
    res.cookie("token",null,{
        expires:new Date(Date.now()),
    }).
    send("Logged Out!")

})


module.exports=authRouter;