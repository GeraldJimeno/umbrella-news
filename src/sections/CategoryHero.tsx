import Image from "next/image";
import Link from "next/link";
import { Badge, ArticleMetadata } from "@/components/ui";

interface CategoryHeroProps {
    title: string;
    subtitle: string;
    category: string;
    author: string;
    imageUrl: string;
    slug: string;
    publishedAt?: string;
}

export function CategoryHero({
    title,
    subtitle,
    category,
    author,
    imageUrl,
    slug,
    publishedAt,
}: CategoryHeroProps) {
    return (
        <article className="group flex flex-col gap-4">
            {imageUrl && (
                <Link href={`/noticia/${slug}`} className="relative aspect-[16/9] w-full overflow-hidden rounded mb-2">
                    <Image
                        src={imageUrl}
                        alt={title}
                        fill
                        priority
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                </Link>
            )}
            
            <div className="flex flex-col gap-3">
                <Badge>{category}</Badge>
                
                <Link href={`/noticia/${slug}`}>
                    <h2 className="font-serif text-3xl md:text-5xl font-black leading-tight text-black group-hover:text-umbrella-red transition-colors">
                        {title}
                    </h2>
                </Link>
                
                <p className="text-gray-600 text-base md:text-lg leading-relaxed">
                    {subtitle}
                </p>
                
                <ArticleMetadata author={author} timeInfo={publishedAt} className="mt-2" />
            </div>
        </article>
    );
}
