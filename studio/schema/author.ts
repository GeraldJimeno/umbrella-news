import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'author',
  title: 'Autor',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Nombre Completo',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
      description: 'Generar a partir del nombre para la URL pública.',
    }),
    defineField({
      name: 'supabaseUserId',
      title: 'ID de Usuario en Supabase (Opcional pero Recomendado)',
      type: 'string',
      description: 'El UUID del autor en Supabase. Si se proporciona, el perfil público extraerá automáticamente su foto, biografía y reconocimientos desde Supabase, ignorando los campos de abajo.',
    }),
    defineField({
      name: 'role',
      title: 'Cargo / Rol',
      type: 'string',
      description: '(Fallback) E.g. Periodista especializada en tecnología. Usar solo si no hay UUID de Supabase.',
    }),
    defineField({
      name: 'image',
      title: 'Fotografía',
      type: 'image',
      options: {
        hotspot: true,
      },
      description: '(Fallback) Mostrar si la cuenta no existe todavía en Supabase.',
    }),
    defineField({
      name: 'bio',
      title: 'Biografía Corta',
      type: 'text',
      rows: 4,
      description: '(Fallback) Lleno temporalmente. La biografía oficial se edita desde el perfil web del autor.',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'role',
      media: 'image',
    },
  },
})
