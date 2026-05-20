import mongoose from "mongoose";

async function connectDB() {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}`)
    } catch (error) {
        throw error
    }
}

export default connectDB