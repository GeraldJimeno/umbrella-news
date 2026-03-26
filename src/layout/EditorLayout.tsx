"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Umbrella, LayoutDashboard, FileText, ImageIcon, LogOut, User, Bookmark } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function EditorLayout({ children }: { children: React.ReactNode }) {
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
        <div className="min-h-screen flex bg-slate-50 font-sans">
            {/* Sidebar */}
            <aside className="w-[260px] bg-[#1a1c23] flex flex-col shrink-0 min-h-screen text-gray-300">
                {/* Logo Area */}
                <div className="p-6">
                    <Link href="/" className="flex flex-col gap-1 group">
                        <div className="flex items-center gap-3">
                            <img 
                                src="/umbrella-news-icon.png" 
                                alt="" 
                                className="w-8 h-8 object-contain"
                            />
                            <span className="font-serif text-[19px] tracking-tighter font-black text-white leading-none mt-1 uppercase">
                                Umbrella<span className="text-umbrella-red">News</span>
                            </span>
                        </div>
                        <span className="text-[9px] tracking-[0.2em] text-gray-500 uppercase font-black mt-2 ml-11">
                            EDITORIAL CMS
                        </span>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-8 space-y-1">
                    <Link href="/autor/dashboard" className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                        pathname === '/autor/dashboard' 
                        ? 'bg-white/5 text-white border-l-4 border-umbrella-red' 
                        : 'hover:bg-white/5 hover:text-white text-gray-400 border-l-4 border-transparent'
                    }`}>
                        <LayoutDashboard className="w-5 h-5" />
                        <span className="text-sm">Dashboard</span>
                    </Link>
                    <Link href="/autor/noticias" className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                        pathname?.includes('/autor/noticias') 
                        ? 'bg-white/5 text-white border-l-4 border-umbrella-red' 
                        : 'hover:bg-white/5 hover:text-white text-gray-400 border-l-4 border-transparent'
                    }`}>
                        <FileText className="w-5 h-5" />
                        <span className="text-sm">Noticias</span>
                    </Link>

                    <Link href="/autor/perfil" className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                        pathname?.includes('/autor/perfil') 
                        ? 'bg-white/5 text-white border-l-4 border-umbrella-red' 
                        : 'hover:bg-white/5 hover:text-white text-gray-400 border-l-4 border-transparent'
                    }`}>
                        <User className="w-5 h-5" />
                        <span className="text-sm">Perfil</span>
                    </Link>
                    <Link href="/guardados" className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                        pathname?.includes('/guardados') 
                        ? 'bg-white/5 text-white border-l-4 border-umbrella-red' 
                        : 'hover:bg-white/5 hover:text-white text-gray-400 border-l-4 border-transparent'
                    }`}>
                        <Bookmark className="w-5 h-5" />
                        <span className="text-sm">Guardados</span>
                    </Link>
                </nav>

                {/* User Profile */}
                <div className="p-6 border-t border-gray-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {userProfile?.avatar_url ? (
                            <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 bg-gray-800 border border-gray-700">
                                <img 
                                    src={userProfile.avatar_url} 
                                    alt={displayName} 
                                    className="w-full h-full object-cover" 
                                />
                            </div>
                        ) : (
                            <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 bg-gray-800 border border-gray-700 flex items-center justify-center text-white font-bold">
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
            <main className="flex-1 flex flex-col min-w-0 max-h-screen overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
