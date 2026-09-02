import User from "../../models/user.model.js";

class Presence {
  constructor() {
    this.userSockets = new Map();
    this.presenceTimeouts = new Map();
    this.presenceWatchers = new Map();
  }

  activePresence(socket) {
    if (!socket.id || !socket.user) {
      return;
    }

    const userId = socket.user._id.toString();

    if (!this.userSockets.has(userId)) {
      this.userSockets.set(userId, new Set());
    }

    if (this.presenceTimeouts.has(userId)) {
      clearTimeout(this.presenceTimeouts.get(userId));
      this.presenceTimeouts.delete(userId);
    }

    this.userSockets.get(userId).add(socket.id);

    if (!this.presenceWatchers.has(userId)) {
      this.presenceWatchers.set(userId, new Set());
    }

    this.presenceWatchers.get(userId).forEach((subscriberId) => {
      const subscriberSockets = this.userSockets.get(subscriberId);
      if (subscriberSockets) {
        subscriberSockets.forEach((userId) => {
          socket.to(userId).emit("user_presence_update", {
            userId: userId,
            active: true,
          });
        });
      }
    });

    console.log(this.userSockets);
  }

  async deletePresence(socket) {
    if (!socket.id || !socket.user) {
      return;
    }

    const userId = socket.user._id.toString();

    if (this.userSockets.has(userId)) {
      this.userSockets.get(userId).delete(socket.id);
    }

    if (
      this.userSockets.get(userId)?.size === 0 &&
      !this.presenceTimeouts.has(userId)
    ) {
      this.presenceTimeouts.set(
        userId,
        setTimeout(async () => {
          try {
            await User.findByIdAndUpdate(userId, {
              lastActive: new Date(),
            });

            this.presenceWatchers.get(userId)?.forEach((subscriberId) => {
              const subscriberSockets = this.userSockets.get(subscriberId);
              if (subscriberSockets) {
                subscriberSockets.forEach((userId) => {
                  socket.to(userId).emit("user_presence_update", {
                    userId: userId,
                    active: false,
                  });
                });
              }
            });
          } catch (error) {
            console.log(error);
          } finally {
            this.presenceTimeouts.delete(userId);
          }
        }, 10000),
      );
      this.userSockets.delete(userId);
    }

    console.log(this.userSockets);
    return;
  }

  updateAndGetpresenceSubscription(userId, uids = []) {
    const subscriberId = userId.toString();

    return uids.map((id) => {
      const targetId = id.toString();

      if (!this.presenceWatchers.has(targetId)) {
        this.presenceWatchers.set(targetId, new Set());
      }
      console.log(this.userSockets.get(targetId)?.size || 0);

      this.presenceWatchers.get(targetId).add(subscriberId);
      console.log("presenceWatchers", this.presenceWatchers);
      return {
        userId: id,
        active: (this.userSockets.get(targetId)?.size || 0) >= 1,
      };
    });
  }
}

export default new Presence();
