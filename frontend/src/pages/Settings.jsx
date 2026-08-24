import Auth from "@/backend/Auth";
import { useSelector } from "react-redux";
import User from "@/backend/User";
import React from "react";
import { setUser } from "@/store/userSlice.js";
import { useDispatch } from "react-redux";
import { Loader, Toast } from "@/components/index";

const Settings = () => {
  const currentUser = useSelector((state) => state.user);
  const [loading,setLoading] = React.useState({
    loadingForProfileUpdate: false,
    loadingForPasswordUpdate: false,
  })

  const [profileData, setProfileData] = React.useState({
    username: currentUser.username,
    email: currentUser.email,
    currentPassword: "",
    newPassword: "",
  });

  const dispatch = useDispatch();
  async function logout() {
    try {
      await Auth.logout();
      window.location.assign("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  }

  async function updateProfilePictureHandler(event) {
    try {
      event.preventDefault();
      const res = await User.updateProfilePicture(event.target.files[0]);
      console.log("Profile picture updated:", res);
      dispatch(setUser({ ...currentUser, profileImage: res.newProfileData }));
    } catch (error) {
      console.error("Error updating profile picture:", error);
    }
  }

  async function updateProfileNameHandler(event) {
    try {
      event.preventDefault();
      setLoading({ ...loading, loadingForProfileUpdate: true });
      const res = await User.updateProfileName(profileData.username);
      console.log("Profile name updated:", res);
      dispatch(setUser({ ...currentUser, username: res.newProfileData }));
    } catch (error) {
      console.error("Error updating profile name:", error);
    }finally {
      setLoading({ ...loading, loadingForProfileUpdate: false });
    }
  }

  async function updatePasswordHandler(event) {
    try {
      event.preventDefault();
      if(profileData.currentPassword.trim() === "" || profileData.newPassword.trim() === ""){
        throw new Error("Current password and new password cannot be empty");
      }
      if(profileData.currentPassword === profileData.newPassword){
        throw new Error("New password cannot be the same as the current password");
      }
      setLoading({ ...loading, loadingForPasswordUpdate: true });
      console.log(profileData)
      const res = await User.updatePassword({currentPassword:profileData.currentPassword,newPassword: profileData.newPassword});
    } catch (error) {
      console.error("Error updating password:", error);
    } finally {
      setLoading({ ...loading, loadingForPasswordUpdate: false });
    }
  }

  return (
    <div className="min-h-screen bg-transparent px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-[32px] border border-white/10 bg-[#0f0f0f] p-8 shadow-2xl shadow-white/10 lg:p-12">
          <div className="mb-10 flex flex-col gap-6 rounded-[28px] border border-white/10 bg-[#111111] p-8 shadow-inner shadow-white/5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
                Settings
              </p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                Manage your profile & account
              </h1>
              <p className="mt-4 max-w-2xl text-slate-400">
                Update the details below to keep your profile current and
                secure. Change your avatar, name, email, or password with one
                click.
              </p>
            </div>
            <div className="flex items-center gap-4 rounded-[28px] border border-white/10 bg-[#0b0b0b] px-5 py-4 shadow-lg shadow-white/5">
              <div className="relative h-16 w-16 overflow-hidden rounded-4xl border border-white/10 bg-[#111111]">
                <img
                  src={currentUser.profileImage?.url}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex flex-col gap-3">
                <div>
                  <p className="text-sm uppercase tracking-[0.25em] text-slate-500">
                    Signed in as
                  </p>
                  <p className="text-lg font-semibold text-white">
                    {currentUser.username}
                  </p>
                  <p className="text-sm text-slate-400">{currentUser.email}</p>
                </div>
                <button
                  type="button"
                  onClick={logout}
                  className="inline-flex items-center cursor-pointer justify-center rounded-full border border-[#612020] bg-[#c44141]  px-4 py-2 text-sm font-medium text-white transition hover:bg-[red] focus:outline-none focus:ring-2 focus:ring-white/20"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            <section className="rounded-[32px] border border-white/10 bg-[#111111] p-8 shadow-2xl shadow-white/10">
              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-white">
                    Update Profile
                  </h2>
                  <p className="mt-1 text-sm text-slate-400">
                    Change your display name, email address, or profile picture.
                  </p>
                </div>
                
              </div>

              <form className="space-y-5">
                <label className="block text-sm text-slate-300">
                  <span className="mb-2 block text-xs uppercase tracking-[0.2em] text-slate-500">
                    Profile picture
                  </span>
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <div className="h-14 w-16 overflow-hidden rounded-4xl">
                      <img
                        src={currentUser.profileImage?.url}
                        alt="Avatar preview"
                        className="h-full w-full object-cover border border-white/10"
                      />
                    </div>
                    <input
                      type="file"
                      onChange={updateProfilePictureHandler}
                      className="block w-full rounded-3xl border border-white/10 bg-[#0b0b0b] px-4 py-3 text-sm text-white file:mr-4 file:rounded-full file:border-0 file:bg-white file:px-4 file:py-2 file:text-black file:font-semibold"
                    />
                  </div>
                </label>

                <label className="block text-sm text-slate-300">
                  <span className="mb-2 block text-xs uppercase tracking-[0.2em] text-slate-500">
                    Name
                  </span>
                  <input
                    type="text"
                    onChange={(e) => {
                      setProfileData({
                        ...profileData,
                        username: e.target.value,
                      });
                    }}
                    defaultValue={profileData.username}
                    className="w-full rounded-3xl border border-white/10 bg-[#0b0b0b] px-4 py-3 text-white outline-none transition focus:border-white/20 focus:ring-2 focus:ring-white/10"
                  />
                </label>

                {/* <label className="block text-sm text-slate-300">
                  <span className="mb-2 block text-xs uppercase tracking-[0.2em] text-slate-500">
                    Email
                  </span>
                  <input
                    type="email"
                    onChange={e=>setProfileData({...profileData, email: e.target.value})}
                    defaultValue={profileData.email}
                    className="w-full rounded-3xl border border-white/10 bg-[#0b0b0b] px-4 py-3 text-white outline-none transition focus:border-white/20 focus:ring-2 focus:ring-white/10"
                  />
                </label> */}

                <button
                  onClick={updateProfileNameHandler}
                  type="button"
                  className="w-full rounded-3xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-slate-100"
                >
                  {loading.loadingForProfileUpdate ? <Loader /> : "Save profile changes"}
                </button>
              </form>
            </section>

            <section className="rounded-[32px] border border-white/10 bg-[#111111] p-8 shadow-2xl shadow-white/10">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-white">
                  Change Password
                </h2>
                <p className="mt-1 text-sm text-slate-400">
                  Keep your account secure by updating your password regularly.
                </p>
              </div>

              <form className="space-y-5">
                <label className="block text-sm text-slate-300">
                  <span className="mb-2 block text-xs uppercase tracking-[0.2em] text-slate-500">
                    Current password
                  </span>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={profileData.currentPassword}
                    onChange={(e) => {
                      setProfileData({
                        ...profileData,
                        currentPassword: e.target.value,
                      });
                    }}
                    className="w-full rounded-3xl border border-white/10 bg-[#0b0b0b] px-4 py-3 text-white outline-none transition focus:border-white/20 focus:ring-2 focus:ring-white/10"
                  />
                </label>

                <label className="block text-sm text-slate-300">
                  <span className="mb-2 block text-xs uppercase tracking-[0.2em] text-slate-500">
                    New password
                  </span>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={profileData.newPassword}
                    onChange={(e) => {
                      setProfileData({
                        ...profileData,
                        newPassword: e.target.value,
                      });
                    }}
                    className="w-full rounded-3xl border border-white/10 bg-[#0b0b0b] px-4 py-3 text-white outline-none transition focus:border-white/20 focus:ring-2 focus:ring-white/10"
                  />
                </label>

                <label className="block text-sm text-slate-300">
                  <span className="mb-2 block text-xs uppercase tracking-[0.2em] text-slate-500">
                    Confirm password
                  </span>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full rounded-3xl border border-white/10 bg-[#0b0b0b] px-4 py-3 text-white outline-none transition focus:border-white/20 focus:ring-2 focus:ring-white/10"
                  />
                </label>

                <button
                onClick={updatePasswordHandler}
                  type="button"
                  className="w-full rounded-3xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-slate-100"
                >
                  Update password
                </button>
              </form>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
