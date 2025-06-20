//creating a schema
const mongoose=require("mongoose");
const validator=require("validator");
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
       
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid Email Id! adress "+value);
            }
        },
    },
    password:{
        type:String,
        required:true,
        minLength:6,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Enter a Strong Password "+value)
            }
        }
    },
    phoneNumber:{
        type:Number,
    },
    age:{
        type:Number,
        min:18,
        
    },
    isPremium:{
        type:Boolean,
        default:false,
    },
    membershipType:{
        type:String,
        
    },
    gender:{
        type:String,
        lowercase:true,
        // validate(value){
        //     if(!["male","female","other"].includes(value)){
        //         throw new Error("Gender is not valid")
        //     }
        // }
        enum:{
            values:["male","female","other",''],
            message:`{VALUE} is not valid gender type`
        }
    },
    skills:{
       type: [String]

    },
    photoUrl:{
        type:String,
        default:"https://www.pnrao.com/wp-content/uploads/2023/06/dummy-user-male.jpg"
    },
    about:{
        type:String,
    }

},{
    timestamps:true,
})

module.exports=mongoose.model("User",userSchema);
