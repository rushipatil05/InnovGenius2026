import React from "react";

interface ButtonProps {
  className?: string;
  text?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  children?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  className = "",
  text,
  onClick,
  type = "button",
  disabled = false,
  children,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        py-2 px-5 
        bg-blue-gradient 
        font-poppins font-medium 
        text-[18px] text-primary 
        outline-none rounded-[10px]
        transition-all duration-300
        hover:scale-105 hover:shadow-lg
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
    >
      {children ? children : text}
    </button>
  );
};

export default Button;