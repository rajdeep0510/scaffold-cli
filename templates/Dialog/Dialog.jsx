import React, { createContext, useContext, useState, useEffect, useRef } from "react";

// ============ CONFIGURATION OBJECTS ============

const VARIANTS = {
  default: "bg-opacity-100 shadow-2xl",
  glass: "backdrop-blur-xl bg-opacity-80 border border-white/10",
  minimal: "shadow-lg",
  bordered: "border-2 shadow-xl",
};

const THEMES = {
  light: {
    overlay: "bg-black/50",
    base: "bg-white text-slate-800",
    glass: "bg-white/80 text-slate-900",
    border: "border-slate-200",
    title: "text-slate-900",
    description: "text-slate-500",
    closeBtn: "text-slate-400 hover:text-slate-600 hover:bg-slate-100",
  },
  dark: {
    overlay: "bg-black/70",
    base: "bg-slate-900 text-slate-100",
    glass: "bg-slate-900/80 text-white",
    border: "border-slate-700",
    title: "text-white",
    description: "text-slate-400",
    closeBtn: "text-slate-500 hover:text-slate-300 hover:bg-slate-800",
  },
};

const SIZES = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  full: "max-w-full mx-4",
};

const ROUNDED = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
  "3xl": "rounded-3xl",
};

const POSITIONS = {
  center: "items-center justify-center",
  top: "items-start justify-center pt-20",
  bottom: "items-end justify-center pb-20",
};

// ============ CONTEXT ============

const DialogContext = createContext(null);

const useDialogContext = () => {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error("Dialog components must be used within a Dialog");
  }
  return context;
};

// ============ DIALOG ROOT ============

/**
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {"light" | "dark"} [props.theme]
 * @param {"default" | "glass" | "minimal" | "bordered"} [props.variant]
 * @param {"sm" | "md" | "lg" | "xl" | "2xl" | "full"} [props.size]
 * @param {"none" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl"} [props.rounded]
 * @param {"center" | "top" | "bottom"} [props.position]
 * @param {boolean} [props.closeOnOverlayClick]
 * @param {boolean} [props.closeOnEscape]
 * @param {boolean} [props.showCloseButton]
 * @param {boolean} [props.open]
 * @param {function} [props.onOpenChange]
 * @param {string} [props.className]
 */
function Dialog({
  children,
  theme = "dark",
  variant = "default",
  size = "md",
  rounded = "xl",
  position = "center",
  closeOnOverlayClick = true,
  closeOnEscape = true,
  showCloseButton = true,
  open: controlledOpen,
  onOpenChange,
  className = "",
  ...props
}) {
  const [internalOpen, setInternalOpen] = useState(false);
  
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  
  const setOpen = (value) => {
    if (!isControlled) {
      setInternalOpen(value);
    }
    onOpenChange?.(value);
  };

  const currentTheme = THEMES[theme] || THEMES.dark;
  const currentVariant = VARIANTS[variant] || VARIANTS.default;
  const currentSize = SIZES[size] || SIZES.md;
  const currentRounded = ROUNDED[rounded] || ROUNDED.xl;
  const currentPosition = POSITIONS[position] || POSITIONS.center;

  return (
    <DialogContext.Provider
      value={{
        open,
        setOpen,
        theme: currentTheme,
        variant: currentVariant,
        size: currentSize,
        rounded: currentRounded,
        position: currentPosition,
        closeOnOverlayClick,
        closeOnEscape,
        showCloseButton,
        rawVariant: variant,
        className,
        props,
      }}
    >
      {children}
    </DialogContext.Provider>
  );
}

// ============ DIALOG TRIGGER ============

/**
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {string} [props.className]
 * @param {boolean} [props.asChild]
 */
function DialogTrigger({ children, className = "", asChild = false, ...props }) {
  const { setOpen } = useDialogContext();

  const handleClick = (e) => {
    e.preventDefault();
    setOpen(true);
  };

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      onClick: handleClick,
      ...props,
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

// ============ DIALOG PORTAL/CONTENT ============

/**
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {string} [props.className]
 */
function DialogContent({ children, className = "", ...props }) {
  const {
    open,
    setOpen,
    theme,
    variant,
    size,
    rounded,
    position,
    closeOnOverlayClick,
    closeOnEscape,
    showCloseButton,
    rawVariant,
  } = useDialogContext();

  const dialogRef = useRef(null);

  // Handle escape key
  useEffect(() => {
    if (!open || !closeOnEscape) return;

    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [open, closeOnEscape, setOpen]);

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Focus trap
  useEffect(() => {
    if (open && dialogRef.current) {
      dialogRef.current.focus();
    }
  }, [open]);

  if (!open) return null;

  const handleOverlayClick = (e) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      setOpen(false);
    }
  };

  const isGlass = rawVariant === "glass";
  const baseStyle = isGlass ? theme.glass : theme.base;

  return (
    <>
      <style>{`
        @keyframes dialogFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes dialogSlideIn {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
      <div
        className={`
          fixed inset-0 z-50 flex ${position}
          ${theme.overlay}
        `}
        style={{ animation: "dialogFadeIn 0.2s ease-out" }}
        onClick={handleOverlayClick}
        role="dialog"
        aria-modal="true"
      >
        <div
          ref={dialogRef}
          tabIndex={-1}
          className={`
            relative w-full ${size} p-6
            ${rounded}
            ${variant}
            ${baseStyle}
            ${rawVariant === "bordered" ? theme.border : ""}
            ${className}
          `}
          style={{ animation: "dialogSlideIn 0.3s ease-out" }}
          {...props}
        >
          {/* Close Button */}
          {showCloseButton && (
            <button
              type="button"
              onClick={() => setOpen(false)}
              className={`
                absolute top-4 right-4 p-1.5 rounded-lg transition-colors duration-200
                ${theme.closeBtn}
                focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
              `}
              aria-label="Close dialog"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}

          {children}
        </div>
      </div>
    </>
  );
}

// ============ DIALOG HEADER ============

/**
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {string} [props.className]
 */
function DialogHeader({ children, className = "", ...props }) {
  return (
    <div className={`mb-4 pr-8 ${className}`} {...props}>
      {children}
    </div>
  );
}

// ============ DIALOG TITLE ============

/**
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {string} [props.className]
 */
function DialogTitle({ children, className = "", ...props }) {
  const { theme } = useDialogContext();

  return (
    <h2
      className={`text-xl font-semibold tracking-tight ${theme.title} ${className}`}
      {...props}
    >
      {children}
    </h2>
  );
}

// ============ DIALOG DESCRIPTION ============

/**
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {string} [props.className]
 */
function DialogDescription({ children, className = "", ...props }) {
  const { theme } = useDialogContext();

  return (
    <p className={`mt-1 text-sm ${theme.description} ${className}`} {...props}>
      {children}
    </p>
  );
}

// ============ DIALOG BODY ============

/**
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {string} [props.className]
 */
function DialogBody({ children, className = "", ...props }) {
  const { theme } = useDialogContext();

  return (
    <div className={`${theme.description} ${className}`} {...props}>
      {children}
    </div>
  );
}

// ============ DIALOG FOOTER ============

/**
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {string} [props.className]
 */
function DialogFooter({ children, className = "", ...props }) {
  return (
    <div
      className={`mt-6 flex items-center justify-end gap-3 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

// ============ DIALOG CLOSE ============

/**
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {string} [props.className]
 * @param {boolean} [props.asChild]
 */
function DialogClose({ children, className = "", asChild = false, ...props }) {
  const { setOpen } = useDialogContext();

  const handleClick = () => {
    setOpen(false);
  };

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      onClick: handleClick,
      ...props,
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

// ============ DISPLAY NAMES ============

Dialog.displayName = "Dialog";
DialogTrigger.displayName = "DialogTrigger";
DialogContent.displayName = "DialogContent";
DialogHeader.displayName = "DialogHeader";
DialogTitle.displayName = "DialogTitle";
DialogDescription.displayName = "DialogDescription";
DialogBody.displayName = "DialogBody";
DialogFooter.displayName = "DialogFooter";
DialogClose.displayName = "DialogClose";

// ============ COMPOUND COMPONENT ============

Dialog.Trigger = DialogTrigger;
Dialog.Content = DialogContent;
Dialog.Header = DialogHeader;
Dialog.Title = DialogTitle;
Dialog.Description = DialogDescription;
Dialog.Body = DialogBody;
Dialog.Footer = DialogFooter;
Dialog.Close = DialogClose;

export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogFooter,
  DialogClose,
};

export default Dialog;
