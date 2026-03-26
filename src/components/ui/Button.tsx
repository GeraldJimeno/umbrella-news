import { ReactNode, ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    variant?: 'primary' | 'secondary' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export function Button({
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    ...props
}: ButtonProps) {

    const baseStyles = "inline-flex items-center justify-center font-bold tracking-wide transition-colors uppercase rounded focus:outline-none";

    const variants = {
        primary: "bg-umbrella-red hover:bg-red-700 text-white",
        secondary: "bg-[#111111] hover:bg-black text-white",
        ghost: "bg-transparent text-gray-400 hover:text-white"
    };

    const sizes = {
        sm: "px-3 py-1.5 text-xs",
        md: "px-4 py-2 text-xs sm:text-sm",
        lg: "px-6 py-3 text-sm"
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}
