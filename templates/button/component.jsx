import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";

const Button = ({
  children,
  size = "sm",
  disabled = false,
  loading = false,
  className = "",
  onClick,
  type = "button",
  borderColor = "white", // "white" or "black"
  borderWidth = 1,
  borderStyle = "solid",
  borderRadius = "md", // sm, md, lg, xl, full
  ...rest
}) => {
  const sizeClasses = {
    sm: "h-8 px-3 text-sm",
    md: "h-10 px-4 text-sm",
    lg: "h-12 px-5 text-base",
    xl: "h-14 px-6 text-lg",
  };

  const radiusClasses = {
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
    full: "rounded-full",
  };

  const borderClasses = clsx(
    `border-${borderWidth}`,
    borderStyle !== "solid" && `border-${borderStyle}`,
    borderColor === "white" ? "border-white" : "border-black"
  );

  const buttonClasses = clsx(
    "inline-flex items-center justify-center font-medium",
    "transition-transform duration-150 ease-in-out", // smooth animation
    "active:scale-95", // 👈 shrink when clicked
    borderClasses,
    radiusClasses[borderRadius],
    sizeClasses[size],
    disabled || loading ? "opacity-60 cursor-not-allowed" : "cursor-pointer",
    className
  );

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={buttonClasses}
      {...rest}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node,
  size: PropTypes.oneOf(["sm", "md", "lg", "xl"]),
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  className: PropTypes.string,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(["button", "submit", "reset"]),
  borderColor: PropTypes.oneOf(["black", "white"]),
  borderWidth: PropTypes.number,
  borderStyle: PropTypes.oneOf(["solid", "dashed", "dotted", "double"]),
  borderRadius: PropTypes.oneOf(["sm", "md", "lg", "xl", "full"]),
};

export default Button;
