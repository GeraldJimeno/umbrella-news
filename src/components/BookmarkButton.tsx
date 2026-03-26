"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Bookmark } from "lucide-react";
import { useRouter } from "next/navigation";

interface BookmarkButtonProps {
    sanityPostId: string;
    className?: string;
}

export function BookmarkButton({ sanityPostId, className }: BookmarkButtonProps) {
    const supabase = createClient();
    const router = useRouter();
    const [isSaved, setIsSaved] = useState(false);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        async function checkBookmark() {
            const { data: { user: authUser } } = await supabase.auth.getUser();
            setUser(authUser);

            if (authUser) {
                const { data } = await supabase
                    .from("saved_articles")
                    .select("id")
                    .eq("user_id", authUser.id)
                    .eq("sanity_post_id", sanityPostId)
                    .maybeSingle();
                setIsSaved(!!data);
            }
            setLoading(false);
        }
        checkBookmark();
    }, [sanityPostId]);

    const toggleBookmark = useCallback(async () => {
        if (!user) {
            router.push("/login");
            return;
        }

        if (isSaved) {
            // Remove bookmark
            await supabase
                .from("saved_articles")
                .delete()
                .eq("user_id", user.id)
                .eq("sanity_post_id", sanityPostId);
            setIsSaved(false);
        } else {
            // Add bookmark
            const { error } = await supabase
                .from("saved_articles")
                .insert({
                    user_id: user.id,
                    sanity_post_id: sanityPostId
                });
            if (!error) {
                setIsSaved(true);
            }
        }
    }, [user, isSaved, sanityPostId]);

    if (loading) {
        return (
            <button className={className} disabled aria-label="Guardar">
                <Bookmark className="w-4 h-4 text-gray-300" />
            </button>
        );
    }

    return (
        <button
            className={className}
            onClick={toggleBookmark}
            aria-label={isSaved ? "Quitar de guardados" : "Guardar noticia"}
            title={isSaved ? "Quitar de guardados" : "Guardar noticia"}
        >
            {isSaved ? (
                <Bookmark className="w-4 h-4 fill-umbrella-red text-umbrella-red" />
            ) : (
                <Bookmark className="w-4 h-4" />
            )}
        </button>
    );
}
