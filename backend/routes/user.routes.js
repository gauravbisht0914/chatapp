import { updateProfilePicture, checkUsernameAvailability, checkEmailAvailability } from '../controllers/userProfile.controller.js'
import express from 'express'
import { createUser, loginUser, logoutUser, verifyEmail, isAuthenticated } from '../controllers/user.controller.js'
import auth from '../middlewares/auth.js'

const userRouter = express.Router()

userRouter.post('/signup',createUser)
userRouter.post('/login', loginUser)
userRouter.post('/logout',auth, logoutUser)
userRouter.post('/verify-email', verifyEmail)
userRouter.get('/is-authenticated', auth, isAuthenticated)



userRouter.post('/update-profile-picture', updateProfilePicture)
userRouter.get('/check-username', checkUsernameAvailability)
userRouter.get('/check-email', checkEmailAvailability)

export default userRouter