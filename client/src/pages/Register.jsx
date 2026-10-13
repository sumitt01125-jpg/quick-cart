import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const EyeIcon = ({ visible }) =>
  visible ? (
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
  );

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    try {
      setLoading(true);

      await register(
        form.name.trim(),
        form.email.trim(),
        form.password
      );

      setSuccess("Account created successfully. Redirecting to login...");

      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 800);
    } catch (error) {
      setError(
        error.message ||
          "Unable to create your account. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "h-11 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 text-[13px] text-slate-900 outline-none ring-0 transition duration-200 placeholder:text-slate-400 hover:border-slate-300 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-0 focus-visible:outline-none";

  const labelClass =
    "mb-1.5 block text-[11px] font-bold tracking-[0.08em] text-slate-600";

  const passwordButtonClass =
    "absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-xl text-slate-400 transition hover:text-emerald-600 focus:outline-none";

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f4f8f5] px-4 py-6 sm:px-6">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_15%_15%,rgba(16,185,129,0.15),transparent_38%),radial-gradient(ellipse_at_85%_85%,rgba(20,184,166,0.13),transparent_38%),linear-gradient(135deg,#f8faf9_0%,#eef7f2_50%,#f7faf8_100%)]" />

      <div className="pointer-events-none absolute -left-32 top-1/4 h-80 w-80 rounded-full bg-emerald-200/30 blur-[110px]" />

      <div className="pointer-events-none absolute -right-32 bottom-1/4 h-80 w-80 rounded-full bg-teal-200/30 blur-[110px]" />

      {/* Register Card */}
      <section className="relative w-full max-w-[430px]">
        <div className="overflow-hidden rounded-[26px] border border-white/80 bg-white/95 shadow-[0_25px_80px_-30px_rgba(15,60,40,0.22)] backdrop-blur-xl">
          <div className="h-[3px] bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-400" />

          <div className="px-6 py-6 sm:px-9 sm:py-7">
            {/* Heading */}
            <div className="mb-5">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

                <span className="text-[10px] font-bold uppercase tracking-[0.17em] text-emerald-700">
                  Join QuickCart
                </span>
              </div>

              <h1 className="text-[30px] font-semibold leading-tight tracking-[-1.2px] text-slate-950">
                Create your <span className="text-emerald-600">account.</span>
              </h1>

              <p className="mt-2 text-[13px] leading-5 text-slate-500">
                A simpler way to shop for your everyday essentials.
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

            {/* Success */}
            {success && (
              <div
                role="status"
                className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-3 text-[13px] leading-5 text-emerald-700"
              >
                {success}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* Name */}
              <div>
                <label htmlFor="name" className={labelClass}>
                  FULL NAME
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  required
                  minLength={2}
                  maxLength={50}
                  autoComplete="name"
                  placeholder="Your name"
                  className={inputClass}
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className={labelClass}>
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
                  className={inputClass}
                />
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className={labelClass}>
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
                    minLength={8}
                    maxLength={100}
                    autoComplete="new-password"
                    placeholder="At least 8 characters"
                    className={`${inputClass} pr-12`}
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
                    className={passwordButtonClass}
                  >
                    <EyeIcon visible={showPassword} />
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className={labelClass}
                >
                  CONFIRM PASSWORD
                </label>

                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={form.confirmPassword}
                    onChange={handleChange}
                    required
                    minLength={8}
                    autoComplete="new-password"
                    placeholder="Enter password again"
                    className={`${inputClass} pr-12`}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword((previous) => !previous)
                    }
                    aria-label={
                      showConfirmPassword
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                    aria-pressed={showConfirmPassword}
                    className={passwordButtonClass}
                  >
                    <EyeIcon visible={showConfirmPassword} />
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="group flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#079669] px-4 text-[13px] font-semibold tracking-wide text-white shadow-[0_5px_14px_-5px_rgba(5,150,105,0.45)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#067f59] hover:shadow-[0_8px_20px_-6px_rgba(5,150,105,0.5)] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Creating account...
                  </>
                ) : (
                  <>
                    Create account
                    <span className="transition-transform duration-200 group-hover:translate-x-1">
                      →
                    </span>
                  </>
                )}
              </button>
            </form>

            {/* Login Link */}
            <div className="mt-5 border-t border-slate-100 pt-4 text-center">
              <p className="text-[13px] text-slate-500">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-bold text-emerald-600 transition-colors hover:text-emerald-700"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Register;