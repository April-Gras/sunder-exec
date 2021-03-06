export default {
  server: {
    host: "0.0.0.0",
    port: 3000,
  },
  css: ["~/static/transitions.css"],
  head: {
    title: "sunder-exec",
    htmlAttrs: {
      lang: "en",
    },
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "" },
      { name: "format-detection", content: "telephone=no" },
    ],
    link: [
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
      {
        rel: "preconnect",
        href: "https://fonts.googleapis.com",
      },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossorigin: true,
      },
      {
        href: "https://fonts.googleapis.com/css2?family=PT+Mono&family=Roboto:wght@400;500;700&display=swap",
        rel: "stylesheet",
      },
    ],
  },
  buildModules: ["@nuxt/typescript-build", "@nuxtjs/tailwindcss"],
  modules: ["@nuxtjs/axios", "~/modules/sunder-exec/index.ts"],
  plugins: [
    { src: "~/plugins/ioManager.client.ts", mode: "client" },
    "~/plugins/axiosApi.ts",
  ],
}
