import { Badge } from '@/components/ui';

interface ArticleHeaderProps {
    category: string;
    title: string;
    subtitle?: string;
}

export function ArticleHeader({ category, title, subtitle }: ArticleHeaderProps) {
    return (
        <header className="mb-6">
            <Badge variant="solid" className="mb-4 inline-block">{category}</Badge>
            <h1 className="text-4xl sm:text-5xl font-serif font-bold leading-[1.15] text-black mb-4 tracking-tight">
                {title}
            </h1>
            {subtitle && (
                <p className="text-lg sm:text-xl text-gray-600 font-sans leading-relaxed">
                    {subtitle}
                </p>
            )}
        </header>
    );
}
