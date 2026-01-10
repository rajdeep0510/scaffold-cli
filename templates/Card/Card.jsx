import React from "react";

const VARIANTS = {
  elevated: "shadow-xl border-transparent",
  outlined: "border border-opacity-20 shadow-sm",
  flat: "shadow-none border-transparent",
  glass: "backdrop-blur-xl bg-opacity-70 border border-white/10 shadow-lg",
  gradient: "border-none shadow-2xl bg-gradient-to-br",
};

const THEMES = {
  light: {
    base: "bg-white text-slate-800",
    glass: "bg-white/70 text-slate-900 border-slate-200/50",
    border: "border-slate-200",
    subtext: "text-slate-500",
    divider: "border-slate-100",
  },
  dark: {
    base: "bg-slate-900 text-slate-100",
    glass: "bg-slate-900/60 text-white border-white/10",
    border: "border-slate-800",
    subtext: "text-slate-400",
    divider: "border-slate-800",
  },
};

const PADDINGS = {
  none: "p-0",
  sm: "p-3",
  md: "p-6",
  lg: "p-8",
  xl: "p-10",
};

const ROUNDED = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
  "3xl": "rounded-3xl",
  full: "rounded-full",
};

const HOVER_EFFECTS = {
  none: "",
  lift: "hover:-translate-y-1 hover:shadow-2xl",
  scale: "hover:scale-[1.02]",
  glow: "hover:shadow-indigo-500/20 hover:border-indigo-500/30",
  shimmer: "hover:bg-opacity-90",
};

/**
 * @param {Object} props
 * @param {React.ReactNode} [props.children]
 * @param {string} [props.title]
 * @param {string} [props.subtitle]
 * @param {string} [props.image]
 * @param {boolean} [props.imageFull]
 * @param {React.ReactNode} [props.footer]
 * @param {React.ReactNode} [props.action]
 * @param {string} [props.badge]
 * @param {string} [props.theme]
 * @param {string} [props.variant]
 * @param {string} [props.padding]
 * @param {string} [props.rounded]
 * @param {string} [props.hoverEffect]
 * @param {string} [props.className]
 * @param {string} [props.width]
 * @param {function} [props.onClick]
 */
export default function Card({
  children = undefined,
  title = undefined,
  subtitle = undefined,
  image = undefined,
  imageFull = false, // If true, image covers the background or top area completely without padding
  footer = undefined,
  action = undefined,
  badge = undefined,
  theme = "dark",
  variant = "elevated",
  padding = "md",
  rounded = "2xl",
  hoverEffect = "lift",
  className = "",
  width = "w-full max-w-sm", // Default width constraint
  onClick = undefined,
  ...props
}) {
  const isGlass = variant === "glass";
  const currentTheme = THEMES[theme] || THEMES.dark;
  const baseStyle = isGlass ? currentTheme.glass : currentTheme.base;
  const borderColor = currentTheme.border;

  return (
    <div
      onClick={onClick}
      className={`
        relative flex flex-col overflow-hidden transition-all duration-300 ease-out group
        ${width}
        ${ROUNDED[rounded] || ROUNDED["2xl"]}
        ${VARIANTS[variant] || VARIANTS.elevated}
        ${baseStyle}
        ${!isGlass && variant === "outlined" ? borderColor : ""}
        ${HOVER_EFFECTS[hoverEffect] || ""}
        ${onClick ? "cursor-pointer" : ""}
        ${className}
      `}
      {...props}
    >
      {/* Background Image (Optional absolute overlay) */}
      {image && imageFull && (
        <div className="absolute inset-0 z-0">
          <img
            src={image}
            alt={title || "Card background"}
            className="h-full w-full object-cover opacity-20 group-hover:scale-105 transition-transform duration-700"
          />
          <div
            className={`absolute inset-0 bg-gradient-to-t ${
              theme === "dark" ? "from-slate-900" : "from-white"
            } via-transparent to-transparent`}
          />
        </div>
      )}

      {/* Header Image (Standard top image) */}
      {image && !imageFull && (
        <div className="relative h-48 w-full overflow-hidden z-10">
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {badge && (
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-white bg-black/50 backdrop-blur-md rounded-full">
                {badge}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Content Container */}
      <div className={`relative z-10 flex flex-col h-full ${PADDINGS[padding]}`}>
        {/* Header Section */}
        {(title || subtitle || action) && (
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              {title && (
                <h3 className="text-xl font-bold tracking-tight mb-1">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className={`text-sm font-medium ${currentTheme.subtext}`}>
                  {subtitle}
                </p>
              )}
            </div>
            {action && <div className="ml-4">{action}</div>}
          </div>
        )}

        {/* Main Body */}
        <div className={`flex-1 ${currentTheme.subtext} leading-relaxed`}>
          {children}
        </div>

        {/* Footer Section */}
        {footer && (
          <div
            className={`mt-6 pt-4 border-t ${currentTheme.divider} flex items-center justify-between`}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

Card.displayName = "Card";
