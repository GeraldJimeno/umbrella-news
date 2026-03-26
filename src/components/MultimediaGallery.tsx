"use client";

import { useState, useEffect } from "react";
import { UploadCloud, Search, ChevronLeft, ChevronRight, FileText, PlayCircle } from "lucide-react";

interface MediaItem {
    id: string;
    filename: string;
    type: 'image' | 'video' | 'document';
    date: string;
    url: string;
}

const MOCK_MEDIA: MediaItem[] = [
    {
        id: '1',
        filename: 'city_skyline_01.jpg',
        type: 'image',
        date: '12 OCT 2023',
        url: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?w=400&q=80'
    },
    {
        id: '2',
        filename: 'breaking_news.mp4',
        type: 'video',
        date: '11 OCT 2023',
        url: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=400&q=80'
    },
    {
        id: '3',
        filename: 'protest_march_04.png',
        type: 'image',
        date: '10 OCT 2023',
        url: 'https://images.unsplash.com/photo-1551061917-7e61a6b0cfa7?w=400&q=80'
    },
    {
        id: '4',
        filename: 'press_conference.jpg',
        type: 'image',
        date: '09 OCT 2023',
        url: 'https://images.unsplash.com/photo-1558222218-b7b54eede3f3?w=400&q=80'
    },
    {
        id: '5',
        filename: 'economy_charts_q4.pdf',
        type: 'document',
        date: '08 OCT 2023',
        url: '' 
    },
    {
        id: '6',
        filename: 'newspaper_texture.jpg',
        type: 'image',
        date: '07 OCT 2023',
        url: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=400&q=80'
    },
    {
        id: '7',
        filename: 'header_abstract.png',
        type: 'image',
        date: '06 OCT 2023',
        url: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=400&q=80'
    },
    {
        id: '8',
        filename: 'office_interior_hq.jpg',
        type: 'image',
        date: '05 OCT 2023',
        url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&q=80'
    }
];

const EXTENDED_MOCK_MEDIA: MediaItem[] = Array.from({ length: 45 }).map((_, i) => {
    const base = MOCK_MEDIA[i % MOCK_MEDIA.length];
    // Create a new distinct mock filename per item
    const nameParts = base.filename.split('.');
    const ext = nameParts.pop();
    const nameStr = nameParts.join('.');
    
    return {
        ...base,
        id: (i + 1).toString(),
        filename: `${nameStr}_${i + 1}.${ext}`
    };
});

interface MultimediaGalleryProps {
    isAdmin?: boolean;
}

export default function MultimediaGallery({ isAdmin = false }: MultimediaGalleryProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState("Todos");
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    const ITEMS_PER_PAGE = 8;

    const filteredMedia = EXTENDED_MOCK_MEDIA.filter(item => {
        if (activeTab === "Imágenes" && item.type !== "image") return false;
        if (activeTab === "Videos" && item.type !== "video") return false;
        if (activeTab === "Documentos" && item.type !== "document") return false;
        
        if (searchQuery) {
            return item.filename.toLowerCase().includes(searchQuery.toLowerCase());
        }
        
        return true;
    });

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, activeTab]);

    const totalPages = Math.ceil(filteredMedia.length / ITEMS_PER_PAGE);
    const paginatedMedia = filteredMedia.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    return (
        <div className="p-8 md:p-12 max-w-5xl mx-auto w-full">
            <div className="w-full pb-8">
                {/* Header Area */}
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                    <div>
                        <h1 className="font-serif text-4xl md:text-5xl font-black text-[#111111] tracking-tight mb-2 md:mb-3">
                            Multimedia
                        </h1>
                        <p className="text-[#597e96] font-sans text-sm pb-1">
                            {isAdmin 
                                ? "Gestiona de forma global las imágenes y recursos del sistema"
                                : "Gestiona imágenes y recursos para tus artículos"
                            }
                        </p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0 pt-2 w-full md:w-auto">
                        <div className="relative w-full sm:flex-1 md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input 
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Buscar archivos..."
                                className="w-full bg-white border border-gray-200 rounded-lg py-3 pl-10 pr-4 text-sm focus:border-umbrella-red focus:ring-1 focus:ring-umbrella-red outline-none text-[#111111] placeholder:text-gray-400 transition-all"
                            />
                        </div>
                        <button 
                            onClick={() => setIsUploadModalOpen(true)}
                            className="w-full sm:w-auto flex justify-center items-center gap-2 bg-umbrella-red hover:bg-red-700 text-white px-6 py-3 rounded-lg text-sm font-bold tracking-wide uppercase transition-colors shadow-sm shadow-red-500/20 shrink-0"
                        >
                            <UploadCloud className="w-4 h-4 md:w-[18px] md:h-[18px]" />
                            Subir archivo
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="mt-10 flex border-b border-gray-100 overflow-x-auto no-scrollbar gap-2">
                    {['Todos', 'Imágenes', 'Videos', 'Documentos'].map((tab) => (
                        <button 
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 rounded-lg text-xs font-bold tracking-wide transition-colors whitespace-nowrap mb-4 ${
                                activeTab === tab 
                                    ? 'bg-umbrella-red/10 text-umbrella-red' 
                                    : 'text-gray-500 hover:bg-gray-100'
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Grid */}
                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {paginatedMedia.length === 0 ? (
                        <div className="col-span-full py-12 text-center text-gray-500 font-bold bg-white rounded-xl border border-gray-100">
                            No se encontraron archivos multimedia.
                        </div>
                    ) : (
                        paginatedMedia.map((item) => (
                            <div 
                                key={item.id} 
                                onClick={() => setSelectedMedia(item)}
                                className="group flex flex-col bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-[0_4px_16px_-4px_rgba(0,0,0,0.1)] hover:border-gray-200 transition-all cursor-pointer"
                            >
                            {/* Preview Area */}
                            <div className="h-40 bg-[#f4f7f9] relative flex items-center justify-center overflow-hidden">
                                {item.type === 'document' ? (
                                    <div className="text-gray-300 transform group-hover:scale-110 transition-transform duration-500">
                                        <FileText className="w-16 h-16 opacity-50" />
                                    </div>
                                ) : (
                                    <>
                                        <img 
                                            src={item.url} 
                                            alt={item.filename}
                                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                                        />
                                        {item.type === 'video' && (
                                            <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-[9px] font-bold tracking-wider uppercase px-2 py-1 rounded flex items-center gap-1.5">
                                                <PlayCircle className="w-3 h-3" />
                                                Video
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>

                            {/* Details Area */}
                            <div className="p-4 flex flex-col">
                                <h3 className="font-bold text-[#111111] text-sm truncate mb-1.5 group-hover:text-umbrella-red transition-colors">
                                    {item.filename}
                                </h3>
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-bold tracking-widest text-[#a0b0ba] uppercase">
                                        {item.date}
                                    </span>
                                    {isAdmin && (
                                        <span className="text-[9px] font-bold tracking-widest bg-gray-100 text-gray-500 px-2 py-0.5 rounded-sm uppercase">
                                            Autor
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    )))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="mt-12 flex flex-col-reverse sm:flex-row items-center justify-center sm:justify-between border-t border-gray-100 pt-8 gap-6">
                        <span className="text-[10px] font-bold tracking-widest text-[#597e96] uppercase text-center sm:text-left">
                            Mostrando {((currentPage - 1) * ITEMS_PER_PAGE) + 1} a {Math.min(currentPage * ITEMS_PER_PAGE, filteredMedia.length)} de {filteredMedia.length} archivos
                        </span>
                        <div className="flex items-center gap-2 flex-wrap justify-center">
                            <button 
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="w-8 h-8 flex items-center justify-center rounded-lg border border-transparent text-gray-400 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            
                            {Array.from({ length: totalPages }).map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={`w-8 h-8 flex items-center justify-center rounded-lg font-bold text-sm transition-colors ${
                                        currentPage === i + 1 
                                            ? 'bg-umbrella-red text-white shadow-sm' 
                                            : 'border border-transparent text-[#111111] hover:bg-gray-50'
                                    }`}
                                >
                                    {i + 1}
                                </button>
                            ))}

                            <button 
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="w-8 h-8 flex items-center justify-center rounded-lg border border-transparent text-[#111111] hover:bg-gray-50 disabled:opacity-50 transition-colors"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Upload Modal (Mock) */}
            {isUploadModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-opacity">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-6 md:p-8">
                            <h3 className="font-serif text-2xl font-bold text-[#111111] mb-2 leading-tight">Subir archivo</h3>
                            <p className="text-[#597e96] text-sm mb-6 leading-relaxed">Selecciona un archivo desde tu dispositivo</p>
                            
                            <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 hover:border-umbrella-red/30 transition-colors">
                                <UploadCloud className="w-10 h-10 text-gray-400 mb-4" />
                                <span className="text-sm font-bold text-[#111111]">Haz clic o arrastra un archivo aquí</span>
                                <span className="text-xs text-gray-400 mt-2">JPG, PNG, GIF, MP4, o PDF. Máx 10MB.</span>
                            </div>

                            <div className="mt-8 flex flex-col-reverse sm:flex-row items-center justify-end gap-3 sm:gap-4">
                                <button 
                                    onClick={() => setIsUploadModalOpen(false)} 
                                    className="w-full sm:w-auto px-6 py-2.5 text-sm font-bold text-gray-500 hover:text-[#111111] hover:bg-gray-50 rounded-sm transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button 
                                    onClick={() => {
                                        alert("Archivo simulado subido con éxito.");
                                        setIsUploadModalOpen(false);
                                    }} 
                                    className="w-full sm:w-auto bg-umbrella-red hover:bg-red-700 text-white px-6 py-2.5 rounded-sm text-sm font-bold tracking-wide uppercase transition-colors shadow-sm shadow-red-500/20"
                                >
                                    Subir archivo
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Preview Modal (Mock) */}
            {selectedMedia && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-opacity">
                    <div className="bg-white rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.3)] w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col sm:flex-row">
                        <div className="w-full sm:w-1/2 bg-[#f4f7f9] flex items-center justify-center p-6 min-h-[200px] sm:min-h-[300px]">
                            {selectedMedia.type === 'document' ? (
                                <FileText className="w-20 h-20 text-gray-300 drop-shadow-sm" />
                            ) : (
                                <img src={selectedMedia.url} alt={selectedMedia.filename} className="w-full h-full object-contain rounded-md drop-shadow-md" />
                            )}
                        </div>
                        <div className="w-full sm:w-1/2 p-6 md:p-8 flex flex-col justify-center bg-white border-l border-gray-100">
                            <h3 className="font-bold text-[#111111] text-lg mb-2 break-all leading-tight">{selectedMedia.filename}</h3>
                            <div className="flex items-center gap-3 mb-6">
                                <span className="text-[10px] font-bold tracking-widest text-[#a0b0ba] uppercase">{selectedMedia.date}</span>
                                <span className="text-[10px] font-bold tracking-widest bg-gray-100 text-gray-500 px-2 flex items-center h-5 rounded-sm uppercase">{selectedMedia.type}</span>
                            </div>
                            <div className="space-y-4 text-sm text-[#597e96] mb-8">
                                <div className="flex justify-between border-b border-gray-100 pb-2">
                                    <span className="font-bold text-gray-400">Tamaño</span>
                                    <span>3.4 MB</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-100 pb-2">
                                    <span className="font-bold text-gray-400">Dimens.</span>
                                    <span>1920x1080px</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-100 pb-2">
                                    <span className="font-bold text-gray-400">Propietario</span>
                                    <span>{isAdmin ? "Autor" : "Me"}</span>
                                </div>
                            </div>
                            <div className="flex flex-col gap-3 mt-auto">
                                <button 
                                    className="w-full font-sans bg-gray-100/80 hover:bg-gray-200 text-[#111111] px-4 py-2.5 rounded-sm text-sm font-bold transition-colors"
                                >
                                    Descargar Original
                                </button>
                                <button 
                                    onClick={() => setSelectedMedia(null)} 
                                    className="w-full px-4 py-2.5 text-sm font-bold text-gray-400 hover:text-[#111111] hover:bg-gray-50 transition-colors uppercase tracking-wide"
                                >
                                    Cerrar vista
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
