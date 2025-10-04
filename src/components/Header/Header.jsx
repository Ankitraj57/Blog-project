import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { LogoutBtn } from '../index';

function Header() {
  const authStatus = useSelector((state) => state.auth.status);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const navItems = [
    { name: "Home", slug: "/", active: true },
    { name: "Login", slug: "/login", active: !authStatus },
    { name: "Signup", slug: "/signup", active: !authStatus },
    { name: "All Posts", slug: "/all-posts", active: authStatus },
    { name: "Add Post", slug: "/add-post", active: authStatus },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`w-full fixed top-0 left-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md' : 'bg-white/90 backdrop-blur-md'}`}>
      <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/">
              <img
                src="https://cdn.sanity.io/images/kts928pd/production/28563b4f836c667b30238865f796aeb03ae702db-358x357.png"
                alt="Logo"
                className="w-14 h-auto"
              />
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map(
              (item) =>
                item.active && (
                  <button
                    key={item.name}
                    onClick={() => navigate(item.slug)}
                    className={`px-4 py-2 rounded-full font-medium text-sm transition-colors duration-200 ${
                      window.location.pathname === item.slug
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'text-gray-700 hover:text-blue-600 hover:bg-gray-100'
                    }`}
                  >
                    {item.name}
                  </button>
                )
            )}
            {authStatus && <LogoutBtn />}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 focus:outline-none"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-md">
          <ul className="px-4 pt-2 pb-4 space-y-2">
            {navItems.map(
              (item) =>
                item.active && (
                  <li key={item.name}>
                    <button
                      onClick={() => {
                        navigate(item.slug);
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition-colors"
                    >
                      {item.name}
                    </button>
                  </li>
                )
            )}
            {authStatus && (
              <li>
                <LogoutBtn />
              </li>
            )}
          </ul>
        </div>
      )}
    </header>
  );
}

export default Header;
