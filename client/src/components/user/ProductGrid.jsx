import ProductCard from "./ProductCard";

const ProductGrid = ({
  products = [],
  loading = false,
  onAddToCart,
  addingProductId = null,
}) => {
  const gridClass =
    "grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 min-[1700px]:grid-cols-6";

  if (loading) {
    return (
      <div className={gridClass} aria-label="Loading products">
        {Array.from({ length: 10 }).map((_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
          >
            <div className="aspect-[4/3] animate-pulse bg-slate-100" />

            <div className="space-y-2.5 p-3">
              <div className="h-3.5 w-3/4 animate-pulse rounded-md bg-slate-200" />
              <div className="h-3 w-full animate-pulse rounded-md bg-slate-100" />
              <div className="h-3 w-1/2 animate-pulse rounded-md bg-slate-100" />
              <div className="mt-3 h-5 w-1/3 animate-pulse rounded-md bg-slate-200" />

              <div className="space-y-2 pt-1">
                <div className="h-8 animate-pulse rounded-lg bg-emerald-100" />
                <div className="h-8 animate-pulse rounded-lg bg-emerald-200" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-3xl">
          🛒
        </div>

        <h2 className="mt-5 text-xl font-semibold text-slate-900">
          No products found
        </h2>

        <p className="mx-auto mt-2 max-w-md text-sm font-normal leading-6 text-slate-500">
          Try changing your search or category filter to find what you are
          looking for.
        </p>
      </div>
    );
  }

  return (
    <div className={gridClass}>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
          adding={addingProductId === product.id}
        />
      ))}
    </div>
  );
};

export default ProductGrid;