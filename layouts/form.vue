<template>
  <v-app
    id="inspire"
  >
    <v-dialog
      v-model="dialog"
      max-width="290"
    >
      <v-card>
        <v-card-title class="headline">
          Verwerfen
        </v-card-title>

        <v-card-text>
          Bist du sicher, dass du die Änderungen verwerfen möchten?
        </v-card-text>

        <v-card-actions>
          <v-spacer />

          <v-btn
            color="primary"
            text
            @click="dialog = false"
          >
            Nein
          </v-btn>

          <v-btn
            color="primary"
            text
            @click="closeForm"
          >
            Ja
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <v-app-bar-nav-icon
        @click.stop="dialog = true"
      >
        <v-icon>mdi-arrow-left</v-icon>
      </v-app-bar-nav-icon>

      <v-toolbar-title />

      <v-spacer />

      <v-btn
        text
        dark
        @click="checkForm"
      >
        Speichern
      </v-btn>
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
      <span class="white--text">HouseholdOrganizer</span>
    </v-footer>
  </v-app>
</template>

<script>

export default {
  data () {
    return {
      dialog: false
    }
  },
  methods: {
    closeForm () {
      window.$nuxt.$router.replace('/')
    },
    checkForm () {
      this.$nuxt.$emit('check-form')
    }
  }
}
</script>
