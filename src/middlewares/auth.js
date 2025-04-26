const authAdmin=(req,res,next)=>{
    console.log("admin auth is getting checked")
    const token="xyz";
    const isAuthorized= token ==="xyz"
    if(!isAuthorized){
        res.status(401).send("Unauthorised User");
    }else
    next();
}

const authUser=(req,res,next)=>{
    console.log("admin auth is getting checked")
    const token="xyz";
    const isAuthorized= token ==="xyz"
    if(!isAuthorized){
        res.status(401).send("Unauthorised User");
    }else
    next();
}
module.exports={
    authAdmin,authUser
};