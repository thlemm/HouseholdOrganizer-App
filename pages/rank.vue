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
        v-if="thing === undefined"
        dark
        class="mb-2"
        elevation="3"
        :icon="mdiThumbsUpDown"
        color="secondary"
      >
        Neue Sachen bewerten
      </v-banner>
      <info-card
        v-if="thing === undefined"
        title="Nicht gefunden"
        subtitle="Es wurden noch keine neuen Sachen in den Katalog eingetragen. Versuche es später nocheinmal."
      />

      <rank-card
        v-for="(element, i) in thing"
        :key="i"
        :thing-id="element.thing_id"
        :tags="element.tags"
        :room="element.room"
        :type="element.type"
        :picture="element.picture"
      />
    </v-container>
  </v-layout>
</template>

<script>
import { mdiThumbsUpDown } from '@mdi/js'
export default {
  name: 'Rank',
  layout: 'default',

  data () {
    return {
      mdiThumbsUpDown,
      show: null,
      notification: false,
      thing: undefined
    }
  },
  beforeMount () {
    if (!this.$auth.loggedIn) {
      window.$nuxt.$router.replace('/login')
    }
    this.getData()
  },
  created () {
    this.$nuxt.$on('accept-thing', () => {
      this.accept()
    })
    this.$nuxt.$on('reject-thing', () => {
      this.reject()
    })
  },
  beforeDestroy () {
    this.$nuxt.$off('accept-thing')
    this.$nuxt.$off('reject-thing')
  },
  methods: {
    async accept () {
      const response = await this.sendRanking(1)
      if (response === 'success') {
        console.log('Accepted')
        this.getData()
      }
    },
    async reject () {
      const response = await this.sendRanking(0)
      if (response === 'success') {
        console.log('Rejected')
        this.getData()
      }
    },
    sendRanking (value) {
      const url = '/thing/rank/'
      const payload = { thing_id: this.thing[0].thing_id, status: value, username: this.$auth.user.username }
      const config = { headers: { Authorization: this.$auth.getToken('local') } }
      return new Promise(function (resolve) {
        window.$nuxt.$http.plain.post(url, payload, config)
          .then((response) => {
            if (response.status === 200) {
              resolve(response.data.message)
            } else {
              resolve(false)
            }
          })
          .catch((err) => {
            console.log(JSON.stringify(err))
            if (err.message === 'Network Error') {
              console.log('Server nicht erreichbar.')
            } else {
              console.log('Abfrage fehlgeschlagen.')
            }
            resolve(false)
          })
      })
    },
    async getData () {
      // if (this.$auth.loggedIn) {
      this.thing = await this.getUnranked()
      console.log(this.thing)
    },
    getUnranked () {
      const url = '/thing/unranked/' + this.$auth.user.username
      const config = { headers: { Authorization: this.$auth.getToken('local') } }
      return new Promise(function (resolve) {
        window.$nuxt.$http.plain.get(url, config)
          .then((response) => {
            if (response.status === 200) {
              resolve(response.data.data)
            } else {
              resolve(false)
            }
          })
          .catch((err) => {
            console.log(JSON.stringify(err))
            if (err.message === 'Network Error') {
              console.log('Server nicht erreichbar.')
            } else {
              console.log('Abfrage fehlgeschlagen.')
            }
            resolve(false)
          })
      })
    }
  }
}
</script>
