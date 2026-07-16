import { useMemo, useState } from "react";
import User from "../backend/User";
import { useNavigate } from "react-router";
import { socket } from "@/utils/socket";
import { useSelector } from "react-redux";

export default function Search() {
  const [query, setQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const navigate = useNavigate();
  const currentUser = useSelector((user) => user.user);

  useMemo(() => {
    const username = query.trim().toLowerCase();
    if (!username) return [];
    async function matches() {
      try {
        let users = []
        users = await User.searchUserProfile(username);
        users = users.filter((user) => user._id !== currentUser._id);
        console.log("Filtered users:", users);
        setFilteredUsers(users);
        return users;
      } catch (error) {
        console.error("Error searching user profile:", error);
        return [];
      }
    }
    matches();
  }, [query]);

  return (
    <div className="min-h-screen bg-transparent px-4 py-8 sm:px-6 lg:px-8 cursor-pointer">
      <div className="mx-auto max-w-5xl space-y-8">
        <section className="rounded-[32px] border border-white/10 bg-[#0e0e0e] p-6 shadow-2xl shadow-white/10">
          <div className="max-w-2xl space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-400">
              People search
            </p>
            <h1 className="text-4xl font-semibold text-white">
              Discover the right profile instantly.
            </h1>
          </div>

          <div className="mt-8 rounded-[28px] border border-white/10 bg-[#0b0b0b] p-5 shadow-inner shadow-white/5">
            <label className="block text-sm font-medium text-slate-300">
              Search users
            </label>
            <div className="mt-4">
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by username"
                className="w-full rounded-3xl border border-white/10 bg-[#090909] px-5 py-4 text-sm text-white outline-none transition focus:border-white/20 focus:ring-2 focus:ring-white/10"
              />
            </div>
          </div>
        </section>

        <section className="rounded-[32px] border border-white/10 bg-[#0e0e0e] p-6 shadow-2xl shadow-white/10">
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-white">Results</h2>
              <p className="text-sm text-slate-400">
                {filteredUsers.length} profile
                {filteredUsers.length === 1 ? "" : "s"} found
              </p>
            </div>
          </div>

          {filteredUsers.length === 0 ? (
            <div className="rounded-[28px] border border-dashed border-white/10 bg-[#0b0b0b] px-6 py-10 text-center">
              <p className="text-sm font-medium text-white">
                No users match your search query.
              </p>
              <p className="mt-2 text-sm text-slate-400">
                Try a different username.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2">
              {filteredUsers.map((FetchedUsers) => (
                <div
                  onClick={() => {
                    socket.emit(
                      "joinRoom",
                      {
                        recipients: [FetchedUsers._id, currentUser._id],
                        roomIdByClient: null,
                      },

                      (response) => {
                        console.log([FetchedUsers._id, currentUser._id], response);
                        navigate(`/chat/${response.roomData._id}`);
                      },
                    );
                  }}
                  key={FetchedUsers._id}
                  className="overflow-hidden rounded-[28px] border border-white/10 bg-[#0b0b0b] p-5 shadow-xl shadow-white/5 transition hover:-translate-y-1 hover:border-white/20"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={
                        FetchedUsers.profileImage?.url ||
                        "https://i.pravatar.cc/150?img=32"
                      }
                      alt={FetchedUsers.username}
                      className="h-16 w-16 rounded-4xl object-cover ring-2 ring-white/10"
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {FetchedUsers.username}
                      </h3>
                      <p className="text-sm text-slate-400">
                        @{FetchedUsers.username}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
