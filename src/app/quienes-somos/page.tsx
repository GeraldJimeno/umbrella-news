import { Header, Navbar, Footer, Container } from "@/layout";

export default function QuienesSomosPage() {
    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Header />
            <Navbar />
            <main className="flex-1 py-16">
                <Container>
                    <div className="max-w-2xl mx-auto">
                        <h1 className="font-serif text-4xl font-black text-black mb-8 border-b-4 border-umbrella-red pb-4 inline-block">
                            Quiénes Somos
                        </h1>
                        <div className="prose prose-lg font-sans text-gray-700 space-y-6">
                            <p className="text-xl font-medium text-gray-900 leading-relaxed italic">
                                Umbrella News es tu fuente definitiva de información veraz, oportuna y equilibrada.
                            </p>
                            <p>
                                Nacimos con la misión de redefinir el periodismo digital, combinando la inmediatez de la tecnología moderna con el rigor y la ética de la prensa tradicional. Nuestro equipo de profesionales trabaja incansablemente para llevarte los hechos tal como ocurren, sin sesgos y con la profundidad que mereces.
                            </p>
                            <p>
                                En Umbrella News, creemos que una sociedad informada es una sociedad libre. Por eso, nos esforzamos por cubrir desde los grandes eventos internacionales hasta las historias locales que dan forma a nuestra comunidad.
                            </p>
                            <div className="bg-gray-50 p-8 rounded-sm border-l-4 border-umbrella-red mt-12">
                                <h2 className="text-sm font-bold uppercase tracking-widest text-black mb-4">Nuestros Valores</h2>
                                <ul className="space-y-4">
                                    <li className="flex items-start gap-3">
                                        <span className="text-umbrella-red font-bold">01.</span>
                                        <span><strong>Integridad:</strong> La verdad por encima de todo.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-umbrella-red font-bold">02.</span>
                                        <span><strong>Innovación:</strong> Nuevas formas de contar la realidad.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-umbrella-red font-bold">03.</span>
                                        <span><strong>Compromiso:</strong> Con nuestros lectores y la democracia.</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </Container>
            </main>
            <Footer />
        </div>
    );
}
