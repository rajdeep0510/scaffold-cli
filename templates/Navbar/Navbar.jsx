import React, { useState, useEffect } from "react";

/**
 * @typedef {Object} LinkItem
 * @property {string} label - The text to display.
 * @property {string} href - The URL link.
 */

/**
 * @param {Object} props
 * @param {React.ReactNode | string} [props.logo] - Brand logo or text.
 * @param {LinkItem[]} [props.links] - Array of navigation links.
 * @param {actionItem[]} [props.actions] - Right-side actions (e.g. Login buttons).
 * @param {string} [props.theme] - "light" or "dark".
 * @param {boolean} [props.sticky] - Whether the navbar is sticky.
 * @param {string} [props.className] - Additional classes.
 * @param {function} [props.onLinkClick] - Callback when a link is clicked.
 */
export default function Navbar({
  logo = "Brand",
  links = [
    { label: "Home", href: "#" },
    { label: "Features", href: "#" },
    { label: "Pricing", href: "#" },
    { label: "About", href: "#" },
  ],
    actions = [
      { label: "Login", href: "#" },
      { label: "Sign Up", href: "#" },
  ],
  theme = "light",
  sticky = true,
  className = "",
  onLinkClick = undefined,
  ...props
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll for glass effect or shadow
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isDark = theme === "dark";

  // Theme Styles
  const baseStyles = isDark ? "bg-slate-900 text-white" : "bg-white text-slate-900";
  const scrolledStyles = isDark
    ? "bg-slate-900/80 backdrop-blur-md border-b border-white/5"
    : "bg-white/80 backdrop-blur-md border-b border-slate-200/50";
  
  const navClasses = `
    ${sticky ? "fixed top-0 left-0 right-0 z-50" : "relative"}
    ${scrolled ? scrolledStyles : baseStyles}
    ${scrolled ? "shadow-sm" : ""}
    transition-all duration-300 ease-in-out
    ${className}
  `;

  // Link Styles
  const linkBase = "text-sm font-medium transition-colors duration-200 cursor-pointer";
  const linkColor = isDark
    ? "text-slate-300 hover:text-white"
    : "text-slate-600 hover:text-slate-900";
    
  // Mobile Menu Styles
  const mobileMenuClasses = `
    absolute top-full left-0 right-0 p-4 border-b
    ${isDark ? "bg-slate-900 border-white/5" : "bg-white border-slate-100"}
    ${isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"}
    transition-all duration-300 ease-out origin-top shadow-xl
  `;

  return (
    <nav className={navClasses} {...props}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo Section */}
          <div className="flex-shrink-0 flex items-center gap-2">
            <span className={`text-xl font-bold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
              {logo}
            </span>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-8">
            {links && links.map((link, index) => (
              <a
                key={index}
                href={link.href}
                onClick={(e) => {
                   if (onLinkClick) onLinkClick(e, link);
                }}
                className={`${linkBase} ${linkColor}`}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Actions (Desktop) */}
          <div className="hidden md:flex items-center gap-4">
             {Array.isArray(actions) ? (
              actions.map((action, index) => (
                <a
                  key={index}
                  href={action.href}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                    index === actions.length - 1
                      ? isDark
                        ? "bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-500/20"
                        : "bg-slate-900 text-white hover:bg-slate-800 shadow-lg"
                      : isDark
                      ? "text-slate-300 hover:text-white"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {action.label}
                </a>
              ))
            ) : (
              actions
            )}
          </div>

          {/* Mobile Toggle Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 rounded-md ${
                  isDark ? "text-slate-300 hover:bg-slate-800" : "text-slate-600 hover:bg-slate-100"
              } focus:outline-none`}
            >
              <span className="sr-only">Open main menu</span>
              {/* Hamburger / Close Icon */}
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isOpen ? (
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
      <div className={mobileMenuClasses}>
        <div className="flex flex-col space-y-4">
          {links && links.map((link, index) => (
             <a
               key={index}
               href={link.href}
                onClick={(e) => {
                   setIsOpen(false);
                   if (onLinkClick) onLinkClick(e, link);
                }}
               className={`block px-3 py-2 rounded-md text-base font-medium ${
                   isDark 
                   ? "text-slate-300 hover:text-white hover:bg-slate-800" 
                   : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
               }`}
             >
               {link.label}
             </a>
          ))}
          <div className="pt-4 border-t border-gray-200/10 flex flex-col gap-3">
             {Array.isArray(actions) ? (
            actions.map((action, index) => (
              <a
                key={index}
                href={action.href}
                className={`w-full px-4 py-2 text-sm font-medium rounded-lg text-center transition-all ${
                  index === actions.length - 1
                    ? isDark
                      ? "bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg"
                      : "bg-slate-900 text-white hover:bg-slate-800 shadow-lg"
                    : isDark
                    ? "text-slate-300 hover:text-white border border-slate-700 hover:bg-slate-800"
                    : "text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-50"
                }`}
              >
                {action.label}
              </a>
            ))
          ) : (
            actions
          )}
          </div>
        </div>
      </div>
    </nav>
  );
}
