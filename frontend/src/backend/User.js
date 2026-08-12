/* eslint-disable preserve-caught-error */
import axios from "axios";

class User {
  constructor() {
    this.backendUrl = import.meta.env.VITE_BACKEND_URL || "";
  }

  async getUserDetails(userId) {
    try {
      const res = await axios.get(
        this.backendUrl + `/api/auth/getUserDetails/${userId}`,
      );
      return res.data;
    } catch (error) {
      throw new Error(error.message || "Failed to fetch user details");
    }
  }

  async searchUserProfile(username) {
    try {
      const res = await axios.get(
        this.backendUrl +
          `/api/auth/findUserProfile/users?username=${username}`,
      );
      return res.data;
    } catch (error) {
      throw new Error(error.message || "Failed to search user profile");
    }
  }

  async updateProfilePicture(file) {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await axios.post(
        this.backendUrl + `/api/auth/update-profile-picture`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        },
      );
      return res.data;
    } catch (error) {
      throw new Error(error.message || "Failed to update profile picture");
    }
  }

  async updateProfileName(username) {
    try {
      const res = await axios.post(
        this.backendUrl + `/api/auth/update-profile-name`,
        { username: username.trim() },
        {
          withCredentials: true,
        },
      );
      return res.data;
    } catch (error) {
      throw new Error(error.message || "Failed to update profile name");
    }
  }

  async checkUsernameAvailability(username) {
    try {
      const res = await axios.get(
        this.backendUrl +
          `/api/auth/check-username-availability?username=${username.trim()}`,
      );
      return res.data;
    } catch (error) {
      throw new Error(error.message || "Failed to check username availability");
    }
  }

  async updatePassword({ currentPassword, newPassword }) {
    try {
      const res = await axios.post(
        this.backendUrl + `/api/auth/change-password`,
        { currentPassword, newPassword },
        {
          withCredentials: true,
        },
      );
      return res.data;
    } catch (e) {
      throw new Error(e.message || "Failed to change password");
    }
  }
}

export default new User();
