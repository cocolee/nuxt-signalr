const { resolve } = require('path')

module.exports = function (moduleOptions) {
  // const options = {
  //   ...this.options['nuxt-signalr'],
  //   ...moduleOptions,
  // }

  this.addPlugin({
    src: resolve(__dirname, 'plugin.js'),
    fileName: 'nuxt-signalr.js',
    options: {
      url: 'CoreHub'
    }
  })
}

// module.exports.meta = require('../package.json')
