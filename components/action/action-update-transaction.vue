<template>
  <div style="float: left;">
    <input-dialog
      :active="dialog"
      toolbar-title="Status anpassen"
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
        title="Status ändern"
        subtitle="Hier kann der Status der Sache angepasst werden. Dazu können auch Preise oder erzielte Erlöse eingetragen werden."
      />
      <v-form>
        <v-row>
          <v-col>
            <v-select
              v-model="input.status"
              :items="transactionStates"
              item-value="id"
              clearable
              outlined
              dense
              label="Status"
              return-object
              @change="onChangeTransactionStatus"
            >
              <template #item="data">
                <span style="font-size: 0.8125rem; font-weight: 500; line-height: 1rem;">{{ $t(data.item.name) }}</span>
              </template>
              <template #selection="data">
                {{ $t(data.item.name) }}
              </template>
            </v-select>
            <v-select
              v-if="showUserSelection"
              v-model="input.user"
              :items="users"
              item-value="id"
              item-text="username"
              clearable
              outlined
              dense
              return-object
              label="Mitgenommen von"
            />
            <v-select
              v-if="showInterestSelection"
              v-model="input.users"
              :items="users"
              item-value="id"
              item-text="username"
              clearable
              multiple
              outlined
              dense
              return-object
              label="Interessenten"
            />
            <v-text-field
              v-if="showPriceRangeForSale"
              v-model="input.priceMin"
              outlined
              dense
              :rules="[rules.price]"
              label="Preis (min)"
            />
            <v-text-field
              v-if="showPriceRangeForSale"
              v-model="input.priceMax"
              outlined
              dense
              :disabled="!input.priceMin"
              :rules="[rules.price]"
              label="Preis (max)"
            />
            <v-text-field
              v-if="showPriceSold"
              v-model="input.priceSold"
              outlined
              dense
              :rules="[rules.price]"
              label="Preis (erzielt)"
            />
          </v-col>
        </v-row>
        <v-row class="text-center">
          <v-col>
            <v-btn
              :disabled="loading"
              color="secondary"
              @click="onSaveSettings()"
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
      <v-icon color="error">
        {{ mdiTagEdit }}
      </v-icon>
    </v-btn>
  </div>
</template>

<script>
import { mdiTagEdit } from '@mdi/js'
import InfoSnackbar from '~/components/feedback/info-snackbar'
export default {
  name: 'ActionUpdateTransaction',
  components: { InfoSnackbar },
  props: {
    item: {
      type: Object,
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
      mdiTagEdit,
      dialog: false,
      transactionStates: [],
      input: {
        status: null,
        user: null,
        users: [],
        priceMin: undefined,
        priceMax: undefined,
        priceSold: undefined
      },
      loading: false,
      snackbar: false,
      feedbackMessage: null,
      users: [],
      rules: {
        price: (value) => {
          const pattern = /^(\d{1,3})?(.?\d{2})*(.\d{2})?$/
          return pattern.test(value) || 'Kein gültiger Preis'
        }
      },
      showUserSelection: false,
      showInterestSelection: false,
      showPriceRangeForSale: false,
      showPriceSold: false
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
    async onSaveSettings () {
      const updateTransactionResponse = await this.updateTransactionRequest()
      if (!updateTransactionResponse) {
        this.handleError('Status konnte nicht aktualisiert werden')
      }
      this.$emit('update-transaction')
      this.dialog = false
    },
    createRequestDataFromInput () {
      const interestedUsers = []
      for (const user of this.input.users) {
        interestedUsers.push(user.id)
      }
      return {
        transactionStatusId: this.input.status.id,
        priceMin: this.input.priceMin ? (this.input.priceMin * 100).toFixed() : null,
        priceMax: this.input.priceMax ? (this.input.priceMax * 100).toFixed() : null,
        priceSold: this.input.priceSold ? (this.input.priceSold * 100).toFixed() : null,
        userId: this.input.user ? this.input.user.id : null,
        interestedUsers
      }
    },
    onChangeTransactionStatus () {
      this.showUserSelection = this.input.status?.name === 'TRANSACTION_STATUS_TAKEN'
      if (this.showUserSelection) {
        this.input.user = this.item?.transaction?.user
      }
      this.showInterestSelection = this.input.status?.name === 'TRANSACTION_STATUS_RESERVED'
      if (this.showInterestSelection) {
        this.input.users = []
        for (const interest of this.item?.interests) {
          this.input.users.push(interest.user)
        }
      }
      this.showPriceRangeForSale = this.input.status?.name === 'TRANSACTION_STATUS_AVAILABLE'
      if (this.showPriceRangeForSale) {
        console.log(this.item?.transaction?.priceMin)
        this.input.priceMin = (this.item?.transaction?.priceMin / 100).toFixed(2)
        console.log(this.input.priceMin)
        this.input.priceMax = (this.item?.transaction?.priceMax / 100).toFixed(2)
      }
      this.showPriceSold = this.input.status?.name === 'TRANSACTION_STATUS_SOLD'
      if (this.showPriceSold) {
        this.input.priceSold = (this.item?.transaction?.priceSold / 100).toFixed(2)
      }
    },
    handleError (feedbackMessage) {
      this.snackbar = true
      this.feedbackMessage = feedbackMessage
    },
    async getData () {
      this.input.status = this.item.transaction.transactionStatus
      this.onChangeTransactionStatus()
      const getTransactionStatesResponse = await this.getTransactionStatesRequest()
      if (getTransactionStatesResponse) {
        this.transactionStates = getTransactionStatesResponse
      }
      const getUsersResponse = await this.getUsersRequest()
      if (getUsersResponse) {
        this.users = getUsersResponse
      }
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
    updateTransactionRequest () {
      const url = '/api/v2/item/' + this.item.id + '/transaction/'
      const config = { headers: { Authorization: this.$auth.getToken('local') } }
      const data = this.createRequestDataFromInput()
      const _this = this
      return new Promise(function (resolve) {
        _this.$axios.patch(url, data, config)
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
