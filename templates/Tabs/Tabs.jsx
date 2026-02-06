import React, { createContext, useContext, useState } from "react";

// ============ CONFIGURATION OBJECTS ============

const VARIANTS = {
  underline: "border-b",
  pills: "bg-opacity-10 rounded-lg p-1",
  boxed: "border rounded-lg",
  minimal: "",
  lifted: "border-b-0",
};

const THEMES = {
  light: {
    base: "text-slate-600",
    list: "bg-slate-100",
    listBorder: "border-slate-200",
    active: "text-slate-900",
    activeUnderline: "border-blue-500",
    activePill: "bg-white text-slate-900 shadow-sm",
    activeBoxed: "bg-white border-slate-200 border-b-white",
    hover: "hover:text-slate-900 hover:bg-slate-50",
    content: "text-slate-700",
    disabled: "text-slate-300 cursor-not-allowed",
  },
  dark: {
    base: "text-slate-400",
    list: "bg-slate-800/50",
    listBorder: "border-slate-700",
    active: "text-white",
    activeUnderline: "border-blue-400",
    activePill: "bg-slate-700 text-white shadow-lg",
    activeBoxed: "bg-slate-800 border-slate-600 border-b-slate-800",
    hover: "hover:text-white hover:bg-slate-800/50",
    content: "text-slate-300",
    disabled: "text-slate-600 cursor-not-allowed",
  },
};

const SIZES = {
  sm: {
    tab: "px-3 py-1.5 text-sm",
    content: "p-3 text-sm",
    gap: "gap-1",
  },
  md: {
    tab: "px-4 py-2 text-base",
    content: "p-4 text-base",
    gap: "gap-2",
  },
  lg: {
    tab: "px-6 py-3 text-lg",
    content: "p-6 text-lg",
    gap: "gap-3",
  },
};

const ORIENTATIONS = {
  horizontal: "flex-col",
  vertical: "flex-row",
};

const LIST_ORIENTATIONS = {
  horizontal: "flex-row",
  vertical: "flex-col",
};

const ALIGNMENTS = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  stretch: "justify-stretch",
};

// ============ CONTEXT ============

const TabsContext = createContext(null);

const useTabsContext = () => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error("Tabs components must be used within a Tabs");
  }
  return context;
};

// ============ TABS ROOT ============

/**
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {"light" | "dark"} [props.theme]
 * @param {"underline" | "pills" | "boxed" | "minimal" | "lifted"} [props.variant]
 * @param {"sm" | "md" | "lg"} [props.size]
 * @param {"horizontal" | "vertical"} [props.orientation]
 * @param {"start" | "center" | "end" | "stretch"} [props.align]
 * @param {string} [props.defaultValue]
 * @param {string} [props.value]
 * @param {function} [props.onValueChange]
 * @param {boolean} [props.fullWidth]
 * @param {string} [props.className]
 */
function Tabs({
  children,
  theme = "dark",
  variant = "underline",
  size = "md",
  orientation = "horizontal",
  align = "start",
  defaultValue = "",
  value: controlledValue,
  onValueChange,
  fullWidth = false,
  className = "",
  ...props
}) {
  const [internalValue, setInternalValue] = useState(defaultValue);

  const isControlled = controlledValue !== undefined;
  const activeTab = isControlled ? controlledValue : internalValue;

  const setActiveTab = (value) => {
    if (!isControlled) {
      setInternalValue(value);
    }
    onValueChange?.(value);
  };

  const currentTheme = THEMES[theme] || THEMES.dark;
  const currentVariant = VARIANTS[variant] || VARIANTS.underline;
  const currentSize = SIZES[size] || SIZES.md;
  const currentOrientation = ORIENTATIONS[orientation] || ORIENTATIONS.horizontal;
  const currentAlignment = ALIGNMENTS[align] || ALIGNMENTS.start;

  return (
    <TabsContext.Provider
      value={{
        activeTab,
        setActiveTab,
        theme: currentTheme,
        variant: currentVariant,
        size: currentSize,
        orientation,
        alignment: currentAlignment,
        fullWidth,
        rawVariant: variant,
      }}
    >
      <div
        className={`
          flex ${currentOrientation}
          ${fullWidth ? "w-full" : ""}
          ${className}
        `}
        {...props}
      >
        {children}
      </div>
    </TabsContext.Provider>
  );
}

// ============ TABS LIST ============

/**
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {string} [props.className]
 */
function TabsList({ children, className = "", ...props }) {
  const { theme, variant, size, orientation, alignment, rawVariant } = useTabsContext();

  const listOrientation = LIST_ORIENTATIONS[orientation] || LIST_ORIENTATIONS.horizontal;

  const getVariantStyles = () => {
    switch (rawVariant) {
      case "pills":
        return `${theme.list} rounded-lg p-1`;
      case "boxed":
        return `border ${theme.listBorder} rounded-t-lg`;
      case "underline":
        return `border-b ${theme.listBorder}`;
      case "lifted":
        return "";
      default:
        return "";
    }
  };

  return (
    <div
      role="tablist"
      className={`
        flex ${listOrientation} ${size.gap} ${alignment}
        ${getVariantStyles()}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}

// ============ TABS TRIGGER ============

/**
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {string} props.value
 * @param {boolean} [props.disabled]
 * @param {React.ReactNode} [props.icon]
 * @param {string} [props.className]
 */
function TabsTrigger({
  children,
  value,
  disabled = false,
  icon = null,
  className = "",
  ...props
}) {
  const { activeTab, setActiveTab, theme, size, rawVariant, fullWidth } = useTabsContext();

  const isActive = activeTab === value;

  const handleClick = () => {
    if (!disabled) {
      setActiveTab(value);
    }
  };

  const getActiveStyles = () => {
    if (!isActive) return "";

    switch (rawVariant) {
      case "underline":
        return `border-b-2 ${theme.activeUnderline} ${theme.active} -mb-px`;
      case "pills":
        return theme.activePill;
      case "boxed":
        return `border border-b-0 ${theme.activeBoxed} rounded-t-lg -mb-px`;
      case "lifted":
        return `border border-b-0 ${theme.activeBoxed} rounded-t-lg shadow-sm -mb-px`;
      case "minimal":
        return theme.active;
      default:
        return theme.active;
    }
  };

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      aria-controls={`tabpanel-${value}`}
      tabIndex={isActive ? 0 : -1}
      onClick={handleClick}
      disabled={disabled}
      className={`
        flex items-center gap-2 font-medium transition-all duration-200
        ${size.tab}
        ${fullWidth ? "flex-1" : ""}
        ${disabled ? theme.disabled : isActive ? "" : `${theme.base} ${theme.hover}`}
        ${getActiveStyles()}
        focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
        ${rawVariant === "pills" ? "rounded-md" : ""}
        ${className}
      `}
      {...props}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </button>
  );
}

// ============ TABS CONTENT ============

/**
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {string} props.value
 * @param {boolean} [props.forceMount]
 * @param {string} [props.className]
 */
function TabsContent({
  children,
  value,
  forceMount = false,
  className = "",
  ...props
}) {
  const { activeTab, theme, size, rawVariant } = useTabsContext();

  const isActive = activeTab === value;

  if (!isActive && !forceMount) return null;

  const getBorderStyles = () => {
    switch (rawVariant) {
      case "boxed":
      case "lifted":
        return `border border-t-0 ${theme.listBorder} rounded-b-lg`;
      default:
        return "";
    }
  };

  return (
    <div
      role="tabpanel"
      id={`tabpanel-${value}`}
      aria-labelledby={`tab-${value}`}
      hidden={!isActive}
      className={`
        ${size.content}
        ${theme.content}
        ${getBorderStyles()}
        ${isActive ? "animate-fadeIn" : ""}
        ${className}
      `}
      style={{
        animation: isActive ? "tabFadeIn 0.2s ease-out" : undefined,
      }}
      {...props}
    >
      <style>{`
        @keyframes tabFadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      {children}
    </div>
  );
}

// ============ DISPLAY NAMES ============

Tabs.displayName = "Tabs";
TabsList.displayName = "TabsList";
TabsTrigger.displayName = "TabsTrigger";
TabsContent.displayName = "TabsContent";

// ============ COMPOUND COMPONENT ============

Tabs.List = TabsList;
Tabs.Trigger = TabsTrigger;
Tabs.Content = TabsContent;

export { Tabs, TabsList, TabsTrigger, TabsContent };
export default Tabs;
