import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import logo from "../assets/logo.png";

export default function Footer() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem("theme");
    if (saved) {
      return saved === "dark";
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

  useEffect(() => {
    const checkTheme = () => {
      const saved = localStorage.getItem("theme");
      if (saved) {
        setIsDarkMode(saved === "dark");
      } else {
        setIsDarkMode(window.matchMedia("(prefers-color-scheme: dark)").matches);
      }
    };
    
    // Check theme on mount
    checkTheme();
    
    // Listen to storage changes (when theme is changed in another tab/window)
    window.addEventListener('storage', checkTheme);
    
    // Listen to custom theme change event (when theme is toggled in same window)
    const handleThemeChange = () => {
      checkTheme();
    };
    window.addEventListener('themechange', handleThemeChange);
    
    // Also check periodically for localStorage changes (fallback)
    const interval = setInterval(checkTheme, 100);
    
    return () => {
      window.removeEventListener('storage', checkTheme);
      window.removeEventListener('themechange', handleThemeChange);
      clearInterval(interval);
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Form submitted:", formData);
    setFormData({ name: "", email: "", message: "" });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <motion.footer
      id="contact"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.2 }}
      className={`w-full mt-20 py-12 border-t border-gray-200/60 dark:border-purple-900/40 shadow-md transition-colors duration-300 ${
        isDarkMode 
          ? "backdrop-blur-md"
          : "bg-gray-50"
      }`}
      style={isDarkMode ? {
        background: 'radial-gradient(circle at top left, rgba(79, 70, 229, 0.3), transparent 55%), radial-gradient(circle at bottom right, rgba(124, 58, 237, 0.25), transparent 55%), rgba(26, 15, 36, 0.7)'
      } : {}}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-8 md:gap-12">
          {/* Left Side - Current Footer Items */}
          <div className="flex-1 flex flex-col gap-4">
            <motion.div
              className="flex items-center gap-3 transition-colors duration-300"
              whileHover={{ scale: 1.05 }}
            >
              <img 
                src={logo} 
                alt="CarRent logo" 
                className="w-8 h-8 object-contain"
              />
              <p className="font-semibold text-lg">
                © {new Date().getFullYear()}{" "}
                {isDarkMode ? (
                  <>
                    <span className="bg-gradient-to-r from-purple-200 to-purple-300 bg-clip-text text-transparent">CAR</span>
                    <span className="bg-gradient-to-r from-purple-300 to-purple-400 bg-clip-text text-transparent">RENT</span>
                  </>
                ) : (
                  <span className="text-indigo-700">CARRENT</span>
                )}
              </p>
            </motion.div>
            
            <p className={`text-sm max-w-2xl transition-colors duration-300 ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}>
              CarRent - Your trusted partner for premium vehicle rentals. 
              Explore our wide selection of cars and enjoy a seamless booking experience.
            </p>
          </div>

          {/* Thin Purple Vertical Line Separator */}
          <div className={`hidden md:block w-px ${isDarkMode ? "bg-purple-700/50" : "bg-gray-200/60"}`}></div>

          {/* Right Side - Contact Form */}
          <div className="flex-1">
            <h3 className={`text-xl font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              Contact Us
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-900"}`}>
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-2 rounded-lg border transition-colors duration-300 ${
                    isDarkMode 
                      ? "bg-indigo-900/60 border-purple-700/30 text-white placeholder-gray-400 focus:border-purple-600" 
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                  } focus:outline-none`}
                  placeholder="Your name"
                />
              </div>
              
              <div>
                <label htmlFor="email" className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-900"}`}>
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-2 rounded-lg border transition-colors duration-300 ${
                    isDarkMode 
                      ? "bg-indigo-900/60 border-purple-700/30 text-white placeholder-gray-400 focus:border-purple-600" 
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                  } focus:outline-none`}
                  placeholder="your.email@example.com"
                />
              </div>
              
              <div>
                <label htmlFor="message" className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-900"}`}>
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  className={`w-full px-4 py-2 rounded-lg border transition-colors duration-300 resize-none ${
                    isDarkMode 
                      ? "bg-indigo-900/60 border-purple-700/30 text-white placeholder-gray-400 focus:border-purple-600" 
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                  } focus:outline-none`}
                  placeholder="Your message..."
                />
              </div>
              
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full px-6 py-3 rounded-lg font-medium transition-colors duration-300 flex items-center justify-center gap-2 ${
                  isDarkMode
                    ? "bg-purple-700 hover:bg-purple-600 text-white"
                    : "bg-purple-600 hover:bg-purple-700 text-white"
                }`}
              >
                <Send className="w-4 h-4" />
                Send Message
              </motion.button>
            </form>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}

