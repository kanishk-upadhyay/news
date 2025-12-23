import { Link } from "react-router-dom";
import { CATEGORIES } from "../constants";

function Navbar() {
  return (
    <nav className="surface-container elevation-1">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <span className="text-4xl font-bold on-surface">NewsHub</span>
          </Link>

          <div className="flex items-center gap-8">
            {CATEGORIES.map((category) => (
              <Link
                key={category}
                to={`/category/${category}`}
                className="px-4 py-2 text-lg font-semibold on-surface-variant hover:bg-purple-100 shape-md capitalize transition-all hover:elevation-1"
              >
                {category}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
