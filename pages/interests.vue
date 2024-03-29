<template>
  <v-layout
    column
    justify-center
    align-center
  >
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
        class="mb-3 pt-0"
        elevation="3"
        :icon="mdiHeartSearch"
        color="error"
      >
        Alle Interessen {{ items?.length > 0 ? '(' + (items?.length) + ')' : '' }}
      </v-banner>
      <v-form class="mt-3">
        <v-row>
          <v-col align="center">
            <v-select
              v-model="input.user"
              :items="users"
              item-value="id"
              item-text="username"
              clearable
              outlined
              dense
              return-object
              label="Benutzer"
            />
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col class="text-center">
            <v-btn
              :disabled="loading"
              color="secondary"
              @click="getItems"
            >
              Anzeigen
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
      <v-divider class="mt-3 mb-0" />
      <info-card-loader
        class="mt-3"
        :lazy="lazy"
        :items="items"
        :loading="loading"
        @loaded-items="loading = false"
        @reloaded-item="replaceReloadedItem($event)"
      />
    </v-container>
  </v-layout>
</template>

<script>
import { mdiHeartSearch } from '@mdi/js'
import InfoSnackbar from '~/components/feedback/info-snackbar'

export default {
  name: 'Interests',
  components: { InfoSnackbar },
  layout: 'default',

  data () {
    return {
      mdiHeartSearch,
      show: null,
      items: [],
      isActive: false,
      username: undefined,
      snackbar: false,
      feedbackMessage: null,
      loading: false,
      lazy: true,
      users: [],
      input: {
        user: null
      }
    }
  },
  beforeMount () {
    if (!this.$auth.loggedIn) {
      this.$nuxt.$router.replace('/login?target=interests')
    }
    if (!this.$auth.user.roles.includes('ROLE_ADMIN')) {
      this.$nuxt.$router.replace('/')
    }
    this.getUsers()
  },
  methods: {
    replaceReloadedItem (item) {
      const index = this.items.findIndex(obj => obj.id === item.id)
      if (index !== -1) {
        this.$set(this.items, index, item)
      }
    },
    handleError (feedbackMessage) {
      this.snackbar = true
      this.feedbackMessage = feedbackMessage
      this.loading = false
    },
    async getUsers () {
      const getUsersResponse = await this.getUsersRequest()
      if (getUsersResponse) {
        this.users = getUsersResponse
      }
    },
    getUsersRequest () {
      const url = '/api/v2/auth/users'
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
    async getItems () {
      if (this.$auth.loggedIn) {
        this.lazy = false
        this.eventsCounter = 0
        this.loading = true
        const getUserItemsResponse = await this.getUserItemsRequest()
        if (getUserItemsResponse) {
          if (getUserItemsResponse.length === 0) {
            this.loading = false
          }
          this.items = getUserItemsResponse
          this.eventLimit = this.items.length
          this.lazy = true
        } else {
          this.snackbar = true
          this.handleError('Fehler bei Abfrage der Daten')
        }
      } else {
        this.snackbar = true
        this.handleError('Du bist nicht korrekt eingeloggt')
      }
    },
    getUserItemsRequest () {
      const url = '/api/v2/user/' + this.input.user.id + '/items'
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
