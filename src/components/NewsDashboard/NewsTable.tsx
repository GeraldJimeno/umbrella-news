"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, Edit3, Trash2, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

export interface NewsDashboardItem {
    _id: string;
    title: string;
    author?: string;
    status: string;
    categorySlug: string;
    publishedAt: string;
    slug: string;
}

interface NewsTableProps {
    initialNews: NewsDashboardItem[];
    isAdmin?: boolean;
    studioUrl?: string;
}

export default function NewsTable({ initialNews, isAdmin = false, studioUrl = "http://localhost:3334" }: NewsTableProps) {
    const [activeTab, setActiveTab] = useState<'all' | 'draft' | 'published'>('all');
    
    const allCount = initialNews.length;
    const draftCount = initialNews.filter(n => n.status === 'draft').length;
    const publishedCount = initialNews.filter(n => n.status === 'published').length;

    const filteredNews = initialNews.filter(item => {
        if (activeTab === 'all') return true;
        return item.status === activeTab;
    });

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'published': return 'Publicada';
            case 'draft': return 'Borrador';
            case 'review': return 'En Revisión';
            default: return (status || 'Borrador').toUpperCase();
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'published': return 'bg-[#eafbf1] text-[#28a745]';
            case 'draft': return 'bg-[#f3f4f6] text-[#6b7280]';
            case 'review': return 'bg-[#fff9db] text-[#f08c00]';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    return (
        <div className="w-full">
            {/* Tabs */}
            <div className="mt-8 md:mt-12 flex border-b border-gray-100 overflow-x-auto no-scrollbar">
                <button 
                    onClick={() => setActiveTab('all')}
                    className={`px-1 text-[11px] font-bold tracking-widest uppercase pb-4 mr-6 md:mr-8 whitespace-nowrap shrink-0 transition-all border-b-[3px] ${
                        activeTab === 'all' 
                        ? 'text-umbrella-red border-umbrella-red' 
                        : 'text-gray-400 hover:text-gray-700 border-transparent'
                    }`}
                >
                    Todas ({allCount})
                </button>
                <button 
                    onClick={() => setActiveTab('draft')}
                    className={`px-1 text-[11px] font-bold tracking-widest uppercase pb-4 mr-6 md:mr-8 whitespace-nowrap shrink-0 transition-all border-b-[3px] ${
                        activeTab === 'draft' 
                        ? 'text-umbrella-red border-umbrella-red' 
                        : 'text-gray-400 hover:text-gray-700 border-transparent'
                    }`}
                >
                    Borradores ({draftCount})
                </button>
                <button 
                    onClick={() => setActiveTab('published')}
                    className={`px-1 text-[11px] font-bold tracking-widest uppercase pb-4 whitespace-nowrap shrink-0 transition-all border-b-[3px] ${
                        activeTab === 'published' 
                        ? 'text-umbrella-red border-umbrella-red' 
                        : 'text-gray-400 hover:text-gray-700 border-transparent'
                    }`}
                >
                    Publicadas ({publishedCount})
                </button>
            </div>

            {/* List */}
            <div className="mt-8 flex flex-col gap-12">
                {filteredNews.length > 0 ? (
                    filteredNews.map((item) => (
                        <div key={item._id} className="group border-b border-gray-100 pb-10 last:border-0 last:pb-0 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                            <div className="flex-1 min-w-0">
                                {/* Status & ID */}
                                <div className="mb-4 flex items-center gap-3">
                                    <span className={`inline-block ${getStatusColor(item.status)} text-[10px] font-bold tracking-widest uppercase px-2 py-1 rounded-sm`}>
                                        {getStatusLabel(item.status)}
                                    </span>
                                    <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                                        ID: {item._id.substring(0, 8)}...
                                    </span>
                                </div>

                                {/* Title */}
                                <h2 className="font-serif text-[26px] font-bold text-[#111111] leading-tight mb-4 pr-12 group-hover:text-umbrella-red transition-colors cursor-pointer capitalize">
                                    {item.title}
                                </h2>

                                {/* Meta (Author, Category, Date) */}
                                <div className="flex flex-wrap items-center gap-4 text-xs font-sans">
                                    {isAdmin && (
                                        <span className="text-gray-500">
                                            Por <strong className="text-[#111111]">{item.author || "Redacción"}</strong>
                                        </span>
                                    )}
                                    <span className="font-bold tracking-wider uppercase text-umbrella-red text-[10px]">
                                        {item.categorySlug || "GENERAL"}
                                    </span>
                                    <span className="text-gray-400">
                                        {item.publishedAt ? new Date(item.publishedAt).toLocaleDateString() : 'Sin fecha'}
                                    </span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-6 shrink-0 pt-4 md:pt-0 w-full md:w-auto border-t md:border-t-0 border-gray-100 mt-2 md:mt-0 justify-end md:justify-start">
                                {item.status === 'published' && item.slug && (
                                    <Link 
                                        href={`/noticia/${item.slug}`}
                                        className="text-gray-400 hover:text-[#597e96] transition-colors" 
                                        title="Ver noticia pública"
                                        aria-label="Ver artículo"
                                    >
                                        <Eye className="w-4 h-4 md:w-4 md:h-4" />
                                    </Link>
                                )}
                                <a 
                                    href={`${studioUrl}/structure/post;${item._id.replace('drafts.', '')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-400 hover:text-[#597e96] transition-colors" 
                                    title="Editar en Sanity" 
                                    aria-label="Editar artículo"
                                >
                                    <Edit3 className="w-4 h-4 md:w-4 md:h-4" />
                                </a>
                                <button className="text-gray-400 hover:text-umbrella-red transition-colors" title="Eliminar" aria-label="Eliminar artículo">
                                    <Trash2 className="w-4 h-4 md:w-4 md:h-4" />
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="py-20 text-center border border-dashed border-gray-200 rounded-xl">
                        <p className="text-gray-400 font-sans italic">
                            No hay noticias {activeTab !== 'all' ? (activeTab === 'draft' ? 'en borrador' : 'publicadas') : ''} registradas.
                        </p>
                    </div>
                )}
            </div>

            {/* Pagination Summary */}
            <div className="mt-12 md:mt-16 flex flex-col sm:flex-row items-center justify-between pt-8 gap-6 border-t md:border-t-0 border-gray-100">
                <span className="text-[10px] font-bold tracking-widest text-[#597e96] uppercase text-center sm:text-left">
                    Mostrando {filteredNews.length} de {initialNews.length} artículos
                </span>
                <div className="flex items-center gap-2 flex-wrap justify-center">
                    <button className="w-10 h-10 flex items-center justify-center rounded-sm border border-gray-200 text-gray-400 hover:bg-gray-50 transition-colors">
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button className="w-10 h-10 flex items-center justify-center rounded-sm bg-umbrella-red text-white font-bold text-sm shadow-sm">
                        1
                    </button>
                    <button className="w-10 h-10 flex items-center justify-center rounded-sm border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
