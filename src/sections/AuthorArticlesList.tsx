import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui";

interface AuthorArticle {
    title: string;
    excerpt: string;
    category: string;
    date: string;
    imageUrl: string;
    slug: string;
}

interface AuthorArticlesListProps {
    articles?: AuthorArticle[];
}

const defaultArticles: AuthorArticle[] = [
    {
        title: "La UE aprueba la ley de inteligencia artificial más ambiciosa del mundo",
        excerpt: "Análisis profundo sobre cómo la nueva regulación europea establece límites al uso de IA en vigilancia, redes sociales y...",
        category: "TECNOLOGÍA",
        date: "15 Marzo, 2026",
        imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=800&auto=format&fit=crop",
        slug: "ue-ley-inteligencia-artificial",
    },
    {
        title: "Privacidad en la era post-cookie: ¿qué cambia para los usuarios?",
        excerpt: "Exploramos las alternativas al rastreo publicitario y su impacto en la experiencia digital de millones de personas...",
        category: "DIGITAL",
        date: "08 Marzo, 2026",
        imageUrl: "https://images.unsplash.com/photo-1563986768609-322da13575f2?q=80&w=800&auto=format&fit=crop",
        slug: "privacidad-era-post-cookie",
    },
    {
        title: "Ciberseguridad en hospitales: la amenaza silenciosa que crece en Latinoamérica",
        excerpt: "Un recorrido por los ataques de ransomware que han paralizado sistemas de salud y las medidas que se están tomando...",
        category: "CIBERSEGURIDAD",
        date: "01 Marzo, 2026",
        imageUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop",
        slug: "ciberseguridad-hospitales-latinoamerica",
    },
];

export function AuthorArticlesList({ articles = defaultArticles }: AuthorArticlesListProps) {
    return (
        <section>
            <h2 className="font-serif text-2xl md:text-3xl font-black text-black italic mb-6">
                Últimos Artículos
            </h2>

            <div className="flex flex-col">
                {articles.map((article, idx) => (
                    <article
                        key={article.slug}
                        className={`py-6 ${idx !== articles.length - 1 ? "border-b border-gray-200" : ""}`}
                    >
                        <Link
                            href={`/noticia/${article.slug}`}
                            className="group flex gap-5 sm:gap-6"
                        >
                            {/* Thumbnail */}
                            <div className="relative w-28 h-24 sm:w-40 sm:h-28 flex-shrink-0 overflow-hidden rounded">
                                <Image
                                    src={article.imageUrl}
                                    alt={article.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>

                            {/* Content */}
                            <div className="flex flex-col justify-center gap-1.5 min-w-0">
                                <Badge>{article.category}</Badge>
                                <h3 className="font-serif text-lg sm:text-xl font-bold leading-snug text-black group-hover:text-umbrella-red transition-colors line-clamp-2">
                                    {article.title}
                                </h3>
                                <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 hidden sm:block">
                                    {article.excerpt}
                                </p>
                                <span className="text-[10px] sm:text-xs font-bold tracking-widest uppercase text-gray-400 mt-1">
                                    {article.date}
                                </span>
                            </div>
                        </Link>
                    </article>
                ))}
            </div>

            {/* Load More Button */}
            <div className="flex justify-center mt-8">
                <button className="border-2 border-gray-900 text-gray-900 text-xs font-bold tracking-widest uppercase px-8 py-3 hover:bg-gray-900 hover:text-white transition-colors">
                    Cargar más artículos
                </button>
            </div>
        </section>
    );
}
