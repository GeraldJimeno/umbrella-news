"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Umbrella, LayoutDashboard, FileText, ImageIcon, Users, Layers, LogOut, User, Bookmark } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const supabase = createClient();
    const [userProfile, setUserProfile] = useState<any>(null);

    useEffect(() => {
        async function fetchUser() {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
                setUserProfile({
                    full_name: data?.full_name || user.email?.split("@")[0],
                    role: data?.role || "reader",
                    avatar_url: data?.avatar_url,
                });
            }
        }
        fetchUser();
    }, [supabase]);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push("/");
    };

    const displayName = userProfile ? userProfile.full_name : "Cargando...";

    return (
        <div className="min-h-screen flex flex-col lg:flex-row bg-slate-50 font-sans">
            {/* Sidebar */}
            <aside className="w-full lg:w-[260px] bg-[#1a1c23] flex flex-col shrink-0 lg:min-h-screen text-gray-300 relative z-20 shadow-md lg:shadow-none">
                {/* Logo Area */}
                <div className="p-4 lg:p-6 flex justify-between items-center">
                    <Link href="/" className="flex flex-col gap-1 group">
                        <div className="flex items-center gap-2 lg:gap-3">
                            <img 
                                src="/umbrella-news-icon.png" 
                                alt="" 
                                className="w-6 h-6 lg:w-8 lg:h-8 object-contain"
                            />
                            <span className="font-serif text-base lg:text-[19px] tracking-tighter font-black text-white leading-none mt-1 uppercase">
                                Umbrella<span className="text-umbrella-red">News</span>
                            </span>
                        </div>
                        <span className="text-[8px] lg:text-[9px] tracking-[0.2em] text-gray-500 uppercase font-black mt-2 ml-8 lg:ml-11">
                            NEWS PORTAL CMS
                        </span>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex lg:flex-col overflow-x-auto lg:overflow-visible no-scrollbar px-2 lg:px-4 py-2 lg:py-8 space-x-2 lg:space-x-0 lg:space-y-1 border-t lg:border-t-0 border-b lg:border-b-0 border-gray-800">
                    <Link href="/admin/dashboard" className={`flex items-center gap-2 lg:gap-3 px-3 lg:px-4 py-2 lg:py-3 rounded-lg font-medium transition-colors whitespace-nowrap ${
                        pathname === '/admin/dashboard' 
                        ? 'bg-white/5 text-white border-l-4 border-umbrella-red' 
                        : 'hover:bg-white/5 hover:text-white text-gray-400 border-l-4 border-transparent'
                    }`}>
                        <LayoutDashboard className="w-4 h-4 lg:w-5 lg:h-5" />
                        <span className="text-xs lg:text-sm">Dashboard</span>
                    </Link>
                    <Link href="/admin/noticias" className={`flex items-center gap-2 lg:gap-3 px-3 lg:px-4 py-2 lg:py-3 rounded-lg font-medium transition-colors whitespace-nowrap ${
                        pathname?.includes('/admin/noticias') 
                        ? 'bg-white/5 text-white border-b-2 lg:border-b-0 lg:border-l-4 border-umbrella-red' 
                        : 'hover:bg-white/5 hover:text-white text-gray-400 border-b-2 lg:border-b-0 lg:border-l-4 border-transparent'
                    }`}>
                        <FileText className="w-4 h-4 lg:w-5 lg:h-5" />
                        <span className="text-xs lg:text-sm">Noticias</span>
                    </Link>

                    <Link href="/admin/usuarios" className={`flex items-center gap-2 lg:gap-3 px-3 lg:px-4 py-2 lg:py-3 rounded-lg font-medium transition-colors whitespace-nowrap ${
                        pathname?.includes('/admin/usuarios') 
                        ? 'bg-white/5 text-white border-b-2 lg:border-b-0 lg:border-l-4 border-umbrella-red' 
                        : 'hover:bg-white/5 hover:text-white text-gray-400 border-b-2 lg:border-b-0 lg:border-l-4 border-transparent'
                    }`}>
                        <Users className="w-4 h-4 lg:w-5 lg:h-5" />
                        <span className="text-xs lg:text-sm">Usuarios</span>
                    </Link>
                    <Link href="/admin/categorias" className={`flex items-center gap-2 lg:gap-3 px-3 lg:px-4 py-2 lg:py-3 rounded-lg font-medium transition-colors whitespace-nowrap ${
                        pathname?.includes('/admin/categorias') 
                        ? 'bg-white/5 text-white border-b-2 lg:border-b-0 lg:border-l-4 border-umbrella-red' 
                        : 'hover:bg-white/5 hover:text-white text-gray-400 border-b-2 lg:border-b-0 lg:border-l-4 border-transparent'
                    }`}>
                        <Layers className="w-4 h-4 lg:w-5 lg:h-5" />
                        <span className="text-xs lg:text-sm">Categorías</span>
                    </Link>
                    <Link href="/admin/perfil" className={`flex items-center gap-2 lg:gap-3 px-3 lg:px-4 py-2 lg:py-3 rounded-lg font-medium transition-colors whitespace-nowrap ${
                        pathname?.includes('/admin/perfil') 
                        ? 'bg-white/5 text-white border-b-2 lg:border-b-0 lg:border-l-4 border-umbrella-red' 
                        : 'hover:bg-white/5 hover:text-white text-gray-400 border-b-2 lg:border-b-0 lg:border-l-4 border-transparent'
                    }`}>
                        <User className="w-4 h-4 lg:w-5 lg:h-5" />
                        <span className="text-xs lg:text-sm">Perfil</span>
                    </Link>
                    <Link href="/guardados" className={`flex items-center gap-2 lg:gap-3 px-3 lg:px-4 py-2 lg:py-3 rounded-lg font-medium transition-colors whitespace-nowrap ${
                        pathname?.includes('/guardados') 
                        ? 'bg-white/5 text-white border-b-2 lg:border-b-0 lg:border-l-4 border-umbrella-red' 
                        : 'hover:bg-white/5 hover:text-white text-gray-400 border-b-2 lg:border-b-0 lg:border-l-4 border-transparent'
                    }`}>
                        <Bookmark className="w-4 h-4 lg:w-5 lg:h-5" />
                        <span className="text-xs lg:text-sm">Guardados</span>
                    </Link>
                </nav>

                {/* Spacer for flex to push profile down on desktop */}
                <div className="hidden lg:block lg:flex-1"></div>

                {/* User Profile */}
                <div className="p-4 lg:p-6 lg:border-t border-gray-800 flex items-center justify-between hidden lg:flex">
                    <div className="flex items-center gap-3">
                        {userProfile?.avatar_url ? (
                            <div className="w-10 h-10 rounded-sm overflow-hidden shrink-0 bg-[#e4ccaf]">
                                <img 
                                    src={userProfile.avatar_url} 
                                    alt={displayName} 
                                    className="w-full h-full object-cover mix-blend-multiply" 
                                />
                            </div>
                        ) : (
                            <div className="w-10 h-10 rounded-sm overflow-hidden shrink-0 bg-gray-800 flex items-center justify-center text-white font-bold">
                                {displayName?.charAt(0).toUpperCase()}
                            </div>
                        )}
                        <div className="flex flex-col justify-center">
                            <span className="text-white font-bold text-xs">{displayName}</span>
                        </div>
                    </div>
                    <button onClick={handleSignOut} className="text-gray-500 hover:text-white transition-colors" title="Cerrar sesión">
                        <LogOut className="w-4 h-4" />
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <main className="flex-1 flex flex-col min-w-0 h-auto lg:max-h-screen lg:overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
