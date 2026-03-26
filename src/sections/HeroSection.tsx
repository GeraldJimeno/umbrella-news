import Image from 'next/image';
import Link from 'next/link';
import { SidebarNews } from '@/components';
import { Badge, ArticleMetadata } from '@/components/ui';

interface HeroSectionProps {
    mainArticle: {
        title: string;
        description: string;
        author: string;
        timeAgo: string;
        imageUrl: string;
        slug: string;
        isBreaking?: boolean;
    };
    sidebarArticles: Array<{
        title: string;
        category: string;
        author: string;
        slug: string;
        imageUrl?: string;
    }>;
}

export function HeroSection({ mainArticle, sidebarArticles }: HeroSectionProps) {
    return (
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 my-8 md:my-12">
            {/* Main Hero Article */}
            <div className="lg:col-span-8 group">
                <Link href={`/noticia/${mainArticle.slug}`}>
                    <div className="relative aspect-[16/9] w-full overflow-hidden rounded-md mb-6">
                        <Image
                            src={mainArticle.imageUrl}
                            alt={mainArticle.title}
                            fill
                            className="object-cover group-hover:scale-[1.02] transition-transform duration-700"
                            priority
                        />
                        {mainArticle.isBreaking && (
                            <div className="absolute top-4 left-4">
                                <Badge variant="solid">Último Minuto</Badge>
                            </div>
                        )}
                    </div>

                    <h2 className="font-serif text-3xl md:text-5xl lg:text-5xl font-black leading-[1.1] mb-4 text-black group-hover:text-umbrella-red transition-colors">
                        {mainArticle.title}
                    </h2>

                    <p className="font-sans text-gray-600 text-base md:text-lg mb-6 leading-relaxed">
                        {mainArticle.description}
                    </p>

                    <ArticleMetadata
                        author={mainArticle.author}
                        timeInfo={mainArticle.timeAgo}
                    />
                </Link>
            </div>

            {/* Sidebar News */}
            <div className="lg:col-span-4 lg:border-l border-gray-100 lg:pl-4">
                <SidebarNews items={sidebarArticles} />
            </div>
        </section>
    );
}
