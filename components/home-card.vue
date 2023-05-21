<template>
  <v-card
    class="mx-auto"
    outlined
  >
    <v-list-item three-line>
      <v-list-item-content>
        <div class="overline mb-4">
          Libori Katalog 2.0
        </div>

        <v-list-item-title class="headline mb-1">
          Startseite
        </v-list-item-title>

        <v-list-item-subtitle>
          Herzlich Willkommen
        </v-list-item-subtitle>
      </v-list-item-content>

      <v-list-item-avatar
        tile
        size="80"
        color="grey"
      >
        <v-img src="/icon.png" />
      </v-list-item-avatar>
    </v-list-item>

    <v-card-text>
      Diese App ersetzt in Zukunft den alten Libori-Katalog.
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'HomeCard'
}
</script>
