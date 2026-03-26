import Image from 'next/image';
import Link from 'next/link';
import { Badge, ArticleMetadata } from '@/components/ui';

export interface SidebarNewsItemProps {
    title: string;
    category: string;
    author: string;
    slug: string;
    imageUrl?: string;
}

interface SidebarNewsProps {
    items: SidebarNewsItemProps[];
}

export function SidebarNews({ items }: SidebarNewsProps) {
    return (
        <div className="flex flex-col flex-1 border-gray-100 pl-4 h-full">
            {items.map((item, index) => (
                <Link
                    key={item.slug}
                    href={`/noticia/${item.slug}`}
                    className={`group flex items-start gap-4 py-6 ${index > 0 ? 'border-t border-gray-100' : 'pt-0'}`}
                >
                    <div className="flex-1">
                        <Badge className="mb-2 block">{item.category}</Badge>
                        <h4 className="font-serif text-lg font-bold leading-tight group-hover:text-umbrella-red transition-colors mb-3">
                            {item.title}
                        </h4>
                        <ArticleMetadata author={item.author} />
                    </div>

                    {item.imageUrl && (
                        <div className="relative w-20 h-20 sm:w-24 sm:h-24 shrink-0 rounded overflow-hidden mt-1">
                            <Image
                                src={item.imageUrl}
                                alt={item.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                        </div>
                    )}
                </Link>
            ))}
        </div>
    );
}
