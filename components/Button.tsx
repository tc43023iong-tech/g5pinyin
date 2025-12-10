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
  const baseStyles = "font-chinese rounded-full shadow-[0_4px_0_rgba(0,0,0,0.1)] transition-all active:shadow-none active:translate-y-1 transform hover:-translate-y-0.5";
  
  const variants = {
    primary: "bg-candy-blue text-slate-700 hover:bg-blue-300",
    secondary: "bg-white text-slate-600 hover:bg-gray-50 border-2 border-slate-100",
    success: "bg-candy-green text-green-800 hover:bg-green-300",
    danger: "bg-candy-pink text-rose-800 hover:bg-rose-300",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-lg",
    lg: "px-8 py-4 text-2xl",
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
