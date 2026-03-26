"use client";

import { useState } from "react";
import { ChevronDown, Image as ImageIcon, X } from "lucide-react";
import { NAV_CATEGORIES } from "@/data/navigation";

interface NewsEditorProps {
    isAdmin?: boolean;
}

export function NewsEditor({ isAdmin = false }: NewsEditorProps) {
    const [title, setTitle] = useState("");
    const [subtitle, setSubtitle] = useState("");
    const [lead, setLead] = useState("");
    const [content, setContent] = useState("");
    const [status, setStatus] = useState("Borrador");
    const [category, setCategory] = useState("");
    const [subcategory, setSubcategory] = useState("");
    const [tagsText, setTagsText] = useState("");
    const [tags, setTags] = useState<string[]>([]);
    const [slug, setSlug] = useState("");
    const [metaDescription, setMetaDescription] = useState("");
    const [author, setAuthor] = useState("");
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSlugEdited, setIsSlugEdited] = useState(false);

    const generateSlug = (text: string) => {
        return text
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newTitle = e.target.value;
        setTitle(newTitle);
        
        if (!isSlugEdited) {
            setSlug(generateSlug(newTitle));
        }
        
        if (errors.title) setErrors({ ...errors, title: "" });
    };

    const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSlug(e.target.value);
        setIsSlugEdited(true);
    };

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setCategory(e.target.value);
        setSubcategory("");
        if (errors.category) setErrors({ ...errors, category: "" });
    };

    const handleKeyDownTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && tagsText.trim()) {
            e.preventDefault();
            const newTag = tagsText.trim();
            if (!tags.includes(newTag)) {
                setTags([...tags, newTag]);
            }
            setTagsText("");
        }
    };

    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter(t => t !== tagToRemove));
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (!title.trim()) newErrors.title = "El titular es obligatorio";
        if (!lead.trim()) newErrors.lead = "La entradilla es obligatoria";
        if (!content.trim()) newErrors.content = "El cuerpo de la noticia es obligatorio";
        if (!category) newErrors.category = "Seleccione una categoría principal";
        if (metaDescription.length > 160) newErrors.metaDescription = "La meta descripción no debe superar 160 caracteres";
        if (isAdmin && !author) newErrors.author = "Seleccione el autor de la noticia";
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSaveDraft = () => {
        if (!validateForm()) return;
        console.log("Guardar borrador", { title, subtitle, lead, content, status: "Borrador", category, subcategory, tags, slug, metaDescription, author: isAdmin ? author : "self" });
        setStatus("Borrador");
        alert("Borrador guardado (Mock)");
    };

    const handlePublish = () => {
        if (!validateForm()) return;
        console.log("Publicar noticia", { title, subtitle, lead, content, status: "Publicada", category, subcategory, tags, slug, metaDescription, author: isAdmin ? author : "self" });
        setStatus("Publicada");
        alert("Noticia publicada (Mock)");
    };

    const selectedNavCategory = NAV_CATEGORIES.find(c => c.name === category);
    const subcategoriesOptions = selectedNavCategory?.subcategories || [];

    return (
        <div className="flex flex-col min-h-[calc(100vh-80px)] w-full bg-white relative">
            {/* Top Bar */}
            <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-200 px-4 sm:px-8 py-3 sm:py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
                <div className="flex items-center gap-2 sm:gap-4 w-full justify-between sm:justify-start">
                    <span className="text-[10px] sm:text-xs font-bold tracking-widest text-[#a0b0ba] uppercase">
                        Redacción {isAdmin && "- MODO ADMIN"}
                    </span>
                    <div className="flex items-center gap-2 sm:gap-4">
                        <span className="w-px h-4 bg-gray-200 hidden sm:block"></span>
                        <span className="text-[10px] sm:text-xs font-serif italic text-gray-400">
                            Autoguardado hace 2 min
                        </span>
                    </div>
                </div>
                
                <div className="flex items-center gap-3 sm:gap-6 w-full sm:w-auto">
                    <button onClick={handleSaveDraft} className="flex-1 sm:flex-none text-xs sm:text-sm font-bold text-[#111111] hover:text-umbrella-red transition-colors bg-gray-100 sm:bg-transparent py-2.5 sm:py-0 rounded-sm">
                        Guardar borrador
                    </button>
                    <button onClick={handlePublish} className="flex-1 sm:flex-none bg-umbrella-red hover:bg-red-700 text-white px-4 sm:px-5 py-2.5 rounded-sm text-[11px] sm:text-sm font-bold tracking-wide uppercase transition-colors shadow-sm shadow-red-500/20 whitespace-nowrap text-center">
                        Publicar noticia
                    </button>
                </div>
            </header>

            {/* Main Content Area */}
            <div className="flex flex-1 flex-col lg:flex-row">
                
                {/* Editor Column (Left) */}
                <div className="flex-1 p-6 sm:p-12 md:p-16 lg:px-24">
                    
                    {/* Breadcrumb */}
                    <div className="flex items-center gap-3 mb-8 sm:mb-16">
                        <span className="text-[10px] font-bold tracking-widest text-[#a0b0ba] hover:text-[#597e96] uppercase cursor-pointer transition-colors">
                            Noticias
                        </span>
                        <span className="text-gray-300 text-xs">›</span>
                        <span className="text-[10px] font-bold tracking-widest text-[#111111] uppercase">
                            Nueva entrada
                        </span>
                    </div>

                    {/* Editor Form */}
                    <div className="flex flex-col gap-8 max-w-[800px]">
                        {/* Title */}
                        <div className="flex flex-col">
                            <textarea 
                                value={title}
                                onChange={handleTitleChange}
                                className={`w-full text-4xl sm:text-5xl md:text-6xl lg:text-[64px] font-serif font-black text-[#111111] leading-[1.1] tracking-tight placeholder:text-gray-200 resize-none outline-none overflow-hidden bg-transparent ${errors.title ? 'border-b-2 border-umbrella-red/30' : ''}`}
                                placeholder="Titular de la noticia..."
                                rows={2}
                            />
                            {errors.title && <span className="text-umbrella-red text-xs mt-2 font-bold">{errors.title}</span>}
                        </div>

                        {/* Subtitle */}
                        <textarea 
                            value={subtitle}
                            onChange={(e) => setSubtitle(e.target.value)}
                            className="w-full text-xl sm:text-2xl md:text-3xl font-serif italic text-gray-500 leading-snug placeholder:text-gray-200 resize-none outline-none overflow-hidden bg-transparent mt-2"
                            placeholder="Sub-titular o bajada de apoyo..."
                            rows={2}
                        />

                        <div className="w-full h-px bg-gray-100 my-8"></div>

                        {/* Lead / Entradilla */}
                        <div className="flex flex-col gap-4">
                            <div className="flex justify-between items-center">
                                <label className="text-[11px] font-bold tracking-widest text-umbrella-red uppercase">
                                    Lead / Entradilla
                                </label>
                                {errors.lead && <span className="text-umbrella-red text-[10px] font-bold">{errors.lead}</span>}
                            </div>
                            <textarea 
                                value={lead}
                                onChange={(e) => {
                                    setLead(e.target.value);
                                    if (errors.lead) setErrors({ ...errors, lead: "" });
                                }}
                                className={`w-full text-lg sm:text-xl font-sans text-[#597e96] leading-relaxed placeholder:text-gray-300 outline-none resize-none bg-transparent ${errors.lead ? 'border-b border-umbrella-red/30' : ''}`}
                                placeholder="El resumen que engancha al lector..."
                                rows={2}
                            />
                        </div>

                        {/* Featured Image */}
                        <div className="mt-12 bg-[#f4f7f9] border border-dashed border-[#d1dce5] rounded-xl p-8 sm:p-12 md:p-24 flex flex-col items-center justify-center text-center transition-colors hover:bg-gray-50 group cursor-pointer">
                            <div className="bg-white p-4 rounded-full shadow-sm mb-4 text-[#a0b0ba] group-hover:text-umbrella-red group-hover:scale-110 transition-all">
                                <ImageIcon className="w-6 h-6 sm:w-8 sm:h-8" />
                            </div>
                            <span className="text-[10px] sm:text-[11px] font-bold tracking-widest text-[#597e96] uppercase mb-4">
                                Añadir imagen destacada
                            </span>
                            <button className="bg-white border border-[#d1dce5] hover:border-gray-300 text-[#111111] px-4 sm:px-5 py-2.5 rounded-sm text-xs font-bold tracking-wide transition-all shadow-sm">
                                Subir archivo
                            </button>
                        </div>

                        {/* Body Placeholder */}
                        <div className="mt-8 flex flex-col">
                            <textarea 
                                value={content}
                                onChange={(e) => {
                                    setContent(e.target.value);
                                    if (errors.content) setErrors({ ...errors, content: "" });
                                }}
                                className={`w-full text-[#111111] font-serif text-xl border-l-4 ${errors.content ? 'border-umbrella-red' : 'border-gray-100'} pl-6 py-2 outline-none min-h-[400px] resize-y placeholder:italic placeholder:text-gray-300 bg-transparent`}
                                placeholder="Comienza a escribir el cuerpo principal de la noticia aquí..."
                            />
                            {errors.content && <span className="text-umbrella-red text-xs mt-3 font-bold">{errors.content}</span>}
                        </div>
                    </div>

                </div>

                {/* Sidebar Column (Right) */}
                <aside className="w-full lg:w-[380px] shrink-0 border-t lg:border-t-0 lg:border-l border-gray-100 bg-[#fbfcfd] p-6 sm:p-8 lg:p-10 flex flex-col gap-10 lg:gap-12">
                    
                    {/* Admin Author Assignment */}
                    {isAdmin && (
                        <section className="flex flex-col gap-6">
                            <h3 className="text-[10px] font-bold tracking-widest text-[#a0b0ba] uppercase pb-2 border-b border-gray-200">
                                Autor
                            </h3>
                            
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-bold text-[#597e96] tracking-wide uppercase">
                                    Asignar autor
                                </label>
                                <div className="relative">
                                    <select 
                                        value={author}
                                        onChange={(e) => {
                                            setAuthor(e.target.value);
                                            if (errors.author) setErrors({ ...errors, author: "" });
                                        }}
                                        className={`w-full appearance-none bg-white border ${errors.author ? 'border-umbrella-red' : 'border-gray-200'} rounded text-sm text-[#111111] pl-4 pr-10 py-3 outline-none focus:border-umbrella-red focus:ring-1 focus:ring-umbrella-red transition-all cursor-pointer`}
                                    >
                                        <option value="" disabled>Seleccione un autor...</option>
                                        <option value="Elena Rodríguez">Elena Rodríguez</option>
                                        <option value="David Santos">David Santos</option>
                                        <option value="Sofía Larson">Sofía Larson</option>
                                        <option value="M. Garay">M. Garay</option>
                                        <option value="P. Rojas">P. Rojas</option>
                                        <option value="L. Méndez">L. Méndez</option>
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                </div>
                                {errors.author && <span className="text-umbrella-red text-[10px] font-bold">{errors.author}</span>}
                            </div>
                        </section>
                    )}

                    {/* Visibility */}
                    <section className="flex flex-col gap-6">
                        <h3 className="text-[10px] font-bold tracking-widest text-[#a0b0ba] uppercase pb-2 border-b border-gray-200">
                            Estado & Visibilidad
                        </h3>
                        
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-bold text-[#597e96] tracking-wide uppercase">
                                Estado actual
                            </label>
                            <div className="relative">
                                <select 
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="w-full appearance-none bg-white border border-gray-200 rounded text-sm text-[#111111] pl-4 pr-10 py-3 outline-none focus:border-umbrella-red focus:ring-1 focus:ring-umbrella-red transition-all cursor-pointer"
                                >
                                    <option value="Borrador">Borrador</option>
                                    <option value="Publicada">Publicada</option>
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            </div>
                        </div>
                    </section>

                    {/* Classification */}
                    <section className="flex flex-col gap-6">
                        <h3 className="text-[10px] font-bold tracking-widest text-[#a0b0ba] uppercase pb-2 border-b border-gray-200">
                            Clasificación
                        </h3>
                        
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-bold text-[#597e96] tracking-wide uppercase">
                                    Categoría principal
                                </label>
                                <div className="relative">
                                    <select 
                                        value={category}
                                        onChange={handleCategoryChange}
                                        className={`w-full appearance-none bg-white border ${errors.category ? 'border-umbrella-red' : 'border-gray-200'} rounded text-sm text-[#111111] pl-4 pr-10 py-3 outline-none focus:border-umbrella-red focus:ring-1 focus:ring-umbrella-red transition-all cursor-pointer`}
                                    >
                                        <option value="" disabled>Seleccione...</option>
                                        {NAV_CATEGORIES.map((c) => (
                                            <option key={c.name} value={c.name}>{c.name}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                </div>
                                {errors.category && <span className="text-umbrella-red text-[10px] font-bold">{errors.category}</span>}
                            </div>
                            
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-bold text-[#597e96] tracking-wide uppercase">
                                    Subcategoría
                                </label>
                                <div className={`relative ${!subcategoriesOptions.length ? 'opacity-60 pointer-events-none' : ''}`}>
                                    <select 
                                        value={subcategory}
                                        onChange={(e) => setSubcategory(e.target.value)}
                                        className={`w-full appearance-none border border-gray-200 rounded text-sm pl-4 pr-10 py-3 outline-none ${!subcategoriesOptions.length ? 'bg-[#f4f7f9] text-gray-500 cursor-not-allowed' : 'bg-white text-[#111111] focus:border-umbrella-red focus:ring-1 focus:ring-umbrella-red cursor-pointer transition-all'}`}
                                    >
                                        {!category ? (
                                            <option value="" disabled>Primero elija categoría</option>
                                        ) : !subcategoriesOptions.length ? (
                                            <option value="" disabled>Sin subcategorías</option>
                                        ) : (
                                            <>
                                                <option value="" disabled>Seleccione...</option>
                                                {subcategoriesOptions.map((sub) => (
                                                    <option key={sub.slug} value={sub.name}>{sub.name}</option>
                                                ))}
                                            </>
                                        )}
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 mt-2">
                            <label className="text-[10px] font-bold text-[#597e96] tracking-wide uppercase">
                                Etiquetas
                            </label>
                            
                            <div className="flex flex-wrap gap-2 mb-3">
                                {tags.map((tag) => (
                                    <div key={tag} className="flex items-center justify-between gap-1 bg-[#f4f7f9] border border-gray-200 text-[#111111] px-2 py-1 rounded-sm text-[10px] font-bold tracking-wider uppercase">
                                        <span>{tag}</span>
                                        <button onClick={() => removeTag(tag)} className="text-gray-400 hover:text-umbrella-red p-0.5 rounded-sm transition-colors">
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <input 
                                type="text"
                                value={tagsText}
                                onChange={(e) => setTagsText(e.target.value)}
                                onKeyDown={handleKeyDownTag}
                                placeholder="Enter para añadir..."
                                className="w-full bg-white border border-gray-200 rounded text-sm text-[#111111] px-4 py-3 outline-none focus:border-umbrella-red focus:ring-1 focus:ring-umbrella-red transition-all"
                            />
                        </div>
                    </section>

                    {/* SEO */}
                    <section className="flex flex-col gap-6">
                        <h3 className="text-[10px] font-bold tracking-widest text-[#a0b0ba] uppercase pb-2 border-b border-gray-200">
                            Optimización SEO
                        </h3>
                        
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-bold text-[#597e96] tracking-wide uppercase">
                                    URL Slug
                                </label>
                                <div className="flex focus-within:ring-1 focus-within:ring-umbrella-red focus-within:border-umbrella-red rounded border border-gray-200 bg-white transition-all overflow-hidden items-stretch">
                                    <span className="bg-[#f4f7f9] text-[#a0b0ba] text-xs px-3 py-3 border-r border-gray-200 flex items-center shrink-0">
                                        /noticias/
                                    </span>
                                    <input 
                                        type="text"
                                        value={slug}
                                        onChange={handleSlugChange}
                                        placeholder="nueva-noticia-redaccion"
                                        className="w-full bg-transparent text-sm text-[#111111] px-3 py-3 outline-none min-w-0"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <div className="flex justify-between items-end">
                                    <label className="text-[10px] font-bold text-[#597e96] tracking-wide uppercase">
                                        Meta descripción
                                    </label>
                                    <span className={`text-[9px] font-bold ${metaDescription.length > 160 ? 'text-umbrella-red' : 'text-gray-400'}`}>
                                        {metaDescription.length}/160
                                    </span>
                                </div>
                                <textarea 
                                    value={metaDescription}
                                    onChange={(e) => {
                                        setMetaDescription(e.target.value);
                                        if (errors.metaDescription && e.target.value.length <= 160) {
                                            setErrors({ ...errors, metaDescription: "" });
                                        }
                                    }}
                                    className={`w-full bg-white border ${errors.metaDescription ? 'border-umbrella-red' : 'border-gray-200'} rounded text-sm text-[#111111] px-4 py-3 outline-none focus:border-umbrella-red focus:ring-1 focus:ring-umbrella-red transition-all resize-none placeholder:text-gray-300`}
                                    placeholder="Descripción para buscadores..."
                                    rows={4}
                                />
                                {errors.metaDescription && <span className="text-umbrella-red text-[10px] font-bold">{errors.metaDescription}</span>}
                            </div>
                        </div>
                    </section>
                </aside>
                
            </div>
        </div>
    );
}
