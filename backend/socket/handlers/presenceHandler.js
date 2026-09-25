import { redisClient } from "../../index.js";
import User from "../../models/user.model.js";

class Presence {
  async activePresence(socket) {
    if (!socket.id || !socket.user) {
      return;
    }

    const userId = socket.user._id.toString();

    await redisClient.sAdd(`user:activeUserSockets:${userId}`, socket.id);

    (await redisClient.sMembers(`user:presenceSubscription:${userId}`)).map(
      (_id) => {
        socket.to(_id.toString()).emit("user_presence_update", {
          userId: userId,
          active: true,
        });
      },
    );
  }

  async deletePresence(socket) {
    if (!socket.id || !socket.user) {
      return;
    }

    const userId = socket.user._id.toString();

    if ((await redisClient.sCard(`user:activeUserSockets:${userId}`)) !== 1) {
      await redisClient.sRem(`user:activeUserSockets:${userId}`, socket.id);
      return;
    }

    setTimeout(async () => {
      await redisClient.sRem(`user:activeUserSockets:${userId}`, socket.id);

      (await redisClient.sMembers(`user:presenceSubscription:${userId}`)).map(
        (_id) => {
          socket.to(_id.toString()).emit("user_presence_update", {
            userId: userId,
            active: false,
          });
        },
      );
    }, [10000]);
  }

  async updateAndGetPresenceSubscription(userId, uids = []) {
    const d = await Promise.all(
      uids.map(async (_id) => {
        const key = `user:presenceSubscription:${_id.toString()}`;

        await redisClient.sAdd(key, userId);

        return {
          userId: _id,
          active: Boolean(
            await redisClient.exists(
              `user:activeUserSockets:${_id.toString()}`,
            ),
          ),
        };
      }),
    );

    return d;
  }
}

export default new Presence();
