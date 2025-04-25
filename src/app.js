const express =require("express");

const app=express();

app.use("/hello",(req,res)=>{
    res.send("Namaste Gentelman !")
})

app.use("/test",(req,res)=>{
    res.send("Hello Aliens how are you doing");
})
app.listen(3000,()=>{
    console.log("Successfully connected");
});

 