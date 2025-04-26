const express =require("express");
const app=express();
const User=require("./models/user")
const {connectDB}=require("./config/database")

app.use(express.json())

app.post("/signup",async (req,res)=>{

    // creating new instance of user model
    const user=new User(req.body);
    try{
    await user.save();
    res.send("Data added Successfully!");
    }catch(err){
        res.status(400).send("Error Saving the user"+ err.message);
    }



})


connectDB()
    .then(()=>{
        console.log("Database connected successfully")
        app.listen(3000,()=>{
            console.log("Successfully connected");
            
        });
})
    .catch(err=>{
        console.log("Database cannot be connected!")
});


 