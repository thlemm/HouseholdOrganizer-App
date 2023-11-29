<template>
  <v-dialog
    :value="active"
    persistent
    width="290"
  >
    <v-card>
      <v-card-title class="headline">
        {{ title }}
      </v-card-title>

      <v-card-text>
        {{ text }}
      </v-card-text>

      <v-divider />

      <v-card-actions>
        <v-btn
          color="warning"
          text
          @click="$emit('click-reject')"
        >
          Nein
        </v-btn>
        <v-spacer />
        <v-btn
          color="secondary"
          text
          @click="$emit('click-confirm')"
        >
          Ja
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'DialogConfirm',
  props: {
    active: {
      type: Boolean,
      required: true
    },
    color: {
      type: String,
      required: false,
      default: 'info'
    },
    title: {
      type: String,
      required: false,
      default: 'Sicher?'
    },
    text: {
      type: String,
      required: false,
      default: 'Soll diese Aktion wirklich ausgeführt werden?'
    }
  },
  data () {
    return {}
  }
}
</script>
