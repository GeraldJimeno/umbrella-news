import Link from "next/link";
import { Header, Navbar, Footer, Container } from "@/layout";
import { TagResultsList } from "@/sections/TagResultsList";
import { AdBanner } from "@/components/AdBanner";
import { SidebarRecent } from "@/components/SidebarRecent";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { client } from "@/lib/sanity/client";
import { urlFor } from "@/lib/sanity/image";

function timeSince(date: string) {
    if (!date) return "Reciente";
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return "hace " + Math.floor(interval) + " años";
    interval = seconds / 2592000;
    if (interval > 1) return "hace " + Math.floor(interval) + " meses";
    interval = seconds / 86400;
    if (interval > 1) return "hace " + Math.floor(interval) + " días";
    interval = seconds / 3600;
    if (interval > 1) return "hace " + Math.floor(interval) + " horas";
    interval = seconds / 60;
    if (interval > 1) return "hace " + Math.floor(interval) + " minutos";
    return "Reciente";
}

export default async function TagPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    
    // Format tag name for display
    const tagName = decodeURIComponent(slug).replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    
    const tagQuery = `*[_type == "post" && status == "published" && count((tags[])[@ match $slug]) > 0] | order(publishedAt desc) {
        _id,
        title,
        categorySlug,
        "authorDoc": author->{name},
        authorName,
        publishedAt,
        mainImage,
        "slug": slug.current
    }`;
    
    const rawDocs = await client.fetch(tagQuery, { slug });
    const totalResults = rawDocs.length;
    
    const mappedResults = rawDocs.map((doc: any) => ({
        title: doc.title || "",
        category: doc.categorySlug?.toUpperCase() || "GENERAL",
        author: doc.authorDoc?.name || doc.authorName || "Redacción Umbrella",
        date: doc.publishedAt ? new Date(doc.publishedAt).toLocaleDateString("es-ES", {
            day: "numeric", month: "long", year: "numeric"
        }) : "Reciente",
        imageUrl: doc.mainImage ? urlFor(doc.mainImage).url() : "",
        slug: doc.slug,
    }));

    const recentQuery = `*[_type == "post" && status == "published"] | order(publishedAt desc)[0...3] {
        _id,
        title,
        categorySlug,
        publishedAt,
        mainImage,
        "slug": slug.current
    }`;
    const recentDocs = await client.fetch(recentQuery);
    const mockRecentItems = recentDocs.map((doc: any) => ({
        id: doc._id,
        title: doc.title || "",
        category: doc.categorySlug?.toUpperCase() || "GENERAL",
        slug: doc.slug,
        imageUrl: doc.mainImage ? urlFor(doc.mainImage).url() : "",
        timeAgo: timeSince(doc.publishedAt),
    }));

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <Header />
            <Navbar />

            <main className="flex-grow pb-16">
                <div className="bg-white border-b border-gray-100">
                    <Container className="pt-6 pb-8">
                        <nav className="flex items-center gap-2 text-[11px] font-bold tracking-widest uppercase text-gray-400 mb-6">
                            <Link href="/" className="hover:text-black transition-colors">
                                Inicio
                            </Link>
                            <span className="text-gray-300">›</span>
                            <span className="text-gray-600">Etiquetas</span>
                        </nav>

                        <h1 className="font-serif text-5xl md:text-6xl font-black text-black tracking-tight" style={{ textTransform: "uppercase" }}>
                            {tagName}
                        </h1>

                        <p className="mt-3 text-sm text-gray-500">
                            {totalResults} resultados encontrados para &apos;{tagName}&apos;
                        </p>
                    </Container>
                </div>

                <Container className="mt-8 md:mt-12">
                    <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8 md:gap-12">
                        <div>
                            {mappedResults.length > 0 ? (
                                <TagResultsList items={mappedResults} />
                            ) : (
                                <div className="py-12 text-center text-gray-500 bg-white rounded border border-gray-100">
                                    No se encontraron noticias con esta etiqueta.
                                </div>
                            )}
                        </div>

                        <aside className="hidden lg:flex flex-col gap-10">
                            <AdBanner orientation="vertical" className="h-[280px] rounded sticky-none" />
                            <SidebarRecent items={mockRecentItems} />
                            <NewsletterSignup />
                        </aside>
                    </div>
                </Container>
            </main>

            <Footer />
        </div>
    );
}
