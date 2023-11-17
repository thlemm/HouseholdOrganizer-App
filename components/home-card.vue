<template>
  <v-card
    class="mx-auto"
    outlined
  >
    <v-list-item three-line>
      <v-list-item-content>
        <div class="overline mb-4">
          HouseholdOrganizer 2.0
        </div>

        <v-list-item-title class="headline mb-1">
          Willkommen
        </v-list-item-title>

        <v-list-item-subtitle>
          Organisiere deine Sachen!
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
      Diese App ersetzt in den alten Libori-Katalog.
      Die Organisation deiner Sachen wird jetzt noch einfacher.
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'HomeCard'
}
</script>
