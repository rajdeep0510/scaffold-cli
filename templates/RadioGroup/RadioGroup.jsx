import React, { forwardRef } from "react";

const SIZES = {
  sm: { circle: "h-4 w-4", dot: "h-1.5 w-1.5", text: "text-xs" },
  md: { circle: "h-5 w-5", dot: "h-2 w-2", text: "text-sm" },
  lg: { circle: "h-6 w-6", dot: "h-2.5 w-2.5", text: "text-base" },
};

const THEMES = {
  light: {
    labelRaw: "text-slate-500 group-hover:text-slate-800",
    labelChecked: "text-slate-900",
    borderRaw: "border-slate-300",
    borderHover: "group-hover:border-slate-400",
    dot: "bg-current",
  },
  dark: {
    labelRaw: "text-slate-400 group-hover:text-slate-200",
    labelChecked: "text-white",
    borderRaw: "border-slate-700",
    borderHover: "group-hover:border-slate-500",
    dot: "bg-white",
  },
};

export const RadioButton = forwardRef(
  (
    {
      label,
      value,
      selectedValue,
      onChange,
      name,
      disabled,
      size = "md",
      theme = "dark",
      activeColor = "text-blue-500",
      ...props
    },
    ref,
  ) => {
    const isSelected = value === selectedValue;
    const currentSize = SIZES[size] || SIZES.md;
    const currentTheme = THEMES[theme] || THEMES.dark;

    return (
      <label
        className={`group flex items-center gap-3 select-none transition-all ${
          disabled ? "opacity-30 cursor-not-allowed" : "cursor-pointer"
        }`}
      >
        <div className="relative flex items-center justify-center">
          <input
            {...props}
            ref={ref}
            type="radio"
            name={name}
            checked={isSelected}
            disabled={disabled}
            onChange={() => onChange(value)}
            className="peer sr-only"
          />

          {/* Outer Circle */}
          <div
            className={`
              rounded-full border-2 transition-all duration-200 bg-transparent
              ${currentSize.circle}
              ${currentTheme.borderRaw}
              ${!disabled && currentTheme.borderHover}
              peer-checked:border-current ${activeColor}
            `}
          />

          {/* Inner Dot */}
          <div
            className={`
              absolute rounded-full transition-transform duration-200
              ${currentSize.dot}
              ${currentTheme.dot}
              ${activeColor}
              ${isSelected ? "scale-100 opacity-100" : "scale-0 opacity-0"}
            `}
          />
        </div>

        {label && (
          <span
            className={`
              font-medium transition-colors
              ${currentSize.text}
              ${isSelected ? currentTheme.labelChecked : currentTheme.labelRaw}
            `}
          >
            {label}
          </span>
        )}
      </label>
    );
  },
);

RadioButton.displayName = "RadioButton";

export default function RadioGroup({
  options,
  value,
  onChange,
  name,
  label,
  orientation = "vertical",
  size = "md",
  theme = "dark",
  activeColor = "text-blue-500",
  className = "",
}) {
  return (
    <fieldset className={`flex flex-col gap-4 ${className}`}>
      {label && (
        <legend className="text-[10px] font-bold tracking-[0.2em] text-slate-500 uppercase">
          {label}
        </legend>
      )}
      <div
        className={`flex ${
          orientation === "vertical" ? "flex-col gap-3" : "flex-row gap-6"
        }`}
      >
        {options.map((opt) => (
          <RadioButton
            key={opt.value}
            name={name}
            label={opt.label}
            value={opt.value}
            selectedValue={value}
            onChange={onChange}
            disabled={opt.disabled}
            size={size}
            theme={theme}
            activeColor={activeColor}
          />
        ))}
      </div>
    </fieldset>
  );
}

RadioGroup.displayName = "RadioGroup";
