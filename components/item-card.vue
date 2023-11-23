<template>
  <v-card
    v-ripple="false"
    class="mt-2"
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
            {{ mdiMapMarker }}
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
              Raum: {{ item.currentRoom ? $t(item.currentRoom.name) : '---' }}
            </v-list-item-subtitle>
            <v-list-item-subtitle class="body-1">
              Kiste/Regal: {{ item.location }}
            </v-list-item-subtitle>
            <v-list-item-subtitle class="body-1">
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
              v-if="actionRemoveInterest || (actionAddInterest && !ownInterest)"
              class="mt-2 font-weight-black"
            >
              Aktionen:
            </v-list-item-subtitle>
            <v-list-item-subtitle
              class="body-2 pb-1"
            >
              <action-remove-interest
                v-if="actionRemoveInterest"
                :interest-id="ownInterest.id"
                :item-id="item.id"
                @removed-interest="$emit('reload-data')"
              />
              <action-add-interest
                v-if="actionAddInterest && !ownInterest"
                :item-id="item.id"
                @added-interest="$emit('reload-data')"
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
import { mdiMapMarker, mdiViewList, mdiAccountAlert, mdiAccountCheck } from '@mdi/js'
import ActionRemoveInterest from '~/components/action/action-remove-interest'
import ActionAddInterest from '~/components/action/action-add-interest'

export default {
  name: 'ItemCard',
  components: { ActionAddInterest, ActionRemoveInterest },
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
    actionRemoveInterest: {
      type: Boolean,
      required: false,
      default: false
    },
    actionAddInterest: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data () {
    return {
      mdiMapMarker,
      mdiViewList,
      mdiAccountAlert,
      mdiAccountCheck,
      imgBaseUrl: this.$config.imgBaseUrl,
      show: false
    }
  },

  computed: {
    filteredInterests () {
      // eslint-disable-next-line no-return-assign
      return this.item.interests.filter(interest => interest.user.username !== this.username)
    },
    ownInterest () {
      const ownInterest = this.item.interests.filter(interest => interest.user.username === this.username)
      return ownInterest[0]
    }
  },
  beforeMount () {
    this.username = this.$auth.user.username
  }
}
</script>
