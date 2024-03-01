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
      color="error"
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
            @change="setCurrentRoles"
          />
          <v-select
            v-model="input.roles"
            :items="roles"
            item-value="id"
            item-text="label"
            outlined
            dense
            label="Rollen"
            multiple
          />
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
    setCurrentRoles () {
      const roles = []
      if (!this.input.user) {
        return
      }
      for (const role of this.input.user?.roles) {
        roles.push(role.id)
      }
      this.input.roles = roles
    },
    async getRolesAndUsers () {
      const getUsersResponse = await this.getUsersRequest()
      if (getUsersResponse) {
        this.users = getUsersResponse
      }
      const getRolesResponse = await this.getRolesRequest()
      if (getRolesResponse) {
        this.roles = this.createLabeledRoles(getRolesResponse)
      }
    },
    createLabeledRoles (roles) {
      const labeledRoles = []
      for (const role of roles) {
        labeledRoles.push({
          id: role.id,
          name: role.name,
          label: this.$t(role.name)
        })
      }
      return labeledRoles
    },
    async updateUserRoles () {
      this.loading = true
      setTimeout(() => (this.loading = false), 10000)
      const postUserRolesResponse = await this.postUserRolesRequest()
      if (postUserRolesResponse) {
        await this.getRolesAndUsers()
        this.loading = false
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
    },
    postUserRolesRequest () {
      const url = '/api/v2/auth/user/roles'
      const data = {
        userId: this.input.user.id,
        roleIds: this.input.roles
      }
      const config = { headers: { Authorization: this.$auth.getToken('local') } }
      const _this = this
      return new Promise(function (resolve) {
        _this.$axios.post(url, data, config)
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
