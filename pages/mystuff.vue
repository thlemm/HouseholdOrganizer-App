<template>
  <v-layout
    column
    justify-center
    align-center
  >
    <v-container
      fluid
    >
      <v-banner
        dark
        class="mb-2"
        elevation="3"
        icon="mdi-cloud-outline"
        color="complementary"
      >
        Meine Sachen
      </v-banner>

      <info-card
        v-if="things === undefined"
        title="Nichts gefunden"
        subtitle="Hier werden die Sachen angezeigt, die mit deinem Account verknüpft sind."
      />

      <div
        v-for="(thing, i) in things"
        :key="i"
      >
        <v-sheet min-height="125" class="fill-height" color="transparent">
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
  </v-layout>
</template>

<script>

export default {
  name: 'MyStuff',
  layout: 'default',

  data () {
    return {
      show: null,
      things: undefined,
      isActive: false
    }
  },
  beforeMount () {
    this.checkLogin()
    if (!this.$auth.loggedIn) {
      window.$nuxt.$router.replace('/login')
    }
    this.getData()
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
    async getData () {
      if (this.$auth.loggedIn) {
        this.things = await this.getRequest()
        console.log(this.things)
      }
    },
    getRequest () {
      const url = '/thing/my/' + this.$auth.user.username
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
