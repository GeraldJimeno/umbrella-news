"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, CheckCircle2, Edit3, MoreVertical, ChevronDown, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { urlFor } from "@/lib/sanity/image";
import { getAuthorDashboardData } from "@/lib/sanity/actions";

interface ArticleMeta {
    _id: string;
    title: string;
    status: string;
    publishedAt: string;
    thumbnail: string;
    isPublished: boolean;
    slug: string;
}

const SANITY_STUDIO_URL = process.env.NEXT_PUBLIC_SANITY_STUDIO_URL || "http://localhost:3334";

export default function AuthorDashboardPage() {
    const [articles, setArticles] = useState<ArticleMeta[]>([]);
    const [loading, setLoading] = useState(true);
    const [userProfile, setUserProfile] = useState<any>(null);
    const [stats, setStats] = useState({ pending: 0 });
    const supabase = createClient();

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return;

                const { data: profile } = await supabase.from("profiles").select("full_name").eq("id", user.id).single();
                setUserProfile({ ...user, full_name: profile?.full_name || user.email?.split('@')[0] });

                // Fetch all dashboard data in one server action call
                const result = await getAuthorDashboardData(user.id);
                
                if (result) {
                    const mapped = (result.latestPosts || []).map((doc: any) => ({
                        _id: doc._id,
                        title: doc.title,
                        status: doc.status === 'published' ? 'PUBLICADA' : doc.status === 'draft' ? 'BORRADOR' : 'REVISIÓN',
                        publishedAt: doc.publishedAt,
                        thumbnail: doc.mainImage ? urlFor(doc.mainImage).url() : 'https://via.placeholder.com/160',
                        isPublished: doc.status === 'published',
                        slug: doc.slug
                    }));
                    setArticles(mapped);
                    setStats({ pending: result.pendingCount || 0 });
                }

            } catch (error) {
                console.error("Error loading dashboard data via server action:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const getTimeAgo = (date: string) => {
        if (!date) return "Reciente";
        const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
        if (seconds < 3600) return `Hace ${Math.floor(seconds / 60)}m`;
        if (seconds < 86400) return `Hace ${Math.floor(seconds / 3600)}h`;
        return `Hace ${Math.floor(seconds / 86400)}d`;
    };

    return (
        <div className="p-8 md:p-12 max-w-5xl mx-auto w-full">
            <div className="w-full">
                {/* Header Area */}
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                    <div>
                        <h1 className="font-serif text-4xl font-black text-[#111111] tracking-tight mb-2">
                            Hola, {userProfile?.full_name || 'Autor'}
                        </h1>
                        <p className="text-gray-500 font-sans">
                            Bienvenido de nuevo al panel editorial. Tienes <span className="font-medium text-gray-700">{stats.pending} artículos pendientes</span>.
                        </p>
                    </div>
                    
                    <div className="flex items-center gap-3 shrink-0">
                        <a 
                            href={`${SANITY_STUDIO_URL}/intent/create/type=post/`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 bg-umbrella-red hover:bg-red-700 text-white px-5 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-sm shadow-red-500/20"
                        >
                            <Plus className="w-4 h-4" />
                            Nueva noticia
                        </a>
                        <Link 
                            href="/autor/noticias"
                            className="bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 text-[#111111] px-5 py-2.5 rounded-lg text-sm font-bold transition-all shadow-sm"
                        >
                            Ver noticias
                        </Link>
                    </div>
                </div>

                {/* Articles Section */}
                <div className="mt-14">
                    <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
                        <h2 className="font-serif text-[22px] font-bold text-[#111111]">Tus últimos artículos</h2>
                        <span className="text-[10px] font-bold tracking-widest text-[#597e96] bg-[#eff3f6] px-3 py-1.5 rounded-sm uppercase">Recientes</span>
                    </div>

                    <div className="space-y-6">
                        {loading ? (
                            <div className="flex justify-center py-10 text-gray-400">
                                <Loader2 className="w-8 h-8 animate-spin" />
                            </div>
                        ) : articles.length > 0 ? (
                            articles.map((article) => (
                                <div key={article._id} className="group flex items-center gap-6 p-4 -mx-4 rounded-xl hover:bg-white hover:shadow-sm hover:shadow-gray-200/50 transition-all border border-transparent hover:border-gray-100 cursor-pointer">
                                    {/* Thumbnail */}
                                    <div className="w-20 h-20 shrink-0 overflow-hidden rounded-xl bg-gray-100 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]">
                                        <img 
                                            src={article.thumbnail} 
                                            alt={article.title} 
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                                        />
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-serif text-lg font-bold text-[#111111] leading-snug mb-2 truncate group-hover:text-umbrella-red transition-colors">
                                            {article.title}
                                        </h3>
                                        
                                        <div className="flex items-center gap-3 text-[11px] font-sans">
                                            {article.isPublished ? (
                                                <div className="flex items-center gap-1.5 text-emerald-600 font-bold tracking-wider uppercase">
                                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                                    {article.status}
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-1.5 text-amber-500 font-bold tracking-wider uppercase">
                                                    <Edit3 className="w-3.5 h-3.5" />
                                                    {article.status}
                                                </div>
                                            )}
                                            <span className="text-gray-300">•</span>
                                            <span className="text-gray-500">
                                                {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : 'Sin fecha'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Actions Right */}
                                    <div className="flex items-center gap-4 pl-4 shrink-0">
                                        <span className="text-xs text-gray-400 italic font-serif hidden sm:block">
                                            {getTimeAgo(article.publishedAt)}
                                        </span>
                                        <a 
                                            href={`${SANITY_STUDIO_URL}/structure/post;${article._id.replace('drafts.', '')}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2 text-gray-300 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors opacity-0 group-hover:opacity-100 md:opacity-100"
                                        >
                                            <MoreVertical className="w-5 h-5" />
                                        </a>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-400 py-10 font-sans italic">No hay artículos publicados aún.</p>
                        )}
                    </div>
                    
                    {/* Load More Button */}
                    <div className="mt-10 flex justify-center">
                        <Link href="/autor/noticias" className="flex items-center gap-2 text-[11px] font-bold tracking-widest text-[#597e96] hover:text-[#3d5a6d] uppercase transition-colors">
                            Ver todos los artículos
                            <ChevronDown className="w-3.5 h-3.5" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
