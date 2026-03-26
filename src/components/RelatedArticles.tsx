import Link from 'next/link';
import { ArticleMetadata } from '@/components/ui';

export interface RelatedArticleItem {
    id: string;
    title: string;
    slug: string;
    timeAgo: string;
}

interface RelatedArticlesProps {
    articles: RelatedArticleItem[];
}

export function RelatedArticles({ articles }: RelatedArticlesProps) {
    if (!articles || articles.length === 0) return null;

    return (
        <div className="mt-12">
            <h3 className="text-black font-bold text-sm tracking-widest uppercase mb-6 border-b-2 border-black pb-2">
                Relacionados
            </h3>

            <div className="flex flex-col">
                {articles.map((article, index) => (
                    <Link
                        key={article.id}
                        href={`/noticia/${article.slug}`}
                        className={`group py-4 ${index > 0 ? 'border-t border-gray-100' : 'pt-0'}`}
                    >
                        <h4 className="font-serif text-sm font-bold leading-snug group-hover:text-umbrella-red transition-colors mb-2">
                            {article.title}
                        </h4>
                        <ArticleMetadata timeInfo={`Hace ${article.timeAgo}`} className="text-[9px]" />
                    </Link>
                ))}
            </div>
        </div>
    );
}
