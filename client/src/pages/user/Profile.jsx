import { useEffect, useState } from "react";

import { useAuth } from "../../context/AuthContext";
import { updateCurrentUser } from "../../services/user.service";

const Profile = () => {
  const { user, fetchCurrentUser } = useAuth();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (user?.name) {
      setName(user.name);
    }
    setInitializing(false);
  }, [user]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedName = name.trim();

    if (trimmedName.length < 2) {
      setError("Name must be at least 2 characters.");
      return;
    }

    if (trimmedName.length > 50) {
      setError("Name cannot exceed 50 characters.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");
      await updateCurrentUser(trimmedName);
      await fetchCurrentUser();
      setSuccess("Profile updated successfully.");
    } catch (error) {
      console.error("Failed to update profile:", error);
      setError(error.message || "Unable to update your profile.");
    } finally {
      setLoading(false);
    }
  };

  if (initializing) {
    return (
      <div className="min-h-screen bg-[#f7f8f5]">
        <main className="mx-auto max-w-4xl px-5 py-8 lg:px-8">
          <div className="animate-pulse">
            <div className="h-3 w-24 rounded bg-emerald-100" />
            <div className="mt-3 h-8 w-44 rounded-lg bg-slate-200" />
            <div className="mt-7 h-80 rounded-2xl bg-white" />
          </div>
        </main>
      </div>
    );
  }

  const initials =
    user?.name
      ?.trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("") || "U";

  return (
    <div className="min-h-screen bg-[#f7f8f5]">
      <main className="mx-auto max-w-4xl px-5 py-8 lg:px-8 lg:py-10">
        {/* Page heading */}
        <div className="mb-7">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-emerald-700">
            Your account
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Profile settings
          </h1>
          <p className="mt-2 max-w-xl text-sm font-normal leading-6 text-slate-500">
            Keep your personal details up to date for a smoother QuickCart
            experience.
          </p>
        </div>

        {/* Profile card */}
        <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_12px_36px_rgba(15,23,42,0.05)]">
          {/* Profile identity */}
          <div className="relative overflow-hidden border-b border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-lime-50 px-6 py-7 sm:px-8 sm:py-8">
            <div className="pointer-events-none absolute -right-8 -top-14 h-48 w-48 rounded-full bg-emerald-100/50 blur-3xl" />
            <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-center gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-white bg-emerald-600 text-xl font-semibold text-white shadow-sm ring-4 ring-white/70 sm:h-[72px] sm:w-[72px] sm:text-2xl">
                  {initials}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium uppercase tracking-[0.12em] text-emerald-700">
                    QuickCart member
                  </p>
                  <h2 className="mt-1 truncate text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
                    {user?.name || "Your profile"}
                  </h2>
                  <p className="mt-1 truncate text-sm font-normal text-slate-500">
                    {user?.email}
                  </p>
                </div>
              </div>

              <div className="w-fit rounded-xl border border-white/90 bg-white/80 px-3.5 py-2.5 shadow-sm backdrop-blur">
                <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-slate-400">
                  Account type
                </p>
                <p className="mt-1 text-xs font-medium text-emerald-800">
                  {user?.role || "CUSTOMER"}
                </p>
              </div>
            </div>
          </div>

          {/* Profile form */}
          <div className="p-5 sm:p-8">
            <div className="mb-6">
              <h3 className="text-base font-semibold text-slate-900">
                Personal information
              </h3>
              <p className="mt-1 text-sm font-normal text-slate-500">
                Update the name associated with your account.
              </p>
            </div>

            {error && (
              <div
                role="alert"
                className="mb-5 flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-normal text-rose-700"
              >
                <span aria-hidden="true">!</span>
                <p>{error}</p>
              </div>
            )}

            {success && (
              <div
                role="status"
                className="mb-5 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-normal text-emerald-800"
              >
                <span aria-hidden="true">✓</span>
                <p>{success}</p>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Full name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(event) => {
                    setName(event.target.value);
                    setError("");
                    setSuccess("");
                  }}
                  required
                  minLength={2}
                  maxLength={50}
                  autoComplete="name"
                  placeholder="Enter your name"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-normal text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50"
                />
                <p className="mt-2 text-xs font-normal text-slate-400">
                  Use 2–50 characters.
                </p>
              </div>

              <div className="mt-5">
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  value={user?.email || ""}
                  disabled
                  autoComplete="email"
                  className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-normal text-slate-500 outline-none"
                />
                <p className="mt-2 text-xs font-normal text-slate-400">
                  Your email address can't be changed here.
                </p>
              </div>

              <div className="mt-5">
                <label
                  htmlFor="role"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Account type
                </label>
                <div
                  id="role"
                  className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3"
                >
                  <span className="text-sm font-normal text-slate-600">
                    Account role
                  </span>
                  <span className="rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800">
                    {user?.role || "CUSTOMER"}
                  </span>
                </div>
              </div>

              <div className="mt-7 flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs font-normal leading-5 text-slate-400">
                  Your account details are kept in sync after saving.
                </p>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                      Saving changes...
                    </>
                  ) : (
                    "Save changes"
                  )}
                </button>
              </div>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Profile;