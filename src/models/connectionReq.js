const moongose=require("mongoose");

const connectionReq=new moongose.Schema({

    fromUserId:{
        type:moongose.Schema.Types.ObjectId,
        required:true,
        ref:"User",
    }
    ,
    toUserId:{
        type:moongose.Schema.Types.ObjectId,
        required:true,
        ref:"User",
    }
    ,
    status:{
        type:String,
        enum:{
            values:["ignord","interested","accepted","rejected"],
            message:`{VALUE} is incorrect status`,
        }
        , required:true,
    }

},{ timestamps:true,})
connectionReq.index({fromUserId:1,toUserId:1});

const ConnectionRequest=new moongose.model("ConnectionRequest",connectionReq);
module.exports=ConnectionRequest;