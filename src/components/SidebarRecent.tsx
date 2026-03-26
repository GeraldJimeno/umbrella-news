import Image from 'next/image';
import Link from 'next/link';
import { Badge, ArticleMetadata } from '@/components/ui';

export interface RecentNewsItem {
    id: string;
    title: string;
    category: string;
    slug: string;
    imageUrl?: string;
    timeAgo?: string;
}

interface SidebarRecentProps {
    items: RecentNewsItem[];
}

export function SidebarRecent({ items }: SidebarRecentProps) {
    return (
        <div className="mb-12">
            <h3 className="text-black font-bold text-sm tracking-widest uppercase mb-6 border-b-2 border-black pb-2">
                Lo más reciente
            </h3>

            <div className="flex flex-col">
                {items.map((item, index) => (
                    <Link
                        key={item.id}
                        href={`/noticia/${item.slug}`}
                        className={`group flex items-start gap-4 py-4 ${index > 0 ? 'border-t border-gray-100' : 'pt-0'}`}
                    >
                        {item.imageUrl && (
                            <div className="relative w-20 h-20 shrink-0 rounded overflow-hidden">
                                <Image
                                    src={item.imageUrl}
                                    alt={item.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                        )}

                        <div className="flex-1">
                            <Badge className="mb-1 block text-[9px]">{item.category}</Badge>
                            <h4 className="font-serif text-sm font-bold leading-snug group-hover:text-umbrella-red transition-colors mb-2 line-clamp-3">
                                {item.title}
                            </h4>
                            {item.timeAgo && (
                                <ArticleMetadata timeInfo={`Hace ${item.timeAgo}`} className="text-[9px]" />
                            )}
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
