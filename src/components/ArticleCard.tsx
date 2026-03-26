import Image from 'next/image';
import Link from 'next/link';
import { Badge, ArticleMetadata } from '@/components/ui';

interface ArticleCardProps {
    title: string;
    category: string;
    author: string;
    imageUrl: string;
    slug: string;
    lead?: string;
    publishedAt?: string;
}

export function ArticleCard({ title, category, author, imageUrl, slug, lead, publishedAt }: ArticleCardProps) {
    return (
        <Link href={`/noticia/${slug}`} className="group flex flex-col gap-3">
            {imageUrl && (
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded">
                    <Image
                        src={imageUrl}
                        alt={title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                </div>
            )}
            <div>
                <Badge className="mb-1 block">{category}</Badge>
                <h3 className="font-serif text-lg font-bold leading-snug group-hover:text-umbrella-red transition-colors line-clamp-3">
                    {title}
                </h3>
                {lead && (
                    <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                        {lead}
                    </p>
                )}
                <ArticleMetadata author={author} timeInfo={publishedAt} className="mt-3" />
            </div>
        </Link>
    );
}
