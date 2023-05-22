<template>
  <v-container
    fluid
  >
    <v-banner
      dark
      class="mb-2"
      elevation="3"
      icon="mdi-magnify"
      color="complementary"
    >
      Suchen
    </v-banner>

    <br>
    <v-form>
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

          <v-select
            v-model="input.type"
            :items="types"
            clearable
            outlined
            dense
            label="Typ"
          />

          <v-select
            v-model="input.room"
            :items="rooms"
            clearable
            outlined
            dense
            label="Raum"
          />

          <v-text-field
            v-model="input.text"
            label="Schlagwort"
            clearable
            outlined
            dense
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col align="end">
          <v-btn
            :loading="loading"
            color="secondary"
            @click="search"
          >
            Suchen
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
      rooms: ['Esszimmer', 'Wohnzimmer', 'Kueche', 'Hof', 'Arbeitszimmer', 'Schlafzimmer', 'Gruenes Zimmer', 'Lottozimmer', 'Liborizimmer I', 'Liborizimmer II', 'Bad', 'Toilette rosa', 'Toilette beige', 'Topfkammer', 'Diele EG', 'Diele 1. OG', 'Diele 2. OG', 'Zentralkeller', 'Waschkeller', 'Lagerkeller', 'Werkstatt', 'Suedbalkon', 'Nordbalkon'],
      types: ['Dekoration', 'Technisches Geraet', 'Gebrauchsgegenstand', 'Moebelstueck', 'Einrichtungsgegenstand'],
      locations: ['Keller', 'Hof', 'Gruenes Zimmer', 'Nach Bild'],
      input: {
        room: '',
        type: '',
        text: ''
      },
      dialog: {
        search: false
      },
      things: null,
      isActive: false
    }
  },

  beforeMount () {
    this.checkLogin()
    if (!this.$auth.loggedIn) {
      window.$nuxt.$router.replace('/login')
    }
  },

  methods: {
    checkLogin () {
      const age = Number(window.localStorage.getItem('token-age'))
      console.log('age: ' + age)
      const now = Date.now()
      console.log('now: ' + now)
      console.log('now-age: ' + (now - age))
      if (age < now - 1800000) {
        console.log('max age expired')
        window.$nuxt.$router.replace('/login')
      }
      console.log(age)
    },
    createPaylod () {
      return {
        type: this.input.type,
        room: this.input.room,
        text: this.input.text
      }
    },
    timeout () {
      if (this.loading) {
        this.showAlert('Anmeldung fehlgeschlagen.')
      }
    },
    checkInput (input) {
      if (input.room === '' && input.type === '' && input.text === '') {
        this.message = 'Zu wenig Angaben'
        this.alert = true
        return false
      }
      return true
    },
    async search () {
      try {
        if (this.checkInput(this.input)) {
          this.dialog.search = true
          this.loading = true
          const response = await this.postRequest()
          if (response) {
            this.loading = false
            this.things = response.data.data
          } else {
            this.things = null
          }
        }
      } catch (err) {
        if (err.message === 'Request Error') {
          this.showSnackbar('Request Error')
        } else if (err.message === 'Network Error') {
          this.showSnackbar('Network Error')
        } else if (err.message === 'Unknown Error') {
          this.showSnackbar('Unknown Error')
        } else {
          this.showSnackbar('Unexpected Error')
        }
      }
    },
    postRequest () {
      const url = '/thing/search/'
      const payload = this.createPaylod()
      const config = { headers: { Authorization: this.$auth.getToken('local') } }
      return new Promise(function (resolve, reject) {
        window.$nuxt.$http.plain.post(url, payload, config)
          .then((response) => {
            if (response.status === 200) {
              resolve(response)
            } else {
              resolve(false)
            }
          })
          .catch((err) => {
            const reports = window.localStorage.getItem('error-reports')
            window.localStorage.setItem('error-reports', JSON.stringify(err) + ';' + reports)
            console.log(JSON.stringify(err))
            if (err.message === 'Network Error') {
              return reject(Error('Network Error'))
            } else {
              return reject(Error('Unknown Error'))
            }
          })
      })
    }
  }
}
</script>
