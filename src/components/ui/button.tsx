import React from "react";
import { Loader2 } from "lucide-react";

// کامپوننت دکمه یکپارچه پروژه. نسخه قبلی از رنگ‌های عمومی آبی/خاکستری/
// قرمز/سبز Tailwind استفاده می‌کرد که با پالت رنگی واقعی برند (بنفش،
// طلایی — تعریف‌شده در globals.css به‌عنوان --primary/--gold) هماهنگ
// نبود. همچنین حالت Loading و Outline اصلا وجود نداشت.

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "sm" | "md" | "lg" | "icon";
  variant?: "primary" | "secondary" | "outline" | "danger" | "success" | "ghost";
  loading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export function Button({
  children,
  size = "md",
  variant = "primary",
  loading = false,
  icon,
  fullWidth = false,
  disabled,
  className = "",
  ...props
}: ButtonProps) {
  const sizes: Record<string, string> = {
    sm: "px-3 py-2 text-sm gap-1.5",
    md: "px-4 py-2.5 text-base gap-2",
    lg: "px-6 py-3 text-lg gap-2.5",
    icon: "p-2.5",
  };

  const variants: Record<string, string> = {
    primary: "bg-[#8B5CF6] text-white hover:bg-[#7C3AED] shadow-md hover:shadow-lg",
    secondary: "bg-[#C084FC] text-white hover:bg-[#A855F7]",
    outline: "bg-transparent border-2 border-[#8B5CF6] text-[#8B5CF6] hover:bg-[#8B5CF6] hover:text-white",
    danger: "bg-[#EF4444] text-white hover:bg-[#DC2626]",
    success: "bg-[#22C55E] text-white hover:bg-[#16A34A]",
    ghost: "bg-transparent text-[#8B5CF6] hover:bg-[#8B5CF6]/10",
  };

  const isDisabled = disabled || loading;

  return (
    <button
      {...props}
      disabled={isDisabled}
      className={`
        inline-flex items-center justify-center
        rounded-full font-medium
        transition-all duration-300
        active:scale-95
        disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
        ${fullWidth ? "w-full" : ""}
        ${sizes[size]}
        ${variants[variant]}
        ${className}
      `}
    >
      {loading ? (
        <Loader2 size={size === "sm" ? 14 : 18} className="animate-spin" />
      ) : (
        icon
      )}
      {children}
    </button>
  );
}
