import { Container, Header, Navbar, Footer } from '@/layout';
import { ArticleMainSection, ArticleSidebarSection } from '@/sections';
import { client } from '@/lib/sanity/client';
import { urlFor } from '@/lib/sanity/image';
import { notFound } from 'next/navigation';
import { PortableText } from '@portabletext/react';
import { createClient as createSupabaseClient } from '@/lib/supabase/server';

interface PageProps {
    params: Promise<{ slug: string }>;
}

function timeSince(date: string) {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return "HACE " + Math.floor(interval) + " AÑOS";
    interval = seconds / 2592000;
    if (interval > 1) return "HACE " + Math.floor(interval) + " MESES";
    interval = seconds / 86400;
    if (interval > 1) return "HACE " + Math.floor(interval) + " DÍAS";
    interval = seconds / 3600;
    if (interval > 1) return "HACE " + Math.floor(interval) + " HORAS";
    interval = seconds / 60;
    if (interval > 1) return "HACE " + Math.floor(interval) + " MINUTOS";
    return "RECIENTE";
}

async function getArticleBySlug(slug: string) {
    const query = `*[_type == "post" && slug.current == $slug && status == "published"][0] {
        _id,
        title,
        subtitle,
        lead,
        mainImage,
        content,
        authorName,
        "authorDoc": author->{
            name,
            "slug": slug.current,
            image,
            supabaseUserId
        },
        categorySlug,
        subcategorySlug,
        publishedAt,
        tags
    }`;
    return await client.fetch(query, { slug });
}

async function getSupabaseProfile(userId: string | null, fallbackName: string | null) {
    if (!userId && !fallbackName) return null;
    
    const supabase = await createSupabaseClient();
    
    try {
        if (userId) {
            const { data: authorProfile } = await supabase.from('author_profiles').select('*').eq('user_id', userId).single();
            const { data: profile } = await supabase.from('profiles').select('full_name, avatar_url').eq('id', userId).single();
            
            if (authorProfile || profile) {
                return {
                    name: authorProfile?.public_name || profile?.full_name,
                    avatarUrl: profile?.avatar_url
                };
            }
        }
        
        if (fallbackName && !userId) {
            const { data: authorProfile } = await supabase.from('author_profiles').select('*').eq('public_name', fallbackName).limit(1).maybeSingle();
            if (authorProfile) {
                const { data: profile } = await supabase.from('profiles').select('full_name, avatar_url').eq('id', authorProfile.user_id).single();
                return {
                    name: authorProfile.public_name || profile?.full_name,
                    avatarUrl: profile?.avatar_url
                };
            } else {
                const { data: profile } = await supabase.from('profiles').select('full_name, avatar_url').eq('full_name', fallbackName).limit(1).maybeSingle();
                if (profile) {
                    return {
                        name: profile.full_name,
                        avatarUrl: profile.avatar_url
                    };
                }
            }
        }
    } catch (e) {
        console.error("Supabase profile fetch error:", e);
    }
    
    return null;
}

async function getContextualData(currentSlug: string, category: string | null, subcategory: string | null, tags: string[] | null) {
    // 1. Lo más reciente
    const recentQuery = `*[_type == "post" && status == "published" && slug.current != $slug] | order(publishedAt desc)[0...4] {
        _id,
        title,
        categorySlug,
        "slug": slug.current,
        mainImage
    }`;
    const recentRaw = await client.fetch(recentQuery, { slug: currentSlug });

    // 2. Relacionados
    const relatedQuery = `*[_type == "post" && status == "published" && slug.current != $slug] | order(publishedAt desc)[0...30] {
        _id,
        title,
        categorySlug,
        subcategorySlug,
        "slug": slug.current,
        publishedAt,
        tags
    }`;
    const allCandidates = await client.fetch(relatedQuery, { slug: currentSlug });
    
    let relatedList: any[] = [];
    
    if (subcategory) {
        const sameSub = allCandidates.filter((p: any) => p.subcategorySlug === subcategory);
        relatedList.push(...sameSub);
    }
    
    if (category) {
        const sameCat = allCandidates.filter((p: any) => p.categorySlug === category && !relatedList.some(r => r._id === p._id));
        relatedList.push(...sameCat);
    }

    if (tags && tags.length > 0) {
        const sameTags = allCandidates.filter((p: any) => {
            if (!p.tags || p.tags.length === 0) return false;
            const hasCommonTag = p.tags.some((t: string) => tags.includes(t));
            return hasCommonTag && !relatedList.some(r => r._id === p._id);
        });
        relatedList.push(...sameTags);
    }
    
    const recentNews = recentRaw.map((r: any) => ({
        id: r._id,
        title: r.title,
        category: r.categorySlug?.toUpperCase() || "NOTICIAS",
        slug: r.slug,
        imageUrl: r.mainImage ? urlFor(r.mainImage).url() : ""
    }));

    const relatedArticles = relatedList.slice(0, 3).map((r: any) => ({
        id: r._id,
        title: r.title,
        slug: r.slug,
        timeAgo: r.publishedAt ? timeSince(r.publishedAt) : "Hace poco"
    }));

    return { recentNews, relatedArticles };
}

function calculateReadTime(content: any[]): string {
    if (!content) return "1 MIN DE LECTURA";
    const text = content
        .map(block => (block.children ? block.children.map((c: any) => c.text).join(' ') : ''))
        .join(' ');
    const words = text.split(/\s+/).length;
    const minutes = Math.ceil(words / 200);
    return `${minutes} MIN DE LECTURA`;
}

export default async function ArticlePage({ params }: PageProps) {
    const { slug } = await params;
    const post = await getArticleBySlug(slug);

    if (!post) {
        return notFound();
    }

    const context = await getContextualData(slug, post.categorySlug, post.subcategorySlug, post.tags);

    const fallbackName = post.authorDoc?.name || post.authorName;
    const authProfile = await getSupabaseProfile(post.authorDoc?.supabaseUserId || null, fallbackName || null);

    const mappedArticle = {
        title: post.title,
        subtitle: post.subtitle || "",
        category: post.categorySlug?.toUpperCase() || "GENERAL",
        author: {
            name: authProfile?.name || fallbackName || "Redacción Umbrella",
            slug: post.authorDoc?.slug, // Always prefer Sanity slug for URL linking
            avatarUrl: authProfile?.avatarUrl || (post.authorDoc?.image ? urlFor(post.authorDoc.image).url() : undefined)
        },
        date: post.publishedAt 
            ? new Date(post.publishedAt).toLocaleDateString('es-ES', { 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
            }).toUpperCase()
            : "RECIENTE",
        readTime: calculateReadTime(post.content),
        imageUrl: post.mainImage ? urlFor(post.mainImage).url() : "",
        imageCaption: post.lead || post.subtitle || "",
        content: (
            <div className="portable-text-content">
                {post.lead && (
                    <div className="bg-gray-50 border-l-4 border-black p-4 mb-8 italic text-lg text-gray-700">
                        {post.lead}
                    </div>
                )}
                <PortableText value={post.content} />
            </div>
        ),
        tags: post.tags || []
    };

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Header />
            <Navbar />

            <main className="flex-1 py-8 md:py-12">
                <Container>
                    <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-x-12 xl:gap-x-16 gap-y-16 lg:gap-y-0">
                        <ArticleMainSection 
                            article={mappedArticle} 
                            sanityPostId={post._id}
                        />
                        <ArticleSidebarSection
                            recentNews={context.recentNews}
                            relatedArticles={context.relatedArticles}
                        />
                    </div>
                </Container>
            </main>

            <Footer />
        </div>
    );
}
