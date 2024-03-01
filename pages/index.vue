<template>
  <v-layout
    column
    justify-center
    align-center
  >
    <v-container
      fluid
    >
      <v-row>
        <v-col>
          <app-name-card />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <welcome-card />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <item-of-the-day-card v-if="isLoggedIn" />
        </v-col>
      </v-row>
      <v-row v-if="isFamily">
        <v-col>
          <v-btn
            class="mb-9 mr-1"
            dark
            absolute
            bottom
            right
            fab
            color="complementary"
            to="/add"
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-layout>
</template>

<script>

import AppNameCard from '~/components/home/app-name-card'
import WelcomeCard from '~/components/home/welcome-card'
import ItemOfTheDayCard from '~/components/home/item-of-the-day-card'
export default {
  components: { ItemOfTheDayCard, WelcomeCard, AppNameCard },
  data () {
    return {

    }
  },

  computed: {
    isLoggedIn () {
      return !!this.$auth.loggedIn
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

  },

  methods: {
  }
}
</script>
