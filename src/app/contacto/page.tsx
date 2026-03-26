import { Header, Navbar, Footer, Container } from "@/layout";
import { Mail, MapPin, Phone } from "lucide-react";

export default function ContactoPage() {
    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Header />
            <Navbar />
            <main className="flex-1 py-16">
                <Container>
                    <div className="max-w-2xl mx-auto">
                        <h1 className="font-serif text-4xl font-black text-black mb-8 border-b-4 border-umbrella-red pb-4 inline-block">
                            Contacto
                        </h1>
                        <p className="text-lg text-gray-600 mb-12">
                            Estamos aquí para escucharte. Si tienes alguna noticia, sugerencia o consulta, no dudes en ponerte en contacto con nuestro equipo.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center shrink-0">
                                        <Mail className="w-5 h-5 text-umbrella-red" />
                                    </div>
                                    <div>
                                        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Redacción</h3>
                                        <p className="text-gray-900 font-medium">redaccion@umbrellanews.com</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center shrink-0">
                                        <Phone className="w-5 h-5 text-umbrella-red" />
                                    </div>
                                    <div>
                                        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Teléfono</h3>
                                        <p className="text-gray-900 font-medium">+1 (809) 555-0123</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center shrink-0">
                                        <MapPin className="w-5 h-5 text-umbrella-red" />
                                    </div>
                                    <div>
                                        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Oficina Central</h3>
                                        <p className="text-gray-900 font-medium">Av. Winston Churchill, Santo Domingo, Rep. Dom.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-6 rounded-sm border border-gray-100">
                                <h3 className="font-serif text-xl font-bold text-black mb-4">¿Tienes una primicia?</h3>
                                <p className="text-sm text-gray-600 leading-relaxed mb-4">
                                    Si tienes información confidencial o una noticia de último minuto, nuestro buzón de primicias está abierto las 24 horas.
                                </p>
                                <a href="mailto:tips@umbrellanews.com" className="inline-block text-xs font-bold uppercase tracking-widest text-umbrella-red hover:underline">
                                    Enviar pista confidencial →
                                </a>
                            </div>
                        </div>
                    </div>
                </Container>
            </main>
            <Footer />
        </div>
    );
}
