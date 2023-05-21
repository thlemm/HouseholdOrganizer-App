<template>
  <v-container
    fluid
  >
    <v-row align="center">
      <v-col justify="center">
        <v-list-item two-line>
          <v-list-item-action align="center">
            <v-icon>
              mdi-bug-check
            </v-icon>
          </v-list-item-action>
          <v-list-item-content>
              <v-list-item-title>Benutzer</v-list-item-title>
              <v-list-item-subtitle>ID: {{ user.id }}, Name: {{ user.username }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-divider />
        <v-list-item two-line @click="showReport">
          <v-list-item-action align="center">
            <v-icon>
              mdi-bug-check
            </v-icon>
          </v-list-item-action>
          <v-list-item-content>
              <v-list-item-title>Fehlerberichte</v-list-item-title>
              <v-list-item-subtitle>Fehlerberichte anzeigen</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-col>
    </v-row>

    <input-dialog
      :active="dialog"
      @click-dialog-close="dialog = false"
    >
      {{ reports }}
    </input-dialog>
  </v-container>
</template>

<script>
import inputDialog from '~/components/input-dialog.vue'

export default {
  components: { inputDialog },
  name: 'Settings',
  layout: 'default',

  data () {
    return {
      user: { id: null, username: null },
      dialog: false,
      reports: ''
    }
  },

  mounted () {
    this.getVariables()
  },

  methods: {
    getVariables () {
      if (this.$auth.user) {
        this.user = this.$auth.user
      }
    },
    showReport () {
      this.reports = window.localStorage.getItem('error-reports')
      this.dialog = true
    }
  }
}
</script>
