const mongoose=require("mongoose");

const connectDB=async()=>{
   await mongoose.connect("mongodb+srv://harshit:k8r8YLVbSyl3yWr6@cluster0.zg9zf.mongodb.net/devTinder")
};

module.exports={
    connectDB,
}