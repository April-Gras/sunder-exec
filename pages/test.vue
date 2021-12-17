<template>
  <div>
    <VCheckbox
      v-for="option in availableOptions"
      :key="option"
      v-model="value"
      :target="option"
    />
  </div>
</template>

<script lang="ts">
import VueMixins from "vue-typed-mixins"

import VCheckbox from "~/components/ui/VCheckbox.vue"

import clientIoMixin from "~/mixins/clientIo"

export default VueMixins(clientIoMixin).extend({
  components: {
    VCheckbox,
  },
  data() {
    return {
      availableOptions: [
        "string",
        "string2",
        "string3",
        "string4",
        "string5",
        "string6",
        "string7",
      ],
      value: [],
    }
  },
})
</script>

<style lang="scss" scoped></style>
