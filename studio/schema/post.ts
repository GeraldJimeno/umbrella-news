import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'post',
  title: 'Noticia',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Título',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtítulo',
      type: 'string',
    }),
    defineField({
      name: 'lead',
      title: 'Entradilla / Lead',
      type: 'text',
      rows: 3,
      description: 'Resumen corto para la portada y redes sociales.',
    }),
    defineField({
      name: 'mainImage',
      title: 'Imagen Principal',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'content',
      title: 'Cuerpo de la Noticia',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'author',
      title: 'Autor Editorial (Referencia)',
      type: 'reference',
      to: [{ type: 'author' }],
      description: 'Selecciona el autor desde la base de datos de Sanity.',
    }),
    defineField({
      name: 'authorName',
      title: 'Nombre del Autor (Legacy)',
      type: 'string',
      description: 'Nombre del autor manual o heredado.',
    }),
    defineField({
      name: 'categorySlug',
      title: 'Slug de Categoría',
      type: 'string',
      description: 'Slug de la categoría principal en Supabase.',
    }),
    defineField({
      name: 'subcategorySlug',
      title: 'Slug de Subcategoría',
      type: 'string',
      description: 'Slug de la subcategoría en Supabase.',
    }),
    defineField({
      name: 'tags',
      title: 'Etiquetas',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
    }),
    defineField({
      name: 'seoTitle',
      title: 'Título SEO',
      type: 'string',
    }),
    defineField({
      name: 'seoDescription',
      title: 'Descripción SEO',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'publishedAt',
      title: 'Fecha de Publicación',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'isFeatured',
      title: 'Destacada',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'isBreaking',
      title: 'Último Minuto',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'status',
      title: 'Estado',
      type: 'string',
      options: {
        list: [
          { title: 'Borrador', value: 'draft' },
          { title: 'En Revisión', value: 'review' },
          { title: 'Publicado', value: 'published' },
        ],
        layout: 'radio',
      },
      initialValue: 'draft',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      author: 'authorName',
      media: 'mainImage',
    },
    prepare(selection) {
      const { author } = selection
      return { ...selection, subtitle: author ? `Por ${author}` : '' }
    },
  },
})
