// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@nuxt/eslint", "@nuxt/ui", "nuxt-auth-utils"],

  devtools: {
    enabled: false,
  },

  css: ["~/assets/css/main.css"],

  runtimeConfig: {
    adminUsername: process.env.NUXT_ADMIN_USERNAME || "admin",
    adminPassword: process.env.NUXT_ADMIN_PASSWORD || "admin123",
    session: {
      password: process.env.NUXT_SESSION_PASSWORD || "super",
      maxAge: 60 * 60 * 24 * 7,
    },
  },

  compatibilityDate: "2025-01-15",

  eslint: {
    config: {
      stylistic: {
        commaDangle: "never",
        braceStyle: "1tbs",
      },
    },
  },
});
