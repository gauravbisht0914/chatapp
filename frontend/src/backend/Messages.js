import axios from "axios";

class Messages {
  constructor() {
    this.backendUrl = import.meta.env.VITE_BACKEND_URL || "";
  }

  async fetchMessages(roomId, offset, limit) {
    const res = await axios.get(
      this.backendUrl +
        `/api/messages/${roomId}?offset=${offset}&limit=${limit}`,
      { withCredentials: true },
    );
    return res;
  }
}

export default new Messages();
