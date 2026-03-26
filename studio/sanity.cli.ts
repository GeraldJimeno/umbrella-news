import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: '32k9mga9',
    dataset: 'production'
  },
  server: {
    port: 3334,
  }
})
