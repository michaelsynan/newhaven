// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ["@/assets/css/main.css"],

  modules: [
    "@nuxt/content",
    "@nuxt/eslint",
    "@nuxt/image",
    "@nuxt/ui",
    "@nuxtjs/seo",
    "nuxt-swiper",
    "nuxt-resend",
  ],

  runtimeConfig: {
    resend: {
      apiKey: process.env.NUXT_RESEND_API_KEY || "",
    },
  },
  site: {
    url: "https://newhavenministries.org",
    name: "New Haven Ministries",
    description:
      "New Haven Ministries is a spirit-filled church in Richmond Hill, Queens, NY. Join us for worship, Bible study, youth programs, and community events.",
    defaultLocale: "en",
  },

  ssr: false,
  nitro: {
    preset: "vercel",
  },
  app: {
    pageTransition: { name: "page", mode: "out-in" },
    head: {
      link: [
        {
          rel: "icon",
          type: "image/x-icon",
          href: "/favicon.ico?v=3",
        },
      ],
    },
  },

  routeRules: {
    "/plan-your-visit": {
      redirect: {
        to: "https://app.textinchurch.com/connect-cards/AxP3gJSuf5DT7GiJCkY5",
        statusCode: 301,
      },
    },
  },
});
