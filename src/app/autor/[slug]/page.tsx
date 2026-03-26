import Image from "next/image";
import { Header, Navbar, Footer, Container } from "@/layout";
import { AuthorBio } from "@/sections/AuthorBio";
import { AuthorArticlesList } from "@/sections/AuthorArticlesList";
import { AuthorHighlights } from "@/components/AuthorHighlights";
import { client } from "@/lib/sanity/client";
import { urlFor } from "@/lib/sanity/image";
import { createClient as createSupabaseClient } from '@/lib/supabase/server';

const tabs = [
    { name: "Sobre el Autor", active: true },
    { name: "Artículos", active: false },
    { name: "Destacados", active: false },
    { name: "Contacto", active: false },
];

async function getSupabaseProfile(userId: string | null, fallbackName: string | null) {
    if (!userId && !fallbackName) return null;
    
    const supabase = await createSupabaseClient();
    
    try {
        if (userId) {
            const { data: authorProfile } = await supabase.from('author_profiles').select('*').eq('user_id', userId).single();
            const { data: profile } = await supabase.from('profiles').select('full_name, avatar_url, role').eq('id', userId).single();
            
            if (authorProfile || profile) {
                return {
                    name: authorProfile?.public_name || profile?.full_name,
                    avatarUrl: profile?.avatar_url,
                    role: profile?.role,
                    bio: authorProfile?.bio,
                    trajectory: authorProfile?.trajectory,
                    mainTopics: authorProfile?.main_topics ? authorProfile.main_topics.split(',').map((t: string) => t.trim()) : [],
                    recognitions: authorProfile?.recognitions ? authorProfile.recognitions.split(';').map((r: string) => r.trim()) : [],
                };
            }
        }
        
        if (fallbackName && !userId) {
            const { data: authorProfile } = await supabase.from('author_profiles').select('*').eq('public_name', fallbackName).limit(1).maybeSingle();
            if (authorProfile) {
                const { data: profile } = await supabase.from('profiles').select('full_name, avatar_url, role').eq('id', authorProfile.user_id).single();
                return {
                    name: authorProfile.public_name || profile?.full_name,
                    avatarUrl: profile?.avatar_url,
                    role: profile?.role,
                    bio: authorProfile?.bio,
                    trajectory: authorProfile?.trajectory,
                    mainTopics: authorProfile?.main_topics ? authorProfile.main_topics.split(',').map((t: string) => t.trim()) : [],
                    recognitions: authorProfile?.recognitions ? authorProfile.recognitions.split(';').map((r: string) => r.trim()) : [],
                };
            } else {
                const { data: profile } = await supabase.from('profiles').select('full_name, avatar_url, role').eq('full_name', fallbackName).limit(1).maybeSingle();
                if (profile) {
                    return {
                        name: profile.full_name,
                        avatarUrl: profile.avatar_url,
                        role: profile.role,
                        bio: null,
                        trajectory: null,
                        mainTopics: [],
                        recognitions: []
                    };
                }
            }
        }
    } catch (e) {
        console.error("Supabase profile fetch error:", e);
    }
    
    return null;
}

export default async function AuthorPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    const authorQuery = `*[_type == "author" && slug.current == $slug][0] {
        name,
        bio,
        role,
        image,
        supabaseUserId
    }`;
    const authorDoc = await client.fetch(authorQuery, { slug });

    const reconstructedName = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    const fallbackName = authorDoc?.name || reconstructedName;

    const authProfile = await getSupabaseProfile(authorDoc?.supabaseUserId || null, fallbackName);

    // Prefer Supabase Auth Profile over Sanity Author Doc over Fallback reconstructed string
    const author = {
        name: authProfile?.name || fallbackName,
        bio: authProfile?.bio || authorDoc?.bio || "Información biográfica no disponible por el momento.",
        avatarUrl: authProfile?.avatarUrl || (authorDoc?.image ? urlFor(authorDoc.image).url() : undefined),
        role: authProfile?.role === "author" ? "Autor / Redactor" : (authProfile?.role || authorDoc?.role || "Redacción"),
        trajectory: authProfile?.trajectory || undefined,
        mainTopics: authProfile?.mainTopics || [],
        recognitions: authProfile?.recognitions || [],
    };

    const postsQuery = `*[_type == "post" && status == "published" && (author->slug.current == $slug || authorName match $reconstructedName)] | order(publishedAt desc)[0...10] {
        title,
        subtitle,
        lead,
        "category": categorySlug,
        publishedAt,
        mainImage,
        "slug": slug.current
    }`;
    const postsData = await client.fetch(postsQuery, { slug, reconstructedName });

    const mappedArticles = postsData.map((post: any) => ({
        title: post.title,
        excerpt: post.lead || post.subtitle || "",
        category: post.category?.toUpperCase() || "NOTICIAS",
        date: post.publishedAt 
            ? new Date(post.publishedAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase()
            : "RECIENTE",
        imageUrl: post.mainImage ? urlFor(post.mainImage).url() : "",
        slug: post.slug
    }));

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <Header />
            <Navbar />

            <main className="flex-grow pb-16">
                {/* Author Header */}
                <div className="bg-white border-b border-gray-100">
                    <Container className="py-12 flex flex-col items-center text-center">
                        {/* Avatar */}
                        {author.avatarUrl ? (
                            <div className="relative w-28 h-28 rounded-full overflow-hidden mb-6 ring-4 ring-gray-100">
                                <Image
                                    src={author.avatarUrl}
                                    alt={author.name}
                                    fill
                                    priority
                                    className="object-cover"
                                />
                            </div>
                        ) : (
                            <div className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center text-4xl font-bold text-gray-400 mb-6 ring-4 ring-gray-100">
                                {author.name.charAt(0)}
                            </div>
                        )}

                        {/* Name */}
                        <h1 className="font-serif text-4xl md:text-5xl font-black text-black mb-4">
                            {author.name}
                        </h1>
                        
                        {/* Role */}
                        <p className="text-umbrella-red text-xs font-bold tracking-widest uppercase mb-4">
                            {author.role}
                        </p>

                        {/* Bio */}
                        <p className="text-gray-500 text-sm md:text-base leading-relaxed max-w-xl">
                            {author.bio}
                        </p>

                        {/* Tabs */}
                        <nav className="flex items-center gap-6 md:gap-8 mt-8">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.name}
                                    className={`text-xs font-bold tracking-widest uppercase pb-2 border-b-2 transition-colors
                                    ${tab.active
                                            ? "text-black border-black"
                                            : "text-gray-400 border-transparent hover:text-black hover:border-gray-300"
                                        }`}
                                >
                                    {tab.name}
                                </button>
                            ))}
                        </nav>
                    </Container>
                </div>

                {/* Two-Column Layout */}
                <Container className="mt-8 md:mt-12">
                    <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8 md:gap-12">
                        {/* Left Column: Main content */}
                        <div className="flex flex-col gap-12">
                            <AuthorBio 
                                trajectory={author.trajectory || (author.bio !== "Información biográfica no disponible por el momento." ? author.bio : undefined)}
                                mainTopics={author.mainTopics}
                                recognitions={author.recognitions}
                            />
                            {author.bio !== "Información biográfica no disponible por el momento." && (
                                <hr className="border-gray-200" />
                            )}
                            <AuthorArticlesList articles={mappedArticles} />
                        </div>

                        {/* Right Column: Highlights & Contact */}
                        <aside className="hidden lg:flex flex-col gap-10">
                            {mappedArticles.length > 0 && (
                                <AuthorHighlights articles={mappedArticles.slice(0, 2)} />
                            )}
                        </aside>
                    </div>
                </Container>
            </main>

            <Footer />
        </div>
    );
}
