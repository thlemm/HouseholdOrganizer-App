import colors from 'vuetify/es5/util/colors'

export default {
  /*
  ** Nuxt target
  ** See https://nuxtjs.org/api/configuration-target
  */
  target: 'static',
  /*
  ** Headers of the page
  ** See https://nuxtjs.org/api/configuration-head
  */
  head: {
    titleTemplate: '%s - ' + 'Libori-Katalog',
    title: 'Libori Katalog' || '',
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
  plugins: [{
    src: '@/plugins/axios.js',
    ssr: false
  }],
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
    '@nuxtjs/vuetify'
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    '@nuxtjs/auth'
  ],
  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
  axios: {},
  pwa: {
    manifest: {
      lang: 'de',
      short_name: 'Katalog 2.0',
      name: 'Libori Katalog 2.0',
      start_url: "/",
      display: 'standalone',
      theme_color: '#53abcb'
    }
    // workbox: {
    //   globPatterns: ['**/*.{js,css}', '**/static/*'],
    //   offlinePage: "/offline.html"
    // }
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
          primary:                   '#53abcb',
          primaryNeutral:            '#6f9eaf',
          primaryNeutralLight:       '#cedee4',
          primaryLight:              '#91c4d7',
          primaryNeutralDark:        '#23373f',
          complementary:             '#db6b43',
          complementaryNeutralDark:  '#42281f', 
          complementaryLight:        '#e19f87',
          complementaryNeutralLight: '#e7d2cb',
          complementaryNeutral:      '#b87c66',
          error: '#db6b43'
        },
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
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
          login: { url: 'http://localhost/api/v1/auth/login', method: 'post', propertyName: 'accessToken' },
          // login: { url: 'https://catalog.thlemm.de/api/v1/auth/login', method: 'post', propertyName: 'accessToken' },
          logout: false,
          user: false
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
  /*
  ** Build configuration
  ** See https://nuxtjs.org/api/configuration-build/
  */
  build: {
    extend(config, {}) {
      config.node = {
        fs: 'empty'
      }
    }
  }
}
