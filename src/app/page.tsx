import { Header, Navbar, Footer, Container } from "@/layout";
import { AdBanner } from "@/components";
import { HeroSection, MostReadSection } from "@/sections";
import { client } from "@/lib/sanity/client";
import { urlFor } from "@/lib/sanity/image";

// Utility to format dates
const formatTimeAgo = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const diff = new Date().getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) return "HACE POCO";
    if (hours === 1) return "HACE 1 HORA";
    if (hours < 24) return `HACE ${hours} HORAS`;
    
    const days = Math.floor(hours / 24);
    if (days === 1) return "HACE 1 DÍA";
    if (days < 7) return `HACE ${days} DÍAS`;
    
    return date.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    }).toUpperCase();
};

async function getHomePosts() {
    const query = `*[_type == "post" && status == "published"] | order(publishedAt desc)[0...10] {
        title,
        "subtitle": subtitle,
        "lead": lead,
        "category": categorySlug,
        "author": authorName,
        publishedAt,
        mainImage,
        isFeatured,
        isBreaking,
        "slug": slug.current
    }`;
    return await client.fetch(query);
}

export default async function Home() {
    const posts = await getHomePosts();

    // Map the articles safely
    const mappedPosts = (posts || []).map((post: any) => ({
        title: post.title,
        description: post.lead || post.subtitle || "Sin descripción", // For Hero
        category: post.category?.toUpperCase() || "NOTICIAS",
        author: post.author?.toUpperCase() || "REDACCIÓN UMBRELLA",
        timeAgo: formatTimeAgo(post.publishedAt),
        imageUrl: post.mainImage ? urlFor(post.mainImage).url() : "",
        slug: post.slug,
        isFeatured: !!post.isFeatured,
        isBreaking: !!post.isBreaking
    }));

    // Find main article
    const featuredIndex = mappedPosts.findIndex((p: any) => p.isFeatured);
    const mainPostIndex = featuredIndex !== -1 ? featuredIndex : 0;
    
    const mainPost = mappedPosts[mainPostIndex] || null;
    const remainingPosts = mappedPosts.filter((_: any, i: number) => i !== mainPostIndex);

    // Distribution
    const sidebarPosts = remainingPosts.slice(0, 3);
    const gridPosts = remainingPosts.slice(3, 9); // Used for MostRead

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <Navbar />

            <main className="flex-1 bg-white">
                <Container className="flex gap-8 relative">

                    {/* Left Sticky Vertical Ad */}
                    <aside className="hidden xl:block w-[160px] shrink-0">
                        <AdBanner orientation="vertical" label="PUBLICIDAD VERTICAL" />
                    </aside>

                    {/* Main Content Center */}
                    <div className="flex-1 min-w-0 pb-16">
                        {mainPost ? (
                            <HeroSection
                                mainArticle={mainPost}
                                sidebarArticles={sidebarPosts}
                            />
                        ) : (
                            <div className="py-20 text-center text-gray-500 font-serif italic border border-dashed border-gray-200 mt-8 mb-8">
                                No hay noticias publicadas en este momento.
                            </div>
                        )}

                        <AdBanner orientation="horizontal" label="PUBLICIDAD HORIZONTAL BANNER" />

                        {gridPosts.length > 0 && (
                            <MostReadSection articles={gridPosts} />
                        )}
                    </div>

                    {/* Right Sticky Vertical Ad */}
                    <aside className="hidden 2xl:block w-[160px] shrink-0">
                        <AdBanner orientation="vertical" label="PUBLICIDAD VERTICAL" />
                    </aside>

                </Container>
            </main>

            <Footer />
        </div>
    );
}
