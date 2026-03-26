import Link from 'next/link';
import { ArticleCard } from '@/components';
import { SectionTitle } from '@/components/ui';

interface MostReadSectionProps {
    articles: Array<{
        title: string;
        category: string;
        author: string;
        imageUrl: string;
        slug: string;
    }>;
}

export function MostReadSection({ articles }: MostReadSectionProps) {
    return (
        <section className="my-16 md:my-24">
            {/* Section Header */}
            <SectionTitle title="MÁS LEÍDAS" viewAllLink="/noticias" />

            {/* Articles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                {articles.map((article) => (
                    <ArticleCard
                        key={article.slug}
                        title={article.title}
                        category={article.category}
                        author={article.author}
                        imageUrl={article.imageUrl}
                        slug={article.slug}
                    />
                ))}
            </div>
        </section>
    );
}
