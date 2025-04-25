const express =require("express");

const app=express();

// app.get will only handle get call to  /user

app.get("/user",(req,res)=>{
    res.send({firstName:"Harshit",lastName:"Kharayat",city:"Pithoragarh"})
})
app.post("/user",(req,res)=>{
    res.send("successfully add the data to the database");
})

// app.use() will match all the http api method calls 
app.use("/test",(req,res)=>{
    res.send("Hello Aliens how are you doing");
})

app.listen(3000,()=>{
    console.log("Successfully connected");
});

