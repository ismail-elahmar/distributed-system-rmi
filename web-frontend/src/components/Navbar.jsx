import React, { useEffect, useMemo, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun, ChevronDown, LogOut, User, Menu, X } from "lucide-react";

const navLinks = [
  { name: "Catalogue", path: "/catalogue" },
  { name: "Bookings", path: "/bookings" },
  { name: "Contact", path: "#contact" },
];

function Navbar() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false); // desktop dropdown
  const [showMobileProfile, setShowMobileProfile] = useState(false); // mobile accordion
  const [userDropdownPosition, setUserDropdownPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
  });
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("theme") === "dark" ||
      (!localStorage.getItem("theme") &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
  });

  const userButtonRef = useRef(null);
  const navRef = useRef(null);

  // Sync theme with document
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", isDark ? "dark" : "light");
    window.dispatchEvent(new Event("themechange"));
  }, [isDark]);

  const toggleTheme = () => setIsDark((prev) => !prev);

  const handleContactClick = () => {
    const el = document.getElementById("contact");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      navigate("/#contact");
    }
    setIsMenuOpen(false);
  };

  const updateDropdownPosition = () => {
    const rect = userButtonRef.current?.getBoundingClientRect();
    if (rect) {
      setUserDropdownPosition({
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  };

  useEffect(() => {
    if (showProfile) {
      updateDropdownPosition();
    }
  }, [showProfile]);

  useEffect(() => {
    const handleResize = () => {
      if (showProfile) updateDropdownPosition();
    };
    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleResize);
    };
  }, [showProfile]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        showProfile &&
        userButtonRef.current &&
        !userButtonRef.current.contains(e.target) &&
        !document.getElementById("profile-dropdown-portal")?.contains(e.target)
      ) {
        setShowProfile(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showProfile]);

  const currentUser = useMemo(() => {
    try {
      const data = localStorage.getItem("carrent_current_user");
      return data ? JSON.parse(data) : null;
    } catch (err) {
      return null;
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("carrent_current_user");
    navigate("/signin");
  };

  const linkBase =
    "text-sm font-semibold px-3 py-2 rounded-lg transition-colors flex items-center gap-1";

  return (
    <nav
      ref={navRef}
      className="sticky top-0 z-50 bg-white/90 dark:bg-indigo-950/80 backdrop-blur-xl shadow-md"
      style={{ marginBottom: 0, paddingBottom: 0, borderBottom: 'none' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 relative">
        <div className="flex items-center justify-between">
          {/* Left: brand */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="text-lg sm:text-xl font-bold text-indigo-700 dark:text-purple-200">
              CARRENT
            </div>
          </div>

          {/* Center links (desktop) */}
          <div className="hidden md:flex flex-1 items-center justify-center gap-2">
            {navLinks.map((link) =>
              link.name === "Contact" ? (
                <button
                  key={link.name}
                  onClick={handleContactClick}
                  className={`${linkBase} text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-purple-300`}
                >
                  {link.name}
                </button>
              ) : (
                <NavLink
                  key={link.name}
                  to={link.path}
                  className={({ isActive }) =>
                    `${linkBase} ${
                      isActive
                        ? "text-indigo-600 dark:text-purple-300"
                        : "text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-purple-300"
                    }`
                  }
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </NavLink>
              )
            )}

            {/* Profile dropdown trigger (desktop inline) */}
            <div className="relative">
              <motion.button
                whileTap={{ scale: 0.97 }}
                ref={userButtonRef}
                onClick={() => setShowProfile((p) => !p)}
                className={`${linkBase} text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-purple-300`}
              >
                <span>Profile</span>
                <ChevronDown className="w-4 h-4" />
              </motion.button>
            </div>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Theme toggle */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme}
              className="p-2 rounded-full bg-transparent border-0 hover:scale-105 transition-transform"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-white" />
              ) : (
                <Moon className="w-5 h-5 text-purple-800" />
              )}
            </motion.button>

            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-indigo-900/40"
              onClick={() => setIsMenuOpen((p) => !p)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

            {/* Mobile menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="md:hidden mt-3 space-y-2 bg-white/90 dark:bg-indigo-950/80 backdrop-blur-md rounded-xl border border-gray-200/60 dark:border-purple-900/40 p-3 shadow-lg"
            >
              {/* Links */}
              <div className="space-y-2">
                {navLinks.map((link) =>
                  link.name === "Contact" ? (
                    <button
                      key={link.name}
                      onClick={handleContactClick}
                      className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-purple-300"
                    >
                      {link.name}
                    </button>
                  ) : (
                    <NavLink
                      key={link.name}
                      to={link.path}
                      onClick={() => setIsMenuOpen(false)}
                      className={({ isActive }) =>
                        `block px-3 py-2 rounded-lg text-sm font-semibold ${
                          isActive
                            ? "text-indigo-600 dark:text-purple-300 bg-indigo-50/60 dark:bg-purple-900/30"
                            : "text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-purple-300"
                        }`
                      }
                    >
                      {link.name}
                    </NavLink>
                  )
                )}
                
                {/* Profile dropdown */}
                <div>
                  <button
                    onClick={() => setShowMobileProfile((p) => !p)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-semibold text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-purple-300"
                  >
                    <span>Profile</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        showMobileProfile ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {showMobileProfile && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="pl-4 space-y-1 pt-1">
                          <button
                            onClick={() => {
                              setShowMobileProfile(false);
                              setIsMenuOpen(false);
                              navigate("/profile");
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-purple-300 hover:bg-indigo-50/60 dark:hover:bg-purple-900/30 transition-colors"
                          >
                            <User className="w-4 h-4 text-indigo-600 dark:text-purple-300" />
                            Profile
                          </button>
                          <button
                            onClick={() => {
                              setShowMobileProfile(false);
                              setIsMenuOpen(false);
                              handleLogout();
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                          >
                            <LogOut className="w-4 h-4" />
                            Logout
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Profile dropdown via portal */}
      {showProfile &&
        createPortal(
          <div
            id="profile-dropdown-portal"
            className="absolute z-[60]"
            style={{
              top: `${userDropdownPosition.top}px`,
              left: `${userDropdownPosition.left}px`,
              minWidth: `${userDropdownPosition.width || 180}px`,
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: -6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -6 }}
              transition={{ duration: 0.15 }}
              className="bg-white/90 dark:bg-indigo-950/80 backdrop-blur-md rounded-xl shadow-2xl border border-gray-200/50 dark:border-purple-800/30 overflow-hidden"
            >
              <div className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-semibold">
                    {currentUser?.name
                      ? currentUser.name.charAt(0).toUpperCase()
                      : "P"}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                      {currentUser?.name || "Profile"}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {currentUser?.email || "Signed in"}
                    </div>
                  </div>
                </div>
              </div>
              <div className="h-px bg-gray-200 dark:bg-purple-800/40" />
              <button
                onClick={() => {
                  setShowProfile(false);
                  navigate("/profile");
                }}
                className="w-full flex items-center gap-2 px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-indigo-50/80 dark:hover:bg-indigo-900/30 transition-colors"
              >
                <User className="w-4 h-4 text-indigo-600 dark:text-purple-300" />
                Profile
              </button>
              <button
                onClick={() => {
                  setShowProfile(false);
                  handleLogout();
                }}
                className="w-full flex items-center gap-2 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </motion.div>
          </div>,
          document.body
        )}
    </nav>
  );
}

export default Navbar;

