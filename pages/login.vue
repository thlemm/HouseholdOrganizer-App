<template>
  <v-container
    fluid
  >
    <v-banner
      dark
      class="mb-4"
      elevation="3"
      :icon="mdiLogin"
      color="primary"
    >
      Anmelden
    </v-banner>
    <v-form v-model="isFormValid">
      <v-row>
        <v-col>
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
            label="Passwort"
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
import { mdiLogin } from '@mdi/js'

export default {
  name: 'UserLogin',
  layout: 'default',

  data () {
    return {
      mdiLogin,
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
    toTarget () {
      this.dialog = false
      if (this.$route.query.target) {
        this.$nuxt.$router.replace(this.$route.query.target.toString())
      } else {
        this.$nuxt.$router.replace('/')
      }
    },
    async userLogin () {
      this.loader = 'loading'
      try {
        const response = await this.$auth.loginWith('local', { data: this.login })
        this.$auth.setUser(response.data)
        this.loading = false
        if (response.status === 200) {
          this.toTarget()
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
