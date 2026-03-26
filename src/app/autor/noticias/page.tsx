import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getAuthorNews } from "@/lib/sanity/actions";
import NewsTable from "@/components/NewsDashboard/NewsTable";

const SANITY_STUDIO_URL = process.env.NEXT_PUBLIC_SANITY_STUDIO_URL || "http://localhost:3334";

export default async function AuthorNewsPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return null;

    const news = await getAuthorNews(user.id);

    return (
        <div className="p-8 md:p-12 max-w-5xl mx-auto w-full">
            <div className="w-full pb-8">
                {/* Header Area */}
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                    <div>
                        <h1 className="font-serif text-5xl font-black text-[#111111] tracking-tight mb-3">
                            Noticias
                        </h1>
                        <p className="text-[#597e96] font-sans text-sm pb-1">
                            Gestiona el catálogo editorial y publicaciones del medio.
                        </p>
                    </div>
                    
                    <div className="flex items-center gap-3 shrink-0 pt-2">
                        <a 
                            href={`${SANITY_STUDIO_URL}/intent/create/type=post/`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 bg-umbrella-red hover:bg-red-700 text-white px-6 py-3 rounded-lg text-sm font-bold transition-colors shadow-sm shadow-red-500/20"
                        >
                            <Plus className="w-4 h-4" />
                            Nueva noticia
                        </a>
                    </div>
                </div>

                <NewsTable initialNews={news || []} isAdmin={false} studioUrl={SANITY_STUDIO_URL} />
            </div>
        </div>
    );
}
