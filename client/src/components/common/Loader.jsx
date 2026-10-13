const Loader = ({
  fullScreen = false,
  text = "Getting QuickCart ready...",
}) => {
  return (
    <div
      className={`flex items-center justify-center bg-[#F5F8F3] ${
        fullScreen ? "min-h-screen w-full" : "py-12"
      }`}
    >
      <div className="flex flex-col items-center gap-6 px-6 text-center">
        <div className="relative flex h-20 w-20 items-center justify-center">
          <div className="absolute inset-0 animate-spin rounded-[1.7rem] border-[3px] border-emerald-100 border-t-emerald-600" />

          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white shadow-lg shadow-emerald-700/20">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-8 w-8"
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
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Quick<span className="text-emerald-600">Cart</span>
          </h2>

          {text && (
            <p className="mt-2 text-sm font-medium text-slate-500">
              {text}
            </p>
          )}
        </div>

        <div className="h-1.5 w-40 overflow-hidden rounded-full bg-emerald-100">
          <div className="h-full w-2/5 animate-[loading_1.4s_ease-in-out_infinite] rounded-full bg-emerald-600" />
        </div>

        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-700/70">
          Freshness is on the way
        </p>
      </div>
    </div>
  );
};

export default Loader;