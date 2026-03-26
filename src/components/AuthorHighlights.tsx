import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui";

interface HighlightArticle {
    title: string;
    category: string;
    imageUrl: string;
    slug: string;
}

interface AuthorHighlightsProps {
    articles?: HighlightArticle[];
}

const defaultArticles: HighlightArticle[] = [
    {
        title: "Deepfakes y desinformación: el desafío electoral que nadie esperaba",
        category: "EXCLUSIVO",
        imageUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=800&auto=format&fit=crop",
        slug: "deepfakes-desinformacion-desafio-electoral",
    },
    {
        title: "El derecho al olvido digital: ¿libertad o censura?",
        category: "OPINIÓN",
        imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop",
        slug: "derecho-olvido-digital-libertad-censura",
    },
];

export function AuthorHighlights({ articles = defaultArticles }: AuthorHighlightsProps) {
    return (
        <section>
            <h3 className="font-serif text-xl font-black text-black italic mb-5 border-b-2 border-black pb-2">
                Destacados
            </h3>

            <div className="flex flex-col gap-6">
                {articles.map((article) => (
                    <Link
                        key={article.slug}
                        href={`/noticia/${article.slug}`}
                        className="group flex flex-col gap-3"
                    >
                        <div className="relative aspect-[4/3] w-full overflow-hidden rounded">
                            <Image
                                src={article.imageUrl}
                                alt={article.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                        </div>
                        <div>
                            <Badge className="mb-1 block">{article.category}</Badge>
                            <h4 className="font-serif text-sm font-bold leading-snug group-hover:text-umbrella-red transition-colors line-clamp-3">
                                {article.title}
                            </h4>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
