"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Menu, Search, User, ChevronRight, ChevronDown } from "lucide-react";
import { Container } from "./Container";
import { Button } from '@/components/ui';
import { MobileDrawer } from "@/components/MobileDrawer";
import { useCategories } from "@/hooks/useCategories";
import { useWeather } from "@/hooks/useWeather";

export function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const supabase = createClient();
    
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
    
    const { temp, desc, loading: weatherLoading } = useWeather();
    const { categories, loading: categoriesLoading } = useCategories();
    const [userProfile, setUserProfile] = useState<{ full_name?: string, email?: string } | null>(null);
    const [loadingAuth, setLoadingAuth] = useState(true);

    useEffect(() => {
        async function fetchUser() {
            setLoadingAuth(true);
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data } = await supabase.from("profiles").select("full_name, status").eq("id", user.id).single();
                
                if (data?.status === "inactive") {
                    await supabase.auth.signOut();
                    setUserProfile(null);
                } else {
                    setUserProfile({
                        full_name: data?.full_name,
                        email: user.email,
                    });
                }
            } else {
                setUserProfile(null);
            }
            setLoadingAuth(false);
        }
        
        fetchUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === "SIGNED_OUT") {
                setUserProfile(null);
            } else if (session?.user) {
                fetchUser();
            }
        });

        return () => subscription.unsubscribe();
    }, [supabase]);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push("/");
    };

    const handleSearch = () => {
        if (searchQuery.trim()) {
            router.push(`/busqueda?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    const isActive = (href: string) => {
        if (href === "/") return pathname === "/";
        return pathname.startsWith(href);
    };

    const mainCategories = categories.slice(0, 8);
    const activeHoverCatObj = categories.find(c => c.name === hoveredCategory && c.subcategories.length > 0);

    return (
        <>
            <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
                {/* Top Navbar Section */}
                <Container className="py-4 md:py-6 flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1">
                        <button
                            onClick={() => setDrawerOpen(true)}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            aria-label="Abrir menú"
                        >
                            <Menu className="w-6 h-6 text-gray-800" strokeWidth={1.5} />
                        </button>
                        <div className="hidden md:flex items-center bg-gray-100 rounded-full px-4 py-2 w-64 focus-within:ring-1 focus-within:ring-gray-300 transition-all">
                            <button onClick={handleSearch} aria-label="Buscar" className="outline-none">
                                <Search className="w-4 h-4 text-gray-500 mr-2 flex-shrink-0 hover:text-umbrella-red transition-colors" />
                            </button>
                            <input
                                type="text"
                                placeholder="Buscar noticias..."
                                className="bg-transparent border-none outline-none text-sm w-full text-gray-700"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={handleKeyDown}
                            />
                        </div>
                    </div>

                    {/* Logo */}
                    <div className="flex-1 flex justify-center">
                        <Link href="/" className="flex flex-col items-center group">
                            <h1 className="font-serif text-4xl tracking-tighter sm:text-5xl font-black text-black leading-none">
                                UMBRELLA<span className="text-umbrella-red">NEWS</span>
                            </h1>
                        </Link>
                    </div>

                    <div className="flex items-center justify-end space-x-4 lg:space-x-6 flex-1 min-w-0">
                        {/* Compact Weather */}
                        <div className="hidden lg:flex items-center gap-2 px-3 border-r border-gray-100 mr-2 shrink-0">
                            {weatherLoading ? (
                                <div className="h-4 w-16 bg-gray-100 animate-pulse rounded" />
                            ) : (
                                <>
                                    <span className="font-bold text-gray-800 text-sm whitespace-nowrap">{temp}°C</span>
                                    <span className="text-gray-400 text-[10px] uppercase font-bold tracking-tight truncate max-w-[70px]" title={desc}>
                                        {desc}
                                    </span>
                                </>
                            )}
                        </div>
                        
                        {!loadingAuth ? (
                            userProfile ? (
                                <div className="flex items-center space-x-3 lg:space-x-4 shrink min-w-0">
                                    <span 
                                        className="text-sm font-medium text-gray-800 hidden sm:inline-block truncate max-w-[180px] lg:max-w-[300px]"
                                        title={`Bienvenido, ${userProfile.full_name || userProfile.email?.split("@")[0]}`}
                                    >
                                        Bienvenido, <span className="font-bold">{userProfile.full_name || userProfile.email?.split("@")[0]}</span>
                                    </span>
                                    <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        className="text-[10px] text-gray-600 hover:text-umbrella-red hover:bg-red-50 font-bold tracking-widest uppercase border border-gray-200 hover:border-red-200 transition-all duration-200 cursor-pointer active:scale-95 shadow-sm shrink-0" 
                                        onClick={handleSignOut}
                                    >
                                        CERRAR SESIÓN
                                    </Button>
                                </div>
                            ) : (
                                <Button 
                                    variant="secondary" 
                                    className="flex items-center cursor-pointer transition-all duration-200 hover:bg-gray-100 hover:shadow-sm active:scale-95 border border-gray-200 shrink-0" 
                                    onClick={() => router.push('/login')}
                                >
                                    <User className="w-3.5 h-3.5 mr-2" />
                                    INICIAR SESIÓN
                                </Button>
                            )
                        ) : (
                            <div className="w-24 h-8 bg-gray-100 animate-pulse rounded-md shrink-0" />
                        )}
                    </div>
                </Container>

                {/* Bottom Categories Navigation + Dropdown Container */}
                <div 
                    className="relative border-t border-gray-100 bg-white group"
                    onMouseLeave={() => {
                        setHoveredCategory(null);
                        setIsMegaMenuOpen(false);
                    }}
                >
                    <Container>
                        <div className="flex items-center justify-center space-x-6 overflow-x-auto no-scrollbar py-3 relative z-20 bg-white">
                            {/* Static Portada link */}
                            <Link
                                href="/"
                                className={`text-xs font-bold tracking-widest uppercase whitespace-nowrap pb-3 border-b-2 pt-1 px-1 transition-colors
                                ${pathname === "/"
                                    ? 'text-umbrella-red border-umbrella-red'
                                    : 'text-gray-600 border-transparent hover:text-black hover:border-gray-300'}`}
                            >
                                PORTADA
                            </Link>

                            {categoriesLoading ? (
                                <div className="h-4 w-32 bg-gray-100 animate-pulse rounded" />
                            ) : (
                                <>
                                    {mainCategories.map((cat) => {
                                        const href = `/categoria/${cat.slug}`;
                                        return (
                                            <Link
                                                key={cat.id}
                                                href={href}
                                                className={`text-xs font-bold tracking-widest uppercase whitespace-nowrap pb-3 border-b-2 pt-1 px-1 transition-colors
                                                ${isActive(href)
                                                    ? 'text-umbrella-red border-umbrella-red'
                                                    : 'text-gray-600 border-transparent hover:text-black hover:border-gray-300'}`}
                                                onMouseEnter={() => {
                                                    setHoveredCategory(cat.name);
                                                    setIsMegaMenuOpen(false);
                                                }}
                                            >
                                                {cat.name}
                                            </Link>
                                        );
                                    })}

                                    {/* VER TODAS Button */}
                                    <button
                                        onMouseEnter={() => {
                                            setHoveredCategory(null);
                                            setIsMegaMenuOpen(true);
                                        }}
                                        className={`text-xs font-bold tracking-widest uppercase whitespace-nowrap pb-3 border-b-2 pt-1 px-1 transition-colors flex items-center gap-1
                                        ${isMegaMenuOpen
                                            ? 'text-umbrella-red border-umbrella-red'
                                            : 'text-gray-600 border-transparent hover:text-black hover:border-gray-300'}`}
                                    >
                                        VER TODAS <ChevronDown className={`w-3 h-3 transition-transform ${isMegaMenuOpen ? 'rotate-180' : ''}`} />
                                    </button>
                                </>
                            )}
                        </div>
                    </Container>

                    {/* Standard Category Hover Dropdown */}
                    <div 
                        className={`absolute left-0 top-full w-full bg-slate-50 border-b border-gray-200 shadow-sm transition-all duration-300 origin-top overflow-hidden hidden md:block z-10 ${
                            activeHoverCatObj && !isMegaMenuOpen ? 'max-h-[200px] opacity-100 py-4' : 'max-h-0 opacity-0 py-0 pointer-events-none'
                        }`}
                    >
                        <Container>
                            <div className="flex items-center justify-center space-x-12">
                                {activeHoverCatObj?.subcategories?.map(sub => (
                                    <Link
                                        key={sub.id}
                                        href={`/categoria/${activeHoverCatObj.slug}/${sub.slug}`}
                                        className="text-sm font-semibold text-gray-700 hover:text-umbrella-red transition-colors"
                                        onClick={() => setHoveredCategory(null)}
                                    >
                                        {sub.name}
                                    </Link>
                                ))}
                                {activeHoverCatObj && (
                                    <>
                                        <div className="w-px h-5 bg-gray-300 mx-4" aria-hidden="true" />
                                        <Link
                                            href={`/categoria/${activeHoverCatObj.slug}`}
                                            className="text-sm font-bold uppercase tracking-wider text-umbrella-red flex items-center hover:text-red-700 transition-colors"
                                            onClick={() => setHoveredCategory(null)}
                                        >
                                            Ver todo {activeHoverCatObj.name} <ChevronRight className="w-4 h-4 ml-1" />
                                        </Link>
                                    </>
                                )}
                            </div>
                        </Container>
                    </div>

                    {/* MEGA MENU: VER TODAS */}
                    <div 
                        className={`absolute left-0 top-full w-full bg-white border-b border-gray-200 shadow-xl transition-all duration-300 origin-top overflow-hidden hidden md:block z-10 ${
                            isMegaMenuOpen ? 'max-h-[600px] opacity-100 py-10' : 'max-h-0 opacity-0 py-0 pointer-events-none'
                        }`}
                    >
                        <Container>
                            <div className="grid grid-cols-4 lg:grid-cols-5 gap-y-10 gap-x-8 text-left">
                                {categories.map((cat) => (
                                    <div key={cat.id} className="flex flex-col">
                                        <Link 
                                            href={`/categoria/${cat.slug}`}
                                            className="font-serif text-lg font-black text-black hover:text-umbrella-red transition-colors mb-3 uppercase tracking-tight"
                                            onClick={() => setIsMegaMenuOpen(false)}
                                        >
                                            {cat.name}
                                        </Link>
                                        <div className="flex flex-col space-y-2">
                                            {cat.subcategories.map((sub) => (
                                                <Link
                                                    key={sub.id}
                                                    href={`/categoria/${cat.slug}/${sub.slug}`}
                                                    className="text-[13px] text-gray-500 hover:text-black transition-colors font-medium"
                                                    onClick={() => setIsMegaMenuOpen(false)}
                                                >
                                                    {sub.name}
                                                </Link>
                                            ))}
                                            {cat.subcategories.length === 0 && (
                                                <span className="text-[11px] text-gray-300 italic">Sin subcategorías</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="mt-12 pt-8 border-t border-gray-50 flex justify-between items-center text-[#597e96]">
                                <p className="text-xs font-serif italic italic font-medium">
                                    Explora todo nuestro contenido organizado por secciones
                                </p>
                                <button 
                                    onClick={() => setIsMegaMenuOpen(false)}
                                    className="text-[10px] font-bold tracking-widest uppercase hover:text-black transition-colors"
                                >
                                    Cerrar ×
                                </button>
                            </div>
                        </Container>
                    </div>
                </div>
            </nav>

            {/* Mobile Drawer */}
            <MobileDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
        </>
    );
}
