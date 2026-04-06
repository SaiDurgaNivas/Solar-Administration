import React, { forwardRef, useId } from "react";

const Input = forwardRef(
  (
    {
      label,
      type = "text",
      name,
      value,
      onChange,
      placeholder,
      error,
      disabled = false,
      className = "",
      id,
      leftIcon,
      rightIcon,
      required = false,
      ...rest // Allows passing native HTML attributes (maxLength, onBlur, etc.)
    },
    ref
  ) => {
    // Generate a unique ID if one isn't provided (better for accessibility)
    const generatedId = useId();
    const inputId = id || name || generatedId;
    const errorId = `${inputId}-error`;

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {/* Label Section */}
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-gray-700 flex items-center gap-1"
          >
            {label}
            {required && <span className="text-red-500">*</span>}
          </label>
        )}

        {/* Input Wrapper (needed for icon positioning) */}
        <div className="relative">
          {/* Left Icon */}
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
              {leftIcon}
            </div>
          )}

          {/* Input Field */}
          <input
            ref={ref}
            id={inputId}
            type={type}
            name={name}
            value={value ?? ""}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : undefined}
            className={`
              w-full px-3 py-2.5 rounded-lg border outline-none 
              transition-all duration-200 ease-in-out
              
              /* Padding adjustments for icons */
              ${leftIcon ? "pl-10" : ""}
              ${rightIcon ? "pr-10" : ""}

              /* Focus States (Ring effect is more modern than outline) */
              focus:ring-2 focus:ring-offset-0
              
              /* State-based Styling */
              ${
                error
                  ? "border-red-500 text-red-900 placeholder-red-300 focus:ring-red-200 focus:border-red-500"
                  : "border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-blue-200 focus:border-blue-500"
              }

              ${
                disabled
                  ? "bg-gray-100 cursor-not-allowed text-gray-500 border-gray-200"
                  : "bg-white hover:border-gray-400"
              }

              ${className}
            `}
            {...rest}
          />

          {/* Right Icon */}
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
              {rightIcon}
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <span id={errorId} className="text-red-600 text-xs mt-1 font-medium">
            {error}
          </span>
        )}
      </div>
    );
  }
);

// Display name for better debugging in React DevTools
Input.displayName = "Input";

export default Input;
