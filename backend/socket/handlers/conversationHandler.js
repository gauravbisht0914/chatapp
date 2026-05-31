import roomId from "../../models/roomId.model.js";

async function conversationHandler(socket) {

    socket.on("createRoom", async (participantsId, cb) => {

        try {

            let room = await roomId.findOne({
                participants: {
                    $all: participantsId
                },

                $expr: {
                    $eq: [
                        { $size: "$participants" },
                        participantsId.length
                    ]
                }

            }).select("uniqueRoomName")

            if (!room) {

                room = await roomId.create({
                    participants: participantsId,
                })

            }

            socket.join(room.uniqueRoomName)

            cb({
                roomId: room._id,
            })

        } catch (err) {
            console.log(err.message)
        }

    })

}

export {
    conversationHandler
}