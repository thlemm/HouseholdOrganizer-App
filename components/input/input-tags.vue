<template>
  <v-combobox
    v-model="tags"
    :loading="isLoading"
    :search-input.sync="search"
    :delimiters="delimiters"
    :items="items"
    counter="5"
    :rules="[rules.required]"
    outlined
    hint="Tags eingeben"
    label="Tags"
    placeholder=""
    multiple
    dense
    small-chips
    deletable-chips
    @input="updateTags()"
  />
</template>

<script>

export default {
  name: 'InputTags',
  props: {
    tagsInput: {
      type: Array,
      required: false,
      default: () => { return [] }
    }
  },
  data () {
    return {
      search: null,
      isLoading: false,
      delimiters: [',', ' '],
      items: [],
      tags: [],
      rules: {
        required: (value) => {
          if (value.length < 1 && value.length > 5) {
            return 'Bitte eingeben.'
          }
          return true
        }
      }
    }
  },

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
    },
    tagsInput () {
      this.tags = this.tagsInput
    }
  },

  methods: {
    updateTags () {
      this.$emit('input', this.tags.map(v => v.toLowerCase()))
    }
  }
}
</script>
