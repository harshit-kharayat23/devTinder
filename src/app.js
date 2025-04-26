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
// feed api to gat all the users from the database

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

// get all users from the db
app.get("/data",async(req,res)=>{

    try{
        const users= await User.find({});
        if(users.length===0)
            res.status(400).send("No Users found");
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
        const user=await User.findOneAndUpdate({_id:userId},data,{
            runValidators:true,
        });
       
        res.send("User updated succesfully!")


    }catch(err){
        res.status(400).send("Somthing went wrong!");
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


 