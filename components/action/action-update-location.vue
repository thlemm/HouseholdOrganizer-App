<template>
  <div style="float: left;">
    <input-dialog
      :active="dialog"
      toolbar-title="Kiste/Regal ändern"
      @click-dialog-close="dialog = false"
    >
      <info-snackbar
        :active="snackbar"
        @click-action="snackbar = !snackbar"
      >
        {{ feedbackMessage }}
      </info-snackbar>

      <info-card
        class="mb-5"
        title="Lagerort ändern"
        subtitle="Hier kann der neue Lagerort für diese Sache ausgewählt werden."
      />
      <v-form>
        <v-row>
          <v-col>
            <v-select
              v-model="input.location"
              :items="locations"
              item-value="id"
              clearable
              outlined
              dense
              label="Kiste/Regal"
            >
              <template #item="data">
                {{ data.item.mark }} ({{ data.item?.room ? $t(data.item?.room?.name) : '---' }}, {{ data.item.box ? 'Kiste' : 'Regal' }})
              </template>
              <template #selection="data">
                {{ data.item.mark }} ({{ data.item?.room ? $t(data.item?.room?.name) : '---' }}, {{ data.item.box ? 'Kiste' : 'Regal' }})
              </template>
            </v-select>
          </v-col>
        </v-row>
        <v-row class="text-center">
          <v-col>
            <v-btn
              :disabled="loading"
              color="secondary"
              @click="updateLocation()"
            >
              Speichern
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </input-dialog>
    <v-btn
      class="ml-1"
      color="neutral"
      rounded
      :disabled="disabled"
      @click="dialog = true"
    >
      <v-icon color="action">
        {{ mdiArchiveEdit }}
      </v-icon>
    </v-btn>
  </div>
</template>

<script>
import { mdiArchiveEdit } from '@mdi/js'
import InfoSnackbar from '~/components/feedback/info-snackbar'
export default {
  name: 'ActionUpdateLocation',
  components: { InfoSnackbar },
  props: {
    itemId: {
      type: Number,
      required: true
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data () {
    return {
      mdiArchiveEdit,
      dialog: false,
      locations: [],
      input: {
        location: null
      },
      loading: false,
      snackbar: false,
      feedbackMessage: null
    }
  },
  watch: {
    dialog () {
      if (this.dialog === true) {
        this.getData()
      }
    }
  },
  methods: {
    handleError (feedbackMessage) {
      this.snackbar = true
      this.feedbackMessage = feedbackMessage
    },
    async getData () {
      const getLocationResponse = await this.getLocationsRequest()
      if (getLocationResponse) {
        this.locations = getLocationResponse
      }
    },
    async updateLocation () {
      const updateLocationResponse = await this.updateLocationRequest()
      if (!updateLocationResponse) {
        this.handleError('Interesse konnte nicht aktualisiert werden')
      }
      this.$emit('update-location')
      this.dialog = false
    },
    getLocationsRequest () {
      const url = '/api/v2/locations'
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
    updateLocationRequest () {
      const url = '/api/v2/item/' + this.itemId + '/location/' + this.input.location
      const config = { headers: { Authorization: this.$auth.getToken('local') } }
      const _this = this
      return new Promise(function (resolve) {
        _this.$axios.patch(url, config)
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
