import { io } from "socket.io-client"

export const socket = io(`${import.meta.env.VITE_BACKEND_URL || ""}`, {
    autoConnect: false,
    withCredentials: true,
})

function socketConnection(userId) {
    socket.connect()
    
    socket.on("connect", () => {
        console.log("Connected to server with id:", socket.id)
    })
    
    socket.on("disconnect", () => {
        console.log("Disconnected from server")
    })
    
    socket.on("message", (data) => {
        console.log("Received message:", data)
    })
    console.log("Establishing socket connection for user:", `${userId}`);
    
    socket.on(`${userId}`, (data) => {
        console.log("Received message:", data);
      });

    // return () =>{
    //     socket.off("connect")
    //     socket.off("disconnect")
    //     socket.off("message")
    //     socket.off("receiveMessage")
    //     // socket.off(`${userId}`)
    //     // socket.disconnect()
    // }

    
}

export default socketConnection