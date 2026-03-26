"use client";

import {
    ArticleHeader,
    ArticleMeta,
    ShareButtons,
    ArticleHeroImage,
    ArticleBody,
    QuoteBlock,
    TagList,
    CommentsSection
} from '@/components';

interface ArticleMainSectionProps {
    article: {
        title: string;
        subtitle: string;
        category: string;
        author: {
            name: string;
            avatarUrl?: string;
        };
        date: string;
        readTime: string;
        imageUrl: string;
        imageCaption: string;
        content: React.ReactNode;
        tags: string[];
    };
    sanityPostId: string;
}

export function ArticleMainSection({ article, sanityPostId }: ArticleMainSectionProps) {

    function scrollToComments() {
        const section = document.getElementById('comments-section');
        if (section) {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
            // After scroll, try to focus the textarea for authenticated users
            setTimeout(() => {
                const textarea = section.querySelector('textarea');
                if (textarea) textarea.focus();
            }, 600);
        }
    }

    return (
        <article className="pb-12">
            <ArticleHeader
                category={article.category}
                title={article.title}
                subtitle={article.subtitle}
            />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 border-y border-gray-100 mt-6 mb-8">
                <ArticleMeta
                    author={article.author}
                    date={article.date}
                    readTime={article.readTime}
                />
                <ShareButtons onCommentClick={scrollToComments} sanityPostId={sanityPostId} />
            </div>

            <ArticleHeroImage
                imageUrl={article.imageUrl}
                altText={article.title}
                caption={article.imageCaption}
            />

            <ArticleBody>
                {article.content}
            </ArticleBody>

            <TagList tags={article.tags} />

            {/* Comments Section */}
            <div id="comments-section" className="mt-16 pt-12 border-t border-gray-100">
                <CommentsSection sanityPostId={sanityPostId} />
            </div>
        </article>
    );
}
