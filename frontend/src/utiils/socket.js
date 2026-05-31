import { io } from "socket.io-client"

export const socket = io("http://localhost:5000", {
    autoConnect: false,
    withCredentials: true,
})

function socketConnection() {
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

    return () =>{
        socket.off("connect")
        socket.off("disconnect")
        socket.off("message")
        socket.disconnect()
    }

    
}

export default socketConnection