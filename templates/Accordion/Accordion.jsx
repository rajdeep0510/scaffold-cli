import React, { createContext, useContext, useState } from "react";

// ============ CONFIGURATION OBJECTS ============

const VARIANTS = {
  default: "border-b",
  bordered: "border rounded-lg mb-2",
  separated: "bg-opacity-5 rounded-lg mb-2",
  minimal: "border-b border-opacity-30",
};

const THEMES = {
  light: {
    base: "text-slate-800",
    header: "hover:bg-slate-50",
    content: "text-slate-600",
    border: "border-slate-200",
    icon: "text-slate-500",
    disabled: "text-slate-300",
  },
  dark: {
    base: "text-slate-100",
    header: "hover:bg-slate-800/50",
    content: "text-slate-400",
    border: "border-slate-700",
    icon: "text-slate-400",
    disabled: "text-slate-600",
  },
};

const SIZES = {
  sm: {
    header: "py-2 px-3 text-sm",
    content: "p-3 text-sm",
    icon: "w-4 h-4",
  },
  md: {
    header: "py-3 px-4 text-base",
    content: "p-4 text-base",
    icon: "w-5 h-5",
  },
  lg: {
    header: "py-4 px-5 text-lg",
    content: "p-5 text-lg",
    icon: "w-6 h-6",
  },
};

const ICON_POSITIONS = {
  left: "flex-row-reverse justify-end",
  right: "flex-row justify-between",
};

// ============ CONTEXT ============

const AccordionContext = createContext(null);

const useAccordionContext = () => {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error("AccordionItem must be used within an Accordion");
  }
  return context;
};

// ============ ACCORDION ROOT ============

/**
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {"light" | "dark"} [props.theme]
 * @param {"default" | "bordered" | "separated" | "minimal"} [props.variant]
 * @param {"sm" | "md" | "lg"} [props.size]
 * @param {"left" | "right"} [props.iconPosition]
 * @param {boolean} [props.denyMultiple]
 * @param {string|string[]} [props.defaultExpanded]
 * @param {boolean} [props.collapsible]
 * @param {string} [props.className]
 */
function Accordion({
  children,
  theme = "dark",
  variant = "minimal",
  size = "md",
  iconPosition = "right",
  denyMultiple = false,
  defaultExpanded = [],
  collapsible = true,
  className = "",
  ...props
}) {
  const initialExpanded = Array.isArray(defaultExpanded)
    ? defaultExpanded
    : [defaultExpanded].filter(Boolean);
  const [expandedItems, setExpandedItems] = useState(new Set(initialExpanded));

  const toggleItem = (itemId) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) {
        if (collapsible || next.size > 1) {
          next.delete(itemId);
        }
      } else {
        if (denyMultiple) {
          next.clear();
          next.add(itemId);
        } else {
          next.add(itemId);
        }
      }
      return next;
    });
  };

  const isExpanded = (itemId) => expandedItems.has(itemId);

  const currentTheme = THEMES[theme] || THEMES.dark;
  const currentSize = SIZES[size] || SIZES.md;
  const currentVariant = VARIANTS[variant] || VARIANTS.minimal;

  return (
    <AccordionContext.Provider
      value={{
        theme: currentTheme,
        size: currentSize,
        variant: currentVariant,
        iconPosition,
        toggleItem,
        isExpanded,
        rawVariant: variant,
      }}
    >
      <div
        className={`
          w-full
          ${currentTheme.base}
          ${className}
        `}
        {...props}
      >
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

// ============ ACCORDION ITEM ============

/**
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {string} props.id
 * @param {string} props.title
 * @param {React.ReactNode} [props.icon]
 * @param {boolean} [props.disabled]
 * @param {string} [props.className]
 */
function AccordionItem({
  children,
  id,
  title,
  icon = null,
  disabled = false,
  className = "",
  ...props
}) {
  const { theme, size, variant, iconPosition, toggleItem, isExpanded, rawVariant } =
    useAccordionContext();

  const expanded = isExpanded(id);

  const handleClick = () => {
    if (!disabled) {
      toggleItem(id);
    }
  };

  const handleKeyDown = (e) => {
    if ((e.key === "Enter" || e.key === " ") && !disabled) {
      e.preventDefault();
      toggleItem(id);
    }
  };

  return (
    <div
      className={`
        ${variant}
        ${theme.border}
        ${disabled ? "opacity-50" : ""}
        ${rawVariant === "separated" ? "bg-current/5" : ""}
        ${className}
      `}
      {...props}
    >
      {/* Header */}
      <button
        type="button"
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        aria-expanded={expanded}
        aria-controls={`accordion-content-${id}`}
        className={`
          w-full flex items-center gap-3 cursor-pointer transition-colors duration-200
          ${size.header}
          ${ICON_POSITIONS[iconPosition]}
          ${disabled ? `cursor-not-allowed ${theme.disabled}` : theme.header}
          focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500
        `}
      >
        <span className="flex items-center gap-2 font-medium">
          {icon && <span className={theme.icon}>{icon}</span>}
          {title}
        </span>

        {/* Chevron Icon */}
        <svg
          className={`
            ${size.icon}
            ${theme.icon}
            transition-transform duration-300 ease-out
            ${expanded ? "rotate-180" : "rotate-0"}
          `}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Content */}
      <div
        id={`accordion-content-${id}`}
        role="region"
        aria-labelledby={`accordion-header-${id}`}
        className={`
          overflow-hidden transition-all duration-300 ease-out
          ${expanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"}
        `}
      >
        <div className={`${size.content} ${theme.content}`}>{children}</div>
      </div>
    </div>
  );
}

// ============ DISPLAY NAMES ============

Accordion.displayName = "Accordion";
AccordionItem.displayName = "AccordionItem";

// ============ COMPOUND COMPONENT ============

Accordion.Item = AccordionItem;

export { Accordion, AccordionItem };
export default Accordion;
