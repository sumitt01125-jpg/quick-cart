import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAdminTest } from "../../services/admin.service";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [adminMessage, setAdminMessage] = useState("");
  const [error, setError] = useState("");
  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getAdminTest();
        setAdminMessage(data.message || "Welcome Admin");
      } catch (error) {
        console.error("Failed to load admin dashboard:", error);
        setError(error.message || "Unable to load admin dashboard.");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const adminSections = [
    {
      title: "Products",
      description: "Create, update and manage your product catalog.",
      icon: "🛍️",
      path: "/admin/products",
    },
    {
      title: "Categories",
      description: "Manage product categories.",
      icon: "📂",
      path: "/admin/categories",
    },
    {
      title: "Inventory",
      description: "Manage product stock and availability.",
      icon: "📦",
      path: "/admin/inventory",
    },
    {
      title: "Coupons",
      description: "Create and manage discount coupons.",
      icon: "🎟️",
      path: "/admin/coupons",
    },
    {
      title: "Orders",
      description: "View and manage customer orders.",
      icon: "🚚",
      path: "/admin/orders",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f7f8f5]">
      <main className="mx-auto max-w-7xl px-4 py-7 sm:px-5 lg:px-8 lg:py-9">
        {/* Premium Hero */}
        <section className="relative isolate overflow-hidden rounded-3xl border border-emerald-900/70 bg-gradient-to-br from-[#07130f] via-[#102a20] to-[#064e3b] p-5 shadow-sm sm:p-7 lg:p-8">
          <div className="pointer-events-none absolute -right-12 -top-20 h-64 w-64 rounded-full bg-emerald-400/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 right-1/4 h-56 w-56 rounded-full bg-lime-300/10 blur-3xl" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/15 via-transparent to-transparent" />

          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-emerald-300">
                QuickCart · Admin
              </p>
              <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                Dashboard
              </h1>
              <p className="mt-2 max-w-xl text-sm leading-6 text-emerald-50/80 sm:text-base">
                Manage products, inventory, coupons, categories and customer orders from one place.
              </p>
            </div>

            <div
              className="flex h-14 w-14 shrink-0 items-center justify-center text-3xl sm:h-16 sm:w-16 sm:text-4xl"
              aria-label="Smiling face"
            >
              😅
            </div>
          </div>

          {loading ? (
            <div className="relative mt-5 h-10 w-48 animate-pulse rounded-xl bg-emerald-900/70" />
          ) : error ? (
            <div
              role="alert"
              className="relative mt-5 rounded-xl border border-red-300/30 bg-black/30 px-4 py-3 text-sm text-red-200"
            >
              {error}
            </div>
          ) : (
            <div className="relative mt-5 inline-flex items-center gap-2 rounded-xl border border-emerald-300/20 bg-black/20 px-4 py-2.5 text-sm font-medium text-emerald-100 shadow-sm backdrop-blur-sm">
              <span aria-hidden="true">✓</span>
              {adminMessage}
            </div>
          )}
        </section>

        {/* Quick Actions */}
        <section className="mt-8">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-emerald-700">
              Management
            </p>
            <h2 className="mt-1 text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
              Quick Actions
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Choose an area to manage your store.
            </p>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {adminSections.map((section) => (
              <Link
                key={section.path}
                to={section.path}
                className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-50 to-sky-50 text-xl ring-1 ring-indigo-100/80 transition group-hover:from-violet-100 group-hover:to-sky-100">
                    {section.icon}
                  </div>
                  <span className="text-lg text-slate-300 transition group-hover:translate-x-1 group-hover:text-indigo-600">
                    →
                  </span>
                </div>

                <h3 className="mt-4 text-base font-semibold text-slate-800">
                  {section.title}
                </h3>
                <p className="mt-1.5 text-sm leading-6 text-slate-500">
                  {section.description}
                </p>
                <p className="mt-4 text-xs font-medium text-indigo-700">
                  Manage {section.title.toLowerCase()}{" "}
                  <span aria-hidden="true">↗</span>
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* Security Notice */}
        <section className="mt-8 rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50/80 to-sky-50/80 p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white bg-white/90 text-lg shadow-sm">
              🛡️
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-800">
                Secure admin access
              </h3>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                Management APIs remain protected by the backend authentication and ADMIN authorization middleware.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
