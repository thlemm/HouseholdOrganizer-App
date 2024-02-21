<template>
  <v-container
    fluid
  >
    <info-snackbar
      :active="snackbar"
      @click-action="snackbar = !snackbar"
    >
      {{ feedbackMessage }}
    </info-snackbar>

    <v-banner
      dark
      class="mb-2"
      elevation="3"
      :icon="mdiMagnify"
      color="primary"
    >
      Suchen
    </v-banner>

    <br>
    <v-form>
      <v-row>
        <v-col align="center">
          <v-text-field
            v-model="input.mark"
            type="number"
            outlined
            dense
            clearable
            :disabled="isInputMarkDisabled"
            label="Teilenummer"
            @input="onInputMark($event)"
          />

          <v-select
            v-model="input.type"
            :items="types"
            item-value="id"
            clearable
            outlined
            dense
            :disabled="isInputTypeDisabled"
            label="Typ"
            @input="onOtherInput()"
          >
            <template #item="data">
              {{ $t(data.item.name) }}
            </template>
            <template #selection="data">
              {{ $t(data.item.name) }}
            </template>
          </v-select>

          <v-select
            v-model="input.status"
            :items="status"
            item-value="id"
            clearable
            outlined
            dense
            :disabled="isInputStatusDisabled"
            label="Status"
            @input="onOtherInput()"
          >
            <template #item="data">
              {{ $t(data.item.name) }}
            </template>
            <template #selection="data">
              {{ $t(data.item.name) }}
            </template>
          </v-select>

          <input-tags
            v-model="input.tags"
            :disabled="isInputTagsDisabled"
            @input="onOtherInput()"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col class="text-center">
          <v-btn
            :disabled="loading"
            color="secondary"
            @click="search"
          >
            Suchen
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
    <v-divider class="mt-3 mb-0" />
    <span class="mt-0 pt-0 mb-5 grey--text">{{ items.length }} {{ items.length > 1 ? 'Ergebnisse' : 'Ergebnis' }} gefunden:</span>
    <info-card-loader
      :lazy="lazy"
      :items="items"
      :loading="loading"
      @loaded-items="loading = false"
      @reloaded-item="replaceReloadedItem($event)"
    />
  </v-container>
</template>

<script>
import { mdiMagnify } from '@mdi/js'
import InputTags from '~/components/input/input-tags'
import InfoSnackbar from '~/components/feedback/info-snackbar'
export default {
  name: 'Search',
  components: { InfoSnackbar, InputTags },
  layout: 'default',

  data () {
    return {
      mdiMagnify,
      alert: false,
      message: '',
      loading: false,
      types: [],
      input: {
        mark: null,
        type: null,
        tags: [],
        status: null
      },
      items: [],
      status: [],
      snackbar: false,
      feedbackMessage: null,
      lazy: true,
      isInputMarkDisabled: false,
      isInputTypeDisabled: false,
      isInputStatusDisabled: false,
      isInputTagsDisabled: false
    }
  },

  beforeMount () {
    if (!this.$auth.loggedIn) {
      this.$nuxt.$router.replace('/login?target=search')
    }
  },
  mounted () {
    this.getData()
  },

  methods: {
    replaceReloadedItem (item) {
      const index = this.items.findIndex(obj => obj.id === item.id)
      if (index !== -1) {
        this.$set(this.items, index, item)
      }
    },
    onInputMark (input) {
      this.isInputTypeDisabled = this.isInputStatusDisabled = this.isInputTagsDisabled = !(input === '' || input === null)
    },
    onOtherInput () {
      this.isInputMarkDisabled = !(this.input.type === null && this.input.status === null && this.input.tags.length === 0)
    },
    handleError (feedbackMessage) {
      this.snackbar = true
      this.feedbackMessage = feedbackMessage
      this.loading = false
    },
    createPayload () {
      if (this.input.mark) {
        return {
          mark: this.input.mark,
          tags: this.input.tags
        }
      } else if (this.input.type === null) {
        return { tags: this.input.tags }
      } else {
        return {
          type: this.input.type,
          tags: this.input.tags
        }
      }
    },
    async getData () {
      const getItemTypesResponse = await this.getItemTypesRequest()
      if (getItemTypesResponse) {
        this.types = getItemTypesResponse
      }
      const getTransactionStatesResponse = await this.getTransactionStatesRequest()
      if (getTransactionStatesResponse) {
        this.status = getTransactionStatesResponse
      }
    },
    getItemTypesRequest () {
      const url = '/api/v2/itemTypes'
      const config = { headers: { Authorization: this.$auth.getToken('local') } }
      const _this = this
      return new Promise(function (resolve) {
        _this.$axios.get(url, config)
          .then((response) => {
            if (response.status === 200) {
              resolve(response.data)
            } else {
              resolve(false)
            }
          })
          .catch(() => {
            resolve(false)
          })
      })
    },
    getTransactionStatesRequest () {
      const url = '/api/v2/transactions/states'
      const config = { headers: { Authorization: this.$auth.getToken('local') } }
      const _this = this
      return new Promise(function (resolve) {
        _this.$axios.get(url, config)
          .then((response) => {
            if (response.status === 200) {
              resolve(response.data)
            } else {
              resolve(false)
            }
          })
          .catch(() => {
            resolve(false)
          })
      })
    },
    async search () {
      this.items = []
      this.lazy = false
      this.loading = true
      const searchResponse = await this.searchRequest()
      if (searchResponse) {
        this.items = searchResponse
        this.lazy = true
      } else {
        this.items = []
        this.handleError('Fehler bei Abfrage der Daten')
      }
    },
    searchRequest () {
      const url = '/api/v2/items/search'
      const payload = this.input
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
              _this.handleError('Server nicht erreichbar')
            } else {
              _this.handleError('Unerwarteter Fehler')
            }
            resolve(false)
          })
      })
    }
  }
}
</script>
