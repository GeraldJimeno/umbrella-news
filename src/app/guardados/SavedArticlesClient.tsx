"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { Bookmark, Trash2, Loader2, Calendar, Tag } from "lucide-react";

export interface SavedArticle {
    id: string;
    sanity_post_id: string;
    created_at: string;
    title?: string;
    slug?: string;
    imageUrl?: string | null;
    category?: string;
    publishedAt?: string;
}

interface SavedArticlesClientProps {
    initialSaved: SavedArticle[];
}

export default function SavedArticlesClient({ initialSaved }: SavedArticlesClientProps) {
    const supabase = createClient();
    const [saved, setSaved] = useState<SavedArticle[]>(initialSaved);
    const [removing, setRemoving] = useState<string | null>(null);

    async function handleRemove(savedId: string) {
        setRemoving(savedId);
        try {
            const { error } = await supabase
                .from("saved_articles")
                .delete()
                .eq("id", savedId);
            
            if (error) throw error;
            
            setSaved(prev => prev.filter(s => s.id !== savedId));
        } catch (err) {
            console.error("Error removing saved article:", err);
        } finally {
            setRemoving(null);
        }
    }

    const formatDate = (dateStr?: string) => {
        if (!dateStr) return "";
        return new Date(dateStr).toLocaleDateString("es-ES", {
            day: "numeric", month: "short", year: "numeric"
        });
    };

    if (saved.length === 0) {
        return (
            <div className="text-center py-16 bg-gray-50 rounded-lg border border-gray-100">
                <Bookmark className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                <p className="text-gray-500 font-medium mb-2">
                    No tienes artículos guardados todavía.
                </p>
                <p className="text-gray-400 text-sm">
                    Usa el icono <Bookmark className="w-3.5 h-3.5 inline-block relative -top-[1px]" /> en cualquier noticia para guardarla.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-0 divide-y divide-gray-100">
            {saved.map((item) => (
                <div key={item.id} className="flex items-start gap-4 py-6 group">
                    {/* Thumbnail */}
                    {item.imageUrl ? (
                        <Link
                            href={item.slug ? `/noticia/${item.slug}` : "#"}
                            className="shrink-0 w-24 h-24 md:w-32 md:h-24 rounded-sm overflow-hidden bg-gray-100"
                        >
                            <img
                                src={item.imageUrl}
                                alt={item.title}
                                className="w-full h-full object-cover"
                            />
                        </Link>
                    ) : (
                        <div className="shrink-0 w-24 h-24 md:w-32 md:h-24 rounded-sm bg-gray-100 flex items-center justify-center">
                            <Bookmark className="w-6 h-6 text-gray-300" />
                        </div>
                    )}

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        {item.category && (
                            <span className="text-[10px] font-bold tracking-widest uppercase text-umbrella-red flex items-center gap-1 mb-1">
                                <Tag className="w-3 h-3" />
                                {item.category}
                            </span>
                        )}
                        <Link
                            href={item.slug ? `/noticia/${item.slug}` : "#"}
                            className="block"
                        >
                            <h3 className="font-serif text-base md:text-lg font-bold text-black leading-tight hover:text-umbrella-red transition-colors line-clamp-2">
                                {item.title}
                            </h3>
                        </Link>
                        <div className="flex items-center gap-4 mt-2">
                            {item.publishedAt && (
                                <span className="text-xs text-gray-400 flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {formatDate(item.publishedAt)}
                                </span>
                            )}
                            <span className="text-xs text-gray-300">
                                Guardado {formatDate(item.created_at)}
                            </span>
                        </div>
                    </div>

                    {/* Remove */}
                    <button
                        onClick={() => handleRemove(item.id)}
                        disabled={removing === item.id}
                        className="shrink-0 p-2 text-gray-300 hover:text-umbrella-red transition-colors opacity-0 group-hover:opacity-100"
                        title="Quitar de guardados"
                    >
                        {removing === item.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Trash2 className="w-4 h-4" />
                        )}
                    </button>
                </div>
            ))}
        </div>
    );
}
