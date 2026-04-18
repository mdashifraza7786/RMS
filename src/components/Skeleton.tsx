import React from 'react';

interface SkeletonProps {
  variant?: 'text' | 'rect';
  width?: string | number;
  height?: string | number;
  className?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({ 
  variant = 'text', 
  width, 
  height, 
  className = '' 
}) => {
  const style: React.CSSProperties = {
    width: width,
    height: height,
  };

  const variantClass = variant === 'text' ? 'skeleton-text' : 'skeleton-rect';

  return (
    <div 
      className={`skeleton ${variantClass} ${className}`} 
      style={style}
    />
  );
};

export default Skeleton;
