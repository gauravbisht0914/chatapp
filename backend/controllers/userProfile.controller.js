import User from "../models/user.model.js";
import fs from "fs/promises";
import { uploadProfileImage, deleteProfileImage } from "../utils/cloudinary.js";
// import DeletedAssests from "../models/deletedAssests.models"

async function updateProfilePicture(req, res) {
  try {
    const { _id } = req.user;
    const file = req.file;

    if (!file) {
      return res.status(400).send("Profile picture required!");
    }

    if (!_id) {
      return res.status(400).send("Cannot find user Id");
    }

    const user = await User.findById(_id);

    if (!user) {
      return res.status(404).send("User doesn't exist");
    }

    if (user.profileImage.public_id) {
      await deleteProfileImage(user.profileImage.public_id);
    } else {
      console.log("no profileimg", user.profileImage);
    }

    const uploadedProfileImg = await uploadProfileImage(file.path);

    await fs.unlink(file.path);

    const newProfileImgData = {
      public_id: uploadedProfileImg.public_id,
      url: uploadedProfileImg.url,
    };

    user.profileImage = newProfileImgData;

    await user.save();

    return res.status(200).json({
      message: "Updated Profile Image",
      newProfileData: newProfileImgData,
    });
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

async function updateProfileName(req, res) {
  try {
    const { _id } = req.user;
    const { username } = req.body;

    if (!username) {
      return res.status(400).send("Username required!");
    }

    const user = await User.findById(_id);

    if (!user) {
      return res.status(404).send("User doesn't exist");
    }

    if (username === user.username) {
      return res
        .status(400)
        .send("New username cannot be the same as the current username");
    }
    if (username.length < 3 || username.length > 20) {
      return res
        .status(400)
        .send("Username must be between 3 and 20 characters");
    }

    user.username = username.trim().toLowerCase();
    await user.save();

    return res.status(200).json({
      message: "Updated Profile Name",
      newProfileData: user.username,
    });
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

async function updatePassword(req, res) {
  try {
    const { _id } = req.user;
    const { currentPassword, newPassword } = req.body;
    console.log(currentPassword,newPassword)

    if (!currentPassword || !newPassword) {
      return res.status(400).send("Current and new password are required");
    }

    if (newPassword.length < 6) {
      return res
        .status(400)
        .send("New password must be at least 6 characters long");
    }

    const user = await User.findById(_id);

    if (!user) {
      return res.status(404).send("User doesn't exist");
    }

    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
      return res.status(400).send("Current password is incorrect");
    }

    user.password = newPassword;
    await user.save();

    return res.status(200).json({
      message: "Password updated successfully",
    });
  } catch (e) {
    return res.status(500).send(e.message);
  }
}

async function checkUsernameAvailability(req, res) {
  try {
    const { username } = req.query;

    if (!username) {
      return res.status(400).send("Username required!");
    }

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(200).send("Available");
    } else {
      return res.status(409).send("Not available");
    }
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

async function checkEmailAvailability(req, res) {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).send("Username required!");
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(200).send("Available");
    } else {
      return res.status(409).send("Not available");
    }
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

export {
  updateProfilePicture,
  checkUsernameAvailability,
  checkEmailAvailability,
  updateProfileName,
  updatePassword,
};
