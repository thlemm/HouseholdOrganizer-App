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
      :icon="mdiAccountEdit"
      color="primary"
    >
      Benutzer bearbeiten
    </v-banner>
    <info-card
      class="mb-5"
      title="Rollen vergeben"
      subtitle="Hier können einzelnen Nutzern Rollen vergeben und entzogen werden."
    />
    <v-form>
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
          <v-select
            v-model="input.roles"
            :items="roles"
            item-value="id"
            item-text="name"
            outlined
            dense
            label="Rollen"
            multiple
          />
          {{ input.roles }}
          {{ currentRoles }}
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col class="text-center">
          <v-btn
            :disabled="loading"
            color="secondary"
            @click="updateUserRoles()"
          >
            Speichern
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

<script>
import { mdiAccountEdit } from '@mdi/js'
import InfoSnackbar from '~/components/feedback/info-snackbar'
export default {
  name: 'Users',
  components: { InfoSnackbar },
  layout: 'default',

  data () {
    return {
      mdiAccountEdit,
      snackbar: false,
      feedbackMessage: null,
      loading: false,
      users: [],
      roles: [],
      input: {
        user: null,
        roles: []
      }
    }
  },
  computed: {
    currentRoles () {
      console.log('updating current roles')
      const roles = []
      for (const role in this.input.user?.roles) {
        console.log(role)
        console.log(role.id)
        roles.push(role.id)
      }
      return roles
    }
  },
  beforeMount () {
    if (!this.$auth.loggedIn) {
      this.$nuxt.$router.replace('/login?target=users')
    }
    if (!this.$auth.user.roles.includes('ROLE_ADMIN')) {
      this.$nuxt.$router.replace('/')
    }
    this.getRolesAndUsers()
  },
  methods: {
    async getRolesAndUsers () {
      const getUsersResponse = await this.getUsersRequest()
      if (getUsersResponse) {
        this.users = getUsersResponse
      }
      const getRolesResponse = await this.getRolesRequest()
      if (getRolesResponse) {
        this.roles = getRolesResponse
      }
    },
    updateUserRoles () {
      // ToDo
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
    getRolesRequest () {
      const url = '/api/v2/auth/roles'
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
    }
  }
}
</script>
