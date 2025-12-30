import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { CATEGORIES } from "../constants";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActiveCategory = (category) => {
    return location.pathname === `/category/${category}`;
  };

  return (
    <nav className="surface-container elevation-1 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity"
            onClick={() => setIsMenuOpen(false)}
          >
            <span className="text-2xl sm:text-3xl md:text-4xl font-bold on-surface">
              NewsHub
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4 lg:gap-8">
            {CATEGORIES.map((category) => (
              <Link
                key={category}
                to={`/category/${category}`}
                className={`px-3 lg:px-4 py-2 text-base lg:text-lg font-semibold shape-md capitalize transition-all hover:elevation-1 ${
                  isActiveCategory(category)
                    ? "primary"
                    : "on-surface-variant hover:bg-purple-100"
                }`}
              >
                {category}
              </Link>
            ))}
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 on-surface-variant hover:bg-purple-100 shape-md transition-all"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMenuOpen ? "max-h-96 opacity-100 mt-4" : "max-h-0 opacity-0"
          }`}
        >
          <div className="flex flex-col gap-2 pb-2">
            {CATEGORIES.map((category) => (
              <Link
                key={category}
                to={`/category/${category}`}
                onClick={() => setIsMenuOpen(false)}
                className={`px-4 py-3 text-base font-semibold shape-md capitalize transition-all transform ${
                  isActiveCategory(category)
                    ? "primary"
                    : "on-surface-variant hover:bg-purple-100"
                }`}
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
