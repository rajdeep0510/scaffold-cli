// component.jsx
import { useState } from "react";
import PropTypes from "prop-types";

export default function Avatar({
  src,
  alt,
  name,
  info,
  size = "md",
  cardPosition = "bottom",
}) {
  const [showCard, setShowCard] = useState(false);

  // Avatar size styles
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  // Hover card position
  const positionClasses =
    cardPosition === "top" ? "bottom-full mb-2" : "top-full mt-2";

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setShowCard(true)}
      onMouseLeave={() => setShowCard(false)}
    >
      {/* Avatar Image */}
      <img
        src={src}
        alt={alt || "Avatar"}
        className={`${sizeClasses[size]} rounded-full object-cover border shadow-sm cursor-pointer`}
      />

      {/* Hover Card */}
      {showCard && (
        <div
          className={`absolute left-1/2 -translate-x-1/2 ${positionClasses} 
                      bg-white shadow-lg rounded-2xl p-3 w-48 
                      border text-sm z-10`}
        >
          <p className="font-extrabold">{name}</p>
          <p className="text-gray-600">{info}</p>
        </div>
      )}
    </div>
  );
}

// PropTypes validation
Avatar.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string,
  name: PropTypes.string.isRequired,
  info: PropTypes.string,
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  cardPosition: PropTypes.oneOf(["top", "bottom"]),
};
