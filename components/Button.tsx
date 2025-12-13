import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  ...props 
}) => {
  // Comic/Sticker style base
  const baseStyles = "font-chinese border-2 border-chiikawa-border rounded-2xl transition-all transform active:translate-y-1 active:shadow-none relative overflow-hidden";
  
  const variants = {
    primary: "bg-chiikawa-blue text-chiikawa-text shadow-comic hover:shadow-comic-hover",
    secondary: "bg-white text-chiikawa-text shadow-comic hover:shadow-comic-hover",
    success: "bg-chiikawa-green text-green-800 shadow-comic hover:shadow-comic-hover",
    danger: "bg-chiikawa-pink text-rose-800 shadow-comic hover:shadow-comic-hover",
  };

  const sizes = {
    sm: "px-3 py-1 text-sm",
    md: "px-6 py-2 text-lg",
    lg: "px-8 py-3 text-2xl",
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
