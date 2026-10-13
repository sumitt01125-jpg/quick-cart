import { Link } from "react-router-dom";

const CategoryCard = ({ category }) => {
  return (
    <Link
      to={`/products?category=${category.id}`}
      className="group flex min-h-32 flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white p-5 text-center shadow-sm transition duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-md"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-2xl transition duration-300 group-hover:scale-110">
        🛍️
      </div>

      <h3 className="mt-3 line-clamp-2 text-sm font-black text-slate-800 transition group-hover:text-emerald-600">
        {category.name}
      </h3>
    </Link>
  );
};

export default CategoryCard;