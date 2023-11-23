<template>
  <v-combobox
    v-model="tags"
    :loading="isLoading"
    :search-input.sync="search"
    :delimiters="delimiters"
    :items="items"
    counter="5"
    :rules="[rules.tag]"
    outlined
    hint="Tags eingeben"
    label="Tags"
    placeholder=""
    multiple
    dense
    small-chips
    deletable-chips
    autofocus
    @change="updateTags"
  />
</template>

<script>

export default {
  name: 'InputTags',

  data: () => ({
    search: null,
    isLoading: false,
    delimiters: [',', ' '],
    tags: [],
    items: [],
    rules: {
      tag: (value) => {
        const pattern = /^[a-zA-Zß]*$/
        return pattern.test(value) || 'In Tags sind nur Buchstaben erlaubt'
      }
    }
  }),

  watch: {
    tags (val) {
      if (this.isLoading) {
        this.isLoading = false
        this.search = ''
      }
      if (val.length > 5) {
        this.$nextTick(() => this.tags.pop())
      }
    },
    search (val) {
      if (val == null) { return }
      if (this.isLoading) { return }

      if (val.length >= 3) {
        this.isLoading = true
        this.$axios.get('/api/v2/tags?query=' + val)
          .then((response) => {
            this.items = response.data
          })
      }
    }
  },

  methods: {
    updateTags () {
      this.$emit('input', this.tags.map(v => v.toLowerCase()))
    }
  }
}
</script>
