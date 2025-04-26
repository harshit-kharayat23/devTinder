//creating a schema
const mongoose=require("mongoose");

const userSchema= new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        minLength:4,
        maxLength:26,
    },
    lastName:{
        type:String,
        required:true,
    },
    emailId:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
    },
    password:{
        type:String,
        required:true,
        minLength:6,
    },
    phoneNumber:{
        type:Number,
    },
    age:{
        type:Number,
        min:18,
        
    },
    gender:{
        type:String,
        lowercase:true,
        validate(value){
            if(!["male","female","other"].includes(value)){
                throw new Error("Gender is not valid")
            }
        }
    },
    skills:{
       type: [String]

    },

},{
    timestamps:true,
})

module.exports=mongoose.model("User",userSchema);
