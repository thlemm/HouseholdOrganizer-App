<template>
  <v-container
    fluid
  >
    <v-banner
      dark
      class="mb-2"
      elevation="3"
      icon="mdi-cube-scan"
      color="complementary"
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
              v-model="input.box_id"
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
      v-for="(thing, i) in things"
      :key="i"
    >
      <v-sheet class="fill-height" color="transparent">
        <v-lazy
          v-model="thing.isActive"
          :options="{
            threshold: .5
          }"
          class="fill-height"
          transition="fade-transition"
        >
          <thing-card
            :thing-id="thing.thing_id"
            :tags="thing.tags"
            :location="thing.location"
            :box-id="thing.box_id"
            :room="thing.room"
            :type="thing.type"
            :picture="thing.picture"
            :user="thing.user"
          />
        </v-lazy>
      </v-sheet>
    </div>
  </v-container>
</template>

<script>

export default {
  name: 'Search',
  layout: 'default',

  data () {
    return {
      alert: false,
      message: '',
      loader: null,
      loading: false,
      input: {
        box_id: null
      },
      isFormValid: false,
      rules: {
        required: (value) => { return !!value || 'Bitte eingeben.' },
        location: (value) => {
          const pattern = /^[0-9]*$/
          return pattern.test(value) || 'Zahl eingeben.'
        }
      },
      things: null
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
          this.things = response
        } else {
          this.things = null
        }
      }
    },
    getRequest () {
      const url = '/thing/scan/' + this.input.box_id
      const config = { headers: { Authorization: this.$auth.getToken('local') } }
      return new Promise(function (resolve, reject) {
        window.$nuxt.$http.plain.get(url, config)
          .then((response) => {
            if (response.status === 200) {
              resolve(response.data.data)
            } else {
              reject(Error('An error occured.'))
            }
          })
          .catch((err) => {
            console.log(JSON.stringify(err))
            const reports = window.localStorage.getItem('error-reports')
            window.localStorage.setItem('error-reports', JSON.stringify(err) + ';' + reports)
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
