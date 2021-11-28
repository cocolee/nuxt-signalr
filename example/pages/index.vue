<template>
  <div>
    Works!
  </div>
</template>

<script>
export default {
  async asyncData (ctx) {
    // console.log('ctx', ctx)
    await ctx.$signalRHub.Connect()
    await ctx.$signalRHub.StartHub()
  },
}
</script>
