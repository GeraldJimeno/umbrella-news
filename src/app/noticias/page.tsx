import { Container, Header, Navbar, Footer } from '@/layout';
import { ArticleCard } from '@/components';
import { client } from '@/lib/sanity/client';
import { urlFor } from '@/lib/sanity/image';

// Disable caching for real-time updates from Sanity
export const revalidate = 0;

async function getPublishedPosts() {
    const query = `*[_type == "post" && status == "published"] | order(publishedAt desc) {
        _id,
        title,
        subtitle,
        lead,
        mainImage,
        authorName,
        categorySlug,
        publishedAt,
        "slug": slug.current
    }`;
    return await client.fetch(query);
}

function formatDate(dateString: string) {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    }).toUpperCase();
}

export default async function NoticiasPage() {
    const posts = await getPublishedPosts();

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Header />
            <Navbar />

            <main className="flex-1 py-12 md:py-20">
                <Container>
                    {/* Header */}
                    <div className="mb-12 border-b-4 border-black pb-6">
                        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-black text-black leading-tight uppercase tracking-tight">
                            ÚLTIMAS NOTICIAS
                        </h1>
                        <p className="mt-4 text-xl text-gray-600 font-serif italic max-w-3xl">
                            Todas las actualizaciones y reportajes recientes del equipo editorial de Umbrella News.
                        </p>
                    </div>

                    {/* Content */}
                    {posts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 px-4 text-center border border-gray-100 rounded-lg bg-gray-50">
                            <h2 className="text-2xl font-bold font-serif text-gray-400 mb-2">Editoriales en proceso</h2>
                            <p className="text-gray-500 max-w-md">
                                Actualmente no tenemos noticias publicadas en el sistema. Pronto nuestros redactores subirán más información.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                            {posts.map((post: any) => (
                                <ArticleCard
                                    key={post._id}
                                    title={post.title}
                                    category={post.categorySlug?.toUpperCase() || 'GENERAL'}
                                    author={post.authorName || 'Redacción Umbrella'}
                                    imageUrl={post.mainImage ? urlFor(post.mainImage).url() : ''}
                                    slug={post.slug}
                                    lead={post.lead || post.subtitle || ''}
                                    publishedAt={formatDate(post.publishedAt)}
                                />
                            ))}
                        </div>
                    )}
                </Container>
            </main>

            <Footer />
        </div>
    );
}
