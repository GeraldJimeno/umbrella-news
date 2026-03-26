'use client';

import Link from "next/link";
import { Container } from "./Container";
import { Button } from '@/components/ui';
import { useCategories } from "@/hooks/useCategories";
import { Loader2 } from "lucide-react";

export function Footer() {
    const currentYear = new Date().getFullYear();
    const { categories, loading } = useCategories();

    return (
        <footer className="bg-[#1a1c23] text-gray-300 pt-16 pb-8 border-t-[8px] border-umbrella-red/20">
            <Container>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand Info */}
                    <div className="space-y-6">
                        <Link href="/" className="inline-block group">
                            <div className="flex items-center gap-3 mb-2">
                                <img 
                                    src="/umbrella-news-icon.png" 
                                    alt="" 
                                    className="w-10 h-10 object-contain transition-transform group-hover:scale-105 duration-300"
                                />
                                <span className="font-serif text-3xl font-black text-white tracking-tighter pt-1">
                                    UMBRELLA<span className="text-umbrella-red">NEWS</span>
                                </span>
                            </div>
                        </Link>
                        <p className="text-sm text-gray-400 leading-relaxed font-sans max-w-sm">
                            Líder en información veraz y oportuna. Comprometidos con el periodismo de calidad para una sociedad informada.
                        </p>
                        
                        {/* Social Icons - Consistent with MobileDrawer.tsx */}
                        <div className="flex items-center gap-4">
                            {/* Facebook */}
                            <a href="#" className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-800 transition-colors" aria-label="Facebook">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                </svg>
                            </a>
                            {/* X / Twitter */}
                            <a href="#" className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-800 transition-colors" aria-label="Twitter">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                </svg>
                            </a>
                            {/* Instagram */}
                            <a href="#" className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-800 transition-colors" aria-label="Instagram">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Sections */}
                    <div>
                        <h3 className="text-white font-bold text-sm tracking-widest uppercase mb-6">Secciones</h3>
                        {loading ? (
                            <div className="flex items-center gap-2 text-gray-500 py-2">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span className="text-xs uppercase tracking-widest">Cargando...</span>
                            </div>
                        ) : (
                            <ul className="space-y-3 text-sm text-gray-400">
                                {categories.map(cat => (
                                    <li key={cat.id}>
                                        <Link href={`/categoria/${cat.slug}`} className="hover:text-umbrella-red transition-colors">
                                            {cat.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* About */}
                    <div>
                        <h3 className="text-white font-bold text-sm tracking-widest uppercase mb-6">Nosotros</h3>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li><Link href="/quienes-somos" className="hover:text-white transition-colors">Quiénes Somos</Link></li>
                            <li><Link href="/contacto" className="hover:text-white transition-colors">Contacto</Link></li>
                            <li><Link href="/publicidad" className="hover:text-white transition-colors">Publicidad</Link></li>
                            <li><Link href="/privacidad" className="hover:text-white transition-colors">Privacidad</Link></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="text-white font-bold text-sm tracking-widest uppercase mb-6">Newsletter</h3>
                        <p className="text-sm text-gray-400 mb-4">
                            Recibe las noticias más importantes cada mañana.
                        </p>
                        <form className="flex" onSubmit={(e) => e.preventDefault()}>
                            <input
                                type="email"
                                placeholder="Tu email"
                                className="bg-[#2a2c35] text-white px-4 py-2 rounded-l outline-none w-full text-sm border border-transparent focus:border-gray-500 transition-colors"
                                required
                            />
                            <Button type="submit" className="rounded-l-none">Unirse</Button>
                        </form>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 uppercase tracking-wider">
                    <p>© {currentYear} UMBRELLA NEWS. TODOS LOS DERECHOS RESERVADOS.</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <Link href="/terminos" className="hover:text-gray-300">Términos de servicio</Link>
                        <Link href="/cookies" className="hover:text-gray-300">Cookies</Link>
                    </div>
                </div>
            </Container>
        </footer>
    );
}
