<template>
  <div>
    <nuxt-link to="/about">About</nuxt-link>
    <a @click="reConnect">RE CONNECT</a>
  </div>
</template>

<script>
export default {
  // async asyncData (ctx) {
  //   await ctx.$signalRHub.Connect()
  //   await ctx.$signalRHub.StartHub()
  //   await ctx.$signalRHub.JoinHubGroup([
  //     'JoinMarketHubLiteGroupAsync',
  //     'marketSummary'
  //   ])
  // },
  async beforeMount () {
    await this.$signalRHub.Connect()
    await this.$signalRHub.StartHub()
    await this.$signalRHub.JoinHubGroup([
      'JoinMarketHubLiteGroupAsync',
      'marketSummary'
    ])
  },
  async mounted () {
    // console.log('mounred =========> ', await this.$signalRHubConnection)
    // await this.$signalRHub.ReconnectHubGroup()
    await this.$signalRHubConnection.off('marketSummary')
    this.$signalRHubConnection.on('marketSummary', (summary) => {
        console.log('summary =============> ', summary)
      })
    // console.log('asdasdasd=>>>', await this.$signalRHubConnection)
    // console.log('this.$signalRHub.Connection.state', this.$signalRHub.Connection.state)
    // console.log('this.$signalRHub.Connection', await this.$signalRHub.ConnectionState)
    // await this.$signalRHub.addHubListener('marketSummary', 'summary').then((res) => {
    //   console.log('index res', res)
    // })
  },
  methods: {
    reConnect() {
      this.$signalRHub.Connect()
    }
  },
}
</script>
