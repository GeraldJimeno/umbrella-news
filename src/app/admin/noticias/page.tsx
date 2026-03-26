import { getAdminNews } from "@/lib/sanity/actions";
import NewsTable from "@/components/NewsDashboard/NewsTable";
import { Plus } from "lucide-react";

interface AdminNewsItem {
    _id: string;
    title: string;
    author: string;
    status: string;
    categorySlug: string;
    publishedAt: string;
    slug: string;
}

const SANITY_STUDIO_URL = process.env.NEXT_PUBLIC_SANITY_STUDIO_URL || "http://localhost:3334";

export default async function AdminNewsPage() {
    const news = await getAdminNews();

    return (
        <div className="p-8 md:p-12 max-w-5xl mx-auto w-full">
            <div className="w-full pb-8">
                {/* Header Area */}
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                    <div>
                        <h1 className="font-serif text-4xl md:text-5xl font-black text-[#111111] tracking-tight mb-2 md:mb-3">
                            Noticias
                        </h1>
                        <p className="text-[#597e96] font-sans text-sm pb-1">
                            Gestiona el catálogo editorial y publicaciones del medio.
                        </p>
                    </div>
                    
                    <div className="flex items-center shrink-0 pt-2 w-full md:w-auto">
                        <a 
                            href={`${SANITY_STUDIO_URL}/intent/create/type=post/`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-1 md:flex-none justify-center items-center gap-2 bg-umbrella-red hover:bg-red-700 text-white px-6 py-3 rounded-sm text-sm font-bold tracking-wide transition-colors shadow-sm shadow-red-500/20"
                        >
                            <Plus className="w-4 h-4" />
                            Nueva noticia
                        </a>
                    </div>
                </div>

                <NewsTable initialNews={news || []} isAdmin={true} studioUrl={SANITY_STUDIO_URL} />
            </div>
        </div>
    );
}
