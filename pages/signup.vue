<template>
  <v-container
    fluid
  >
    <v-banner
      dark
      class="mb-4"
      elevation="3"
      :icon="mdiAccountPlus"
      color="primary"
    >
      Registrieren
    </v-banner>
    <v-dialog
      v-model="dialog"
      persistent
      width="290"
    >
      <v-card>
        <v-card-title class="headline">
          Erfolgreich registriert!
        </v-card-title>

        <v-card-text>
          Du kannst dich jetzt mit deinen Zugangsdaten anmelden.
        </v-card-text>

        <v-divider />

        <v-card-actions>
          <v-spacer />
          <v-btn
            color="secondary"
            text
            @click="toLogin"
          >
            Anmelden
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
            v-model="signup.username"
            :rules="[rules.required, rules.username]"
            label="Benutzername"
            outlined
            dense
          />

          <v-text-field
            v-model="signup.email"
            :rules="[rules.required, rules.email]"
            label="E-Mail"
            outlined
            dense
          />

          <v-text-field
            v-model="signup.password"
            :append-icon="show ? mdiEye : mdiEyeOff"
            :rules="[rules.required, rules.password]"
            :type="show ? 'text' : 'password'"
            label="Passwort"
            outlined
            dense
            @click:append="show = !show"
          />

          <v-text-field
            v-model="repeatedPassword"
            :append-icon="show ? mdiEye : mdiEyeOff"
            :rules="[rules.required, rules.equals]"
            :type="show ? 'text' : 'password'"
            label="Passwort wiederholen"
            outlined
            dense
            @click:append="show = !show"
          />
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col class="text-center">
          <v-btn
            :disabled="!isFormValid"
            :loading="loading"
            color="secondary"
            @click="userSignup"
          >
            Account erstellen
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

<script>
import { mdiEye, mdiEyeOff, mdiAccountPlus } from '@mdi/js'

export default {
  name: 'SignUp',
  layout: 'default',

  data () {
    return {
      mdiEye,
      mdiEyeOff,
      mdiAccountPlus,
      dialog: false,
      alert: false,
      message: '',
      loader: null,
      loading: false,
      show: false,
      signup: {
        username: '',
        email: '',
        password: '',
        thingUUID: ''
      },
      repeatedPassword: '',
      isFormValid: false,
      rules: {
        required: (value) => { return !!value || 'Pflichtfeld' },
        email: (value) => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || 'Keine gültige E-Mail-Adresse'
        },
        password: (value) => {
          const pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,40}$/
          return pattern.test(value) || 'Mindestens 8 Zeichen, 1 Großbuchstabe, 1 Zahl'
        },
        username: (value) => {
          const pattern = /^[a-zA-Z0-9ÄäÖöÜü\\._-]{3,20}$/
          return pattern.test(value) || 'Mindestens 3 Zeichen, keine Sonderzeichen'
        },
        equals: (value) => { return value === this.signup.password || 'Passwörter stimmen nicht überein' }
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
  beforeMount () {
    if (!this.$auth.loggedIn) {
      this.$nuxt.$router.replace('/login?target=signup')
    }
    if (!this.$auth.user.roles.includes('ROLE_ADMIN')) {
      this.$nuxt.$router.replace('/')
    }
  },
  methods: {
    timeout () {
      if (this.loading) {
        this.showAlert('Registrierung fehlgeschlagen.')
      }
    },
    showAlert (message) {
      this.message = message
      this.loading = false
      this.alert = true
    },
    toLogin () {
      this.dialog = false
      window.$nuxt.$router.replace('/login')
    },
    async userSignup () {
      this.loader = 'loading'
      const signupResponse = await this.signupRequest()
      if (signupResponse) {
        this.dialog = true
      }
    },
    signupRequest () {
      const url = '/api/v2/auth/signup'
      const payload = this.signup
      const config = { headers: { Authorization: this.$auth.getToken('local') } }
      const _this = this
      return new Promise(function (resolve) {
        _this.$axios.post(url, payload, config)
          .then((response) => {
            if (response.status === 200) {
              resolve(response.data)
            } else {
              resolve(false)
            }
          })
          .catch((err) => {
            if (err.message === 'Network Error') {
              _this.showAlert('Server nicht erreichbar')
            } else {
              _this.showAlert(err)
            }
            resolve(false)
          })
      })
    }
  }
}
</script>
