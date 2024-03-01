<template>
  <v-card
    class="mx-auto"
    outlined
    color="#F2F3D9"
  >
    <v-card-title class="mb-0 pb-0 pt-2">
      Sache des Tages
    </v-card-title>
    <item-card
      v-if="itemOfTheDay"
      :item="itemOfTheDay"
      :elevation="0"
      custom-class="mt-0"
      color="#F2F3D9"
      :action-toggle-interest="true"
      @reload-data="getData"
    />
  </v-card>
</template>

<script>

export default {
  name: 'ItemOfTheDayCard',
  data () {
    return {
      itemOfTheDay: undefined
    }
  },
  mounted () {
    this.getData()
  },
  methods: {
    async getData () {
      const getItemOfTheDayResponse = await this.getItemOfTheDayRequest()
      if (getItemOfTheDayResponse) {
        this.itemOfTheDay = getItemOfTheDayResponse
      }
    },
    getItemOfTheDayRequest () {
      const url = '/api/v2/item/today'
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
