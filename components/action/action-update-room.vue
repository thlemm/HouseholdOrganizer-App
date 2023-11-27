<template>
  <div style="float: left;">
    <v-btn
      class="ml-1"
      color="neutral"
      rounded
    >
      <v-icon color="action">
        {{ mdiArchiveMarker }}
      </v-icon>
    </v-btn>
  </div>
</template>

<script>
import { mdiArchiveMarker } from '@mdi/js'
export default {
  name: 'ActionUpdateRoom',
  data () {
    return {
      mdiArchiveMarker
    }
  }
}
</script>
