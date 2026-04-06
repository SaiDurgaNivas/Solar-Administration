import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// 1. Utility for merging Tailwind classes
const cn = (...inputs) => twMerge(clsx(inputs));

// 2. Mini Sparkline Component (No external library needed)
const MiniSparkline = ({ data, className }) => {
  if (!data || data.length === 0) return null;
  
  const width = 80;
  const height = 24;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const points = data
    .map((val, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((val - min) / range) * height;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={cn("w-20 h-6 overflow-visible", className)}
    >
      <polyline
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
};

// 3. Main Premium Card Component
const DashboardCard = ({
  title,
  value,
  icon,
  iconBgColor = "bg-blue-500", // Solid color for better glow
  trend,
  trendLabel = "vs last month",
  sparklineData, // Pass array of numbers e.g., [1, 5, 2, 6, 3]
  variant = "solid", // 'solid' | 'glass'
  isLoading = false,
  className,
  action, // Slot for a menu button or link
}) => {
  
  // Determine text color for icon container based on bg darkness (simplified logic)
  const iconTextColor = iconBgColor.includes("white") ? "text-gray-600" : "text-white";

  // Loading Skeleton
  if (isLoading) {
    return (
      <div
        className={cn(
          "rounded-2xl p-6 border border-gray-100 bg-white",
          className
        )}
      >
        <div className="flex justify-between items-start">
          <div className="space-y-3 w-full">
            <div className="h-3 bg-gray-200 rounded w-1/3 animate-pulse"></div>
            <div className="h-7 bg-gray-200 rounded w-2/3 animate-pulse"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse mt-2"></div>
          </div>
          <div className="w-12 h-12 bg-gray-200 rounded-xl animate-pulse"></div>
        </div>
      </div>
    );
  }

  // Trend Logic
  const isTrendPositive = trend && trend >= 0;
  const trendColor = trend === 0 ? "text-gray-500" : isTrendPositive ? "text-emerald-500" : "text-rose-500";
  const trendBg = trend === 0 ? "bg-gray-50" : isTrendPositive ? "bg-emerald-50" : "bg-rose-50";

  return (
    <div
      className={cn(
        // Base Styles
        "relative group rounded-2xl p-6 border transition-all duration-500 ease-out",
        "flex flex-col justify-between min-h-[160px]",
        
        // Variants
        variant === "solid" && [
          "bg-white border-gray-100 shadow-sm",
          "hover:shadow-xl hover:border-gray-200 hover:-translate-y-1",
        ],
        variant === "glass" && [
          "bg-white/60 backdrop-blur-lg border-white/20 shadow-lg",
          "hover:bg-white/80 hover:shadow-2xl hover:border-white/40",
        ],

        className
      )}
    >
      {/* Top Section: Title & Action */}
      <div className="flex justify-between items-start mb-4">
        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
          {title}
        </p>
        
        {action && (
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {action}
          </div>
        )}
      </div>

      {/* Middle Section: Value & Icon */}
      <div className="flex justify-between items-end">
        <div className="flex flex-col gap-1">
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
            {value}
          </h2>

          {/* Trend & Sparkline Section */}
          <div className="flex items-center gap-3 mt-2">
            {trend !== undefined && (
              <span
                className={cn(
                  "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold",
                  trendColor,
                  trendBg
                )}
              >
                {isTrendPositive ? "↑" : "↓"} {Math.abs(trend)}%
              </span>
            )}
            
            {sparklineData && (
              <MiniSparkline 
                data={sparklineData} 
                className={cn(
                    "opacity-70 group-hover:opacity-100 transition-opacity",
                    isTrendPositive ? "text-emerald-500" : "text-rose-500"
                )} 
              />
            )}
          </div>
        </div>

        {/* Icon Container with Glow Effect */}
        <div className="relative">
          {/* The Glow (visible on hover) */}
          <div
            className={cn(
              "absolute inset-0 rounded-xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500",
              iconBgColor
            )}
          />
          
          {/* The Icon Button */}
          <div
            className={cn(
              "relative flex items-center justify-center w-14 h-14 rounded-xl shadow-sm transition-transform duration-300 group-hover:scale-110",
              iconBgColor,
              iconTextColor
            )}
          >
            {icon}
          </div>
        </div>
      </div>

      {/* Subtle Footer Label */}
      {trendLabel && !sparklineData && (
        <div className="absolute bottom-4 right-6 text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
          {trendLabel}
        </div>
      )}
    </div>
  );
};

export default DashboardCard;
