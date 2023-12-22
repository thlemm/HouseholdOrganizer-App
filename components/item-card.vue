<template>
  <v-card
    v-ripple="false"
    :class="customClass"
    :elevation="elevation"
    :color="color"
  >
    <v-list-item two-line @click="show = !show">
      <v-list-item-avatar
        tile
        size="80"
        color="grey"
      >
        <v-img :src="imgBaseUrl + item.image" />
      </v-list-item-avatar>
      <v-list-item-content class="mx-0">
        <v-list-item-title class="title">
          <v-chip
            v-for="tag in item.tags"
            :key="tag.id"
            class="mr-1"
            small
            label
          >
            {{ tag.tag }}
          </v-chip>
        </v-list-item-title>
        <v-list-item-subtitle>
          <v-icon left small>
            {{ mdiFloorPlan }}
          </v-icon>
          {{ $t(item.originalRoom.name) }}
        </v-list-item-subtitle>
        <v-list-item-subtitle>
          <v-icon left small>
            {{ mdiViewList }}
          </v-icon>
          {{ $t(item.type.name) }}
        </v-list-item-subtitle>
        <v-list-item-subtitle>
          <v-icon left small>
            {{ item.interests.length > 0 ? (filterInterests && filteredInterests.length === 0 ? mdiAccountCheck : mdiAccountAlert) : '' }}
          </v-icon>
          <v-chip
            v-for="interest in filterInterests ? filteredInterests : item.interests"
            :key="interest.id"
            class="mr-1"
            color="warning"
            x-small
          >
            {{ interest.user.username }}
          </v-chip>
          <v-chip
            v-if="filterInterests && filteredInterests.length === 0"
            class="mr-1"
            color="secondary"
            x-small
          >
            Keine Interessenten
          </v-chip>
        </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>

    <v-expand-transition>
      <div v-show="show">
        <v-list-item>
          <v-list-item-content class="mx-0">
            <v-list-item-subtitle class="font-weight-black">
              Lagerort
            </v-list-item-subtitle>
            <v-list-item-subtitle class="body-1">
              <v-icon left small class="mr-0">
                {{ mdiMapMarker }}
              </v-icon>
              Raum: {{ item.location.room ? $t(item.location.room.name) : '---' }}
            </v-list-item-subtitle>
            <v-list-item-subtitle class="body-1">
              <v-icon left small class="mr-0">
                {{ mdiArchive }}
              </v-icon>
              Kiste/Regal: {{ item.location.mark }}
            </v-list-item-subtitle>
            <v-list-item-subtitle class="body-1">
              <v-icon left small class="mr-0">
                {{ mdiTagText }}
              </v-icon>
              Teilenummer: {{ item.mark }}
            </v-list-item-subtitle>
            <v-list-item-subtitle class="mt-2 font-weight-black">
              Schlagworte:
            </v-list-item-subtitle>
            <v-list-item-subtitle class="body-2">
              <v-chip
                v-for="tag in item.tags"
                :key="tag.id"
                class="mr-1"
                small
                label
              >
                {{ tag.tag }}
              </v-chip>
            </v-list-item-subtitle>
            <v-list-item-subtitle
              class="mt-2 font-weight-black"
            >
              Aktionen:
            </v-list-item-subtitle>
            <v-list-item-subtitle
              class="body-2 pb-1"
            >
              <action-update-location
                :item-id="item.id"
                @update-location="$emit('reload-data')"
              />
              <action-toggle-interest
                v-if="actionToggleInterest"
                :interest-id="ownInterest?.id"
                :is-interested="ownInterest?.interested"
                :item-id="item.id"
                @update-interest="$emit('reload-data')"
              />
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-card-text class="pt-0">
          <v-img
            :src="imgBaseUrl + item.image"
            width="100%"
            style="max-width: 500px; "
            aspect-ratio="1"
          />
        </v-card-text>
      </div>
    </v-expand-transition>
  </v-card>
</template>

<script>
import { mdiMapMarker, mdiViewList, mdiAccountAlert, mdiAccountCheck, mdiArchive, mdiTagText, mdiFloorPlan, mdiHeart } from '@mdi/js'
import ActionToggleInterest from '~/components/action/action-toggle-interest'
import ActionUpdateLocation from '~/components/action/action-update-location'

export default {
  name: 'ItemCard',
  components: { ActionUpdateLocation, ActionToggleInterest },
  props: {
    item: {
      type: Object,
      required: true
    },
    filterInterests: {
      type: Boolean,
      required: false,
      default: true
    },
    actionToggleInterest: {
      type: Boolean,
      required: false,
      default: false
    },
    elevation: {
      type: Number,
      required: false,
      default: 2
    },
    customClass: {
      type: String,
      required: false,
      default: 'mt-2'
    },
    color: {
      type: String,
      required: false,
      default: '#FFFFFF'
    }
  },
  data () {
    return {
      mdiMapMarker,
      mdiViewList,
      mdiAccountAlert,
      mdiAccountCheck,
      mdiArchive,
      mdiTagText,
      mdiFloorPlan,
      mdiHeart,
      imgBaseUrl: this.$config.imgBaseUrl,
      show: false
    }
  },

  computed: {
    isLoggedIn () {
      return !!this.$auth.loggedIn
    },
    username () {
      if (this.isLoggedIn) {
        return this.$auth.user.username.replace('&', ' & ')
      }
      return false
    },
    filteredInterests () {
      // eslint-disable-next-line no-return-assign
      return this.item.interests.filter(interest => interest.user.username !== this.username)
    },
    ownInterest () {
      const ownInterest = this.item.interests.filter(interest => interest.user.username === this.username)
      return ownInterest[0]
    }
  }
}
</script>
