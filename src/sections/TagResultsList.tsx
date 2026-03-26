import Image from "next/image";
import Link from "next/link";
import { Badge, ArticleMetadata } from "@/components/ui";

interface TagResultItem {
    title: string;
    category: string;
    author: string;
    date: string;
    imageUrl: string;
    slug: string;
}

interface TagResultsListProps {
    items?: TagResultItem[];
}

const defaultItems: TagResultItem[] = [
    {
        title: "Aumentan los casos registrados en el primer trimestre del año tras nuevas medidas",
        category: "NACIONAL",
        author: "Redacción Umbrella",
        date: "24 de Mayo, 2024",
        imageUrl: "https://images.unsplash.com/photo-1504711434969-e33886168d9c?q=80&w=800&auto=format&fit=crop",
        slug: "aumentan-casos-primer-trimestre",
    },
    {
        title: "Expertos analizan las causas sociales detrás del incremento de la violencia de género",
        category: "OPINIÓN",
        author: "Juan Pérez",
        date: "23 de Mayo, 2024",
        imageUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=800&auto=format&fit=crop",
        slug: "expertos-analizan-causas-sociales",
    },
    {
        title: "Nueva ley busca agilizar procesos judiciales para proteger a víctimas vulnerables",
        category: "JUSTICIA",
        author: "Redacción Umbrella",
        date: "22 de Mayo, 2024",
        imageUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=800&auto=format&fit=crop",
        slug: "nueva-ley-procesos-judiciales",
    },
    {
        title: "Comunidades organizan vigilias en memoria de las víctimas en todo el país",
        category: "COMUNIDAD",
        author: "Ana Martínez",
        date: "21 de Mayo, 2024",
        imageUrl: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=800&auto=format&fit=crop",
        slug: "comunidades-organizan-vigilias",
    },
];

export function TagResultsList({ items = defaultItems }: TagResultsListProps) {
    return (
        <div className="flex flex-col">
            {items.map((item, idx) => (
                <article
                    key={item.slug}
                    className={`py-6 ${idx !== items.length - 1 ? "border-b border-gray-200" : ""}`}
                >
                    <Link
                        href={`/noticia/${item.slug}`}
                        className="group flex gap-5 sm:gap-6"
                    >
                        {/* Thumbnail */}
                        <div className="relative w-28 h-24 sm:w-40 sm:h-28 flex-shrink-0 overflow-hidden rounded">
                            <Image
                                src={item.imageUrl}
                                alt={item.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                        </div>

                        {/* Content */}
                        <div className="flex flex-col justify-center gap-2 min-w-0">
                            <Badge>{item.category}</Badge>
                            <h3 className="font-serif text-lg sm:text-xl font-bold leading-snug text-black group-hover:text-umbrella-red transition-colors line-clamp-3">
                                {item.title}
                            </h3>
                            <ArticleMetadata
                                author={item.author}
                                timeInfo={item.date}
                            />
                        </div>
                    </Link>
                </article>
            ))}

            {/* Load More Button */}
            <div className="flex justify-center mt-8">
                <button className="border-2 border-gray-900 text-gray-900 text-xs font-bold tracking-widest uppercase px-8 py-3 hover:bg-gray-900 hover:text-white transition-colors">
                    Cargar más resultados
                </button>
            </div>
        </div>
    );
}
