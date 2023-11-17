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
        :icon="mdiHeart"
        color="primary"
      >
        Meine Sachen
      </v-banner>

      <info-card
        v-if="items === undefined"
        title="Nichts gefunden"
        subtitle="Hier werden die Sachen angezeigt, die mit deinem Account verknüpft sind."
      />

      <div
        v-for="item in items"
        :key="item.id"
      >
        <v-sheet min-height="125" class="fill-height" color="transparent">
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
  </v-layout>
</template>

<script>
import { mdiHeart } from '@mdi/js'

export default {
  name: 'MyStuff',
  layout: 'default',

  data () {
    return {
      mdiHeart,
      show: null,
      items: undefined,
      isActive: false
    }
  },
  beforeMount () {
    if (!this.$auth.loggedIn) {
      this.$nuxt.$router.replace('/login')
    }
    this.getData()
  },
  methods: {
    async getData () {
      if (this.$auth.loggedIn) {
        this.items = await this.getRequest()
      }
    },
    getRequest () {
      const url = '/api/v2/items/user'
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
