"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { X, Search, Sun, ChevronRight, LayoutDashboard, User, Bookmark } from "lucide-react";
import { useCategories } from "@/hooks/useCategories";
import { useWeather } from "@/hooks/useWeather";
import { createClient } from "@/lib/supabase/client";

interface MobileDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

export function MobileDrawer({ isOpen, onClose }: MobileDrawerProps) {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const { temp, desc, loading: weatherLoading } = useWeather();
    const drawerRef = useRef<HTMLDivElement>(null);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedQuery = searchQuery.trim();
        if (trimmedQuery) {
            router.push(`/busqueda?q=${encodeURIComponent(trimmedQuery)}`);
            onClose();
        }
    };
    const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
    const [userRole, setUserRole] = useState<string | null>(null);
    const supabase = createClient();

    // Fetch user role
    useEffect(() => {
        const fetchRole = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data } = await supabase.from("profiles").select("role, status").eq("id", user.id).single();
                if (data && data.status !== "inactive") {
                    setUserRole(data.role);
                } else {
                    setUserRole(null);
                }
            } else {
                setUserRole(null);
            }
        };

        fetchRole();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (session?.user) {
                fetchRole();
            } else {
                setUserRole(null);
            }
        });

        return () => subscription.unsubscribe();
    }, [supabase]);

    // Close on Escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        if (isOpen) {
            document.addEventListener("keydown", handleEscape);
            document.body.style.overflow = "hidden";
        }
        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.body.style.overflow = "";
        };
    }, [isOpen, onClose]);

    // Reset expanded state when drawer closes
    useEffect(() => {
        if (!isOpen) {
            setExpandedCategory(null);
        }
    }, [isOpen]);

    const { categories, loading: categoriesLoading } = useCategories();

    const toggleCategory = (categoryName: string) => {
        setExpandedCategory((prev) => (prev === categoryName ? null : categoryName));
    };

    return (
        <>
            {/* Overlay */}
            <div
                className={`fixed inset-0 bg-black/40 z-[60] transition-opacity duration-300 ${
                    isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                }`}
                onClick={onClose}
                aria-hidden="true"
            />
            
            {/* Drawer Panel */}
            <div
                ref={drawerRef}
                className={`fixed top-0 left-0 h-full w-[280px] bg-white z-[70] shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
                    isOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                {/* Header: Logo + Close */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                    <Link href="/" onClick={onClose} className="flex items-center gap-3 group">
                        <img 
                            src="/umbrella-news-icon.png" 
                            alt="" 
                            className="w-8 h-8 object-contain"
                        />
                        <span className="font-serif text-xl font-black tracking-tighter text-black leading-none pt-0.5">
                            UMBRELLA<span className="text-umbrella-red">NEWS</span>
                        </span>
                    </Link>
                    <button
                        onClick={onClose}
                        className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                        aria-label="Cerrar menú"
                    >
                        <X className="w-5 h-5 text-gray-600" strokeWidth={1.5} />
                    </button>
                </div>

                {/* Weather Block */}
                <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-100">
                    <Sun className="w-5 h-5 text-amber-400" />
                    <div>
                        {weatherLoading ? (
                            <>
                                <div className="h-4 w-32 bg-gray-100 animate-pulse rounded mb-1" />
                                <div className="h-3 w-16 bg-gray-100 animate-pulse rounded" />
                            </>
                        ) : (
                            <>
                                <p className="text-sm font-semibold text-gray-800">Santo Domingo, {temp}°C</p>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-blue-500">
                                    {desc}
                                </p>
                            </>
                        )}
                    </div>
                </div>

                {/* Search Bar */}
                <div className="px-5 py-3 border-b border-gray-100">
                    <form onSubmit={handleSearch} className="flex items-center bg-gray-100 rounded-md px-3 py-2">
                        <button type="submit" aria-label="Buscar" className="mr-2 flex-shrink-0 hover:text-gray-600 transition-colors">
                            <Search className="w-4 h-4 text-gray-400" />
                        </button>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Buscar noticias..."
                            className="bg-transparent border-none outline-none text-sm w-full text-gray-700 placeholder:text-gray-400"
                        />
                    </form>
                </div>

                {/* Categories List */}
                <nav className="flex-1 overflow-y-auto py-2">
                    {categoriesLoading ? (
                        <div className="px-5 py-4 space-y-4">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="h-4 bg-gray-100 animate-pulse rounded w-full" />
                            ))}
                        </div>
                    ) : (
                        categories.map((cat) => {
                            const hasSubs = cat.subcategories && cat.subcategories.length > 0;
                            const isExpanded = expandedCategory === cat.name;
                            const href = `/categoria/${cat.slug}`;

                            return (
                                <div key={cat.id}>
                                    {/* Category Row */}
                                    {hasSubs ? (
                                        <button
                                            onClick={() => toggleCategory(cat.name)}
                                            className="w-full flex items-center justify-between px-5 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-50 transition-colors group"
                                        >
                                            <span className="flex items-center gap-2">
                                                {cat.name}
                                            </span>
                                            <ChevronRight
                                                className={`w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-transform duration-200 ${
                                                    isExpanded ? "rotate-90" : ""
                                                }`}
                                                strokeWidth={2}
                                            />
                                        </button>
                                    ) : (
                                        <Link
                                            href={href}
                                            onClick={onClose}
                                            className="flex items-center justify-between px-5 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-50 transition-colors group"
                                        >
                                            <span className="flex items-center gap-2">
                                                {cat.name}
                                            </span>
                                            <ChevronRight
                                                className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors"
                                                strokeWidth={2}
                                            />
                                        </Link>
                                    )}

                                    {/* Subcategories Panel */}
                                    {hasSubs && (
                                        <div
                                            className="overflow-hidden transition-all duration-300 ease-in-out"
                                            style={{
                                                maxHeight: isExpanded
                                                    ? `${cat.subcategories!.length * 44 + 8 + 44}px`
                                                    : "0px",
                                                opacity: isExpanded ? 1 : 0,
                                            }}
                                        >
                                            {/* Parent link */}
                                            <Link
                                                href={href}
                                                onClick={onClose}
                                                className="flex items-center pl-10 pr-5 py-2.5 text-[13px] font-semibold text-umbrella-red hover:bg-red-50/60 transition-colors"
                                            >
                                                Ver todo {cat.name}
                                            </Link>

                                            {/* Sub-items */}
                                            {cat.subcategories!.map((sub) => (
                                                <Link
                                                    key={sub.id}
                                                    href={`${href}/${sub.slug}`}
                                                    onClick={onClose}
                                                    className="flex items-center pl-10 pr-5 py-2.5 text-[13px] text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                                                >
                                                    <span className="w-1 h-1 rounded-full bg-gray-300 mr-2.5 flex-shrink-0" />
                                                    {sub.name}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </nav>

                {/* Account Access / Profile */}
                {userRole !== null && (
                    <div className="border-t border-gray-100 bg-gray-50/30">
                        <Link
                            href="/perfil"
                            onClick={onClose}
                            className="flex items-center justify-between px-5 py-4 text-sm font-semibold text-gray-800 hover:bg-gray-100 transition-colors group bg-white"
                        >
                            <span className="flex items-center gap-2 pt-[1px]">
                                <User className="w-4 h-4 mb-[2px] text-gray-500 group-hover:text-black transition-colors" />
                                Mi Perfil
                            </span>
                            <ChevronRight
                                className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors"
                                strokeWidth={2}
                            />
                        </Link>
                        <Link
                            href="/guardados"
                            onClick={onClose}
                            className="flex items-center justify-between px-5 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-100 transition-colors group bg-white"
                        >
                            <span className="flex items-center gap-2 pt-[1px]">
                                <Bookmark className="w-4 h-4 mb-[2px] text-gray-500 group-hover:text-black transition-colors" />
                                Guardados
                            </span>
                            <ChevronRight
                                className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors"
                                strokeWidth={2}
                            />
                        </Link>
                    </div>
                )}

                {/* Dashboard Access */}
                {(userRole === "admin" || userRole === "author") && (
                    <div className="border-t border-gray-100 bg-gray-50/50">
                        <Link
                            href={userRole === "admin" ? "/admin/dashboard" : "/autor/dashboard"}
                            onClick={onClose}
                            className="flex items-center justify-between px-5 py-4 text-sm font-semibold text-umbrella-red hover:bg-gray-100 transition-colors group"
                        >
                            <span className="flex items-center gap-2 tracking-wide pt-[1px]">
                                <LayoutDashboard className="w-4 h-4 mb-[2px]" />
                                IR A DASHBOARD
                            </span>
                            <ChevronRight
                                className="w-4 h-4 text-red-300 group-hover:text-umbrella-red transition-colors"
                                strokeWidth={2}
                            />
                        </Link>
                    </div>
                )}

                {/* Social Icons */}
                <div className="flex items-center gap-5 px-5 py-4 border-t border-gray-100">
                    {/* Facebook */}
                    <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors" aria-label="Facebook">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                    </a>
                    {/* X / Twitter */}
                    <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors" aria-label="Twitter">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                    </a>
                    {/* Instagram */}
                    <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors" aria-label="Instagram">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                        </svg>
                    </a>
                </div>
            </div>
        </>
    );
}
