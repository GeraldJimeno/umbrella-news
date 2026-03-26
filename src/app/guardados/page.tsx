import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Header, Navbar, Footer, Container } from "@/layout";
import { Bookmark, ArrowLeft } from "lucide-react";
import { client as sanityClient } from "@/lib/sanity/client";
import { urlFor } from "@/lib/sanity/image";
import SavedArticlesClient, { SavedArticle } from "./SavedArticlesClient";
import Link from "next/link";

export default async function GuardadosPage() {
    const supabase = await createClient();
    
    // Auth check on server
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        redirect("/login");
    }

    // Get saved articles from Supabase
    const { data: savedData } = await supabase
        .from("saved_articles")
        .select("id, sanity_post_id, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

    let merged: SavedArticle[] = [];

    if (savedData && savedData.length > 0) {
        // Fetch article metadata from Sanity
        const postIds = savedData.map(s => s.sanity_post_id);
        const query = `*[_type == "post" && _id in $ids] {
            _id,
            title,
            "slug": slug.current,
            mainImage,
            categorySlug,
            publishedAt
        }`;
        
        try {
            const articles = await sanityClient.fetch(query, { ids: postIds.slice(0, 50) });
            const articlesMap: Record<string, any> = {};
            if (articles) {
                articles.forEach((a: any) => { articlesMap[a._id] = a; });
            }

            merged = savedData.map(s => ({
                ...s,
                title: articlesMap[s.sanity_post_id]?.title || "Artículo sin título",
                slug: articlesMap[s.sanity_post_id]?.slug,
                imageUrl: articlesMap[s.sanity_post_id]?.mainImage 
                    ? urlFor(articlesMap[s.sanity_post_id].mainImage).width(320).height(240).url() 
                    : null,
                category: articlesMap[s.sanity_post_id]?.categorySlug,
                publishedAt: articlesMap[s.sanity_post_id]?.publishedAt,
            }));
        } catch (err) {
            console.error("Error fetching Sanity metadata in GuardadosPage:", err);
            merged = (savedData as any[]).map(s => ({ ...s, title: "Error al cargar información" }));
        }
    }

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Header />
            <Navbar />

            <main className="flex-1 py-8 md:py-12">
                <Container>
                    <div className="max-w-3xl mx-auto">
                        {/* Header Section */}
                        <div className="flex items-center gap-3 mb-2">
                            <Link href="/" className="text-gray-400 hover:text-black transition-colors">
                                <ArrowLeft className="w-5 h-5" />
                            </Link>
                            <Bookmark className="w-6 h-6 text-umbrella-red" />
                            <h1 className="font-serif text-3xl font-black text-black">
                                Guardados
                            </h1>
                        </div>
                        <p className="text-gray-500 text-sm mb-10 ml-14">
                            {merged.length} {merged.length === 1 ? "artículo guardado" : "artículos guardados"}
                        </p>

                        <SavedArticlesClient initialSaved={merged} />
                    </div>
                </Container>
            </main>

            <Footer />
        </div>
    );
}
