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

        socket.on("joinChat",({targetUserId,userId,firstName})=>{
            // create a room 
            const roomId=[userId,targetUserId].sort().join('_')
            console.log(firstName +" Joined Room",roomId);
            socket.join(roomId);

        })

        socket.on("sendMessage",({firstName,text,userId,targetUserId})=>{
            const roomId=[userId,targetUserId].sort().join('_');
            console.log(firstName +": "+text);
            io.to(roomId).emit("messageRecieved",{firstName,text})


        })
        socket.on("dissconnect",()=>{
            
        })


    })
}