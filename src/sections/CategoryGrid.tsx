import { ArticleCard } from "@/components/ArticleCard";

interface CategoryGridArticle {
    title: string;
    category: string;
    author: string;
    imageUrl: string;
    slug: string;
    lead?: string;
    publishedAt?: string;
}

interface CategoryGridProps {
    articles?: CategoryGridArticle[];
}

export function CategoryGrid({ articles = [] }: CategoryGridProps) {
    return (
        <section>
            <h3 className="text-xs font-bold tracking-widest uppercase mb-6 border-b border-gray-200 pb-2">
                Últimas Noticias
            </h3>
            {articles && articles.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
                    {articles.map((article) => (
                        <ArticleCard key={article.slug} {...article} />
                    ))}
                </div>
            ) : (
                <div className="py-12 px-6 bg-white border border-dashed border-gray-200 rounded-sm text-center">
                    <p className="text-sm font-serif italic text-gray-400">
                        Próximamente más noticias en esta sección.
                    </p>
                </div>
            )}
        </section>
    );
}
