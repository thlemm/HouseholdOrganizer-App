<template>
  <v-container
    fluid
  >
    <v-banner
      dark
      class="mb-2"
      elevation="3"
      :icon="mdiMagnify"
      color="secondary"
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
            item-text="label"
            item-value="id"
            clearable
            outlined
            dense
            label="Typ"
          />

          <input-tags
            v-model="input.tags"
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
      v-for="(item, i) in items"
      :key="i"
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
import { mdiMagnify } from '@mdi/js'
import InputTags from '~/components/input/InputTags'
export default {
  name: 'Search',
  components: { InputTags },
  layout: 'default',

  data () {
    return {
      mdiMagnify,
      alert: false,
      message: '',
      loader: null,
      loading: false,
      types: [
        { id: 1, name: 'TYPE_DECORATION', label: this.$t('TYPE_DECORATION') },
        { id: 2, name: 'TYPE_FURNITURE', label: this.$t('TYPE_FURNITURE') },
        { id: 3, name: 'TYPE_UTILITY_ITEM', label: this.$t('TYPE_UTILITY_ITEM') },
        { id: 4, name: 'ROOM_TECHNICAL_DEVICE', label: this.$t('ROOM_TECHNICAL_DEVICE') },
        { id: 5, name: 'ROOM_FURNISHING', label: this.$t('ROOM_FURNISHING') }
      ],
      input: {
        type: null,
        tags: []
      },
      dialog: {
        search: false
      },
      items: []
    }
  },

  beforeMount () {
    if (!this.$auth.loggedIn) {
      this.$nuxt.$router.replace('/login')
    }
  },

  methods: {
    createPaylod () {
      if (this.input.type === null) {
        return { tags: this.input.tags }
      } else {
        return {
          type: this.input.type,
          tags: this.input.tags
        }
      }
    },
    timeout () {
      if (this.loading) {
        this.showAlert('Suche fehlgeschlagen.')
      }
    },
    async search () {
      try {
        this.dialog.search = true
        this.loading = true
        const response = await this.postRequest()
        if (response) {
          this.loading = false
          this.items = response
        } else {
          this.items = []
        }
      } catch (err) {
        console.log(err)
      }
    },
    postRequest () {
      const url = '/api/v2/items/search'
      const payload = this.createPaylod()
      const config = { headers: { Authorization: this.$auth.getToken('local') } }
      const _this = this
      return new Promise(function (resolve, reject) {
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
