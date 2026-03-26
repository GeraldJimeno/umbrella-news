import { ReactNode } from 'react';

interface ArticleMetadataProps {
    author?: string;
    timeInfo?: string;
    className?: string;
    dark?: boolean;
}

export function ArticleMetadata({
    author,
    timeInfo,
    className = '',
    dark = false
}: ArticleMetadataProps) {
    if (!author && !timeInfo) return null;

    return (
        <div className={`flex items-center text-[10px] sm:text-xs font-bold tracking-widest uppercase ${dark ? 'text-gray-400' : 'text-gray-500'} ${className}`}>
            {author && (
                <span className={dark ? "text-gray-300" : "text-umbrella-red"}>
                    {author.startsWith('POR ') ? author : `POR ${author}`}
                </span>
            )}

            {author && timeInfo && (
                <span className="mx-2 opacity-50">•</span>
            )}

            {timeInfo && (
                <span>{timeInfo}</span>
            )}
        </div>
    );
}
