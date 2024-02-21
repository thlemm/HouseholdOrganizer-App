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
        <v-img :src="imgBaseUrl + addSuffixToImage(item.image, '_small')" />
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
          {{ $t(item.originalRoom?.name) }}
        </v-list-item-subtitle>
        <v-list-item-subtitle>
          <v-icon left small>
            {{ mdiViewList }}
          </v-icon>
          {{ $t(item.type.name) }}
        </v-list-item-subtitle>
        <v-list-item-subtitle>
          <v-icon left small>
            {{ mdiRoutes }}
          </v-icon>
          <v-chip
            class="mr-1"
            :color="statusColor"
            x-small
          >
            {{ $t(item.transaction.transactionStatus.name) }}
          </v-chip>
        </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>

    <v-expand-transition>
      <div v-show="show">
        <v-list-item>
          <v-list-item-content class="mx-0">
            <v-list-item-subtitle class="font-weight-black">
              Lagerort:
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
            <v-list-item-subtitle
              v-if="item.interests.length > 0"
              class="mt-2 font-weight-black"
            >
              Interessenten:
            </v-list-item-subtitle>
            <v-list-item-subtitle v-if="item.interests.length > 0">
              <v-icon left small>
                {{ item.interests.length > 0 ? (filterInterests && filteredInterests.length === 0 ? mdiAccountCheck : mdiAccountAlert) : '' }}
              </v-icon>
              <v-chip
                v-for="interest in filterInterests ? filteredInterests : item.interests"
                :key="interest.id"
                class="mr-1"
                color="primary"
                x-small
              >
                {{ interest.user.username }}
              </v-chip>
              <v-chip
                v-if="item.interests.length > 0 ? (filterInterests && filteredInterests.length === 0) : false"
                class="mr-1"
                color="primary"
                x-small
              >
                keine anderen Interessenten
              </v-chip>
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
              v-if="[1,2].includes(item.transaction.transactionStatus.id)"
              class="mt-2 font-weight-black"
            >
              Preis:
            </v-list-item-subtitle>
            <v-list-item-subtitle
              v-if="item.transaction.transactionStatus.id === 1"
              class="body-2 pb-1"
            >
              <v-chip
                v-if="item.transaction.priceMin > 0 || item.transaction.priceMax > 0"
                small
                color="secondary"
              >
                {{ (item.transaction.priceMin / 100).toFixed(2) }} - {{ (item.transaction.priceMax / 100).toFixed(2) }} €
              </v-chip>
              <v-chip
                v-else
                small
                color="secondary"
              >
                nicht angegeben
              </v-chip>
            </v-list-item-subtitle>
            <v-list-item-subtitle
              v-if="item.transaction.transactionStatus.id === 2"
              class="body-2 pb-1"
            >
              <v-chip
                small
                color="warning"
              >
                {{ (item.transaction.priceSold / 100).toFixed(2) }} €
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
                :disabled="[2,4,5].includes(item.transaction.transactionStatus.id)"
                @update-location="$emit('reload-item', item.id)"
              />
              <action-update-transaction
                v-if="isAdmin"
                :item="item"
                @update-transaction="$emit('reload-item', item.id)"
              />
              <action-toggle-interest
                v-if="actionToggleInterest"
                :interest-id="ownInterest?.id"
                :is-interested="ownInterest?.interested"
                :item-id="item.id"
                :disabled="[2,4,5].includes(item.transaction.transactionStatus.id)"
                @update-interest="$emit('reload-item', item.id)"
              />
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-card-text class="pt-0">
          <v-img
            :src="imgBaseUrl + addSuffixToImage(item.image, '_medium')"
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
import { mdiMapMarker, mdiViewList, mdiAccountAlert, mdiAccountCheck, mdiArchive, mdiTagText, mdiFloorPlan, mdiHeart, mdiRoutes } from '@mdi/js'
import ActionToggleInterest from '~/components/action/action-toggle-interest'
import ActionUpdateLocation from '~/components/action/action-update-location'
import ActionUpdateTransaction from '~/components/action/action-update-transaction'

export default {
  name: 'ItemCard',
  components: { ActionUpdateTransaction, ActionUpdateLocation, ActionToggleInterest },
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
      mdiRoutes,
      imgBaseUrl: this.$config.imgBaseUrl,
      show: false
    }
  },

  computed: {
    isLoggedIn () {
      return !!this.$auth.loggedIn
    },
    isAdmin () {
      if (this.isLoggedIn) {
        if (this.$auth.user.roles.includes('ROLE_ADMIN')) {
          return true
        }
      }
      return false
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
    },
    statusColor () {
      if ([1].includes(this.item?.transaction?.transactionStatus?.id)) {
        return 'secondary'
      }
      if ([7, 6].includes(this.item?.transaction?.transactionStatus?.id)) {
        return 'primary'
      }
      return 'warning'
    }
  },
  methods: {
    addSuffixToImage (image, suffix) {
      const parts = image.split('.')
      // Check if the filename has an extension
      if (parts.length > 1) {
        const extension = parts.pop() // Remove the extension from the array
        return `${parts.join('.')}${suffix}.${extension}`
      } else {
        // If there's no extension, just add the suffix
        return `${image}_small`
      }
    }
  }
}
</script>
