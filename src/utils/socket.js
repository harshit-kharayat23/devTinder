const Chat=require("../models/chat")

const socket=require("socket.io")
const cors=require("cors");
exports.initializeSocket=(server)=>{

    const io=socket(server,{
        cors:{
            origin: "http://localhost:5173",
            credentials:true,
        }
    })

    io.on("connection",(socket)=>{
        // handle events

        socket.on("joinChat",({targetUserId,userId,firstName,lastName})=>{
            // create a room 
            const roomId=[userId,targetUserId].sort().join('_')
            console.log(firstName +" Joined Room",roomId);
            socket.join(roomId);

        })

        socket.on("sendMessage",async({firstName,text,userId,targetUserId,lastName})=>{
           
        
            try{
                 const roomId=[userId,targetUserId].sort().join('_');
                    console.log(firstName +": "+text);
                    // save the data in the data base
                    let chat=await Chat.findOne({
                        participants:{$all:[userId,targetUserId]},
                    });
                    if(!chat){
                        chat=new Chat({
                            participants:[userId,targetUserId],
                            messages:[],
                        })
                    }
                    chat.messages.push({
                        senderId:userId,
                        text,
                    })
                    await chat.save();

                 io.to(roomId).emit("messageRecieved",{firstName,text,lastName})
            }catch(err){
                console.log(err);
            }
           


        })
        socket.on("dissconnect",()=>{
            
        })


    })
}