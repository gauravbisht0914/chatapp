import mongoose from "mongoose";
import bcrypt from "bcrypt"

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: 2,
        maxlength: 25,
        lowercase: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    profileImage: {
        url: {
            type: String,
            default: "https://th.bing.com/th/id/OIP.hGSCbXlcOjL_9mmzerqAbQHaHa?rs=1&pid=ImgDetMain",
        },
        public_id: {
            type: String,
            default: null
        }
    },
    isVerified: {
        type: Boolean,
        default: false
    },

    emailVerificationToken: String,
    emailVerificationTokenExpiredAt: String,

}, { timestamps: true })

userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        {
            const hashedPassword = await bcrypt.hash(this.password, 10)
            this.password = hashedPassword
        }
        next()
    }
})

userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password)
}

const User = mongoose.model("User", userSchema)

export default User