// component.jsx
import PropTypes from "prop-types";

export default function Input({
  type = "text",
  placeholder = "",
  value,
  onChange,
  className = "",
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`px-3 py-2 rounded-md border outline-none 
                  transition-all duration-200 
                  border-gray-300 focus:border-gray-500 
                  focus:ring-2 focus:ring-gray-300 focus:ring
                  ${className}`}
    />
  );
}

// PropTypes validation
Input.propTypes = {
  type: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  className: PropTypes.string,
};
