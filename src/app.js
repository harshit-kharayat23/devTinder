const express =require("express");
const app=express();
const User=require("./models/user")
const {connectDB}=require("./config/database")
const cookieParser=require("cookie-parser");
const http=require("http");



const authRouter=require("./routes/auth")
const reqRouter=require("./routes/requests")
const profileRouter=require("./routes/profile");
const userRouter = require("./routes/userRouter");
const paymentRouter=require("./routes/payment")
const chatRouter=require("./routes/chat")
const cors=require("cors");
const { initializeSocket } = require("./utils/socket1.js");
require("dotenv").config();

app.use(cors({
    
    origin: "http://localhost:5173",
    credentials:true,
    optionSuccessStatus:200
}))

app.use(express.json())
app.use(cookieParser())
// feed api to gat all the users from the database

app.use("/",authRouter);
app.use("/",reqRouter)
app.use("/",profileRouter);
app.use("/",userRouter);
app.use("/",paymentRouter);
app.use("/",chatRouter);
// get user by email
app.get("/getData",async(req,res)=>{

    const userEmail=req.body.emailId;

    try{
        const users= await User.find({emailId: userEmail});
        if(users.length===0){
            res.status(400).send("No user found !");
        }
        else{
            res.send(users);
        }

    }
    catch(err){
        res.status(400).send("Something went wrong");
    }

})

 
app.delete("/delete",async(req,res)=>{

    const userId=req.body.userId;

    try{

        const user=await User.findByIdAndDelete(userId);
        res.send("User deleted successfully!");

    }catch(err){
        res.status(400).send("Something went wrong!")
    }
})

app.patch("/update",async(req,res)=>{
    
    const userId=req.body.userId;
    const data=req.body;
    try{
        if(data?.skills.length>10){
            throw new Error("Dont add more than 10 skills!")
        }
        const user=await User.findOneAndUpdate({_id:userId},data,{
            runValidators:true,
        });
        if(!user){
            res.status(404).send("User not found!");
        }
       
        
      
        res.send("User updated succesfully!")


    }catch(err){
        res.status(400).send(err.message || "Something went wrong!");

    }



})


const server=http.createServer(app);
initializeSocket(server);


connectDB()
    .then(()=>{
        console.log("Database connected successfully")
        server.listen(process.env.PORT_NUMBER,()=>{
            console.log("Successfully connected");
            
        });
})
    .catch(err=>{
        console.log("Database cannot be connected!")
});


 