const express =require("express");
const app=express();
const User=require("./models/user")
const {connectDB}=require("./config/database")
const {validateSignUp}=require("./utils/validation")
const bcrypt=require("bcrypt");
const validator=require("validator")

app.use(express.json())

app.post("/signup",async (req,res)=>{

    // creating new instance of user model
    const user=new User(req.body);
    try{
        // validation
        validateSignUp(req)

        // encryption of password
        const {firstName,lastName,password,emailId}=req.body;
        const hashPass =await bcrypt.hash(password,10);
        // creating a new instance of user

        const user=new User({
            firstName,
            lastName,
            emailId,
            password:hashPass,
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

app.post("/login",async(req,res)=>{
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
                
                res.send("Logged In");
            }
            else{
                throw new Error("Password is Incorrect");
            }


        }catch(err){
        res.status(400).send(err.message || "Something went wrong!");

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


 