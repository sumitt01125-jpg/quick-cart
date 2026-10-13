import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import quickCartLogo from "../../assets/Logo.webp";
import { useCart } from "../../context/CartContext";

const SearchBar = ({ searchQuery, setSearchQuery, onSearch, mobile = false }) => (
  <form
    onSubmit={onSearch}
    className={`flex h-11 items-center rounded-xl border border-white/15 bg-slate-100 shadow-sm shadow-black/10 transition-colors duration-200 focus-within:border-emerald-400/60 focus-within:bg-white/[0.12] ${
      mobile ? "w-full" : "w-full max-w-[390px]"
    }`}
  >
    <button
      type="submit"
      aria-label="Search products"
      className="flex h-full w-11 shrink-0 items-center justify-center text-slate-300 transition-colors hover:text-emerald-300"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="h-5 w-5"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="m16 16 4 4" strokeLinecap="round" />
      </svg>
    </button>

    <input
      type="search"
      value={searchQuery}
      onChange={(event) => setSearchQuery(event.target.value)}
      placeholder='Search "milk", "fruits"...'
      aria-label="Search products"
      className="qc-search-input h-full min-w-0 flex-1 border-0 bg-transparent px-1 text-sm text-white placeholder:text-slate-400 focus:border-0 focus:outline-none focus:ring-0 focus-visible:outline-none"
    />

    {searchQuery.length > 0 && (
      <button
        type="button"
        aria-label="Clear search"
        onClick={() => setSearchQuery("")}
        className="mr-2 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none"
      >
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4" aria-hidden="true">
          <path d="m5 5 10 10M15 5 5 15" strokeLinecap="round" />
        </svg>
      </button>
    )}
  </form>
);

const Navbar = () => {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();

  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(
    () => new URLSearchParams(location.search).get("search") || ""
  );

  const isAdmin = user?.role === "ADMIN";

  const isActive = (path) => {
    if (path === "/home") {
      return location.pathname === "/home";
    }

    return location.pathname.startsWith(path);
  };

  const handleSearch = (event) => {
    event.preventDefault();

    const query = searchQuery.trim();

    navigate(
      query
        ? `/products?search=${encodeURIComponent(query)}`
        : "/products"
    );

    setMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      setMenuOpen(false);
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const closeMenu = () => setMenuOpen(false);

  const navLinkClass = (path) =>
    `rounded-xl px-3 py-2 text-sm font-semibold transition-colors duration-200 ${
      isActive(path)
        ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/70"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
    }`;

  const sharedSearchProps = {
    searchQuery,
    setSearchQuery,
    onSearch: handleSearch,
  };

  // LOGGED OUT NAVBAR — landing page only: brand + authentication actions
  if (!user) {
    return (
      <header className="sticky top-0 z-50 border-b border-emerald-200/80 bg-gradient-to-r from-[#d9f7e5] via-[#e8f8ed] to-[#d5f3e2] shadow-[0_6px_24px_rgba(37,99,70,0.12)] backdrop-blur-xl">
        <nav className="mx-auto flex min-h-[76px] max-w-[1440px] items-center gap-4 px-4 sm:px-6 lg:px-8">
          <Link to="/" className="group flex shrink-0 items-center gap-2.5" aria-label="QuickCart home">
            <span className="inline-flex items-center rounded-xl bg-white px-2.5 py-1.5 shadow-lg shadow-black/10 transition-transform duration-200 group-hover:scale-[1.02]">
              <img src={quickCartLogo} alt="QuickCart" className="h-10 w-auto max-w-[190px] object-contain sm:h-11" />
            </span>
          </Link>

          <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
            <Link
              to="/login"
              className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-emerald-50 hover:text-emerald-800"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="group relative isolate inline-flex items-center gap-2 overflow-hidden rounded-xl border border-emerald-500 bg-white px-5 py-3 text-sm font-bold text-slate-900 shadow-[0_3px_12px_rgba(16,185,129,0.08)] transition-all duration-300 before:absolute before:inset-0 before:-z-10 before:translate-y-full before:rounded-[inherit] before:bg-gradient-to-r before:from-lime-300 before:via-emerald-300 before:to-green-400 before:transition-transform before:duration-300 before:content-[''] hover:-translate-y-0.5 hover:border-emerald-400 hover:shadow-[0_0_22px_rgba(52,211,153,0.35)] hover:before:translate-y-0 sm:px-6"
            >
              Sign Up <span aria-hidden="true">→</span>
            </Link>
          </div>
        </nav>
      </header>
    );
  }

  // LOGGED IN NAVBAR
  return (
    <header className="sticky top-0 z-50 border-b border-emerald-200/80 bg-gradient-to-r from-[#d9f7e5] via-[#e8f8ed] to-[#d5f3e2] shadow-[0_6px_24px_rgba(37,99,70,0.12)] backdrop-blur-xl">
      <nav className="mx-auto flex min-h-[72px] max-w-[1440px] items-center gap-3 px-4 sm:px-6 lg:gap-5 lg:px-8">
        <Link to="/home" className="group flex shrink-0 items-center gap-2.5" aria-label="QuickCart home">
          <span className="inline-flex items-center rounded-xl bg-white px-2.5 py-1.5 transition-transform duration-200 group-hover:scale-[1.02]">
            <img src={quickCartLogo} alt="QuickCart" className="h-10 w-auto max-w-[190px] object-contain sm:h-11" />
          </span>
        </Link>

        <div className="hidden min-w-0 flex-1 md:flex md:justify-center">
          <SearchBar {...sharedSearchProps} />
        </div>

        <div className="hidden shrink-0 items-center gap-1 xl:flex">
          <Link to="/home" className={navLinkClass("/home")}>
            Home
          </Link>

          <Link to="/products" className={navLinkClass("/products")}>
            Products
          </Link>

          <Link to="/wishlist" className={navLinkClass("/wishlist")}>
            Wishlist
          </Link>

          <Link to="/orders" className={navLinkClass("/orders")}>
            Orders
          </Link>

          {isAdmin && (
            <Link
              to="/admin"
              className="rounded-xl px-3 py-2 text-sm font-semibold text-emerald-700 transition-colors hover:bg-emerald-50"
            >
              Admin
            </Link>
          )}
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          <Link
            to="/cart"
            aria-label="Shopping cart"
            className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition-colors hover:border-emerald-300/40 hover:bg-emerald-400/10"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <path
                d="M3 4h2l2.2 10.2a2 2 0 0 0 2 1.6h7.9a2 2 0 0 0 2-1.6L21 8H6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="10" cy="20" r="1" />
              <circle cx="18" cy="20" r="1" />
            </svg>

            {itemCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-600 px-1 text-[10px] font-bold text-white ring-2 ring-white">
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            )}
          </Link>

          <Link
            to="/profile"
            aria-label="My account"
            className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-white py-1.5 pl-1.5 pr-3 transition-colors hover:border-emerald-300/40 hover:bg-white/10 sm:flex"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-sm font-black text-emerald-700">
              {user?.name?.charAt(0)?.toUpperCase()}
            </span>

            <span className="max-w-24 truncate text-xs font-bold text-slate-800">
              {user?.name}
            </span>
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="hidden rounded-xl border border-white/15 px-3 py-2.5 text-xs font-bold text-slate-600 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600 sm:inline-flex"
          >
            Logout
          </button>

          <button
            type="button"
            onClick={() => setMenuOpen((value) => !value)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/15 text-slate-800 transition-colors hover:bg-white/10 xl:hidden"
          >
            {menuOpen ? (
              <span className="text-xl" aria-hidden="true">×</span>
            ) : (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile search */}
      <div className="border-t border-slate-100 px-4 py-3 md:hidden">
        <SearchBar {...sharedSearchProps} mobile />
      </div>

      {/* Mobile navigation */}
      {menuOpen && (
        <div className="border-t border-slate-100 bg-white px-4 py-4 shadow-lg shadow-slate-900/10 xl:hidden">
          <div className="mx-auto flex max-w-[1440px] flex-col gap-1">
            <Link to="/home" onClick={closeMenu} className={navLinkClass("/home")}>
              Home
            </Link>

            <Link to="/products" onClick={closeMenu} className={navLinkClass("/products")}>
              Products
            </Link>

            <Link to="/wishlist" onClick={closeMenu} className={navLinkClass("/wishlist")}>
              Wishlist
            </Link>

            <Link to="/orders" onClick={closeMenu} className={navLinkClass("/orders")}>
              Orders
            </Link>

            <Link to="/cart" onClick={closeMenu} className={navLinkClass("/cart")}>
              Cart {itemCount > 0 ? `(${itemCount})` : ""}
            </Link>

            {isAdmin && (
              <Link to="/admin" onClick={closeMenu} className={navLinkClass("/admin")}>
                Admin Panel
              </Link>
            )}

            <Link to="/profile" onClick={closeMenu} className={navLinkClass("/profile")}>
              My Account
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="mt-2 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;