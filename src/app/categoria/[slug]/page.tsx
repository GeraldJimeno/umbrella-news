import { Header, Navbar, Footer, Container } from "@/layout";
import { CategoryHeader } from "@/components/CategoryHeader";
import { CategoryGrid } from "@/sections/CategoryGrid";
import { createClient } from "@/lib/supabase/server";
import { client } from "@/lib/sanity/client";
import { urlFor } from "@/lib/sanity/image";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

interface PageProps {
    params: Promise<{ slug: string }>;
}

async function getCategoryNews(categorySlug: string) {
    const query = `*[_type == "post" && categorySlug == $categorySlug && status == "published"] | order(publishedAt desc) {
        title,
        subtitle,
        lead,
        "category": categorySlug,
        "author": authorName,
        mainImage,
        "slug": slug.current,
        publishedAt
    }`;
    return await client.fetch(query, { categorySlug });
}

function timeSince(date: string) {
    if(!date) return "HACE POCO";
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    let interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " DÍAS";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " HORAS";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " MINUTOS";
    return "RECIENTE";
}

export default async function CategoryPage({ params }: PageProps) {
    const { slug } = await params;
    const supabase = await createClient();

    // 1. Fetch real category from Supabase
    const { data: category, error: catError } = await supabase
        .from("categories")
        .select("*")
        .eq("slug", slug)
        .single();

    if (catError || !category) {
        return notFound();
    }

    // 2. Fetch real subcategories for this category from Supabase
    const { data: subcategories, error: subError } = await supabase
        .from("subcategories")
        .select("*")
        .eq("category_id", category.id)
        .order("name");

    // 3. Fetch real news from Sanity for this category
    const newsFromSanity = await getCategoryNews(slug);

    // Map news
    const mappedArticles = (newsFromSanity || []).map((article: any) => ({
        title: article.title,
        category: article.category?.toUpperCase() || category.name.toUpperCase(),
        author: article.author || "Redacción Umbrella",
        imageUrl: article.mainImage ? urlFor(article.mainImage).url() : "",
        slug: article.slug,
        lead: article.lead || article.subtitle || "",
        publishedAt: article.publishedAt
    }));

    // Map subcategories for the header
    const mappedSubcategories = (subcategories || []).map(sub => ({
        name: sub.name,
        href: `/categoria/${slug}/${sub.slug}`
    }));

    // Slicing for editorial layout
    const leadStory = mappedArticles[0];
    const secondaryStory = mappedArticles[1];
    const stackedStories = mappedArticles.slice(2, 5);
    const gridStories = mappedArticles.slice(5);

    return (
        <div className="min-h-screen bg-white flex flex-col font-sans">
            <Header />
            <Navbar />
            
            <main className="flex-grow pb-16">
                <CategoryHeader 
                    title={category.name} 
                    subcategories={mappedSubcategories}
                />
                
                <Container className="mt-8 md:mt-10">
                    <div className="flex flex-col mb-16">
                        {/* NO NEWS EMPTY STATE */}
                        {mappedArticles.length === 0 && (
                            <div className="py-24 px-6 bg-white border border-dashed border-gray-200 rounded-sm text-center flex flex-col items-center justify-center">
                                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                    <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H15" />
                                    </svg>
                                </div>
                                <h2 className="text-xl font-serif font-bold text-gray-900 mb-2">Editoriales en proceso</h2>
                                <p className="text-sm text-gray-500 max-w-md mx-auto leading-relaxed">
                                    Nuestro equipo editorial está trabajando para traerte la mejor información sobre {category.name.toLowerCase()}.
                                </p>
                            </div>
                        )}

                        {/* EDITORIAL TOP BLOCK */}
                        {(leadStory || secondaryStory || stackedStories.length > 0) && (
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12 border-b border-gray-200 pb-12 mb-12">
                                {/* Left Column: Lead Story */}
                                {leadStory && (
                                    <div className={`flex flex-col group h-full ${secondaryStory || stackedStories.length > 0 ? 'lg:col-span-8' : 'lg:col-span-12'}`}>
                                        <Link href={`/noticia/${leadStory.slug}`} className="block relative aspect-[16/10] w-full mb-6 overflow-hidden bg-gray-50 border border-gray-100/50">
                                            {leadStory.imageUrl && (
                                                <Image src={leadStory.imageUrl} alt={leadStory.title} fill className="object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out" />
                                            )}
                                        </Link>
                                        <Link href={`/noticia/${leadStory.slug}`}>
                                            <h2 className="font-serif text-3xl md:text-5xl xl:text-[56px] font-black leading-[1.1] mb-5 group-hover:text-umbrella-red transition-colors text-gray-900 drop-shadow-sm tracking-tight">{leadStory.title}</h2>
                                            <p className="text-gray-700 md:text-xl xl:text-[22px] mb-6 line-clamp-3 leading-relaxed font-serif">{leadStory.lead}</p>
                                        </Link>
                                        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-auto">
                                            {timeSince(leadStory.publishedAt)} • POR <span className="text-gray-600">{leadStory.author}</span>
                                        </div>
                                    </div>
                                )}

                                {/* Right Column: Secondary & Stacked Stories */}
                                {(secondaryStory || stackedStories.length > 0) && (
                                    <div className="lg:col-span-4 flex flex-col border-t pt-8 lg:border-t-0 lg:pt-0 lg:border-l lg:pl-8 xl:pl-10 border-gray-200">
                                        {/* Secondary Story */}
                                        {secondaryStory && (
                                            <div className={`flex flex-col group ${stackedStories.length > 0 ? 'border-b border-gray-200 pb-8 mb-8' : ''}`}>
                                                <Link href={`/noticia/${secondaryStory.slug}`} className="block relative aspect-[4/3] w-full mb-5 overflow-hidden bg-gray-50 border border-gray-100/50">
                                                    {secondaryStory.imageUrl && (
                                                        <Image src={secondaryStory.imageUrl} alt={secondaryStory.title} fill className="object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out" />
                                                    )}
                                                </Link>
                                                <Link href={`/noticia/${secondaryStory.slug}`}>
                                                    <h3 className="font-serif text-2xl xl:text-[28px] font-bold leading-[1.15] mb-3 group-hover:text-umbrella-red transition-colors text-gray-900 tracking-tight">{secondaryStory.title}</h3>
                                                    <p className="text-gray-600 text-sm xl:text-base mb-5 line-clamp-3 leading-relaxed">{secondaryStory.lead}</p>
                                                </Link>
                                                <div className="text-[10px] xl:text-xs font-bold text-gray-400 uppercase tracking-widest mt-auto">
                                                    {timeSince(secondaryStory.publishedAt)} • POR <span className="text-gray-600">{secondaryStory.author}</span>
                                                </div>
                                            </div>
                                        )}

                                        {/* Stacked Stories */}
                                        {stackedStories.length > 0 && (
                                            <div className="flex flex-col justify-between h-full">
                                                <h4 className="text-[11px] font-black tracking-widest uppercase text-umbrella-red mb-5 flex items-center gap-2">
                                                    <span className="w-2 h-2 rounded-full bg-umbrella-red"></span> En Foco
                                                </h4>
                                                <div className="flex flex-col gap-6">
                                                    {stackedStories.map((story: any, idx: number) => (
                                                        <div key={story.slug} className={`group flex flex-col ${idx !== stackedStories.length - 1 ? 'border-b border-gray-100 pb-6' : ''}`}>
                                                            <Link href={`/noticia/${story.slug}`}>
                                                                <h4 className="font-serif text-[19px] xl:text-[22px] font-bold leading-snug mb-2 group-hover:text-umbrella-red transition-colors text-gray-900 tracking-tight">{story.title}</h4>
                                                                <p className="text-gray-500 text-sm line-clamp-2 mb-3">{story.lead}</p>
                                                            </Link>
                                                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-auto">
                                                                {timeSince(story.publishedAt)} • POR <span className="text-gray-500">{story.author}</span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* BOTTOM LAYER */}
                        {gridStories.length > 0 && (
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12 mt-4">
                                {/* Horizontal News List */}
                                <div className={`lg:col-span-${gridStories.length > 4 ? '8' : '12'}`}>
                                    <h4 className="text-[11px] font-bold tracking-widest uppercase mb-8 border-b-2 border-black pb-3 w-full text-gray-900 flex items-center gap-2">
                                        <span className="w-[18px] h-[18px] bg-black text-white flex items-center justify-center rounded-sm leading-none text-[10px] pb-0.5">+</span> Más Noticias
                                    </h4>
                                    <div className="flex flex-col gap-8">
                                        {gridStories.slice(0, 5).map((story: any) => (
                                            <div key={story.slug} className="group flex flex-col sm:flex-row gap-6 border-b border-gray-100 pb-8 last:border-0 last:pb-0">
                                                {story.imageUrl && (
                                                    <Link href={`/noticia/${story.slug}`} className="block relative w-full sm:w-[280px] aspect-[4/3] sm:aspect-[3/2] shrink-0 overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0">
                                                        <Image src={story.imageUrl} alt={story.title} fill className="object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out" />
                                                    </Link>
                                                )}
                                                <div className="flex flex-col flex-grow justify-center py-1">
                                                    <Link href={`/noticia/${story.slug}`}>
                                                        <h3 className="font-serif text-2xl xl:text-[26px] font-bold leading-[1.15] mb-3 group-hover:text-umbrella-red transition-colors text-gray-900 tracking-tight">{story.title}</h3>
                                                        <p className="text-gray-600 text-[15px] mb-4 line-clamp-3 leading-relaxed">{story.lead}</p>
                                                    </Link>
                                                    <div className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest mt-auto">
                                                        {timeSince(story.publishedAt)} • POR <span className="text-gray-500">{story.author}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                
                                {/* Right Rail Archive */}
                                {gridStories.length > 5 && (
                                    <div className="lg:col-span-4 flex flex-col h-full border-t pt-8 lg:border-t-0 lg:pt-0 lg:border-l lg:pl-10 border-gray-200">
                                        <div className="sticky top-24">
                                            <h4 className="text-[11px] font-bold tracking-widest uppercase mb-6 text-gray-400 flex items-center before:flex-grow before:h-[1px] before:bg-gray-200 before:mr-3 after:flex-grow after:h-[1px] after:bg-gray-200 after:ml-3">
                                                Archivo de {category.name}
                                            </h4>
                                            <div className="flex flex-col gap-5">
                                                {gridStories.slice(5).map((story: any, idx: number) => (
                                                    <div key={story.slug} className="group flex flex-col relative pl-4 border-l-2 border-transparent hover:border-umbrella-red transition-colors pb-1">
                                                        <span className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-gray-200 group-hover:bg-umbrella-red transition-colors"></span>
                                                        <Link href={`/noticia/${story.slug}`}>
                                                            <h5 className="font-serif text-lg font-bold leading-snug mb-1 group-hover:text-umbrella-red transition-colors text-gray-800 tracking-tight">{story.title}</h5>
                                                        </Link>
                                                        <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                                                            {timeSince(story.publishedAt)}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </Container>
            </main>

            <Footer />
        </div>
    );
}
