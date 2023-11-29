<template>
  <v-app
    id="household"
  >
    <v-navigation-drawer
      v-model="drawer"
      app
    >
      <template #prepend>
        <v-list-item two-line>
          <v-list-item-avatar>
            <img src="/avatar.png" alt="">
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title>HouseholdOrganizer</v-list-item-title>
            <v-list-item-subtitle>by thlemm</v-list-item-subtitle>
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
            <v-icon>{{ mdiHome }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Startseite</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item
          link
          to="/myitems"
          nuxt
        >
          <v-list-item-action>
            <v-icon>{{ mdiHeart }}</v-icon>
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
            <v-icon>{{ mdiThumbsUpDown }}</v-icon>
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
            <v-icon>{{ mdiMagnify }}</v-icon>
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
            <v-icon>{{ mdiArchiveSearch }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Kiste durchleuchten</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item
          link
          to="/location"
          nuxt
        >
          <v-list-item-action>
            <v-icon>{{ mdiArchiveEdit }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Lagerorte verwalten</v-list-item-title>
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
            v-if="$auth.loggedIn"
            link
            to="/logout"
            nuxt
          >
            <v-list-item-action>
              <v-icon>{{ mdiLogout }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Abmelden</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item
            v-if="!$auth.loggedIn"
            link
            to="/login"
            nuxt
          >
            <v-list-item-action>
              <v-icon>{{ mdiLogin }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Anmelden</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </client-only>

        <v-divider inset />

        <v-list-item
          link
          to="/settings"
          nuxt
        >
          <v-list-item-action>
            <v-icon>{{ mdiCog }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Einstellungen</v-list-item-title>
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
              {{ mdiPlusCircle }}
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
      <v-toolbar-title>HouseholdOrganizer</v-toolbar-title>
    </v-app-bar>

    <v-main>
      <v-container
        class="pa-0 ma-0"
        fluid
      >
        <nuxt />
      </v-container>
    </v-main>

    <v-footer
      color="primary"
      app
    >
      <span class="white--text">HouseholdOrganizer</span>
    </v-footer>
  </v-app>
</template>

<script>
import { mdiHome, mdiHeart, mdiThumbsUpDown, mdiMagnify, mdiArchiveSearch, mdiArchiveEdit, mdiLogin, mdiLogout, mdiCog, mdiPlusCircle } from '@mdi/js'
export default {
  data () {
    return {
      drawer: null,
      mdiHome,
      mdiHeart,
      mdiThumbsUpDown,
      mdiMagnify,
      mdiArchiveSearch,
      mdiArchiveEdit,
      mdiLogin,
      mdiLogout,
      mdiCog,
      mdiPlusCircle
    }
  }
}
</script>
