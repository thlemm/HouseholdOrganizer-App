<template>
  <v-dialog
    :value="active"
    fullscreen
    hide-overlay
    transition="slide-x-reverse-transition"
  >
    <v-card>
      <v-toolbar
        dark
        color="primary"
      >
        <v-btn
          icon
          dark
          absolute
          @click="$emit('click-dialog-close')"
        >
          <v-icon>
            {{ mdiArrowLeft }}
          </v-icon>
        </v-btn>
        <v-spacer />
        <v-toolbar-title>
          {{ toolbarTitle }}
        </v-toolbar-title>
        <v-spacer />
      </v-toolbar>

      <v-container
        fluid
      >
        <slot />
      </v-container>
    </v-card>
    <v-footer
      color="primary"
      app
    >
      <span class="white--text">HouseholdOrganizer</span>
    </v-footer>
  </v-dialog>
</template>

<script>
import { mdiArrowLeft } from '@mdi/js'
export default {
  name: 'InputDialog',

  props: {
    active: {
      type: Boolean,
      required: true,
      default: false
    },
    toolbarTitle: {
      type: String,
      required: true,
      default: ''
    }
  },

  data () {
    return {
      mdiArrowLeft
    }
  }
}
</script>
