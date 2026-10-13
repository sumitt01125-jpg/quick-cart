import { Link } from "react-router-dom";

const Footer = () => {
  const linkClass =
    "w-fit text-sm font-normal text-emerald-50/70 transition-colors duration-200 hover:text-white";

  const headingClass =
    "text-xs font-semibold uppercase tracking-[0.16em] text-white/90";

  return (
    <footer className="relative overflow-hidden border-t border-emerald-800/40 bg-gradient-to-br from-[#073b32] via-[#064e3b] to-[#022c22] text-white">
      {/* Subtle background glow */}
      <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-20 h-72 w-72 rounded-full bg-teal-300/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-5 py-12 sm:py-14 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-xl font-medium text-white shadow-sm backdrop-blur-sm">
                Q
              </div>

              <span className="text-xl font-semibold tracking-tight text-white">
                Quick<span className="text-emerald-300">Cart</span>
              </span>
            </Link>

            <p className="mt-5 max-w-sm text-sm font-normal leading-7 text-emerald-50/70">
              Your everyday essentials, delivered quickly and conveniently.
              Shop groceries and daily needs from one simple place.
            </p>

            <div className="mt-6 flex items-center gap-2.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
              <span className="text-xs font-normal tracking-wide text-emerald-100/60">
                Everyday essentials, made simple.
              </span>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className={headingClass}>Shop</h3>

            <div className="mt-5 flex flex-col gap-3.5">
              <Link to="/home" className={linkClass}>
                Home
              </Link>

              <Link to="/products" className={linkClass}>
                Products
              </Link>

              <Link to="/wishlist" className={linkClass}>
                Wishlist
              </Link>

              <Link to="/orders" className={linkClass}>
                Orders
              </Link>
            </div>
          </div>

          {/* Account */}
          <div>
            <h3 className={headingClass}>Account</h3>

            <div className="mt-5 flex flex-col gap-3.5">
              <Link to="/profile" className={linkClass}>
                Profile
              </Link>

              <Link to="/addresses" className={linkClass}>
                Addresses
              </Link>

              <Link to="/cart" className={linkClass}>
                Cart
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs font-normal tracking-wide text-emerald-50/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} QuickCart. All rights reserved.
          </p>

          <p>Built with React, Node.js & PostgreSQL.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;