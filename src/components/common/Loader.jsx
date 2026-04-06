import React from "react";

function Loader({ size = "md", color = "blue" }) {
  // 📏 Sizes
  const sizes = {
    sm: "h-5 w-5 border-2",
    md: "h-8 w-8 border-4",
    lg: "h-12 w-12 border-4",
  };

  // 🎨 Colors
  const colors = {
    blue: "border-blue-500",
    green: "border-green-500",
    red: "border-red-500",
    gray: "border-gray-500",
  };

  return (
    <div className="flex justify-center items-center">
      <div
        className={`
          ${sizes[size]}
          ${colors[color]}
          border-t-transparent
          rounded-full
          animate-spin
        `}
      ></div>
    </div>
  );
}

export default Loader;
