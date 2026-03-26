import Image from 'next/image'
import { PortableText } from '@portabletext/react'
import { client } from '@/lib/sanity/client'
import { urlFor } from '@/lib/sanity/image'

async function getPost() {
  const query = `*[_type == "post"] | order(publishedAt desc)[0] {
    title,
    slug,
    subtitle,
    lead,
    mainImage,
    content,
    authorName,
    categorySlug,
    subcategorySlug,
    publishedAt,
    isFeatured,
    isBreaking
  }`
  const post = await client.fetch(query)
  return post
}

export default async function TestSanityPage() {
  const post = await getPost()

  if (!post) {
    return (
      <div className="p-10 text-center">
        <h1 className="text-2xl font-bold text-gray-800">No se encontraron noticias en Sanity</h1>
        <p className="mt-4 text-gray-600">Asegúrate de haber publicado al menos una noticia en el Studio.</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-10 font-sans">
      <div className="mb-8 border-b pb-4">
        <span className="text-xs font-bold uppercase tracking-widest text-red-600">
          Prueba de Integración Sanity
        </span>
        <h1 className="text-4xl font-black mt-2 leading-tight uppercase italic tracking-tighter">
          {post.title}
        </h1>
        {post.subtitle && (
          <p className="text-xl text-gray-600 mt-2 font-medium italic">
            {post.subtitle}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          {/* Lead / Entradilla */}
          {post.lead && (
            <div className="bg-gray-50 border-l-4 border-black p-4 mb-6 italic text-lg text-gray-700">
              {post.lead}
            </div>
          )}

          {/* Main Image */}
          {post.mainImage && (
            <div className="mb-8 relative aspect-video overflow-hidden rounded-sm grayscale hover:grayscale-0 transition-all duration-500 border border-gray-200 shadow-xl">
              <Image
                src={urlFor(post.mainImage).url()}
                alt={post.title}
                fill
                className="object-cover"
              />
            </div>
          )}

          {/* Content (Portable Text) */}
          <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed drop-cap">
            <PortableText value={post.content} />
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="bg-white p-6 border border-gray-100 shadow-sm self-start sticky top-10">
          <h3 className="text-sm font-black uppercase tracking-widest border-b pb-2 mb-4">Metadatos</h3>
          
          <div className="space-y-4">
            <div>
              <p className="text-[10px] uppercase font-bold text-gray-400">Autor</p>
              <p className="font-bold text-black">{post.authorName || 'Redacción Umbrella'}</p>
            </div>
            
            <div>
              <p className="text-[10px] uppercase font-bold text-gray-400">Categoría</p>
              <p className="font-bold text-black uppercase">{post.categorySlug || '-'}</p>
            </div>

            <div>
              <p className="text-[10px] uppercase font-bold text-gray-400">Subcategoría</p>
              <p className="font-bold text-black uppercase">{post.subcategorySlug || '-'}</p>
            </div>

            <div>
              <p className="text-[10px] uppercase font-bold text-gray-400">Publicado el</p>
              <p className="font-bold text-black">
                {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : '-'}
              </p>
            </div>

            <div className="pt-2 border-t">
              <div className="flex gap-2">
                {post.isFeatured && (
                  <span className="bg-black text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Destacada</span>
                )}
                {post.isBreaking && (
                  <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Último Minuto</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
