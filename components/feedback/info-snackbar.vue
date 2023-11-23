<template>
  <v-snackbar
    :value="active"
    :multi-line="true"
  >
    <slot />
    <template #action="{ attrs }">
      <v-btn
        :color="color"
        text
        v-bind="attrs"
        @click="$emit('click-action')"
      >
        {{ actionText }}
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
export default {
  name: 'InfoSnackbar',
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
    actionText: {
      type: String,
      required: false,
      default: 'OK'
    }
  },
  data () {
    return {}
  }
}
</script>
