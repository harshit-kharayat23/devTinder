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

 const validateEditProfile=(req)=>{


     const allowedFields=["firstName","lastName","emailId","skills","age","gender","photoUrl","about"];
    const isEditAllowed= Object.keys(req.body).every((field)=>allowedFields.includes(field))

    return isEditAllowed;
 
}

 module.exports={validateSignUp,validateEditProfile};