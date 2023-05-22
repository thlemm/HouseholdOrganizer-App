<template>
  <v-layout
    column
    justify-center
    align-center
  >
    <v-container
      fluid
    >
      <v-row>
        <v-col>
          <home-card />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-btn
            class="mb-9 mr-1"
            dark
            absolute
            bottom
            right
            fab
            color="complementary"
            to="/add"
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-layout>
</template>

<script>

export default {
  data () {
    return {

    }
  },

  mounted () {
    this.checkLogin()
  },

  methods: {
    checkLogin () {
      const age = Number(window.localStorage.getItem('token-age'))
      console.log('age: ' + age)
      const now = Date.now()
      console.log('now: ' + now)
      console.log('now-age: ' + (now - age))
      if (age < now - 1800000) {
        console.log('max age expired')
        window.$nuxt.$router.replace('/login')
      }
      console.log(age)
    }
  }
}
</script>
