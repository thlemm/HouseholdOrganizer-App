<template>
  <div>
    <loading-animation
      v-if="loading"
      color="secondary"
    />
    <div v-if="lazy">
      <v-pagination
        v-if="items.length > pageLength && !loading"
        v-model="pageNumber"
        class="mt-2"
        :length="Math.ceil(items.length/pageLength)"
      />
      <v-lazy
        v-for="(item, i) in getItemsByPageNumberAndPageLength(pageNumber, pageLength)"
        :key="i"
        :options="{
          threshold: .5
        }"
        class="fill-height"
        transition="fade-transition"
        @input="countLoadingEvents()"
      >
        <item-card
          :item="item"
          :action-toggle-interest="true"
          :action-update-location="true"
          :filter-interests="false"
          @reload-item="reloadItem($event)"
        />
      </v-lazy>
      <v-pagination
        v-if="items.length > pageLength && !loading"
        v-model="pageNumber"
        class="mt-2"
        :length="Math.ceil(items.length/pageLength)"
      />
    </div>
  </div>
</template>

<script>
import LoadingAnimation from '~/components/feedback/loading-animation'

export default {
  name: 'InfoCardLoader',
  components: { LoadingAnimation },

  props: {
    items: {
      type: Array,
      required: true
    },
    lazy: {
      type: Boolean,
      required: true
    },
    loading: {
      type: Boolean,
      required: true
    }
  },

  data () {
    return {
      eventsCounter: 0,
      pageLength: 10,
      pageNumber: 1,
      maxPageNumber: 1
    }
  },
  methods: {
    countLoadingEvents () {
      this.eventsCounter += 1
      if (this.eventsCounter === this.pageLength || this.eventsCounter === this.items.length) {
        this.$emit('loaded-items')
        this.eventsCounter = 0
      }
    },
    getItemsByPageNumberAndPageLength (pageNumber, pageLength) {
      const startIndex = (pageNumber - 1) * pageLength
      const endIndex = pageNumber * pageLength
      return this.items.slice(startIndex, endIndex)
    },
    async reloadItem (itemId) {
      const getItemResponse = await this.getItemRequest(itemId)
      if (getItemResponse) {
        this.$emit('reloaded-item', getItemResponse)
      }
    },
    getItemRequest (itemId) {
      const url = '/api/v2/items/' + itemId
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
