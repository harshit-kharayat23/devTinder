const express =require("express");

const app=express();

// app.get will only handle get call to  /user

app.use("/user",(req,res,next)=>{
    console.log("first route handler")
    next();
   res.send("First route Handler")
    
    
},
(req,res)=>{
    console.log("second Router")
    res.send("Second route handler");   
}


);

app.listen(3000,()=>{
    console.log("Successfully connected");
});

