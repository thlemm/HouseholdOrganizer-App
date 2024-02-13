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
            <v-list-item-subtitle>
              <a
                href="https://thlemm.de"
                target="_blank"
                style="color: #7ca5c9;"
              >
                by thlemm
              </a>
            </v-list-item-subtitle>
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
          v-if="isFamily"
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

        <v-list-item
          link
          to="/casino"
          nuxt
        >
          <v-list-item-action>
            <v-icon :color="colorCasino">
              {{ mdiSlotMachine }}
            </v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title :class="colorCasino + '--text'">
              Angst Potter?
            </v-list-item-title>
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

        <v-divider v-if="isAdmin" inset />

        <v-list-item
          v-if="isAdmin"
          link
          to="/locations"
          nuxt
        >
          <v-list-item-action>
            <v-icon color="error">
              {{ mdiArchiveEdit }}
            </v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Lagerorte verwalten</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item
          v-if="isAdmin"
          link
          to="/users"
          nuxt
        >
          <v-list-item-action>
            <v-icon color="error">
              {{ mdiAccountEdit }}
            </v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Benutzer verwalten</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item
          v-if="false"
          link
          to="/transactions"
          nuxt
        >
          <v-list-item-action>
            <v-icon color="error">
              {{ mdiTagEdit }}
            </v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Transaktionen verwalten</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item
          v-if="isAdmin"
          link
          to="/interests"
          nuxt
        >
          <v-list-item-action>
            <v-icon color="error">
              {{ mdiHeartSearch }}
            </v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Alle Interessen</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-divider inset />

        <v-list-item
          v-if="isLoggedIn"
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
          v-if="!isLoggedIn"
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

        <v-list-item
          v-if="!isLoggedIn"
          link
          to="/signup"
          nuxt
        >
          <v-list-item-action>
            <v-icon>{{ mdiAccountPlus }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Registrieren</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

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
      <v-spacer />
      <v-app-bar-title>HouseholdOrganizer</v-app-bar-title>
      <v-spacer />
      <v-icon>{{ accountIcon }}</v-icon>
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
      <span class="white--text flex text-center">HouseholdOrganizer</span>
    </v-footer>
  </v-app>
</template>

<script>
import {
  mdiHome,
  mdiHeart,
  mdiThumbsUpDown,
  mdiMagnify,
  mdiArchiveSearch,
  mdiArchiveEdit,
  mdiLogin,
  mdiLogout,
  mdiCog,
  mdiPlusCircle,
  mdiAccount,
  mdiAccountOff,
  mdiAccountCowboyHat,
  // eslint-disable-next-line import/named
  mdiHeartSearch,
  mdiAccountEdit,
  // eslint-disable-next-line import/named
  mdiTagEdit,
  mdiSlotMachine,
  mdiAccountPlus,
  mdiArchivePlus
} from '@mdi/js'
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
      mdiPlusCircle,
      mdiAccount,
      mdiAccountOff,
      mdiAccountCowboyHat,
      mdiHeartSearch,
      mdiAccountEdit,
      mdiTagEdit,
      mdiSlotMachine,
      mdiAccountPlus,
      colorCasino: 'warning',
      mdiArchivePlus
    }
  },
  computed: {
    accountIcon () {
      if (this.isLoggedIn) {
        if (this.isAdmin) {
          return mdiAccountCowboyHat
        }
        return mdiAccount
      }
      return mdiAccountOff
    },
    isLoggedIn () {
      return !!this.$auth.loggedIn
    },
    isAdmin () {
      if (this.isLoggedIn) {
        if (this.$auth.user.roles.includes('ROLE_ADMIN')) {
          return true
        }
      }
      return false
    },
    isFamily () {
      if (this.isLoggedIn) {
        if (this.$auth.user.roles.includes('ROLE_FAMILY')) {
          return true
        }
      }
      return false
    }
  },
  mounted () {
    this.changeCasinoColor()
  },
  methods: {
    changeCasinoColor () {
      setTimeout(() => (this.colorCasino = 'primary'), 1000)
      setTimeout(() => (this.colorCasino = 'warning'), 2000)
      setTimeout(() => (this.colorCasino = 'secondary'), 3000)
      setTimeout(() => (this.colorCasino = 'info'), 4000)
      setTimeout(() => (this.colorCasino = 'error'), 5000)
      setTimeout(() => (this.changeCasinoColor()), 5000)
    },
    selectAccountIcon () {
      if (this.$auth.loggedIn) {
        if (this.$auth.user.roles.includes('ROLE_ADMIN')) {
          return mdiAccountCowboyHat
        }
        return mdiAccount
      }
      return mdiAccountOff
    }
  }
}
</script>
