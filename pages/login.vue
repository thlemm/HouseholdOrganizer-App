<template>
  <v-container
    fluid
  >
    <v-dialog
      v-model="dialog"
      persistent
      width="290"
    >
      <v-card>
        <v-card-title class="headline">
          Erfolg!
        </v-card-title>

        <v-card-text>
          Sie haben sich erfolgreich angemeldet.
        </v-card-text>

        <v-divider />

        <v-card-actions>
          <v-spacer />
          <v-btn
            color="primary"
            text
            @click="toHome"
          >
            weiter
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-form v-model="isFormValid">
      <v-row>
        <v-col align="center">
          <v-alert
            :value="alert"
            outlined
            dense
            type="info"
            text
            transition="scale-transition"
          >
            {{ message }}
          </v-alert>

          <v-text-field
            v-model="login.username"
            :rules="[rules.required]"
            label="Benutzername"
            outlined
            dense
          />

          <v-text-field
            v-model="login.password"
            :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
            :rules="[rules.required]"
            :type="show ? 'text' : 'password'"
            name="input-10-2"
            label="Passwort"
            outlined
            dense
            @click:append="show = !show"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col align="end">
          <v-btn
            :disabled="!isFormValid"
            :loading="loading"
            color="secondary"
            @click="userLogin"
          >
            Anmelden
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

<script>

export default {
  name: 'UserLogin',
  layout: 'default',

  data () {
    return {
      dialog: false,
      alert: false,
      message: '',
      loader: null,
      loading: false,
      show: false,
      login: {
        username: '',
        password: ''
      },
      isFormValid: false,
      rules: {
        required: (value) => { return !!value || 'Pflichtfeld.' }
      }
    }
  },
  watch: {
    loader () {
      this.loading = true
      setTimeout(() => (this.timeout()), 10000)
      this.loader = null
    }
  },
  methods: {
    timeout () {
      if (this.loading) {
        this.showAlert('Anmeldung fehlgeschlagen.')
      }
    },
    showAlert (message) {
      this.message = message
      this.loading = false
      this.alert = true
    },
    toHome () {
      this.dialog = false
      window.$nuxt.$router.replace('/')
    },
    async userLogin () {
      this.loader = 'loading'
      try {
        const response = await this.$auth.loginWith('local', { data: this.login })
        console.log(response)
        this.$auth.setUser(response.data)
        this.loading = false
        console.log(response)
        if (response.status === 200) {
          window.localStorage.setItem('token-age', Date.now())
          this.dialog = true
        }
      } catch (err) {
        if (err.message === 'Network Error') {
          this.showAlert('Server nicht erreichbar.')
        } else {
          this.showAlert('Anmeldung fehlgeschlagen.')
        }
      }
    }
  }
}
</script>
