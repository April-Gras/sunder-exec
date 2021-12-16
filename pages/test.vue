<template>
  <div>
    <VSelect v-model="value" :available-options="availableOptions" />
  </div>
</template>

<script lang="ts">
import VueMixins from "vue-typed-mixins"

import ButtonMain from "~/components/ui/buttons/main.vue"
import VSelect from "~/components/ui/VSelect.vue"

import clientIoMixin from "~/mixins/clientIo"

export default VueMixins(clientIoMixin).extend({
  components: {
    ButtonMain,
    VSelect,
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
      value: "",
    }
  },
})
</script>

<style lang="scss" scoped></style>
