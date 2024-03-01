<template>
  <v-container
    v-if="!showItem"
    fluid
    class="text-center"
  >
    <v-row no-gutters>
      <v-col>
        <v-card elevation="0">
          <v-card-actions>
            <div class="ma-auto position-relative">
              <v-otp-input
                v-model="code"
                class="ml-3 mr-3"
                length="6"
                type="number"
                :disabled="codeInputDisabled"
                @finish="onFinishCodeInput"
              />
              <v-overlay absolute :value="codeInputCheckInProgress">
                <v-progress-circular
                  indeterminate
                  color="primary"
                />
              </v-overlay>
            </div>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-row no-gutters>
      <v-col>
        <v-progress-circular
          class="mt-8"
          :size="230"
          :width="30"
          :color="color_1"
          rotate="180"
          :indeterminate="run"
        >
          <v-progress-circular
            :size="180"
            :width="30"
            :color="color_2"
            :indeterminate="run"
          >
            <v-progress-circular
              :size="130"
              :width="30"
              :color="color_3"
              rotate="90"
              :indeterminate="run"
            >
              <v-progress-circular
                :size="80"
                :width="30"
                :color="color_4"
                rotate="270"
                :indeterminate="run"
              >
                <v-btn
                  v-if="startAnimationButtonVisible"
                  fab
                  x-large
                  color="warning"
                  @click="startAnimation()"
                >
                  Los
                </v-btn>
              </v-progress-circular>
            </v-progress-circular>
          </v-progress-circular>
        </v-progress-circular>
      </v-col>
    </v-row>
  </v-container>
  <v-container v-else>
    <v-row no-gutters>
      <v-col>
        <item-card
          :item="item"
          :elevation="0"
          custom-class="mt-0"
          color="#F2F3D9"
          :show-details="true"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {

  data () {
    return {
      color_1: 'info',
      color_2: 'warning',
      color_3: 'primary',
      color_4: 'secondary',
      run: false,
      colors: ['info', 'warning', 'primary', 'secondary', 'error'],
      code: undefined,
      codeInputDisabled: false,
      codeInputCheckInProgress: false,
      startAnimationButtonVisible: false,
      item: undefined,
      showItem: false
    }
  },

  methods: {
    async onFinishCodeInput () {
      this.codeInputDisabled = true
      this.codeInputCheckInProgress = true

      const checkCasinoCodeResponse = await this.checkCasinoCodeRequest()
      if (checkCasinoCodeResponse) {
        if (checkCasinoCodeResponse.message === 'true') {
          this.startAnimationButtonVisible = true
        }
      } else {
        this.codeInputDisabled = false
      }
      this.codeInputCheckInProgress = false
    },
    async getCasinoItem () {
      const getCasinoItemResponse = await this.getCasinoItemRequest()
      if (getCasinoItemResponse) {
        this.item = getCasinoItemResponse
        setTimeout(() => (this.run = false), 5000)
        setTimeout(() => (this.showItem = true), 5000)
      }
    },
    startAnimation () {
      this.startAnimationButtonVisible = false
      this.run = true
      this.changeAnimationColors(0)
      this.getCasinoItem()
      // setTimeout(() => (this.run = false), 5000)
    },
    changeAnimationColors (i) {
      this.color_1 = this.colors[this.normalizeIndex(i)]
      this.color_2 = this.colors[this.normalizeIndex(i + 1)]
      this.color_3 = this.colors[this.normalizeIndex(i + 2)]
      this.color_4 = this.colors[this.normalizeIndex(i + 3)]
      if (i < 3) {
        i++
      } else {
        i = 0
      }
      if (this.run) {
        setTimeout(() => (this.changeAnimationColors(i)), 500)
      }
    },
    normalizeIndex (i) {
      return i < 4 ? i : (i - 4)
    },
    checkCasinoCodeRequest () {
      const url = '/api/v2/code/check'
      const config = { headers: { Authorization: this.$auth.getToken('local') } }
      const payload = { code: this.code }
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
          .catch(() => {
            resolve(false)
          })
      })
    },
    getCasinoItemRequest () {
      const url = '/api/v2/item/casino'
      const config = { headers: { Authorization: this.$auth.getToken('local') } }
      const payload = { code: this.code }
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
          .catch(() => {
            resolve(false)
          })
      })
    }
  }
}
</script>
