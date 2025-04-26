const express =require("express");
const {authAdmin, authUser}=require("./middlewares/auth")
const app=express();

app.use("/admin",authAdmin)

// app.get will only handle get call to  /user
app.get("/admin/getData",(req,res,next)=>{
    res.send("Successfully collected the user");
   
})  
 
app.get("/admin/deleteUser",(req,res)=>{
    res.send("Deleted the user");
})

app.get("/user",authUser,(req,res)=>{
    res.send("Hi Harshit!");
})
app.post("/user/login",(req,res)=>{
    res.send("Logged In Succesfully!!");
})


app.listen(3000,()=>{
    console.log("Successfully connected");
});

