<template>
  <div class="order-view">
    <SfHeading class="login__header" :level="3" title="Order details" />
    <SwOrderDetails :order-id="orderId" />
  </div>
</template>

<script>
import { SfHeading } from "@storefront-ui/vue"
import SwOrderDetails from "@shopware-pwa/default-theme/components/SwOrderDetails"

export default {
  components: { SfHeading, SwOrderDetails },
  computed: {
    orderId() {
      return this.$router.currentRoute.params.id
    },
  },
}
</script>

<style lang="scss" scoped>
.order-view {
  .sw-order-details {
    width: 100%;
  }
}
</style>
