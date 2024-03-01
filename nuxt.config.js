import colors from './assets/colors'

export default {
  /*
  ** Nuxt target
  ** See https://nuxtjs.org/api/configuration-target
  */
  target: 'static',
  ssr: false,
  /*
  ** Headers of the page
  ** See https://nuxtjs.org/api/configuration-head
  */
  head: {
    titleTemplate: '%s - ' + 'HouseholdOrganizer',
    title: 'HouseholdOrganizer' || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /*
  ** Global CSS
  */
  css: [
  ],
  /*
  ** Plugins to load before mounting the App
  ** https://nuxtjs.org/guide/plugins
  */
  plugins: [],
  /*
  ** Auto import components
  ** See https://nuxtjs.org/api/configuration-components
  */
  components: true,
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    '@nuxtjs/vuetify',
    '@nuxtjs/axios',
    '@nuxtjs/i18n',
    '@nuxtjs/moment',
    '@nuxtjs/auth',
    '@nuxtjs/pwa'
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
  ],
  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
  axios: {},
  pwa: {
    manifest: {
      lang: 'de',
      short_name: 'HouseholdOrganizer 2.0',
      name: 'HouseholdOrganizer 2.0',
      start_url: '/',
      display: 'standalone',
      theme_color: '#7ca5c9'
    }
  },
  /*
  ** vuetify module configuration
  ** https://github.com/nuxt-community/vuetify-module
  */
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false,
      themes: {
        light: {
          primary: colors.blue.lighten_50,
          secondary: colors.green.lighten_40,
          complementary: colors.red.lighten_40,
          warning: colors.red.lighten_50,
          error: colors.purple.base,
          neutral: colors.grey.base,
          info: colors.beige.darken_20,
          action: colors.green.lighten_20
        }
      }
    }
  },
  auth: {
    strategies: {
      local: {
        token: {
          property: 'accessToken'
        },
        endpoints: {
          login: { url: '/api/v2/auth/login', method: 'post', propertyName: 'token' },
          logout: false,
          user: { url: '/api/v2/auth/user', method: 'get', propertyName: false }
        }
      }
    },
    redirect: {
      login: false,
      logout: false,
      home: false,
      callback: false
    }
  },
  i18n: {
    lazy: true,
    langDir: 'locales/',
    strategy: 'no_prefix',
    locales: [{
      code: 'de',
      name: 'Deutsch',
      iso: 'de-DE',
      file: 'de.json'
    }],
    defaultLocale: 'de',
    fallbackLocale: 'de'
  },
  /*
  ** Build configuration
  ** See https://nuxtjs.org/api/configuration-build/
  */
  build: {
    transpile: ['vue-filter-date-format', 'vue-filter-date-parse'],
    postcss: null,
    loaders: {
      css: {
        modules: false
      }
    },
    extend (config, { isDev, isClient }) {
      config.devtool = 'eval-cheap-source-map'
    }
  },
  publicRuntimeConfig: {
    axios: {
      baseURL: process.env.BASE_URL || 'https://household-organizer-api.thlemm.de'
    },
    imgBaseUrl: process.env.IMG_BASE_URL || '/2023-11-13_images_backup/'
  }
}
