<template>
  <v-dialog
    v-model="active"
    fullscreen
    hide-overlay
    transition="slide-x-reverse-transition"
  >
    <v-card>
      <v-toolbar
        dark
        color="primary"
      >
        <v-toolbar-title />
        <v-spacer />
        <v-toolbar-items>
          <v-btn
            icon
            dark
            @click="$emit('click-dialog-close')"
          >
            <v-icon>mdi-check</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>

      <v-container
        fluid
      >
        <v-row>
          <v-col>
            <slot />
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>

export default {
  name: 'InputDialog',

  props: {
    active: {
      type: Boolean,
      required: true,
      default: false
    }
  },

  data () {
    return {

    }
  }
}
</script>
