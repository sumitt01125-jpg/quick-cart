import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import ProductGrid from "../../components/user/ProductGrid";
import { getCategories } from "../../services/category.service";
import { getProducts } from "../../services/product.service";

const HERO_SLIDES = [
  {
    eyebrow: "YOUR DAILY ESSENTIALS",
    title: "Fresh finds for",
    highlight: "everyday living.",
    description:
      "Discover your everyday favourites, from fresh produce to pantry essentials.",
    button: "Explore products",
    background: "from-[#075e42] via-[#12805b] to-[#a3d977]",
    accent: "bg-lime-300",
    badge: "Fresh picks, happy days",
    items: [
      { emoji: "🥬", label: "Fresh greens" },
      { emoji: "🍎", label: "Seasonal fruits" },
      { emoji: "🥛", label: "Daily dairy" },
      { emoji: "🍞", label: "Bakery picks" },
    ],
  },
  {
    eyebrow: "SNACK TIME, ANYTIME",
    title: "Little treats,",
    highlight: "big happiness.",
    description:
      "Explore snacks, biscuits, drinks and delicious favourites for every craving.",
    button: "Discover snacks",
    background: "from-[#312e81] via-[#5546c7] to-[#b6a6ff]",
    accent: "bg-amber-300",
    badge: "Your cravings, covered",
    items: [
      { emoji: "🍪", label: "Biscuits" },
      { emoji: "🍿", label: "Crunchy snacks" },
      { emoji: "🥤", label: "Cold drinks" },
      { emoji: "🍫", label: "Sweet treats" },
    ],
  },
  {
    eyebrow: "STOCK UP & SAVE TIME",
    title: "Everything you need,",
    highlight: "all in one place.",
    description:
      "From kitchen staples to household essentials, find more of what you need.",
    button: "Shop essentials",
    background: "from-[#9a3412] via-[#ea580c] to-[#fbbf72]",
    accent: "bg-yellow-200",
    badge: "Make everyday shopping easy",
    items: [
      { emoji: "🌾", label: "Pantry staples" },
      { emoji: "☕", label: "Tea & coffee" },
      { emoji: "🧴", label: "Personal care" },
      { emoji: "🧹", label: "Home essentials" },
    ],
  },
];

const CATEGORY_BACKGROUNDS = [
  "bg-emerald-50",
  "bg-amber-50",
  "bg-sky-50",
  "bg-rose-50",
  "bg-violet-50",
  "bg-orange-50",
];

const CATEGORY_ICONS = ["🥬", "🥛", "🍎", "🍞", "🥚", "🛒"];

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryLoading, setCategoryLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        setLoading(true);
        setCategoryLoading(true);
        setError("");

        const [productData, categoryData] = await Promise.all([
          getProducts({
            page: 1,
            limit: 8,
            sort: "newest",
          }),
          getCategories(),
        ]);

        setProducts(productData.products || []);
        setCategories(categoryData.categories || []);
      } catch (error) {
        console.error("Failed to load home:", error);
        setError(error.message || "Unable to load products right now.");
      } finally {
        setLoading(false);
        setCategoryLoading(false);
      }
    };

    loadHomeData();
  }, []);

  // Automatically change banner every 5 seconds.
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((current) => (current + 1) % HERO_SLIDES.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const currentSlide = HERO_SLIDES[activeSlide];

  const nextSlide = () => {
    setActiveSlide((current) => (current + 1) % HERO_SLIDES.length);
  };

  const previousSlide = () => {
    setActiveSlide(
      (current) => (current - 1 + HERO_SLIDES.length) % HERO_SLIDES.length
    );
  };

  const getCategoryImage = (category) => {
    const categoryImage =
      category.imageUrl || category.image || category.imageURL;

    if (categoryImage) return categoryImage;

    const matchingProduct = products.find(
      (product) =>
        String(product.category?.id) === String(category.id) &&
        product.imageUrl
    );

    return matchingProduct?.imageUrl || "";
  };

  return (
    <div className="min-h-screen bg-[#f7f8f5]">
      <main className="mx-auto max-w-[1440px] px-4 py-5 sm:px-6 lg:px-8 lg:py-7">
        {/* Premium Hero Slider */}
        <section
          aria-label="QuickCart promotions"
          className={`relative isolate overflow-hidden rounded-2xl bg-gradient-to-r ${currentSlide.background} shadow-sm transition-colors duration-500 sm:rounded-3xl`}
        >
          <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl sm:h-96 sm:w-96" />

            <div className="absolute -bottom-32 left-1/3 h-64 w-64 rounded-full bg-black/10 blur-3xl" />

            <div className="absolute right-[16%] top-1/2 hidden h-64 w-64 -translate-y-1/2 rounded-full border border-white/15 lg:block" />

            <div className="absolute right-[19%] top-1/2 hidden h-48 w-48 -translate-y-1/2 rounded-full border border-white/15 lg:block" />
          </div>

          <div
            key={activeSlide}
            className="grid min-h-[320px] items-center gap-8 px-6 py-8 sm:px-10 sm:py-10 lg:min-h-[370px] lg:grid-cols-[1.1fr_0.9fr] lg:px-14"
          >
            {/* Left Content */}
            <div className="max-w-xl animate-[fadeIn_400ms_ease-out]">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[10px] font-medium tracking-[0.14em] text-white backdrop-blur sm:text-[11px]">
                <span
                  className={`h-2 w-2 rounded-full ${currentSlide.accent}`}
                />
                {currentSlide.eyebrow}
              </span>

              <h1 className="mt-5 text-3xl font-semibold leading-[1.12] tracking-tight text-white sm:text-4xl lg:text-[48px]">
                {currentSlide.title}
                <span className="mt-1 block text-white/85">
                  {currentSlide.highlight}
                </span>
              </h1>

              <p className="mt-4 max-w-md text-sm leading-6 text-white/85 sm:text-base">
                {currentSlide.description}
              </p>

              <Link
                to="/products"
                className="group mt-6 inline-flex items-center gap-3 rounded-xl bg-white px-5 py-3 text-sm font-medium text-slate-900 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-lg"
              >
                {currentSlide.button}

                <span className="transition-transform duration-200 group-hover:translate-x-1">
                  →
                </span>
              </Link>

              <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-xs font-medium text-white/90">
                <span>✓ Easy shopping</span>
                <span>✓ Everyday favourites</span>
              </div>
            </div>

            {/* Right-side Product Composition */}
            <div className="relative hidden min-h-[255px] items-center justify-center lg:flex">
              <div className="grid grid-cols-2 gap-3">
                {currentSlide.items.map((item, index) => (
                  <div
                    key={`${activeSlide}-${item.label}`}
                    style={{ transitionDelay: `${index * 70}ms` }}
                    className="flex w-[155px] items-center gap-3 rounded-2xl border border-white/50 bg-white/95 p-3 shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-xl xl:w-[175px]"
                  >
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-3xl">
                      {item.emoji}
                    </span>

                    <span className="text-xs font-medium leading-4 text-slate-800">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>

              <div className="absolute -bottom-5 right-0 rounded-full bg-white px-4 py-2.5 text-xs font-medium text-slate-900 shadow-lg">
                {currentSlide.badge}
              </div>
            </div>
          </div>

          {/* Slider Controls */}
          <div className="absolute bottom-4 right-4 flex items-center gap-3 sm:bottom-6 sm:right-8">
            <div className="flex items-center gap-1.5" aria-label="Choose banner">
              {HERO_SLIDES.map((slide, index) => (
                <button
                  key={slide.eyebrow}
                  type="button"
                  onClick={() => setActiveSlide(index)}
                  aria-label={`Go to slide ${index + 1}`}
                  aria-current={activeSlide === index ? "true" : undefined}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    activeSlide === index
                      ? "w-7 bg-white"
                      : "w-2 bg-white/50 hover:bg-white/80"
                  }`}
                />
              ))}
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={previousSlide}
                aria-label="Previous banner"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white transition hover:bg-white/25"
              >
                ←
              </button>

              <button
                type="button"
                onClick={nextSlide}
                aria-label="Next banner"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white transition hover:bg-white/25"
              >
                →
              </button>
            </div>
          </div>
        </section>

        {/* Error Message */}
        {error && (
          <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-600">
            {error}
          </div>
        )}

        {/* Categories */}
        <section className="mt-8 sm:mt-10">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-emerald-700 sm:text-[11px]">
                Explore the store
              </p>

              <h2 className="mt-1.5 text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
                Shop by category
              </h2>

              <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                Find something for every day.
              </p>
            </div>

            <Link
              to="/products"
              className="shrink-0 rounded-lg px-3 py-2 text-xs font-medium text-emerald-700 transition hover:bg-emerald-50 sm:text-sm"
            >
              View all →
            </Link>
          </div>

          {categoryLoading ? (
            <div className="mt-5 grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
              {Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="animate-pulse rounded-2xl border border-slate-100 bg-white p-3"
                >
                  <div className="aspect-square rounded-xl bg-slate-100" />
                  <div className="mx-auto mt-3 h-3 w-3/4 rounded bg-slate-100" />
                </div>
              ))}
            </div>
          ) : categories.length === 0 ? (
            <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
              No categories available yet.
            </div>
          ) : (
            <div className="mt-5 grid grid-cols-3 gap-3 sm:grid-cols-4 sm:gap-4 lg:grid-cols-6 xl:grid-cols-8">
              {categories.slice(0, 8).map((category, index) => {
                const image = getCategoryImage(category);

                return (
                  <Link
                    key={category.id}
                    to={`/products?categoryId=${category.id}`}
                    className="group flex min-w-0 flex-col items-center rounded-2xl border border-slate-100 bg-white p-2.5 text-center transition duration-200 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-md sm:p-3"
                  >
                    <div
                      className={`flex aspect-square w-full items-center justify-center overflow-hidden rounded-xl sm:rounded-2xl ${
                        CATEGORY_BACKGROUNDS[
                          index % CATEGORY_BACKGROUNDS.length
                        ]
                      }`}
                    >
                      {image ? (
                        <img
                          src={image}
                          alt={category.name}
                          loading="lazy"
                          className="h-full w-full object-contain p-2 transition-transform duration-300 group-hover:scale-105 sm:p-3"
                        />
                      ) : (
                        <span className="text-3xl sm:text-4xl">
                          {CATEGORY_ICONS[index % CATEGORY_ICONS.length]}
                        </span>
                      )}
                    </div>

                    <span className="mt-2.5 line-clamp-2 min-h-8 text-[11px] font-medium leading-4 text-slate-700 transition-colors group-hover:text-emerald-700 sm:text-xs">
                      {category.name}
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        {/* Products */}
        <section className="mt-9 sm:mt-12">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-emerald-700 sm:text-[11px]">
                Handpicked for you
              </p>

              <h2 className="mt-1.5 text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
                Fresh finds
              </h2>

              <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                Discover products picked for your everyday needs.
              </p>
            </div>

            <Link
              to="/products"
              className="shrink-0 rounded-lg px-3 py-2 text-xs font-medium text-emerald-700 transition hover:bg-emerald-50 sm:text-sm"
            >
              View all →
            </Link>
          </div>

          <div className="mt-5">
            <ProductGrid products={products} loading={loading} />
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="relative mt-10 overflow-hidden rounded-2xl bg-slate-950 px-6 py-7 sm:mt-14 sm:rounded-3xl sm:px-10 sm:py-9">
          <div className="absolute -right-10 -top-20 h-56 w-56 rounded-full bg-emerald-500/20 blur-3xl" />

          <div className="relative flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-emerald-400 sm:text-[11px]">
                Your next favourite awaits
              </p>

              <h2 className="mt-2 text-xl font-semibold tracking-tight text-white sm:text-2xl lg:text-3xl">
                Good things are just a click away.
              </h2>

              <p className="mt-2 max-w-lg text-sm leading-6 text-slate-400">
                Explore the collection and find your everyday favourites.
              </p>
            </div>

            <Link
              to="/products"
              className="shrink-0 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-medium text-white transition hover:bg-emerald-400"
            >
              Explore products →
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;