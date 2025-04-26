const express =require("express");
const {authAdmin, authUser}=require("./middlewares/auth")
const app=express();

app.use("/admin",authAdmin)

// app.get will only handle get call to  /user
// app.get("/admin/getData",(req,res,next)=>{
//     res.send("Successfully collected the user details");
   
// })  
 

// app.get("/user",authUser,(req,res)=>{
//     res.send("Hi Harshit!");
// })


// handling Errors


app.get("/getUserData",(req,res,next)=>{

    try{
    throw new Error("----------error------");
    res.send("user data found");
    }catch(err){
        res.status(500).send("something went worng")
    }
    
})



app.listen(3000,()=>{
    console.log("Successfully connected");
    
});

