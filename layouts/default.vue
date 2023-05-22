<template>
  <v-app
    id="inspire"
  >
    <v-navigation-drawer
      v-model="drawer"
      app
    >
      <template v-slot:prepend>
        <v-list-item two-line>
          <v-list-item-avatar>
            <img src="/avatar.png">
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title>Libori Katalog</v-list-item-title>
            <v-list-item-subtitle>Sachen und so</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </template>

      <v-divider />

      <v-list>
        <v-list-item
          link
          to="/"
          nuxt
        >
          <v-list-item-action>
            <v-icon>mdi-home</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Startseite</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item
          link
          to="/mystuff"
          nuxt
        >
          <v-list-item-action>
            <v-icon>mdi-format-list-text</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Meine Sachen</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item
          link
          to="/rank"
          nuxt
        >
          <v-list-item-action>
            <v-icon>mdi-thumbs-up-down</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Sachen aussuchen</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-divider inset />

        <v-list-item
          link
          to="/search"
          nuxt
        >
          <v-list-item-action>
            <v-icon>mdi-magnify</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Sachen suchen</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item
          link
          to="/scan"
          nuxt
        >
          <v-list-item-action>
            <v-icon>mdi-cube-scan</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Kiste durchleuchten</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <!--         <v-divider v-if="this.$auth.user.username === 'Thomas'" inset />
        <v-list-item
          v-if="this.$auth.user.username === 'Thomas'"
          link
          to="/admin"
          nuxt
        >
          <v-list-item-action>
            <v-icon>mdi-account-search</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Benutzersuche</v-list-item-title>
          </v-list-item-content>
        </v-list-item> -->

        <v-divider inset />
        <client-only>
          <v-list-item
            v-if="this.$auth.loggedIn"
            link
            to="/logout"
            nuxt
          >
            <v-list-item-action>
              <v-icon>mdi-logout</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Abmelden</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item
            v-if="!this.$auth.loggedIn"
            link
            to="/login"
            nuxt
          >
            <v-list-item-action>
              <v-icon>mdi-login</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Anmelden</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </client-only>
        <v-list-item
          link
          to="/playground"
          nuxt
        >
          <v-list-item-action>
            <v-icon>mdi-slide</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Playground</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-divider inset />

        <v-list-item
          link
          to="/settings"
          nuxt
        >
          <v-list-item-action>
            <v-icon>mdi-cog</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Einstellungen</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item
          link
          to="/about"
          nuxt
        >
          <v-list-item-action>
            <v-icon>mdi-information</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Über</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-divider inset />

        <v-list-item
          link
          to="/add"
          nuxt
        >
          <v-list-item-action>
            <v-icon
              color="complementary"
            >
              mdi-plus-circle
            </v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Neue Sache</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      app
      color="primary"
      dark
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title>Libori Katalog</v-toolbar-title>
    </v-app-bar>

    <v-main>
      <v-container
        fluid
      >
        <nuxt />
      </v-container>
    </v-main>

    <v-footer
      color="primary"
      app
    >
      <span class="white--text">Libori Katalog</span>
    </v-footer>
  </v-app>
</template>

<script>

export default {
  data: () => ({
    drawer: null
  })
}
</script>
