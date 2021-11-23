export default {
  server: {
    host: '0.0.0.0',
    port: 3000
  },
  head: {
    title: 'sunder-exec',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'preconnect', href: 'https://fonts.googleapis.com'
      }, {
        rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: true
      }, {
        href: 'https://fonts.googleapis.com/css2?family=PT+Mono&family=Roboto:wght@400;500;700&display=swap', rel: 'stylesheet'
      }
    ]
  },
  server: {
    host: "0.0.0.0"
  },
  css: [
  ],
  plugins: [
  ],
  buildModules: [
    '@nuxt/typescript-build',
    '@nuxtjs/tailwindcss'
  ],
  modules: [
    '@nuxtjs/axios',
    '~/modules/socket-io.ts'
  ],
  serverMiddleware: [
    {
      path: '/read-from-config',
      handler: '~/api/read-from-config.ts'
    },
    {
      path: '/read-target-directory',
      handler: '~/api/read-target-directory.ts'
    }
  ],
  watch: ['~/modules/*.ts']
}
