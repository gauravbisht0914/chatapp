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
        let users = [];
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
    <div className="page-enter min-h-full bg-white px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:p-7">
          <div className="max-w-2xl space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">
              People search
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              Discover the right profile instantly.
            </h1>
          </div>

          <div className="mt-7 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <label className="block text-sm font-medium text-slate-700">
              Search users
            </label>
            <div className="mt-4">
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by username"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-5 py-3.5 text-sm text-slate-900 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7">
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">Results</h2>
              <p className="text-sm text-slate-500">
                {filteredUsers.length} profile
                {filteredUsers.length === 1 ? "" : "s"} found
              </p>
            </div>
          </div>

          {filteredUsers.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center">
              <p className="text-sm font-medium text-slate-700">
                No users match your search query.
              </p>
              <p className="mt-2 text-sm text-slate-500">
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
                        console.log(
                          [FetchedUsers._id, currentUser._id],
                          response,
                        );
                        navigate(`/chat/${response.roomData._id}`);
                      },
                    );
                  }}
                  key={FetchedUsers._id}
                  className="cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={
                        FetchedUsers.profileImage?.url ||
                        "https://i.pravatar.cc/150?img=32"
                      }
                      alt={FetchedUsers.username}
                      className="h-14 w-14 rounded-2xl object-cover ring-2 ring-indigo-50"
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">
                        {FetchedUsers.username}
                      </h3>
                      <p className="text-sm text-slate-500">
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
