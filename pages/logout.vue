<template>
  <v-container
    fluid
  >
    <v-form v-model="isFormValid">
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
            {{ alertText }}
          </v-alert>

          <v-btn
            class="mt-3"
            :disabled="!isFormValid"
            color="secondary"
            @click="userLogout"
          >
            Abmelden
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

<script>

export default {
  name: 'UserLogout',
  layout: 'default',

  data () {
    return {
      alert: false,
      alertText: '',
      show: false,
      isFormValid: false
    }
  },
  methods: {
    userLogout () {
      this.$auth.logout()
      window.$nuxt.$router.replace('/login')
    }
  }
}
</script>
