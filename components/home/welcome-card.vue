<template>
  <v-card
    class="mx-auto"
    outlined
  >
    <v-card-title class="pt-2">
      Willkommen{{ username ? ' ' + username : '' }}!
    </v-card-title>
    <v-card-text>Leg los und organisiere Deine Sachen. An dieser Stelle werden in Zukunft viele interessante Statistiken angezeigt. Außerdem gibt es einen Schnellübersicht.</v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'WelcomeCard',
  computed: {
    isLoggedIn () {
      return !!this.$auth.loggedIn
    },
    username () {
      if (this.isLoggedIn) {
        return this.$auth.user.username.replace('&', ' & ')
      }
      return false
    }
  }
}
</script>
