import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { login } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const redirectPath = location.state?.from || "/home";

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");

      await login(form.email.trim(), form.password);

      navigate(redirectPath, { replace: true });
    } catch (error) {
      setError(
        error.message ||
          "Unable to login. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f4f8f5] px-4 py-5 sm:px-6">
      {/* Premium background */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_15%_15%,rgba(16,185,129,0.15),transparent_38%),radial-gradient(ellipse_at_85%_85%,rgba(20,184,166,0.13),transparent_38%),linear-gradient(135deg,#f8faf9_0%,#eef7f2_50%,#f7faf8_100%)]" />

      <div className="pointer-events-none absolute -left-32 top-1/4 h-80 w-80 rounded-full bg-emerald-200/30 blur-[110px]" />

      <div className="pointer-events-none absolute -right-32 bottom-1/4 h-80 w-80 rounded-full bg-teal-200/30 blur-[110px]" />

      {/* Login card */}
      <section className="relative w-full max-w-[430px]">
        <div className="overflow-hidden rounded-[26px] border border-white/80 bg-white/95 shadow-[0_25px_80px_-30px_rgba(15,60,40,0.22)] backdrop-blur-xl">
          <div className="h-[3px] bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-400" />

          <div className="px-6 py-6 sm:px-9 sm:py-7">
            {/* Heading */}
            <div className="mb-5">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

                <span className="text-[10px] font-bold uppercase tracking-[0.17em] text-emerald-700">
                  Your everyday essentials
                </span>
              </div>

              <h1 className="text-[30px] font-semibold leading-tight tracking-[-1.2px] text-slate-950">
                Welcome <span className="text-emerald-600">back.</span>
              </h1>

              <p className="mt-2 text-[13px] leading-5 text-slate-500">
                Sign in to continue your QuickCart experience.
              </p>
            </div>

            {/* Error */}
            {error && (
              <div
                role="alert"
                className="mb-4 rounded-xl border border-red-100 bg-red-50 px-3.5 py-3 text-[13px] leading-5 text-red-600"
              >
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-[11px] font-bold tracking-[0.08em] text-slate-600"
                >
                  EMAIL ADDRESS
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                  placeholder="name@example.com"
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 text-[13px] text-slate-900 outline-none transition duration-200 placeholder:text-slate-400 hover:border-slate-300 focus:border-emerald-500 focus:bg-white"
                />
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-1.5 block text-[11px] font-bold tracking-[0.08em] text-slate-600"
                >
                  PASSWORD
                </label>

                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={handleChange}
                    required
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 pr-12 text-[13px] text-slate-900 outline-none transition duration-200 placeholder:text-slate-400 hover:border-slate-300 focus:border-emerald-500 focus:bg-white"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((previous) => !previous)
                    }
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    aria-pressed={showPassword}
                    className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-xl text-slate-400 transition hover:text-emerald-600 focus:outline-none"
                  >
                    {showPassword ? (
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        className="h-[18px] w-[18px]"
                        aria-hidden="true"
                      >
                        <path d="M3 3l18 18" strokeLinecap="round" />
                        <path
                          d="M10.6 10.6a2 2 0 002.8 2.8"
                          strokeLinecap="round"
                        />
                        <path
                          d="M9.9 5.2A10.8 10.8 0 0112 5c5 0 8.5 4.5 9.5 7-.4 1-1.2 2.2-2.3 3.3M6.2 6.2C3.9 7.7 2.8 10 2.5 12c.6 1.5 3.9 7 9.5 7 1.3 0 2.5-.3 3.6-.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : (
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        className="h-[18px] w-[18px]"
                        aria-hidden="true"
                      >
                        <path
                          d="M2.5 12S6 5 12 5s9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7Z"
                          strokeLinejoin="round"
                        />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="group mt-1 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#079669] px-4 text-[13px] font-semibold tracking-wide text-white shadow-[0_5px_14px_-5px_rgba(5,150,105,0.45)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#067f59] hover:shadow-[0_8px_20px_-6px_rgba(5,150,105,0.5)] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Signing you in...
                  </>
                ) : (
                  <>
                    Continue to QuickCart
                    <span className="transition-transform duration-200 group-hover:translate-x-1">
                      →
                    </span>
                  </>
                )}
              </button>
            </form>

            {/* Separator */}
            <div className="my-5 flex items-center gap-3">
              <div className="h-px flex-1 bg-slate-100" />

              <span className="text-[10px] font-medium tracking-[0.12em] text-slate-400">
                NEW HERE?
              </span>

              <div className="h-px flex-1 bg-slate-100" />
            </div>

            {/* Register */}
            <Link
              to="/register"
              className="flex h-10 w-full items-center justify-center rounded-xl border border-slate-200 bg-white text-[13px] font-semibold text-slate-700 transition duration-200 hover:border-emerald-200 hover:bg-emerald-50/50 hover:text-emerald-700"
            >
              Create your account
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Login;