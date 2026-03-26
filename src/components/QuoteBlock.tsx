import { ReactNode } from 'react';

interface QuoteBlockProps {
    children: ReactNode;
}

export function QuoteBlock({ children }: QuoteBlockProps) {
    return (
        <blockquote className="my-8 pl-6 border-l-4 border-umbrella-red italic font-serif text-xl sm:text-2xl text-gray-700 leading-relaxed bg-gray-50 py-4 pr-6">
            {children}
        </blockquote>
    );
}
