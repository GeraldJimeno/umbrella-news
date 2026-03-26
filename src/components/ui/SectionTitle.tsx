import { ReactNode } from 'react';
import Link from 'next/link';

interface SectionTitleProps {
    title: string;
    viewAllLink?: string;
    className?: string;
}

export function SectionTitle({ title, viewAllLink, className = '' }: SectionTitleProps) {
    return (
        <div className={`flex items-end justify-between border-b-2 border-black pb-2 mb-8 ${className}`}>
            <h2 className="font-serif text-3xl font-black tracking-tight text-black uppercase">
                {title}
            </h2>

            {viewAllLink && (
                <Link
                    href={viewAllLink}
                    className="text-umbrella-red font-bold text-[10px] sm:text-xs uppercase tracking-widest hover:text-red-700 transition-colors"
                >
                    Ver todo
                </Link>
            )}
        </div>
    );
}
