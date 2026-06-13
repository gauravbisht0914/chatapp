/* eslint-disable preserve-caught-error */
import axios from "axios";

class User {
  constructor(backendUrl) {
    this.backendUrl = backendUrl || import.meta.env.VITE_BACKEND_URL || "";
  }

  async getUserDetails(userId) {
    try {
      const res = await axios.get(
        this.backendUrl + `/api/auth/getUserDetails/${userId}`,
      );
      return res.data;
    } catch (error) {
      throw new Error(
        error.message || "Failed to fetch user details",
      );
    }
  }
}

export default new User();
