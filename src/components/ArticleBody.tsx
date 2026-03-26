import { ReactNode } from 'react';

interface ArticleBodyProps {
    children: ReactNode;
}

export function ArticleBody({ children }: ArticleBodyProps) {
    return (
        <div className="prose prose-lg max-w-none prose-p:font-sans prose-p:text-lg prose-p:leading-relaxed prose-p:text-gray-800 prose-headings:font-serif prose-headings:font-bold prose-headings:text-black">
            {children}
        </div>
    );
}
