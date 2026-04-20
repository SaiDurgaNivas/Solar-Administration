import React from "react";

// 2. Use forwardRef to allow DOM access
const Button = React.forwardRef(
  (
    {
      children,
      onClick,
      type = "button",
      variant = "primary",
      size = "md",
      disabled = false,
      isLoading = false,
      leftIcon,
      rightIcon,
      className = "",
      ...props // Capture any other native button props (id, name, etc.)
    },
    ref
  ) => {
    
    // 🎨 Premium Variants matching Solar Administration aesthetic: Solar colors, dark glassmorphism
    const variants = {
      primary: `
        bg-gradient-to-r from-orange-500 to-yellow-500 text-black font-bold
        hover:from-orange-400 hover:to-orange-500 hover:shadow-[0_0_15px_rgba(249,115,22,0.4)]
        focus:ring-orange-500 
        active:scale-[0.98]
      `,
      secondary: `
        bg-white/10 backdrop-blur-md border border-white/20 text-white font-semibold
        hover:bg-white/20 hover:border-white/30
        focus:ring-white/50 
        active:scale-[0.98]
      `,
      danger: `
        bg-red-500/20 backdrop-blur-md border border-red-500/50 text-red-500 font-semibold
        hover:bg-red-500/30 hover:border-red-500 hover:shadow-[0_0_15px_rgba(239,68,68,0.4)]
        focus:ring-red-500 
        active:scale-[0.98]
      `,
      outline: `
        border-2 border-orange-500/50 text-orange-400 bg-transparent font-semibold
        hover:bg-orange-500/10 hover:border-orange-500
        focus:ring-orange-500 
        active:scale-[0.98]
      `,
      ghost: `
        bg-transparent text-gray-400 font-medium
        hover:bg-white/5 hover:text-white
        focus:ring-gray-500 
        active:scale-[0.98]
      `,
    };

    // 📏 Sizes
    const sizes = {
      sm: "px-4 py-2 text-xs font-medium rounded-lg",
      md: "px-6 py-3 text-sm font-semibold rounded-xl",
      lg: "px-8 py-4 text-base font-bold rounded-2xl",
    };

    return (
      <button
        ref={ref} // Attach the forwarded ref
        type={type}
        onClick={onClick}
        disabled={disabled || isLoading}
        className={`
          relative
          font-sans
          transition-all duration-300 ease-out
          
          /* Focus Ring for Accessibility */
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#020617]
          
          /* Disabled State */
          disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:active:scale-100 disabled:shadow-none
          
          /* Flex layout for icons */
          inline-flex items-center justify-center gap-2
          
          ${variants[variant] || variants.primary}
          ${sizes[size] || sizes.md}
          ${className}
        `}
        {...props} // Spread remaining props
      >
        {isLoading ? (
          // Premium Spinner
          <svg
            className="animate-spin h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        ) : (
          <>
            {leftIcon}
            {children}
            {rightIcon}
          </>
        )}
      </button>
    );
  }
);

// Display name for better debugging in React DevTools
Button.displayName = "Button";

export default Button;
