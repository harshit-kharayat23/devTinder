 const validator=require("validator");

 const validateSignUp=(req)=>{

   const  {firstName,lastName,emailId,password}=req.body;
   if(!firstName||!lastName){
        throw new Error("Invaild Name Credentials");
   }
   if(!validator.isEmail(emailId)){
        throw new Error("Invalid Email id :"+emailId)
   }
   if(!validator.isStrongPassword(password)){
        throw new Error("Enter a Strong Password !")
   }

 }

 module.exports={validateSignUp};