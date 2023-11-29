<template>
  <v-container class="ma-0 pa-0">
    <info-snackbar
      :active="snackbar"
      @click-action="snackbar = !snackbar"
    >
      {{ feedbackMessage }}
    </info-snackbar>

    <v-dialog
      v-model="dialog.upload"
      persistent
      width="290"
    >
      <v-card>
        <v-card-title class="headline">
          Speichern
        </v-card-title>
        <v-card-subtitle>
          Einen Moment bitte...
        </v-card-subtitle>

        <v-card-text align="center">
          Die Daten werden auf dem Server gespeichert.
        </v-card-text>
        <v-card-text align="center">
          <v-progress-circular
            :size="50"
            color="primaryNeutral"
            indeterminate
          />
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="dialog.next"
      persistent
      width="290"
    >
      <v-card>
        <v-card-title class="headline">
          Gespeichert als:
        </v-card-title>

        <v-list-item three-line class="pl-6">
          <v-list-item-content>
            <v-list-item-subtitle>Lagerort: <b>{{ $t(item?.location?.room?.name) }}</b></v-list-item-subtitle>
            <v-list-item-subtitle>Kiste/Regal: <b>{{ input?.location }}</b></v-list-item-subtitle>
            <v-list-item-subtitle>Nummer: <b>{{ item?.mark }}</b></v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <v-divider />

        <v-card-actions>
          <v-btn
            color="primary"
            text
            @click="toHome"
          >
            Home
          </v-btn>
          <v-spacer />
          <v-btn
            color="primary"
            text
            @click="newQuestion"
          >
            nächste sache
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-form v-model="isFormValid">
      <v-select
        v-model="input.originalRoom"
        :rules="[rules.required]"
        :items="rooms"
        item-value="id"
        outlined
        dense
        label="Raum"
      >
        <template #item="data">
          {{ $t(data.item?.name) }}
        </template>
        <template #selection="data">
          {{ $t(data.item?.name) }}
        </template>
      </v-select>

      <v-select
        v-model="input.type"
        :items="types"
        :rules="[rules.required]"
        item-value="id"
        item-text="label"
        outlined
        dense
        label="Typ"
      >
        <template #item="data">
          {{ $t(data.item?.label) }}
        </template>
      </v-select>

      <input-tags
        v-model="input.tags"
        :tags-input="input.tags"
      />

      <v-text-field
        v-model.number="input.location"
        :rules="[rules.required]"
        type="number"
        outlined
        dense
        label="Kiste/Regal"
      />

      <span>Bild:</span>
      <label v-if="input.image === null">
        <div>
          <p>
            <v-icon
              x-large
              color="primary"
              class="mb-1"
            >
              {{ mdiPlusBox }}
            </v-icon>
            Foto hinzufügen</p>
        </div>

        <input
          ref="fileInput"
          class="file-input"
          hidden
          type="file"
          accept="image/*"
          capture="environment"
          @change="onSelectFile"
        >
      </label>

      <v-img
        v-if="thumbnail !== undefined"
        :src="thumbnail"
        width="50%"
        aspect-ratio="1"
      />
    </v-form>
  </v-container>
</template>

<script>
import { mdiPlusBox } from '@mdi/js'
import InputTags from '~/components/input/input-tags'
import InfoSnackbar from '~/components/feedback/info-snackbar'

export default {
  name: 'AddItem',
  components: { InfoSnackbar, InputTags },
  layout: 'form',

  data () {
    return {
      mdiPlusBox,
      item: null,
      snackbar: false,
      feedbackMessage: null,
      isFormValid: false,
      rooms: [],
      types: [
        { id: 1, name: 'TYPE_DECORATION', label: this.$t('TYPE_DECORATION') },
        { id: 2, name: 'TYPE_FURNITURE', label: this.$t('TYPE_FURNITURE') },
        { id: 3, name: 'TYPE_UTILITY_ITEM', label: this.$t('TYPE_UTILITY_ITEM') },
        { id: 4, name: 'ROOM_TECHNICAL_DEVICE', label: this.$t('ROOM_TECHNICAL_DEVICE') },
        { id: 5, name: 'ROOM_FURNISHING', label: this.$t('ROOM_FURNISHING') }
      ],
      input: {
        originalRoom: null,
        type: null,
        tags: [],
        location: undefined,
        image: null
      },
      file: undefined,
      thumbnail: undefined,
      rules: {
        required: (value) => { return !!value || 'Bitte eingeben.' }
      },
      dialog: {
        upload: false,
        nuxt: false
      }
    }
  },

  watch: {
    input: {
      handler () {
        if (
          this.input.originalRoom !== null &&
          this.input.type !== null &&
          this.input.location !== null &&
          this.input.tags.length > 0 &&
          this.input.image !== null
        ) {
          this.$nuxt.$emit('form-input-complete', true)
        } else {
          this.$nuxt.$emit('form-input-complete', false)
        }
      },
      deep: true
    }
  },
  beforeMount () {
    if (!this.$auth.loggedIn) {
      this.$nuxt.$router.replace('/login?target=add')
    }
    this.getData()
  },

  created () {
    this.$nuxt.$on('check-form', () => {
      this.addItem()
    })
  },
  beforeDestroy () {
    this.$nuxt.$off('check-form')
  },

  methods: {
    async getData () {
      const getRoomsResponse = await this.getRoomsRequest()
      if (getRoomsResponse) {
        this.rooms = getRoomsResponse
      }
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
    toHome () {
      this.dialog.next = false
      this.$nuxt.$router.replace('/')
    },
    newQuestion () {
      this.input = {
        originalRoom: null,
        type: null,
        tags: [],
        location: undefined,
        image: null
      }
      this.file = undefined
      this.thumbnail = undefined
      this.itemId = null
      this.mark = null
      this.dialog.next = false
    },
    createFormData () {
      if (this.file !== undefined) {
        const formdata = new FormData()
        formdata.append('file', this.file)
        return formdata
      } else {
        return false
      }
    },
    snackbarMessage (feedbackMessage) {
      this.snackbar = true
      this.feedbackMessage = feedbackMessage
    },
    async addItem () {
      this.dialog.upload = true
      const addItemResposnse = await this.addItemRequest()
      if (this.input.name !== null) {
        if (addItemResposnse) {
          this.item = addItemResposnse
          const uploadImageResposnse = await this.uploadImageRequest()
          console.log(uploadImageResposnse)
          if (uploadImageResposnse) {
            this.dialog.upload = false
            this.dialog.next = true
          }
        }
      }
      this.dialog.upload = false
    },
    addItemRequest () {
      const url = '/api/v2/item'
      const config = { headers: { Authorization: this.$auth.getToken('local') } }
      const _this = this
      return new Promise(function (resolve) {
        _this.$axios.post(url, _this.input, config)
          .then((response) => {
            if (response.status === 201) {
              resolve(response.data)
            } else {
              resolve(false)
            }
          })
          .catch((err) => {
            if (err.message === 'Network Error') {
              _this.snackbarMessage('Server nicht erreichbar')
            } else {
              _this.snackbarMessage('Unerwarteter Fehler')
            }
            resolve(false)
          })
      })
    },
    uploadImageRequest () {
      const url = '/api/v2/upload/' + this.item.id
      const formdata = this.createFormData()
      const config = { headers: { Authorization: this.$auth.getToken('local') } }
      const _this = this
      return new Promise(function (resolve, reject) {
        _this.$axios.post(url, formdata, config)
          .then((response) => {
            if (response.status === 200) {
              resolve(response)
            } else {
              resolve(false)
            }
          })
          .catch((err) => {
            if (err.message === 'Network Error') {
              _this.snackbarMessage('Server nicht erreichbar')
            } else {
              _this.snackbarMessage('Unerwarteter Fehler')
            }
            resolve(false)
          })
      })
    },
    onSelectFile (e) {
      let file = null
      if (e.target.files.length > 0) {
        file = e.target.files[0]
        const name = file.name
        this.input.image = name
        console.log(file)
        const reader = new FileReader()
        reader.onload = (e) => {
          this.thumbnail = e.target.result
          this.resizeImage(e.target.result, name)
        }
        reader.readAsDataURL(file)
      }
    },
    onClearFile () {
      // ToDo: Add button to make thumbnail clearable
      this.file = undefined
      this.thumbnail = undefined
    },
    resizeImage (file, name) {
      const _this = this
      const img = new Image()
      img.src = file
      img.onload = function () {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')

        const ratio = 0.5
        const width = img.width * ratio
        const height = img.height * ratio

        canvas.width = width
        canvas.height = height
        ctx.drawImage(img, 0, 0, width, height)

        const dataUrl = canvas.toDataURL('image/jpeg')

        const fileBlob = dataURItoBlob(dataUrl, name)
        _this.file = fileBlob
        _this.input.image = fileBlob.name

        function dataURItoBlob (dataURI, name) {
          const byteString = atob(dataURI.split(',')[1])
          const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

          const ab = new ArrayBuffer(byteString.length)
          const ia = new Uint8Array(ab)
          for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i)
          }

          const blob = new Blob([ab], { type: mimeString })
          return new File([blob], name, { type: mimeString })
        }
      }
    }
  }
}
</script>
