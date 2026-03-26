import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {schemaTypes} from './schema'

export default defineConfig({
  name: 'default',
  title: 'Umbrella News Studio',

  projectId: '32k9mga9',
  dataset: 'production',

  plugins: [structureTool()],

  schema: {
    types: schemaTypes,
  },
})
