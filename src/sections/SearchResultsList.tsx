import Image from "next/image";
import Link from "next/link";
import { ArticleMetadata } from '@/components/ui/ArticleMetadata'; // if available, or just render it

export interface SearchResultItem {
    id: string;
    category: string;
    date: string;
    title: string;
    excerpt: string;
    author: string;
    authorSlug?: string | null;
    slug: string;
    imageUrl: string;
}

interface SearchResultsListProps {
    results: SearchResultItem[];
}

export function SearchResultsList({ results }: SearchResultsListProps) {
    if (!results || results.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center border border-gray-100 rounded-lg bg-white mt-8">
                <h2 className="text-2xl font-bold font-serif text-gray-400 mb-2">Sin resultados</h2>
                <p className="text-gray-500 max-w-md">
                    No encontramos noticias que coincidan con tu búsqueda. Intenta con otros términos o explora nuestras categorías.
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col">
            {/* Results List */}
            <div className="flex flex-col">
                {results.map((result) => (
                    <article key={result.id} className="flex flex-col md:flex-row gap-6 md:gap-10 py-10 border-b border-gray-100 first:pt-0">
                        {/* Text Content */}
                        <div className="flex-1 order-2 md:order-1 flex flex-col justify-center">
                            <div className="flex items-center gap-3 mb-3">
                                <span className="text-[10px] md:text-xs font-bold tracking-widest text-umbrella-red uppercase">
                                    {result.category}
                                </span>
                                <span className="text-[10px] md:text-xs font-bold tracking-widest text-gray-400 uppercase">
                                    • {result.date}
                                </span>
                            </div>
                            
                            <Link href={`/noticia/${result.slug}`} className="group">
                                <h2 className="font-serif text-2xl md:text-[28px] text-gray-900 leading-tight mb-3 group-hover:text-umbrella-red transition-colors">
                                    {result.title}
                                </h2>
                            </Link>
                            
                            <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-4">
                                {result.excerpt}
                            </p>
                            
                            <div className="text-sm mt-auto">
                                <span className="text-gray-500">Por </span>
                                <span className="text-gray-900 font-semibold decoration-umbrella-red decoration-2">
                                    {result.author}
                                </span>
                            </div>
                        </div>

                        {/* Thumbnail Image */}
                        <div className="w-full md:w-[280px] lg:w-[320px] aspect-[16/9] md:aspect-[4/3] relative order-1 md:order-2 shrink-0 bg-gray-100">
                            {result.imageUrl ? (
                                <Link href={`/noticia/${result.slug}`} className="block w-full h-full relative group overflow-hidden">
                                    <Image 
                                        src={result.imageUrl} 
                                        alt={result.title} 
                                        fill 
                                        className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out grayscale hover:grayscale-0" 
                                    />
                                </Link>
                            ) : (
                                <Link href={`/noticia/${result.slug}`} className="block w-full h-full relative group overflow-hidden bg-gray-200 flex items-center justify-center">
                                    <span className="text-gray-400 font-bold tracking-widest text-xs">UMBRELLA NEWS</span>
                                </Link>
                            )}
                        </div>
                    </article>
                ))}
            </div>

            {/* Pagination Mock (No tocarlo como pidió el user) */}
            <div className="flex items-center justify-center gap-2 mt-16 mb-8">
                <button className="w-10 h-10 flex items-center justify-center bg-[#1e293b] text-white text-sm font-semibold rounded-sm">
                    1
                </button>
                <button className="w-10 h-10 flex items-center justify-center bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 text-sm font-semibold rounded-sm transition-colors cursor-not-allowed opacity-50">
                    2
                </button>
                <span className="px-2 text-gray-400">...</span>
                <button className="px-4 h-10 flex items-center justify-center bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-bold tracking-widest uppercase rounded-sm transition-colors cursor-not-allowed opacity-50">
                    Siguiente
                </button>
            </div>
        </div>
    );
}
