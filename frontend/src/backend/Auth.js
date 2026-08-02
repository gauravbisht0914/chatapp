import axios from "axios";

class Auth {
  constructor() {
    this.user = null;
    this.backendUrl = import.meta.env.VITE_BACKEND_URL || "";
  }

  async login({ email, password }) {
    try {
      const response = await axios.post(
        this.backendUrl + "/api/auth/login",
        { email, password },
        {
          withCredentials: true,
        },
      );
      console.log(response);

      if (response.statusText !== "OK") {
        throw new Error("Login failed");
      }

      return response;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }

  async signup({ email, password, username }) {
    try {
      const response = await axios.post(this.backendUrl + "/api/auth/signup", {
        email,
        password,
        username,
      });

      if (!response.statusText !== "OK") {
        throw new Error("Signup failed");
      }

      return response;
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    }
  }

  async isAuthenticated() {
    try {
      const res = await axios.get(
        this.backendUrl + "/api/auth/is-authenticated",
        {
          withCredentials: true,
        },
      );
      return res;
    } catch (error) {
      console.error("Authentication error:", error);
      throw error;
    }
  }

  async logout() {
    try {
      const response = await axios.post(
        this.backendUrl + "/api/auth/logout",{},
        {
          withCredentials: true,
        },
      );

      if (response.statusText !== "OK") {
        throw new Error("Logout failed");
      }

      return response;
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  }
}

export default new Auth();
