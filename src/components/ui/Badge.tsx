import { ReactNode } from 'react';

interface BadgeProps {
    children: ReactNode;
    variant?: 'solid' | 'text';
    className?: string;
}

export function Badge({ children, variant = 'text', className = '' }: BadgeProps) {
    const baseStyles = "font-bold tracking-widest uppercase transition-colors";

    const variants = {
        solid: "bg-umbrella-red text-white text-[10px] px-3 py-1.5 rounded",
        text: "text-umbrella-red text-[10px] sm:text-xs"
    };

    return (
        <span className={`${baseStyles} ${variants[variant]} ${className}`}>
            {children}
        </span>
    );
}
