import { Link } from "react-router-dom";
import { useState } from "react";
import { CATEGORIES } from "../constants";

function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

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

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
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

          {/* Mobile Hamburger Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden flex flex-col gap-1 p-2"
            aria-label="Toggle menu"
          >
            <span className={`block w-6 h-0.5 bg-gray-800 transition-all ${isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-gray-800 transition-all ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-gray-800 transition-all ${isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 flex flex-col gap-2">
            {CATEGORIES.map((category) => (
              <Link
                key={category}
                to={`/category/${category}`}
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-4 py-3 text-lg font-semibold on-surface-variant hover:bg-purple-100 shape-md capitalize transition-all hover:elevation-1"
              >
                {category}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
