<template>
  <v-container
    fluid
  >
    <v-banner
      dark
      class="mb-2"
      elevation="3"
      icon="mdi-cube-scan"
      color="secondary"
    >
      Kiste Durchleuchten
    </v-banner>
    <info-card
      title="Nummer eingeben"
      subtitle="Hier kann die Nummer der Kiste oder des Regals eingegeben werden, dass gescannt werden soll."
    />

    <br>
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

          <v-col
            cols="5"
          >
            <v-text-field
              v-model="input.location"
              :rules="[rules.required, rules.location]"
              type="number"
              outlined
              dense
              label="Nummer"
            />
          </v-col>
        </v-col>
      </v-row>
      <v-row>
        <v-col align="end">
          <v-btn
            :disabled="!isFormValid"
            :loading="loading"
            color="secondary"
            @click="scan"
          >
            Durchleuchten
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
    <v-divider class="mt-3 mb-3" />

    <div
      v-for="item in items"
      :key="item.id"
    >
      <v-sheet class="fill-height" color="transparent">
        <v-lazy
          :options="{
            threshold: .5
          }"
          class="fill-height"
          transition="fade-transition"
        >
          <item-card
            :item="item"
          />
        </v-lazy>
      </v-sheet>
    </div>
  </v-container>
</template>

<script>

export default {
  name: 'Scan',
  layout: 'default',

  data () {
    return {
      alert: false,
      message: '',
      loader: null,
      loading: false,
      input: {
        location: null
      },
      isFormValid: false,
      rules: {
        required: (value) => { return !!value || 'Bitte eingeben.' },
        location: (value) => {
          const pattern = /^[0-9]*$/
          return pattern.test(value) || 'Zahl eingeben.'
        }
      },
      items: []
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
        this.showAlert('Durchleuchten fehlgeschlagen.')
      }
    },
    async scan () {
      if (this.$auth.loggedIn) {
        this.loading = true
        const response = await this.getRequest()
        if (response) {
          this.loading = false
          this.items = response
        } else {
          this.items = []
        }
      }
    },
    getRequest () {
      const url = '/api/v2/items/location/' + this.input.location
      const config = { headers: { Authorization: this.$auth.getToken('local') } }
      const _this = this
      return new Promise(function (resolve, reject) {
        _this.$axios.get(url, config)
          .then((response) => {
            if (response.status === 200) {
              resolve(response.data)
            } else {
              reject(Error('An error occured.'))
            }
          })
          .catch((err) => {
            if (err.message === 'Network Error') {
              console.log('Server nicht erreichbar.')
            } else {
              console.log('Abfrage fehlgeschlagen.')
            }
          })
      })
    }
  }
}
</script>
