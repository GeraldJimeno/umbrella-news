import { Header, Navbar, Footer, Container } from "@/layout";

export default function TerminosPage() {
    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Header />
            <Navbar />
            <main className="flex-1 py-16">
                <Container>
                    <div className="max-w-3xl mx-auto">
                        <h1 className="font-serif text-4xl font-black text-black mb-12">
                            Términos de Servicio
                        </h1>
                        
                        <div className="prose prose-sm font-sans text-gray-700 max-w-none space-y-8">
                            <p className="text-gray-500 italic">Última actualización: 26 de marzo de 2026</p>

                            <section>
                                <h2 className="text-lg font-bold uppercase tracking-widest text-black mb-4">1. Aceptación de los Términos</h2>
                                <p>
                                    Al acceder y utilizar Umbrella News, usted acepta quedar vinculado por estos Términos de Servicio. Si no está de acuerdo con alguna parte de estos términos, no podrá acceder al servicio.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-lg font-bold uppercase tracking-widest text-black mb-4">2. Uso del Contenido</h2>
                                <p>
                                    Todo el contenido publicado en Umbrella News está protegido por derechos de autor. Queda prohibida la reproducción total o parcial de los contenidos sin la autorización expresa y por escrito de la dirección del medio.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-lg font-bold uppercase tracking-widest text-black mb-4">3. Conducta del Usuario</h2>
                                <p>
                                    Al participar en nuestra sección de comentarios o foros, el usuario se compromete a mantener un lenguaje respetuoso. No se tolerará el discurso de odio, el acoso ni la desinformación deliberada.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-lg font-bold uppercase tracking-widest text-black mb-4">4. Limitación de Responsabilidad</h2>
                                <p>
                                    Umbrella News se esfuerza por la exactitud de su información, pero no garantiza la ausencia de errores. El medio no se hace responsable del uso que terceros den a la información publicada.
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
