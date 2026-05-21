import User from "../models/user.models";
import fs from "fs/promises"
import { uploadProfileImage } from "../utils/cloudinary"
import DeletedAssests from "../models/deletedAssests.models"
import { deleteProfileImage } from "../utils/cloudinary";

async function updateProfilePicture(req, res) {
    async function uploadProfilePicture(req, res) {
        try {
            const { _id } = req.user
            const file = req.file

            if (!file) {
                return res.status(400).send("Profile picture required!")
            }

            if (!_id) {
                return res.status(400).send('Cannot find user Id')
            }

            const user = await User.findById(_id)

            if (!user) {
                return res.status(404).send("User doesn't exist")
            }

            if (user.profileImage.public_id) {
                await deleteProfileImage(user.profileImage.public_id)
            } else {
                console.log('no profileimg', user.profileImage)
            }

            const uploadedProfileImg = await uploadProfileImage(file.path)

            await fs.unlink(file.path)

            const newProfileImgData = {
                public_id: uploadedProfileImg.public_id,
                url: uploadedProfileImg.url,
            }

            user.profileImage = newProfileImgData

            await user.save()

            return res.status(200).json({
                message: 'Updated Profile Image',
                url: uploadedProfileImg.url,
            })


        } catch (error) {
            return res.status(500).send(error.message)
        }
    }


    async function checkUsernameAvailability(req, res) {
        try {
            const { username } = req.query

            if (!username) {
                return res.status(400).send("Username required!")
            }

            const user = await User.findOne({ username })

            if (!user) {
                return res.status(200).send('Available')
            } else {
                return res.status(409).send('Not available')
            }

        } catch (error) {
            return res.status(500).send(error.message)
        }
    }

    async function checkEmailAvailability(req, res) {
        try {
            const { email } = req.query

            if (!email) {
                return res.status(400).send("Username required!")
            }

            const user = await User.findOne({ email })

            if (!user) {
                return res.status(200).send('Available')
            } else {
                return res.status(409).send('Not available')
            }

        } catch (error) {
            return res.status(500).send(error.message)
        }
    }
}

export { updateProfilePicture, checkUsernameAvailability, checkEmailAvailability }