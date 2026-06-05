"use client";

import React from "react";

interface SkeletonProps {
  className?: string;
  variant?: "text" | "rect" | "circle";
  width?: string | number;
  height?: string | number;
}

const Skeleton: React.FC<SkeletonProps> = ({ 
  className = "", 
  variant = "rect",
  width,
  height 
}) => {
  const variantClasses = {
    text: "skeleton-text",
    rect: "skeleton-rect",
    circle: "skeleton-rect rounded-full", // Reusing rect for now with full round
  };

  const style: React.CSSProperties = {
    width: width,
    height: height,
  };

  return (
    <div 
      className={`skeleton ${variantClasses[variant]} ${className}`} 
      style={style}
    />
  );
};

export default Skeleton;
