import { Header, Navbar, Footer, Container } from "@/layout";

export default function CookiesPage() {
    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Header />
            <Navbar />
            <main className="flex-1 py-16">
                <Container>
                    <div className="max-w-3xl mx-auto">
                        <h1 className="font-serif text-4xl font-black text-black mb-12">
                            Política de Cookies
                        </h1>
                        
                        <div className="prose prose-sm font-sans text-gray-700 max-w-none space-y-8">
                            <section>
                                <h2 className="text-lg font-bold uppercase tracking-widest text-black mb-4">¿Qué son las cookies?</h2>
                                <p>
                                    Las cookies son pequeños archivos de texto que se descargan en su dispositivo al visitar un sitio web. Ayudan al portal a recordar información sobre su visita para mejorar su experiencia.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-lg font-bold uppercase tracking-widest text-black mb-4">Tipos de cookies que usamos</h2>
                                <ul className="list-disc pl-6 space-y-4">
                                    <li><strong>Esenciales:</strong> Necesarias para el funcionamiento básico del sitio y la autenticación de usuarios.</li>
                                    <li><strong>De Rendimiento:</strong> Nos ayudan a entender cómo interactúan los usuarios con el sitio para mejorarlo.</li>
                                    <li><strong>De Personalización:</strong> Permiten recordar sus preferencias (como tamaño de fuente o categorías favoritas).</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-lg font-bold uppercase tracking-widest text-black mb-4">Cómo gestionar las cookies</h2>
                                <p>
                                    Usted puede restringir, bloquear o borrar las cookies de Umbrella News utilizando la configuración de su navegador. Cada navegador tiene una operativa diferente, pero la función de 'Ayuda' le indicará cómo hacerlo.
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
