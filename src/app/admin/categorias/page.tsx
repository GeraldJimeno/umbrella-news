"use client";

import { Cpu, Trophy, TrendingUp, Film, Plus, Edit3, X, GripVertical, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import React, { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

interface Subcategory {
    id: string;
    name: string;
    slug: string;
    category_id: string;
}

interface Category {
    id: string;
    name: string;
    slug: string;
    icon_name?: string;
    subcategories: Subcategory[];
}

const iconMap: Record<string, React.ElementType> = {
    "Tecnología": Cpu,
    "Deportes": Trophy,
    "Economía": TrendingUp,
    "Entretenimiento": Film,
};

const getIcon = (name: string) => iconMap[name] || Plus;

export default function AdminCategoriesPage() {
    const supabase = createClient();
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Modal States
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [categoryInput, setCategoryInput] = useState("");

    const [isSubcategoryModalOpen, setIsSubcategoryModalOpen] = useState(false);
    const [editingSubcategory, setEditingSubcategory] = useState<{ catId: string; sub: Subcategory | null } | null>(null);
    const [subcategoryInput, setSubcategoryInput] = useState("");

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deletingSubcategory, setDeletingSubcategory] = useState<{ catId: string; sub: Subcategory } | null>(null);

    const [actionLoading, setActionLoading] = useState(false);
    const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const generateSlug = (text: string) => {
        return text
            .toLowerCase()
            .trim()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "") // remove accents
            .replace(/[^\w\s-]/g, "") // remove non-alphanumeric except spaces and hyphens
            .replace(/[\s_]+/g, "-") // replace spaces and underscores with hyphens
            .replace(/^-+|-+$/g, ""); // remove leading/trailing hyphens
    };

    const fetchCategories = async () => {
        setLoading(true);
        setError(null);
        try {
            const { data: catData, error: catError } = await supabase
                .from("categories")
                .select("*")
                .order("name");

            if (catError) throw catError;

            const { data: subData, error: subError } = await supabase
                .from("subcategories")
                .select("*")
                .order("name");

            if (subError) throw subError;

            const structured: Category[] = (catData || []).map(cat => ({
                ...cat,
                subcategories: (subData || []).filter(sub => sub.category_id === cat.id)
            }));

            setCategories(structured);
        } catch (err: any) {
            console.error("Error fetching categories:", err);
            setError("Error al cargar las categorías. Por favor, intenta de nuevo.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    // Category Actions
    const openCreateCategory = () => {
        setActionMessage(null);
        setEditingCategory(null);
        setCategoryInput("");
        setIsCategoryModalOpen(true);
    };

    const openEditCategory = (cat: Category) => {
        setActionMessage(null);
        setEditingCategory(cat);
        setCategoryInput(cat.name);
        setIsCategoryModalOpen(true);
    };

    const handleSaveCategory = async () => {
        if (!categoryInput.trim()) return;
        setActionLoading(true);
        setActionMessage(null);

        const name = categoryInput.trim();
        const slug = generateSlug(name);

        try {
            if (editingCategory) {
                const { error } = await supabase
                    .from("categories")
                    .update({ name, slug })
                    .eq("id", editingCategory.id);
                if (error) throw error;
                setActionMessage({ type: 'success', text: 'Categoría actualizada correctamente.' });
            } else {
                const { error } = await supabase
                    .from("categories")
                    .insert([{ name, slug }]);
                if (error) throw error;
                setActionMessage({ type: 'success', text: 'Categoría creada correctamente.' });
            }

            setTimeout(() => {
                fetchCategories();
                setIsCategoryModalOpen(false);
            }, 1000);
        } catch (err: any) {
            console.error("Error saving category:", err);
            setActionMessage({ type: 'error', text: 'Error al guardar la categoría. Puede que ya exista o falten permisos.' });
        } finally {
            setActionLoading(false);
        }
    };

    // Subcategory Actions
    const openCreateSubcategory = (catId: string) => {
        setActionMessage(null);
        setEditingSubcategory({ catId, sub: null });
        setSubcategoryInput("");
        setIsSubcategoryModalOpen(true);
    };

    const openEditSubcategory = (catId: string, sub: Subcategory) => {
        setActionMessage(null);
        setEditingSubcategory({ catId, sub });
        setSubcategoryInput(sub.name);
        setIsSubcategoryModalOpen(true);
    };

    const handleSaveSubcategory = async () => {
        if (!subcategoryInput.trim() || !editingSubcategory) return;
        setActionLoading(true);
        setActionMessage(null);

        const name = subcategoryInput.trim();
        const slug = generateSlug(name);
        const category_id = editingSubcategory.catId;

        try {
            if (editingSubcategory.sub) {
                const { error } = await supabase
                    .from("subcategories")
                    .update({ name, slug, category_id })
                    .eq("id", editingSubcategory.sub.id);
                if (error) throw error;
                setActionMessage({ type: 'success', text: 'Subcategoría actualizada.' });
            } else {
                const { error } = await supabase
                    .from("subcategories")
                    .insert([{ name, slug, category_id }]);
                if (error) throw error;
                setActionMessage({ type: 'success', text: 'Subcategoría creada.' });
            }

            setTimeout(() => {
                fetchCategories();
                setIsSubcategoryModalOpen(false);
            }, 1000);
        } catch (err: any) {
            console.error("Error saving subcategory:", err);
            setActionMessage({ type: 'error', text: 'Error al guardar la subcategoría.' });
        } finally {
            setActionLoading(false);
        }
    };

    // Delete Actions
    const openDeleteSubcategory = (catId: string, sub: Subcategory) => {
        setActionMessage(null);
        setDeletingSubcategory({ catId, sub });
        setIsDeleteModalOpen(true);
    };

    const confirmDeleteSubcategory = async () => {
        if (!deletingSubcategory) return;
        setActionLoading(true);
        setActionMessage(null);

        try {
            const { error } = await supabase
                .from("subcategories")
                .delete()
                .eq("id", deletingSubcategory.sub.id);

            if (error) throw error;

            setActionMessage({ type: 'success', text: 'Subcategoría eliminada.' });
            setTimeout(() => {
                fetchCategories();
                setIsDeleteModalOpen(false);
            }, 1000);
        } catch (err: any) {
            console.error("Error deleting subcategory:", err);
            setActionMessage({ type: 'error', text: 'Error al eliminar. Puede estar siendo usada en noticias.' });
        } finally {
            setActionLoading(false);
        }
    };
  

    return (
        <div className="p-6 sm:p-8 md:p-12 max-w-5xl mx-auto w-full">
            <div className="w-full pb-8">
                
                {/* Header Area */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 mb-12">
                    <div>
                        <h1 className="font-serif text-4xl md:text-5xl font-black text-[#111111] tracking-tight mb-2 md:mb-3">
                            Categorías
                        </h1>
                        <p className="text-[#597e96] font-sans text-sm pb-1 leading-relaxed">
                            Organiza y gestiona las secciones del portal
                        </p>
                    </div>
                    
                    <div className="flex items-center shrink-0 pt-2 w-full sm:w-auto">
                        <button 
                            onClick={openCreateCategory}
                            className="flex flex-1 sm:flex-none justify-center items-center gap-2 bg-umbrella-red hover:bg-red-700 text-white px-6 py-3 rounded-sm text-sm font-bold tracking-wide uppercase transition-colors shadow-sm shadow-red-500/20"
                        >
                            <Plus className="w-4 h-4" />
                            Nueva categoría
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="mt-8 min-h-[400px]">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-gray-100">
                            <Loader2 className="w-10 h-10 text-umbrella-red animate-spin mb-4" />
                            <p className="text-gray-500 font-bold text-sm tracking-wide">Cargando categorías...</p>
                        </div>
                    ) : error ? (
                        <div className="flex flex-col items-center justify-center py-12 px-6 text-center bg-red-50 rounded-xl border border-red-100">
                            <AlertCircle className="w-10 h-10 text-umbrella-red mb-4" />
                            <h3 className="text-red-900 font-bold mb-2">Error de conexión</h3>
                            <p className="text-red-700 text-sm max-w-md mb-6">{error}</p>
                            <button 
                                onClick={fetchCategories}
                                className="bg-umbrella-red text-white px-6 py-2 rounded-sm text-xs font-bold uppercase tracking-widest hover:bg-red-700 transition-colors"
                            >
                                Reintentar
                            </button>
                        </div>
                    ) : categories.length === 0 ? (
                        <div className="text-center py-12 text-gray-500 font-bold bg-white rounded-xl border border-gray-100 italic">
                            No hay categorías configuradas todavía.
                        </div>
                    ) : (
                        <div className="flex flex-col gap-8">
                            {categories.map((cat) => {
                                const Icon = getIcon(cat.name);
                                return (
                                    <div key={cat.id} className="bg-white border border-gray-100 rounded-xl shadow-[0_2px_12px_-4px_rgba(0,0,0,0.05)] flex flex-col items-stretch overflow-hidden transition-all hover:border-gray-200">
                                        
                                        {/* Main Category Header */}
                                        <div className="p-6 md:p-8 flex items-center justify-between gap-4 border-b border-gray-100 bg-white">
                                            <div className="flex items-center gap-4 md:gap-6">
                                                <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-umbrella-red/5 flex items-center justify-center shrink-0">
                                                    <Icon className="w-5 h-5 md:w-6 md:h-6 text-umbrella-red" />
                                                </div>
                                                <div className="flex flex-col text-left">
                                                    <h2 className="font-serif text-2xl md:text-[28px] font-bold text-[#111111] leading-tight mb-1">
                                                        {cat.name}
                                                    </h2>
                                                    <span className="text-[10px] font-bold tracking-widest text-[#a0b0ba] uppercase">
                                                        Categoría principal
                                                    </span>
                                                </div>
                                            </div>
                                            
                                            <button 
                                                onClick={() => openEditCategory(cat)}
                                                title="Editar categoría principal"
                                                className="p-2 text-gray-400 hover:bg-gray-50 hover:text-[#597e96] rounded-full transition-colors flex shrink-0"
                                            >
                                                <Edit3 className="w-4 h-4 md:w-5 md:h-5" />
                                            </button>
                                        </div>

                                        {/* Subcategories Area */}
                                        <div className="p-6 md:px-8 md:py-8 bg-[#fdfdfd] text-left">
                                            <h3 className="text-xs font-semibold text-gray-400 mb-4 tracking-wider uppercase">
                                                Subcategorías
                                            </h3>
                                            
                                            <div className="flex flex-wrap items-center gap-3">
                                                {cat.subcategories.map((sub) => (
                                                    <div 
                                                        key={sub.id} 
                                                        className="group flex items-center bg-white border border-gray-200 rounded-full pl-4 pr-1.5 py-1.5 shadow-sm hover:border-gray-300 hover:shadow transition-all"
                                                    >
                                                        <span className="text-sm font-semibold text-[#111111] leading-none mb-[1px]">
                                                            {sub.name}
                                                        </span>
                                                        <div className="flex items-center text-gray-300 ml-2">
                                                            <div className="w-[1px] h-4 bg-gray-200 mr-1.5"></div>
                                                            <button 
                                                                onClick={() => openEditSubcategory(cat.id, sub)}
                                                                title={`Editar ${sub.name}`}
                                                                className="w-6 h-6 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-[#597e96] transition-colors"
                                                            >
                                                                <Edit3 className="w-3.5 h-3.5" />
                                                            </button>
                                                            <button 
                                                                onClick={() => openDeleteSubcategory(cat.id, sub)}
                                                                title={`Eliminar ${sub.name}`}
                                                                className="w-6 h-6 flex items-center justify-center rounded-full text-gray-400 hover:bg-red-50 hover:text-umbrella-red transition-colors"
                                                            >
                                                                <X className="w-3.5 h-3.5" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}

                                                {/* Add Subcategory Action */}
                                                <button 
                                                    onClick={() => openCreateSubcategory(cat.id)}
                                                    className="flex items-center gap-1.5 bg-transparent border border-dashed border-gray-300 rounded-full pl-3 pr-4 py-1.5 hover:bg-gray-50 hover:border-gray-400 text-gray-400 hover:text-[#597e96] transition-all group shrink-0"
                                                >
                                                    <Plus className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#597e96]" />
                                                    <span className="text-sm font-semibold">Crear subcategoría</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Optional philosophical footer quote based on the mockup */}
                <div className="mt-16 text-center">
                    <p className="text-xs italic font-serif text-[#a0b0ba]">
                        "Una jerarquía limpia garantiza una navegación intuitiva para el lector."
                    </p>
                </div>            {/* Category Modal */}
            {isCategoryModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-opacity">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-6 md:p-8">
                            <h3 className="font-serif text-2xl font-bold text-[#111111] mb-2 leading-tight">
                                {editingCategory ? "Editar categoría" : "Nueva categoría"}
                            </h3>
                            <p className="text-[#597e96] text-sm mb-6 leading-relaxed">
                                {editingCategory ? "Modifica el nombre de la categoría principal." : "Crea una nueva categoría principal para organizar el contenido."}
                            </p>
                            
                            {actionMessage && (
                                <div className={`mb-6 p-4 rounded-sm flex items-start gap-3 border ${
                                    actionMessage.type === 'success' 
                                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                                        : 'bg-red-50 text-umbrella-red border-red-200'
                                }`}>
                                    {actionMessage.type === 'success' ? (
                                        <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                                    ) : (
                                        <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                                    )}
                                    <span className="text-sm font-medium pt-0.5">{actionMessage.text}</span>
                                </div>
                            )}

                            <div className="space-y-4 text-left">
                                <div>
                                    <label className="block text-sm font-bold text-[#111111] mb-2">Nombre de la categoría</label>
                                    <input 
                                        type="text"
                                        value={categoryInput}
                                        onChange={(e) => setCategoryInput(e.target.value)}
                                        onKeyDown={(e) => { if (e.key === "Enter" && !actionLoading) handleSaveCategory(); }}
                                        placeholder="Ej: Tecnología, Estilo de vida..."
                                        className="w-full bg-white border border-gray-200 rounded-lg py-3 px-4 text-sm focus:border-umbrella-red focus:ring-1 focus:ring-umbrella-red outline-none text-[#111111] placeholder:text-gray-400 transition-all shadow-sm"
                                        autoFocus
                                        disabled={actionLoading}
                                    />
                                </div>
                            </div>

                            <div className="mt-8 flex flex-col-reverse sm:flex-row items-center justify-end gap-3 sm:gap-4">
                                <button 
                                    onClick={() => setIsCategoryModalOpen(false)} 
                                    disabled={actionLoading}
                                    className="w-full sm:w-auto px-6 py-2.5 text-sm font-bold text-gray-500 hover:text-[#111111] hover:bg-gray-50 rounded-sm transition-colors disabled:opacity-50"
                                >
                                    Cancelar
                                </button>
                                <button 
                                    onClick={handleSaveCategory}
                                    disabled={!categoryInput.trim() || actionLoading}
                                    className="w-full sm:w-auto bg-umbrella-red hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-sm text-sm font-bold tracking-wide uppercase transition-colors shadow-sm shadow-red-500/20 flex items-center justify-center gap-2"
                                >
                                    {actionLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                                    {actionLoading ? "Guardando..." : "Guardar"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Subcategory Modal */}
            {isSubcategoryModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-opacity">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-6 md:p-8">
                            <h3 className="font-serif text-2xl font-bold text-[#111111] mb-2 leading-tight">
                                {editingSubcategory?.sub ? "Editar subcategoría" : "Nueva subcategoría"}
                            </h3>
                            <p className="text-[#597e96] text-sm mb-6 leading-relaxed text-left">
                                Ingresa el nombre de la subsección.
                            </p>
                            
                            {actionMessage && (
                                <div className={`mb-6 p-4 rounded-sm flex items-start gap-3 border ${
                                    actionMessage.type === 'success' 
                                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                                        : 'bg-red-50 text-umbrella-red border-red-200'
                                }`}>
                                    {actionMessage.type === 'success' ? (
                                        <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                                    ) : (
                                        <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                                    )}
                                    <span className="text-sm font-medium pt-0.5">{actionMessage.text}</span>
                                </div>
                            )}

                            <div className="space-y-4 text-left">
                                <div>
                                    <label className="block text-sm font-bold text-[#111111] mb-2">Nombre</label>
                                    <input 
                                        type="text"
                                        value={subcategoryInput}
                                        onChange={(e) => setSubcategoryInput(e.target.value)}
                                        onKeyDown={(e) => { if (e.key === "Enter" && !actionLoading) handleSaveSubcategory(); }}
                                        placeholder="Ej: Startups, Cine, Mercados..."
                                        className="w-full bg-white border border-gray-200 rounded-lg py-3 px-4 text-sm focus:border-umbrella-red focus:ring-1 focus:ring-umbrella-red outline-none text-[#111111] placeholder:text-gray-400 transition-all shadow-sm"
                                        autoFocus
                                        disabled={actionLoading}
                                    />
                                </div>
                            </div>

                            <div className="mt-8 flex flex-col-reverse sm:flex-row items-center justify-end gap-3 sm:gap-4">
                                <button 
                                    onClick={() => setIsSubcategoryModalOpen(false)} 
                                    disabled={actionLoading}
                                    className="w-full sm:w-auto px-6 py-2.5 text-sm font-bold text-gray-500 hover:text-[#111111] hover:bg-gray-50 rounded-sm transition-colors disabled:opacity-50"
                                >
                                    Cancelar
                                </button>
                                <button 
                                    onClick={handleSaveSubcategory}
                                    disabled={!subcategoryInput.trim() || actionLoading}
                                    className="w-full sm:w-auto bg-[#111111] hover:bg-black disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-sm text-sm font-bold tracking-wide uppercase transition-colors shadow-sm flex items-center justify-center gap-2"
                                >
                                    {actionLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                                    {actionLoading ? "Guardando..." : "Guardar"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirm Modal */}
            {isDeleteModalOpen && deletingSubcategory && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-opacity">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-6 md:p-8 text-center">
                            <div className="w-16 h-16 bg-red-50 text-umbrella-red rounded-full flex items-center justify-center mx-auto mb-6">
                                <X className="w-8 h-8" />
                            </div>
                            <h3 className="font-serif text-2xl font-bold text-[#111111] mb-3 leading-tight">
                                Eliminar subcategoría
                            </h3>
                            <p className="text-[#597e96] text-sm mb-8 leading-relaxed">
                                ¿Estás seguro de que deseas eliminar la subcategoría <strong className="text-[#111111]">"{deletingSubcategory.sub.name}"</strong>? Esta acción no se puede deshacer.
                            </p>

                            {actionMessage && (
                                <div className={`mb-6 p-4 rounded-sm flex items-start gap-3 border text-left ${
                                    actionMessage.type === 'success' 
                                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                                        : 'bg-red-50 text-umbrella-red border-red-200'
                                }`}>
                                    {actionMessage.type === 'success' ? (
                                        <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                                    ) : (
                                        <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                                    )}
                                    <span className="text-sm font-medium pt-0.5">{actionMessage.text}</span>
                                </div>
                            )}

                            <div className="flex flex-col-reverse sm:flex-row items-center justify-center gap-3">
                                <button 
                                    onClick={() => setIsDeleteModalOpen(false)} 
                                    disabled={actionLoading}
                                    className="w-full sm:w-auto px-6 py-2.5 text-sm font-bold text-gray-500 hover:text-[#111111] hover:bg-gray-50 rounded-sm transition-colors disabled:opacity-50"
                                >
                                    Cancelar
                                </button>
                                <button 
                                    onClick={confirmDeleteSubcategory}
                                    disabled={actionLoading}
                                    className="w-full sm:w-auto bg-umbrella-red hover:bg-red-700 text-white px-6 py-2.5 rounded-sm text-sm font-bold tracking-wide uppercase transition-colors shadow-sm shadow-red-500/20 flex items-center justify-center gap-2"
                                >
                                    {actionLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                                    {actionLoading ? "Eliminando..." : "Eliminar"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            </div>
        </div>
    );
}
