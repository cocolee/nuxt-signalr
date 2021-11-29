<template>
  <div>
    <nuxt-link to="/about">About</nuxt-link>
  </div>
</template>

<script>
export default {
  async created () {
    await this.$signalRHub.StartHub()
    await this.$signalRHub.JoinHubGroup([
      'JoinMarketHubLiteGroupAsync',
      'marketSummary'
    ])
  },
  async mounted () {
    console.log('mounred =========> ', await this.$signalRHubConnection)
    await this.$signalRHubConnection.off('marketSummary')
    setTimeout(() => {
      this.$signalRHubConnection.on('marketSummary', (summary) => {
        console.log('summary =============> ', summary)
      })
    }, 500);
    // console.log('asdasdasd=>>>', await this.$signalRHubConnection)
    // console.log('this.$signalRHub.Connection.state', this.$signalRHub.Connection.state)
    // console.log('this.$signalRHub.Connection', await this.$signalRHub.ConnectionState)
    // await this.$signalRHub.addHubListener('marketSummary', 'summary').then((res) => {
    //   console.log('index res', res)
    // })
  },
}
</script>
