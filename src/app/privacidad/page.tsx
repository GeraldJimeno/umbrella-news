import { Header, Navbar, Footer, Container } from "@/layout";

export default function PrivacidadPage() {
    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Header />
            <Navbar />
            <main className="flex-1 py-16">
                <Container>
                    <div className="max-w-3xl mx-auto">
                        <h1 className="font-serif text-4xl font-black text-black mb-12">
                            Política de Privacidad
                        </h1>
                        
                        <div className="prose prose-sm font-sans text-gray-700 max-w-none space-y-8">
                            <section>
                                <h2 className="text-lg font-bold uppercase tracking-widest text-black mb-4 border-l-4 border-umbrella-red pl-4">1. Introducción</h2>
                                <p>
                                    En Umbrella News, nos tomamos muy en serio la privacidad de nuestros usuarios. Esta Política de Privacidad describe cómo recopilamos, utilizamos y protegemos su información personal cuando visita nuestro sitio web.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-lg font-bold uppercase tracking-widest text-black mb-4 border-l-4 border-umbrella-red pl-4">2. Información que Recopilamos</h2>
                                <p>Recopilamos información de diversas maneras, incluyendo:</p>
                                <ul className="list-disc pl-6 space-y-2 mt-4">
                                    <li><strong>Información de Registro:</strong> Cuando crea una cuenta, recopilamos su nombre, correo electrónico y preferencias.</li>
                                    <li><strong>Datos de Navegación:</strong> Recopilamos información técnica como su dirección IP, tipo de navegador e historial de navegación en nuestro portal.</li>
                                    <li><strong>Cookies:</strong> Utilizamos cookies para mejorar su experiencia de navegación.</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-lg font-bold uppercase tracking-widest text-black mb-4 border-l-4 border-umbrella-red pl-4">3. Uso de la Información</h2>
                                <p>Utilizamos la información recopilada para:</p>
                                <ul className="list-disc pl-6 space-y-2 mt-4">
                                    <li>Personalizar su experiencia de noticias.</li>
                                    <li>Mejorar nuestro portal y servicios.</li>
                                    <li>Enviar boletines informativos (solo si se ha suscrito).</li>
                                    <li>Asegurar la integridad de nuestra comunidad de comentarios.</li>
                                </ul>
                            </section>

                            <section className="bg-gray-50 p-8 rounded-sm">
                                <h2 className="text-sm font-bold uppercase tracking-widest text-black mb-2">Contacto de Privacidad</h2>
                                <p className="text-sm text-gray-600">
                                    Si tiene alguna duda sobre cómo manejamos sus datos, puede escribirnos a: <br />
                                    <strong>privacidad@umbrellanews.com</strong>
                                </p>
                            </section>
                        </div>
                    </div>
                </Container>
            </main>
            <Footer />
        </div>
    );
}
