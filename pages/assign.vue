<template>
  <v-layout
    column
    justify-center
    align-center
  >
    <v-container
      fluid
    >
      <v-row no-gutters>
        <v-col cols="3">
          <v-row>
            <v-col no-gutters>
              <v-list two-line>
                <v-header>
                  Lara & Fabian
                </v-header>
                <draggable v-model="thingsA" :options="{group:'people'}" style="min-height: 10px">
                  <div
                    v-for="(thing, i) in thingsA"
                    :key="i"
                  >
                    <thing-card-mini
                      :thing-id="thing.thing_id"
                      :tags="thing.tags"
                      :location="thing.location"
                      :box-id="thing.box_id"
                      :room="thing.room"
                      :type="thing.type"
                      :picture="thing.picture"
                      :user="thing.user"
                    />
                  </div>
                </draggable>
              </v-list>
            </v-col>
          </v-row>
          <v-row justyfy-center>
            <v-col no-gutters>
              <v-list two-line>
                <v-header>
                  Esther
                </v-header>
                <draggable v-model="thingsB" :options="{group:'people'}" style="min-height: 10px">
                  <div
                    v-for="(thing, i) in thingsB"
                    :key="i"
                  >
                    <thing-card-mini
                      :thing-id="thing.thing_id"
                      :tags="thing.tags"
                      :location="thing.location"
                      :box-id="thing.box_id"
                      :room="thing.room"
                      :type="thing.type"
                      :picture="thing.picture"
                      :user="thing.user"
                    />
                  </div>
                </draggable>
              </v-list>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="6">
          <v-list two-line>
            <v-header>
              Sachen
            </v-header>
            <draggable v-model="thingsCenter" :options="{group:'people'}" style="min-height: 10px">
              <div
                v-for="(thing, i) in thingsCenter"
                :key="i"
              >
                <thing-card-compact
                  v-if="thing.user === 'Fabian,'"
                  :thing-id="thing.thing_id"
                  :tags="thing.tags"
                  :location="thing.location"
                  :box-id="thing.box_id"
                  :room="thing.room"
                  :type="thing.type"
                  :picture="thing.picture"
                  :user="thing.user"
                />
              </div>
            </draggable>
          </v-list>
        </v-col>
        <v-col cols="3">
          <v-row>
            <v-col no-gutters>
              <v-list two-line>
                <v-header>
                  Thomas
                </v-header>
                <draggable v-model="thingsC" :options="{group:'people'}" style="min-height: 10px">
                  <div
                    v-for="(thing, i) in thingsC"
                    :key="i"
                  >
                    <thing-card-mini
                      :thing-id="thing.thing_id"
                      :tags="thing.tags"
                      :location="thing.location"
                      :box-id="thing.box_id"
                      :room="thing.room"
                      :type="thing.type"
                      :picture="thing.picture"
                      :user="thing.user"
                    />
                  </div>
                </draggable>
              </v-list>
            </v-col>
          </v-row>
          <v-row>
            <v-col no-gutters>
              <v-list two-line>
                <v-header>
                  ---
                </v-header>
                <draggable v-model="thingsD" :options="{group:'people'}" style="min-height: 10px">
                  <div
                    v-for="(thing, i) in thingsD"
                    :key="i"
                  >
                    <thing-card-mini
                      :thing-id="thing.thing_id"
                      :tags="thing.tags"
                      :location="thing.location"
                      :box-id="thing.box_id"
                      :room="thing.room"
                      :type="thing.type"
                      :picture="thing.picture"
                      :user="thing.user"
                    />
                  </div>
                </draggable>
              </v-list>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-btn
        @click="generateSQL"
      >
        Generate
      </v-btn>
      <br></br>
      <span>
        {{ queries }}
      </span>
    </v-container>
  </v-layout>
</template>

<script>
import draggable from 'vuedraggable'

export default {
  name: 'Assign',
  layout: 'default',
  components: {
    draggable
  },

  data () {
    return {
      show: null,
      isActive: false,
      user: undefined,
      thingsCenter: [],
      thingsA: [],
      thingsB: [],
      thingsC: [],
      thingsD: [],
      queries: ''
    }
  },
  watch: {
    thingsA () {
      console.log(this.thingsA)
    }
  },
  beforeMount () {
    this.checkLogin()
    if (!this.$auth.loggedIn) {
      this.$nuxt.$router.replace('/login?target=assign')
    }
    // this.user = this.$auth.user
    // console.log(this.$auth)
    this.getData()
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
    generateSQL () {
      this.queries = ''
      for (let i = 0; i < this.thingsA.length; i++) {
        this.queries = this.queries + 'UPDATE \'catalog_things\' SET `Thomas`=0,`Lara`=0,`Esther`=0,`Fabian`=1 WHERE `thing_id` = ' + this.thingsA[i].thing_id + ';'
      }
      for (let i = 0; i < this.thingsB.length; i++) {
        this.queries = this.queries + 'UPDATE \'catalog_things\' SET `Thomas`=0,`Lara`=0,`Esther`=1,`Fabian`=0 WHERE `thing_id` = ' + this.thingsB[i].thing_id + ';'
      }
      for (let i = 0; i < this.thingsC.length; i++) {
        this.queries = this.queries + 'UPDATE \'catalog_things\' SET `Thomas`=1,`Lara`=0,`Esther`=0,`Fabian`=0 WHERE `thing_id` = ' + this.thingsC[i].thing_id + ';'
      }
      for (let i = 0; i < this.thingsD.length; i++) {
        this.queries = this.queries + 'UPDATE \'catalog_things\' SET `Thomas`=0,`Lara`=0,`Esther`=0,`Fabian`=0 WHERE `thing_id` = ' + this.thingsD[i].thing_id + ';'
      }
      console.log(this.queries)
    },
    async getData () {
      if (this.$auth.loggedIn) {
        this.things = await this.getRequest()
        this.thingsCenter = this.things
        console.log(this.things)
      }
    },
    getRequest () {
      const url = '/thing/my/' + 'Thomas'
      const config = { headers: { Authorization: this.$auth.getToken('local') } }
      return new Promise(function (resolve, reject) {
        window.$nuxt.$http.plain.get(url, config)
          .then((response) => {
            if (response.status === 200) {
              resolve(response.data.data)
            } else {
              reject(Error('An error occured.'))
            }
          })
          .catch((err) => {
            console.log(JSON.stringify(err))
            const reports = window.localStorage.getItem('error-reports')
            window.localStorage.setItem('error-reports', JSON.stringify(err) + ';' + reports)
            if (err.message === 'Network Error') {
              console.log('Server nicht erreichbar.')
            } else {
              console.log('Abfrage fehlgeschlagen.')
            }
          })
      })
    }
  }
}
</script>
