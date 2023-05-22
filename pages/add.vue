<template>
  <v-layout
    column
    justify-center
    align-center
  >
    <v-container
      fluid
    >
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
            Fertig
          </v-card-title>

          <v-list-item three-line>
            <v-list-item-content>
              <v-list-item-subtitle>Lagerort: <b>{{ input.room }}</b></v-list-item-subtitle>
              <v-list-item-subtitle>Kiste/Regal: <b>{{ input.location }}</b></v-list-item-subtitle>
              <v-list-item-subtitle>Nummer: <b>{{ thingId }}</b></v-list-item-subtitle>
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

      <v-form v-model="valid">
        <v-select
          v-model="input.room"
          :rules="[rules.required]"
          :items="rooms"
          outlined
          dense
          label="Raum"
        />

        <v-select
          v-model="input.type"
          :rules="[rules.required]"
          :items="types"
          outlined
          dense
          label="Typ"
        />

        <v-combobox
          v-model="input.tags"
          :rules="[rules.required]"
          :items="suggestions"
          :delimiters="delimiters"
          outlined
          dense
          label="Tags"
          placeholder=""
          multiple
          small-chips
          deletable-chips
          autofocus
        />
        <v-row>
          <v-col
            cols="7"
          >
            <v-select
              v-model="input.location"
              :rules="[rules.required]"
              :items="locations"
              outlined
              dense
              label="Lagerort"
            />
          </v-col>
          <v-col
            cols="5"
          >
            <v-text-field
              v-model="input.box_id"
              :rules="[rules.required, rules.location]"
              type="number"
              outlined
              dense
              label="Nummer"
            />
          </v-col>
        </v-row>

        <label>
          <div>
            <p>
              <v-icon
                x-large
                color="primary"
              >
                mdi-plus-box
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

      <v-snackbar
        v-model="snackbar"
      >
        {{ message }}

        <template v-slot:action="{ attrs }">
          <v-btn
            color="complementary"
            text
            v-bind="attrs"
            @click="snackbar = false"
          >
            OK
          </v-btn>
        </template>
      </v-snackbar>
    </v-container>
  </v-layout>
</template>

<script>

export default {
  name: 'AddThing',
  layout: 'form',

  data () {
    return {
      message: '',
      snackbar: false,
      valid: false,
      rooms: ['Esszimmer', 'Wohnzimmer', 'Kueche', 'Hof', 'Arbeitszimmer', 'Schlafzimmer', 'Gruenes Zimmer', 'Lottozimmer', 'Liborizimmer I', 'Liborizimmer II', 'Bad', 'Toilette rosa', 'Toilette beige', 'Topfkammer', 'Diele EG', 'Diele 1. OG', 'Diele 2. OG', 'Zentralkeller', 'Waschkeller', 'Lagerkeller', 'Werkstatt', 'Suedbalkon', 'Nordbalkon'],
      types: ['Dekoration', 'Technisches Geraet', 'Gebrauchsgegenstand', 'Moebelstueck', 'Einrichtungsgegenstand'],
      locations: ['Keller', 'Hof', 'Gruenes Zimmer', 'Nach Bild'],
      suggestions: [],
      delimiters: [',', ' '],
      thingId: null,
      input: {
        room: '',
        type: '',
        tags: [],
        location: '',
        box_id: null,
        picture: ''
      },
      file: undefined,
      thumbnail: undefined,
      rules: {
        required: (value) => { return !!value || 'Bitte eingeben.' },
        location: (value) => {
          const pattern = /^[0-9]*$/
          return pattern.test(value) || 'Zahl eingeben.'
        }
      },
      dialog: {
        upload: false,
        nuxt: false
      }
    }
  },

  beforeMount () {
    this.checkLogin()
    if (!this.$auth.loggedIn) {
      window.$nuxt.$router.replace('/login')
    }
  },

  created () {
    this.$nuxt.$on('check-form', () => {
      this.addThing()
    })
    this.$nuxt.$on('update-files', (file) => {
      console.log(file)
      if (file.size > 5000000) { // 5242880
        console.log('bild zu groß')
        // this.$nuxt.$emit('input-media-too-large')
        return
      }
      this.file = file
      this.input.picture = file.name
      // this.$nuxt.$emit('input-media-image', this.input)
    })
  },
  beforeDestroy () {
    this.$nuxt.$off('check-form')
    this.$nuxt.$off('update-files')
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
    },
    toHome () {
      this.dialog.next = false
      window.$nuxt.$router.replace('/')
    },
    newQuestion () {
      this.checkLogin()
      this.input = {
        room: '',
        type: '',
        tags: [],
        location: '',
        box_id: null,
        picture: ''
      }
      this.file = undefined
      this.thumbnail = undefined
      this.thingId = null
      this.dialog.next = false
      // this.$nuxt.refresh()
      // window.$nuxt.$router.replace('/add')
    },
    onSelectFile (e) {
      let file = null
      if (e.target.files.length > 0) {
        file = e.target.files[0]
        const name = file.name
        console.log(file)
        const reader = new FileReader()
        reader.onload = (e) => {
          this.thumbnail = e.target.result
          file = this.resizeImage(e.target.result, name)
        }
        reader.readAsDataURL(file)
      }
    },
    resizeImage (file, name) {
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
        window.$nuxt.$emit('update-files', dataURItoBlob(dataUrl, name))

        function dataURItoBlob (dataURI, name) {
          const byteString = atob(dataURI.split(',')[1])
          const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

          const ab = new ArrayBuffer(byteString.length)
          const ia = new Uint8Array(ab)
          for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i)
          }

          const blob = new Blob([ab], { type: mimeString })
          const file = new File([blob], name, { type: mimeString })
          return file
        }
      }
    },
    onClearFile () {
      this.file = undefined
      this.thumbnail = undefined
    },
    createPaylod () {
      let tags = ''
      for (const tag of this.input.tags) {
        tags += tag + ','
      }
      tags = tags.slice(0, -1)

      return {
        tags,
        type: this.input.type,
        room: this.input.room,
        location: this.input.location,
        box_id: this.input.box_id,
        picture: this.input.picture
      }
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
    checkInput (input) {
      if (input.room === '') {
        this.showSnackbar('Bitte Raum auswählen.')
        return false
      }
      if (input.typ === '') {
        this.showSnackbar('Bitte Typ auswählen.')
        return false
      }
      if (input.tags.length < 1) {
        this.showSnackbar('Bitte füge Tags hinzu.')
        return false
      }
      if (input.location === '') {
        this.showSnackbar('Bitte Lagerort auswählen.')
        return false
      }
      if (input.box_id === null) {
        this.showSnackbar('Bitte Kiste/Regal angeben.')
        return false
      }
      return true
    },
    showSnackbar (message) {
      this.message = message
      this.snackbar = true
    },
    async addThing () {
      try {
        if (this.checkInput(this.input)) {
          this.dialog.upload = true
          let response = await this.postThing()
          if (response.data.message === 'success') {
            this.thingId = response.data.thing_id
            response = await this.uploadPicture()
            console.log(response)
            if (response.data.message === 'success') {
              this.dialog.upload = false
              this.dialog.next = true
              // window.$nuxt.$router.replace('/')
            }
          }
        }
      } catch (err) {
        if (err.message === 'Request Error') {
          this.showSnackbar('Request Error')
        } else if (err.message === 'Network Error') {
          this.showSnackbar('Network Error')
        } else if (err.message === 'Unknown Error') {
          this.showSnackbar('Unknown Error')
        } else {
          this.showSnackbar('Unexpected Error')
        }
      }
    },
    postThing () {
      const url = '/thing/create/'
      const payload = this.createPaylod()
      const config = { headers: { Authorization: this.$auth.getToken('local') } }
      return new Promise(function (resolve, reject) {
        window.$nuxt.$http.plain.post(url, payload, config)
          .then((response) => {
            if (response.status === 200) {
              resolve(response)
            } else {
              resolve(false)
            }
          })
          .catch((err) => {
            const reports = window.localStorage.getItem('error-reports')
            window.localStorage.setItem('error-reports', JSON.stringify(err) + ';' + reports)
            console.log(JSON.stringify(err))
            if (err.message === 'Network Error') {
              return reject(Error('Network Error'))
            } else {
              return reject(Error('Unknown Error'))
            }
          })
      })
    },
    uploadPicture () {
      const url = '/file/upload/'
      const formdata = this.createFormData()
      const config = { headers: { Authorization: this.$auth.getToken('local') } }
      return new Promise(function (resolve, reject) {
        window.$nuxt.$http.files.post(url, formdata, config)
          .then((response) => {
            if (response.status === 200) {
              resolve(response)
            } else {
              resolve(false)
            }
          })
          .catch((err) => {
            const reports = window.localStorage.getItem('error-reports')
            window.localStorage.setItem('error-reports', JSON.stringify(err) + ';' + reports)
            console.log(JSON.stringify(err))
            if (err.message === 'Network Error') {
              return reject(Error('Network Error'))
            } else {
              return reject(Error('Unknown Error'))
            }
          })
      })
    }
  }
}
</script>
