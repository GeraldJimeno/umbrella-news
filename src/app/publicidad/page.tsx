import { Header, Navbar, Footer, Container } from "@/layout";
import { BarChart3, Target, Zap } from "lucide-react";

export default function PublicidadPage() {
    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Header />
            <Navbar />
            <main className="flex-1 py-16">
                <Container>
                    <div className="max-w-3xl mx-auto">
                        <div className="text-center mb-16">
                            <h1 className="font-serif text-4xl font-black text-black mb-6">
                                Publicidad en Umbrella News
                            </h1>
                            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                                Conecta tu marca con una audiencia influyente, informada y en constante crecimiento.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                            <div className="p-8 border border-gray-100 rounded-sm hover:shadow-lg transition-shadow bg-white text-center">
                                <Target className="w-10 h-10 text-umbrella-red mx-auto mb-6" />
                                <h3 className="text-sm font-bold uppercase tracking-widest text-black mb-4">Segmentación</h3>
                                <p className="text-sm text-gray-600">Llega exactamente a quien buscas mediante segmentación por intereses y categorías.</p>
                            </div>
                            <div className="p-8 border border-gray-100 rounded-sm hover:shadow-lg transition-shadow bg-white text-center">
                                <BarChart3 className="w-10 h-10 text-umbrella-red mx-auto mb-6" />
                                <h3 className="text-sm font-bold uppercase tracking-widest text-black mb-4">Métricas Reales</h3>
                                <p className="text-sm text-gray-600">Reportes detallados de impresiones, clics y engagement para cada una de tus campañas.</p>
                            </div>
                            <div className="p-8 border border-gray-100 rounded-sm hover:shadow-lg transition-shadow bg-white text-center">
                                <Zap className="w-10 h-10 text-umbrella-red mx-auto mb-6" />
                                <h3 className="text-sm font-bold uppercase tracking-widest text-black mb-4">Alto Impacto</h3>
                                <p className="text-sm text-gray-600">Formatos publicitarios premium diseñados para no ser intrusivos pero sí efectivos.</p>
                            </div>
                        </div>

                        <div className="bg-[#1a1c23] text-white p-10 rounded-sm text-center">
                            <h2 className="font-serif text-2xl font-bold mb-4">Descarga nuestro Media Kit</h2>
                            <p className="text-gray-400 mb-8 max-w-lg mx-auto">
                                Conoce nuestras tarifas, formatos y estadísticas de audiencia para este año.
                            </p>
                            <button className="bg-umbrella-red hover:bg-red-700 text-white px-8 py-4 text-xs font-bold uppercase tracking-widest transition-colors rounded-sm">
                                Solicitar Media Kit
                            </button>
                        </div>
                    </div>
                </Container>
            </main>
            <Footer />
        </div>
    );
}
