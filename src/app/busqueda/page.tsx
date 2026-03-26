import { Header, Navbar, Footer, Container } from "@/layout";
import { ChevronDown } from "lucide-react";
import { SearchResultsList, SearchResultItem } from "@/sections/SearchResultsList";
import { client } from "@/lib/sanity/client";
import { urlFor } from "@/lib/sanity/image";

// Optional helper for date formatting
function formatDate(dateStr: string) {
    if (!dateStr) return "RECIENTE";
    return new Date(dateStr).toLocaleDateString("es-ES", {
        day: "numeric",
        month: "short",
        year: "numeric"
    }).toUpperCase();
}

export default async function SearchPage({ 
    searchParams 
}: { 
    searchParams: Promise<{ [key: string]: string | string[] | undefined }> 
}) {
    // Next.js 15+ requires awaiting searchParams
    const resolvedSearchParams = await searchParams;
    const rawQuery = resolvedSearchParams.q;
    const query = typeof rawQuery === 'string' ? rawQuery : ""; 
    
    // Fetch from Sanity
    let mappedResults: SearchResultItem[] = [];
    
    if (query.trim()) {
        const exactTerm = query.trim();
        const wildcardTerm = `*${exactTerm}*`;
        
        const sanityQuery = `*[_type == "post" && status == "published" && (
            title match $wildcardTerm || 
            subtitle match $wildcardTerm || 
            lead match $wildcardTerm || 
            categorySlug match $wildcardTerm || 
            subcategorySlug match $wildcardTerm || 
            $exactTerm in tags
        )] | order(publishedAt desc) {
            _id,
            title,
            subtitle,
            lead,
            categorySlug,
            authorName,
            "authorDoc": author->{
                name,
                "slug": slug.current
            },
            publishedAt,
            mainImage,
            "slug": slug.current
        }`;
        
        const rawDocs = await client.fetch(sanityQuery, { 
            wildcardTerm, 
            exactTerm 
        });
        
        mappedResults = rawDocs.map((doc: any) => ({
            id: doc._id,
            category: doc.categorySlug?.toUpperCase() || "GENERAL",
            date: formatDate(doc.publishedAt),
            title: doc.title || "",
            excerpt: doc.lead || doc.subtitle || "",
            author: doc.authorDoc?.name || doc.authorName || "Redacción Umbrella",
            authorSlug: doc.authorDoc?.slug || null,
            slug: doc.slug,
            imageUrl: doc.mainImage ? urlFor(doc.mainImage).url() : ""
        }));
    }

    return (
        <div className="min-h-screen bg-gray-50/50 flex flex-col font-sans">
            <Header />
            <Navbar />
            
            <main className="flex-grow pb-24">
                <Container className="mt-12 md:mt-16">
                    {/* Header */}
                    <div className="mb-6">
                        <h1 className="font-serif text-3xl md:text-[40px] text-gray-900 tracking-tight">
                            Mostrando resultados para: <span className="italic">"{query}"</span>
                        </h1>
                    </div>

                    {/* Filters Row */}
                    <div className="border-t border-b border-gray-200 py-4 mb-12">
                        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar min-w-max">
                            <FilterButton label="Ordenar por relevancia" />
                            <FilterButton label="Filtrar por fecha" />
                            <FilterButton label="Filtrar por sección" />
                            <FilterButton label="Tipo de contenido" />
                        </div>
                    </div>

                    {/* Results Layout (1 column) */}
                    <div className="max-w-4xl max-w-[850px]">
                        <SearchResultsList results={mappedResults} />
                    </div>
                </Container>
            </main>

            <Footer />
        </div>
    );
}

// Simple filter button component tailored to match the mockup
function FilterButton({ label }: { label: string }) {
    return (
        <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 transition-colors rounded-md text-xs font-semibold text-gray-600 whitespace-nowrap">
            {label}
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
        </button>
    );
}
