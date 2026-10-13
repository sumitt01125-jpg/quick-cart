import { NavLink } from "react-router-dom";

const links = [
  {
    label: "Dashboard",
    path: "/admin",
    icon: "📊",
  },
  {
    label: "Products",
    path: "/admin/products",
    icon: "📦",
  },
  {
    label: "Categories",
    path: "/admin/categories",
    icon: "🗂️",
  },
  {
    label: "Inventory",
    path: "/admin/inventory",
    icon: "🏷️",
  },
  {
    label: "Coupons",
    path: "/admin/coupons",
    icon: "🎟️",
  },
  {
    label: "Orders",
    path: "/admin/orders",
    icon: "🛍️",
  },
];

const AdminSidebar = () => {
  return (
    <aside className="w-full shrink-0 rounded-2xl border border-slate-200/80 bg-white p-3 shadow-sm sm:p-4 lg:w-64">
      <div className="px-3 py-3">
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-emerald-700">
          QuickCart
        </p>
        <h2 className="mt-1 text-lg font-semibold tracking-tight text-slate-900">
          Admin Panel
        </h2>
        <p className="mt-1 text-xs text-slate-400">Manage your store</p>
      </div>

      <div className="my-2 h-px bg-slate-100" />

      <nav
        aria-label="Admin navigation"
        className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0"
      >
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            end={link.path === "/admin"}
            className={({ isActive }) =>
              `flex shrink-0 items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-emerald-500 text-white shadow-sm shadow-emerald-500/15"
                  : "text-slate-600 hover:bg-emerald-50 hover:text-emerald-800"
              }`
            }
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-black/5 text-base">
              {link.icon}
            </span>
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default AdminSidebar;
