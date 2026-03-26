import Link from 'next/link';
import { PlusCircle, UserPlus, Users, Layers } from 'lucide-react';
import { getAdminDashboardData } from '@/lib/sanity/actions';
import { createClient } from '@/lib/supabase/server';

const SANITY_STUDIO_URL = "http://localhost:3334";

export default async function AdminDashboardPage() {
    // 1. Fetch Sanity Data
    const sanityData = await getAdminDashboardData();
    const { totalArticles, publishedArticles, draftArticles, latestArticles } = sanityData;

    // 2. Fetch Supabase Data (Active Users)
    const supabase = await createClient();
    const { count: activeUsers, error: userError } = await supabase
        .from("profiles")
        .select("*", { count: 'exact', head: true })
        .eq("status", "active");

    if (userError) {
        console.error("Error fetching active users from Supabase:", userError);
    }

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'published': return 'Publicado';
            case 'draft': return 'Borrador';
            case 'review': return 'Revisión';
            default: return (status || 'Borrador').toUpperCase();
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'published': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
            case 'draft': return 'text-amber-600 bg-amber-50 border-amber-100';
            case 'review': return 'text-blue-600 bg-blue-50 border-blue-100';
            default: return 'text-gray-600 bg-gray-50 border-gray-100';
        }
    };

    const getTimeAgo = (dateStr: string) => {
        if (!dateStr) return 'Recientemente';
        const date = new Date(dateStr);
        const now = new Date();
        const diffInMs = now.getTime() - date.getTime();
        const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
        
        if (diffInHours < 1) return 'Hace menos de una hora';
        if (diffInHours < 24) return `Hace ${diffInHours} horas`;
        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays === 1) return 'Ayer';
        return `Hace ${diffInDays} días`;
    };

    return (
        <div className="p-8 md:p-12 lg:p-16 max-w-6xl mx-auto w-full">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-16">
                <div>
                    <h1 className="text-4xl md:text-5xl font-serif font-black text-[#111111] tracking-tight mb-3">
                        Panel de administración
                    </h1>
                    <p className="text-xl text-gray-500 font-serif italic">
                        Resumen de la actividad editorial actual.
                    </p>
                </div>
                <a 
                    href={`${SANITY_STUDIO_URL}/intent/create/type=post/`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-umbrella-red hover:bg-red-700 text-white px-6 py-3 rounded-sm text-sm font-bold tracking-wide uppercase transition-colors shadow-sm shadow-red-500/20 shrink-0 inline-flex items-center justify-center"
                >
                    Nueva noticia
                </a>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-20 whitespace-nowrap">
                <div className="flex flex-col">
                    <span className="text-[10px] font-bold tracking-widest text-[#a0b0ba] uppercase mb-4 border-b border-gray-200 pb-2">Artículos totales</span>
                    <span className="text-[40px] font-serif font-black text-[#111111] leading-none">{totalArticles || 0}</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-[10px] font-bold tracking-widest text-[#a0b0ba] uppercase mb-4 border-b border-gray-200 pb-2">Publicados</span>
                    <span className="text-[40px] font-serif font-black text-[#111111] leading-none">{publishedArticles || 0}</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-[10px] font-bold tracking-widest text-[#a0b0ba] uppercase mb-4 border-b border-gray-200 pb-2">Borradores</span>
                    <span className="text-[40px] font-serif font-black text-[#111111] leading-none">{draftArticles || 0}</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-[10px] font-bold tracking-widest text-[#a0b0ba] uppercase mb-4 border-b border-gray-200 pb-2">Usuarios Activos</span>
                    <span className="text-[40px] font-serif font-black text-[#111111] leading-none">{activeUsers || 0}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-16 lg:gap-20">
                {/* Últimos artículos */}
                <div className="flex flex-col">
                    <div className="flex items-baseline justify-between mb-8 border-b border-gray-200 pb-4">
                        <h2 className="text-2xl font-serif font-black text-[#111111]">Últimos artículos</h2>
                        <Link href="/admin/noticias" className="text-[10px] font-bold tracking-widest text-umbrella-red uppercase hover:text-red-700 transition">
                            Ver todos
                        </Link>
                    </div>

                    <div className="flex flex-col gap-8">
                        {latestArticles && latestArticles.length > 0 ? (
                            latestArticles.map((item: any) => (
                                <div key={item._id} className="flex flex-col md:flex-row justify-between md:items-center gap-4 pb-8 border-b border-gray-100 group">
                                    <div className="flex flex-col gap-2 flex-1 pr-4">
                                        <h3 className="text-xl font-serif font-bold text-[#111111] leading-snug group-hover:text-umbrella-red transition-colors cursor-pointer capitalize">
                                            {item.title}
                                        </h3>
                                        <div className="flex items-center gap-3 mt-1">
                                            <span className="text-xs font-bold text-[#111111]">{item.author}</span>
                                            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                            <span className="text-xs font-serif italic text-gray-400">
                                                {getTimeAgo(item.publishedAt || item._createdAt)}
                                            </span>
                                        </div>
                                    </div>
                                    <span className={`text-[10px] font-bold tracking-widest uppercase px-2 py-1 rounded-sm border shrink-0 self-start md:self-auto ${getStatusColor(item.status)}`}>
                                        {getStatusLabel(item.status)}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <div className="py-12 text-center text-gray-400 italic font-serif">
                                No se encontraron artículos recientes.
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="flex flex-col">
                    <div className="mb-10">
                        <h3 className="text-xl font-serif font-bold text-[#111111] mb-6 border-b border-gray-200 pb-4">Gestión rápida</h3>
                        <div className="flex flex-col gap-6">
                            <a 
                                href={`${SANITY_STUDIO_URL}/intent/create/type=post/`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-4 text-sm font-bold text-[#111111] hover:text-umbrella-red transition-colors group"
                            >
                                <div className="w-6 h-6 rounded-full bg-umbrella-red text-white flex items-center justify-center shrink-0 shadow-sm">
                                    <PlusCircle className="w-4 h-4" />
                                </div>
                                Crear nueva noticia (Studio)
                            </a>
                            <Link href="/admin/usuarios/nuevo" className="flex items-center gap-4 text-sm font-bold text-[#111111] hover:text-umbrella-red transition-colors group">
                                <div className="w-6 h-6 text-umbrella-red flex items-center justify-center shrink-0">
                                    <UserPlus className="w-5 h-5" />
                                </div>
                                Crear usuario
                            </Link>
                            <Link href="/admin/usuarios" className="flex items-center gap-4 text-sm font-bold text-[#111111] hover:text-umbrella-red transition-colors group">
                                <div className="w-6 h-6 text-umbrella-red flex items-center justify-center shrink-0">
                                    <Users className="w-5 h-5" />
                                </div>
                                Ver usuarios
                            </Link>
                            <Link href="/admin/categorias" className="flex items-center gap-4 text-sm font-bold text-[#111111] hover:text-umbrella-red transition-colors group">
                                <div className="w-6 h-6 text-umbrella-red flex items-center justify-center shrink-0">
                                    <Layers className="w-5 h-5" />
                                </div>
                                Gestionar categorías
                            </Link>
                        </div>
                    </div>

                    <div className="bg-[#fbfcfd] border border-gray-100 p-8 flex flex-col items-start mt-4">
                        <h4 className="text-sm font-serif font-bold text-[#111111] mb-3">Soporte Editorial</h4>
                        <p className="text-xs font-sans text-gray-500 leading-relaxed mb-6">
                            ¿Necesitas ayuda con la publicación? Consulta nuestra guía de estilo o contacta al administrador técnico.
                        </p>
                        <Link href="/admin/soporte" className="text-[10px] font-bold tracking-widest text-[#111111] uppercase border-b border-[#111111] pb-1 hover:text-umbrella-red hover:border-umbrella-red transition-colors">
                            Ver documentación
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
