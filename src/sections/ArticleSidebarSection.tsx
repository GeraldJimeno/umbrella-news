import { SidebarRecent, RelatedArticles, AdBanner, RecentNewsItem, RelatedArticleItem } from '@/components';

interface ArticleSidebarSectionProps {
    recentNews: RecentNewsItem[];
    relatedArticles: RelatedArticleItem[];
}

export function ArticleSidebarSection({ recentNews, relatedArticles }: ArticleSidebarSectionProps) {
    return (
        <aside className="sticky top-28 h-fit">
            <SidebarRecent items={recentNews} />

            <div className="my-12">
                <AdBanner orientation="vertical" />
            </div>

            <RelatedArticles articles={relatedArticles} />
        </aside>
    );
}
