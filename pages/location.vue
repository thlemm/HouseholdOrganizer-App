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
      :icon="mdiArchiveEdit"
      color="primary"
    >
      Lagerort bearbeiten
    </v-banner>
    <info-card
      class="mb-5"
      title="Raum ändern"
      subtitle="Hier kann der Raum einer Kiste oder eines Regals geändert werden."
    />
    <v-form>
      <v-row>
        <v-col align="center">
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
          <v-select
            v-model="input.room"
            :items="rooms"
            item-value="id"
            clearable
            outlined
            dense
            label="Raum"
          >
            <template #item="data">
              {{ data.item?.name ? $t(data.item?.name) : '---' }}
            </template>
            <template #selection="data">
              {{ $t(data.item?.name) }}
            </template>
          </v-select>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-btn
            :disabled="loading"
            color="secondary"
            @click="updateLocationRoom()"
          >
            Speichern
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

<script>
import { mdiArchiveEdit } from '@mdi/js'
import InfoSnackbar from '~/components/feedback/info-snackbar'
export default {
  name: 'Location',
  components: { InfoSnackbar },
  layout: 'default',

  data () {
    return {
      mdiArchiveEdit,
      locations: [],
      rooms: [],
      loading: false,
      snackbar: false,
      feedbackMessage: null,
      input: {
        location: null,
        room: null
      }
    }
  },
  beforeMount () {
    if (!this.$auth.loggedIn) {
      this.$nuxt.$router.replace('/login?target=location')
    }
    this.getData()
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
      const getRoomsResponse = await this.getRoomsRequest()
      if (getLocationResponse) {
        this.rooms = getRoomsResponse
      }
    },
    async updateLocationRoom () {
      const updateLocationRoomResponse = await this.updateLocationRoomRequest()
      if (!updateLocationRoomResponse) {
        this.handleError('Interesse konnte nicht aktualisiert werden')
      }
      // ToDo: Add sufficient user feedback on success
      this.handleError('Erfolgreich geändert.')
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
    getRoomsRequest () {
      const url = '/api/v2/rooms'
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
    updateLocationRoomRequest () {
      const url = '/api/v2/location/' + this.input.location + '/room/' + this.input.room
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
