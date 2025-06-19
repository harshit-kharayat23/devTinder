const jwt=require("jsonwebtoken")

const User=require("../models/user")
const authAdmin=(req,res,next)=>{
    console.log("admin auth is getting checked")
    const token="xyz";
    const isAuthorized= token ==="xyz"
    if(!isAuthorized){
        res.status(401).send("Unauthorised User");
    }else
    next();
}

const authUser=(req,res,next)=>{
    console.log("admin auth is getting checked")
    const token="xyz";
    const isAuthorized= token ==="xyz"
    if(!isAuthorized){
        res.status(401).send("Unauthorised User");
    }else
    next();
}

const userAuth=async(req,res,next)=>{
    //read the token from the request req cookies
    try{
        const cookies=req.cookies;
        const {token}=cookies;
        if(!token)
            res.status(401).send("Please Login!")
        const decodedData= await jwt.verify(token,"Harsh@2394");
        const {_id}=decodedData;
      
        const user=await User.findById(_id);
        if(!user){
            res.status(400).send("user not found!")
        }
        req.user=user;
        next();
    }catch(err){
        res.status(400).send("Something went wrong "+err.message);
    }
    


    //validate the token
    //Find the user 


}
module.exports={
    authAdmin,authUser,userAuth
};