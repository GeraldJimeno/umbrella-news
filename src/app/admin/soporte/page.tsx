import React from 'react';
import { BookOpen, Edit3, Send, Layers, User, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function EditorialSupportPage() {
    return (
        <div className="p-8 md:p-12 lg:p-16 max-w-4xl mx-auto w-full">
            <div className="mb-12 border-b border-gray-100 pb-8">
                <Link href="/admin/dashboard" className="text-xs font-bold text-[#597e96] uppercase tracking-widest hover:text-umbrella-red transition-colors mb-4 inline-block">
                    ← Volver al Dashboard
                </Link>
                <h1 className="text-4xl md:text-5xl font-serif font-black text-[#111111] tracking-tight mt-4">
                    Guía de Soporte Editorial
                </h1>
                <p className="text-xl text-gray-500 font-serif italic mt-3">
                    Instrucciones esenciales para la gestión de contenidos en Umbrella News.
                </p>
            </div>

            <div className="space-y-16">
                {/* Sanity Studio */}
                <section>
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-10 h-10 rounded-full bg-umbrella-red/10 text-umbrella-red flex items-center justify-center">
                            <BookOpen className="w-5 h-5" />
                        </div>
                        <h2 className="text-2xl font-serif font-bold text-[#111111]">Sanity Studio: El Motor Editorial</h2>
                    </div>
                    <div className="bg-white border border-gray-100 p-8 rounded-sm shadow-sm">
                        <p className="text-gray-600 leading-relaxed mb-6">
                            Toda la creación y edición de noticias se realiza a través de <strong>Sanity Studio</strong> (en el puerto 3334). No existe un editor interno en la web principal para garantizar la integridad de los datos.
                        </p>
                        <ul className="space-y-4">
                            <li className="flex gap-3">
                                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                                <div>
                                    <strong className="block text-[#111111]">Crear una noticia</strong>
                                    <span className="text-sm text-gray-500">Usa el botón "Nueva noticia" en el dashboard o entra a Studio y haz clic en el icono "+" en la sección de Posts.</span>
                                </div>
                            </li>
                            <li className="flex gap-3">
                                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                                <div>
                                    <strong className="block text-[#111111]">Editar contenido</strong>
                                    <span className="text-sm text-gray-500">Busca el artículo en el listado de Studio. Los cambios se guardan automáticamente como borradores mientras escribes.</span>
                                </div>
                            </li>
                        </ul>
                    </div>
                </section>

                {/* Status Logic */}
                <section>
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
                            <Send className="w-5 h-5" />
                        </div>
                        <h2 className="text-2xl font-serif font-bold text-[#111111]">Diferencia entre Borrador y Publicado</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="border border-gray-100 p-6 rounded-sm bg-amber-50/30">
                            <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 border border-amber-200 px-2 py-0.5 rounded-full mb-4 inline-block">Borrador</span>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                El artículo es visible solo en el Dashboard y en Sanity Studio. No aparecerá en la página principal, categorías ni resultados de búsqueda. Ideal para trabajo en progreso.
                            </p>
                        </div>
                        <div className="border border-gray-100 p-6 rounded-sm bg-emerald-50/30">
                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 border border-emerald-200 px-2 py-0.5 rounded-full mb-4 inline-block">Publicado</span>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                El artículo es enviado a producción. Se genera su URL pública y aparece inmediatamente en las secciones correspondientes de la web. Requiere tener un slug válido.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Metadata Reminder */}
                <section>
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                            <Layers className="w-5 h-5" />
                        </div>
                        <h2 className="text-2xl font-serif font-bold text-[#111111]">Recordatorio de Metadatos</h2>
                    </div>
                    <div className="bg-[#fbfcfd] border border-gray-100 p-10 rounded-sm">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                            <div>
                                <h4 className="font-serif font-bold text-[#111111] mb-2 flex items-center gap-2">
                                    <Layers className="w-4 h-4 text-[#597e96]" /> Categorías
                                </h4>
                                <p className="text-xs text-gray-500 leading-relaxed">Asegúrate de asignar al menos una categoría principal para que la noticia sea navegable.</p>
                            </div>
                            <div>
                                <h4 className="font-serif font-bold text-[#111111] mb-2 flex items-center gap-2">
                                    <Edit3 className="w-4 h-4 text-[#597e96]" /> Tags
                                </h4>
                                <p className="text-xs text-gray-500 leading-relaxed">Usa etiquetas descriptivas para mejorar el SEO y la búsqueda interna.</p>
                            </div>
                            <div>
                                <h4 className="font-serif font-bold text-[#111111] mb-2 flex items-center gap-2">
                                    <User className="w-4 h-4 text-[#597e96]" /> Autor
                                </h4>
                                <p className="text-xs text-gray-500 leading-relaxed">Sin un autor vinculado, el sistema mostrará "Redacción Umbrella" por defecto.</p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
