<template>
  <v-card class="mx-auto">
    <v-card-title>
      {{ title }}
    </v-card-title>
    <v-card-subtitle>
      {{ subtitle }}
    </v-card-subtitle>
    <v-card-text class="text--primary">
      {{ text }}
    </v-card-text>
    <slot />
  </v-card>
</template>

<script>
export default {
  name: 'InfoCard',
  props: {
    title: {
      type: String,
      required: false
    },
    subtitle: {
      type: String,
      required: false
    },
    text: {
      type: String,
      required: false
    }
  }
}
</script>
