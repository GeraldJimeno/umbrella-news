import Image from 'next/image';
import Link from 'next/link';

interface ArticleMetaProps {
    author: {
        name: string;
        avatarUrl?: string;
        slug?: string;
    };
    date: string;
    readTime: string;
}

export function ArticleMeta({ author, date, readTime }: ArticleMetaProps) {
    const authorSlug = author.slug || author.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-");

    return (
        <div className="flex items-center gap-3">
            {author.avatarUrl ? (
                <Link href={`/autor/${authorSlug}`} className="relative w-10 h-10 rounded-full overflow-hidden border border-gray-200 block flex-shrink-0">
                    <Image src={author.avatarUrl} alt={author.name} fill className="object-cover" />
                </Link>
            ) : (
                <Link href={`/autor/${authorSlug}`} className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-500 flex-shrink-0">
                    {author.name.charAt(0)}
                </Link>
            )}

            <div className="flex flex-col">
                <span className="text-xs sm:text-sm font-bold font-sans uppercase tracking-wider">
                    Por <Link href={`/autor/${authorSlug}`} className="text-black hover:text-red-700 transition-colors">{author.name}</Link>
                </span>
                <div className="flex items-center text-[10px] sm:text-xs text-gray-500 font-bold uppercase tracking-widest mt-0.5">
                    <span>{date}</span>
                    <span className="mx-2 opacity-50">•</span>
                    <span>{readTime}</span>
                </div>
            </div>
        </div>
    );
}
