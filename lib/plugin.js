import * as signalRCore from '@microsoft/signalr'
import Debug from 'debug'
import cookieUniversal from 'cookie-universal'

const universelCookie = cookieUniversal()

const debug = Debug('nuxt-signalr')
const baseUrl = process.env.hubUrl || 'https://tekhub.bitbu.com'
const hubSlug = '<%= options.url %>'

const _hubConnection = new signalRCore.HubConnectionBuilder()
  .withUrl(`${baseUrl}/${hubSlug}`, {
    transport: signalRCore.HttpTransportType.WebSockets,
    logMessageContent: true,
    accessTokenFactory: () => {
      let accessToken = ''

      const authToken = universelCookie.get(
        process.env.APP_SLUG + '_auth'
      )

      if (authToken) {
        accessToken = authToken
        return `${accessToken}`
      }

      return `${accessToken}`
    }
  })
  .withAutomaticReconnect([0, 1000, 10000, 30000])
  .withHubProtocol(new signalRCore.JsonHubProtocol())
  .configureLogging(
    process.env.NODE_ENV === 'production'
      ? signalRCore.LogLevel.Critical
      : signalRCore.LogLevel.Critical
  )
  .build()

export const SignalRHub = {
  Connect: () => {
    // eslint-disable-next-line no-console
    // console.log('hubUrl: ', baseUrl)
    // eslint-disable-next-line no-console
    // console.log('NODE_ENV: ', process.env.NODE_ENV)

    // eslint-disable-next-line no-console
    console.log('Connection First: ', _hubConnection)



    // eslint-disable-next-line no-console
    console.log('_hubConnection After Connection Builder: ', _hubConnection)

    _hubConnection.onclose(async (e) => {
      // eslint-disable-next-line no-console
      // console.log('connection onclose : ', hubConnection)
      // eslint-disable-next-line no-console
      console.log('connection.HubName : ', await _hubConnection)
      // // eslint-disable-next-line no-console
      // console.log('connection.CallBack : ', hubConnection.CallBack)
      if (e) {
        // eslint-disable-next-line no-console
        console.log('Connection closed with error: ' + e)
      } else {
        // eslint-disable-next-line no-console
        console.log('Disconnected')
      }

      if (_hubConnection.connectionStarted === false) {
        if (_hubConnection.connectionState !== 'Connected') {
          await this.Connect()
        }
        await this.StartHub()
      }

      this.ReconnectHubGroup()
    })
    _hubConnection.onreconnecting(async (e) => {
      // eslint-disable-next-line no-console
      // console.log('connection onclose : ', hubConnection)
      // eslint-disable-next-line no-console
      console.log('connection.HubName : ', await _hubConnection)
      // eslint-disable-next-line no-console
      console.log(
        'connection.HubName methods: ',
        await _hubConnection.methods
      )
      // eslint-disable-next-line no-console
      console.log('Connection onreconnecting: ' + e)
    })
    _hubConnection.onreconnected(async (e) => {
      // eslint-disable-next-line no-console
      // console.log('connection onclose : ', hubConnection)
      // eslint-disable-next-line no-console
      console.log('connection.HubName : ', await _hubConnection)
      // eslint-disable-next-line no-console
      console.log('Connection conreconnected: ' + e)

      if (_hubConnection.connectionStarted === false) {
        if (_hubConnection.connectionState !== 'Connected') {
          await this.Connect()
        }
        await this.StartHub()
      }

      this.ReconnectHubGroup()
    })
  },
  StartHub: () => {
    // eslint-disable-next-line no-console
    console.log('connection.start : ', _hubConnection)

    _hubConnection.start().then(() => {})

    return new Promise((resolve, reject) =>
      setTimeout(() => {
        resolve(_hubConnection)
      }, 100)
    )
  },
  JoinHubGroup: async (_callback) => {
    try {
      // let _hubConnection = HubConnections.find(
      //   (x) => x.HubName === _hubName.toLowerCase()
      // ).Connection
      // eslint-disable-next-line no-console
      // console.log('connection.HubName : ', _callback)
      if (Array.isArray(_callback)) {
        const [name, value, value2] = _callback
        const _name = name.replace('Join', 'join')
        const LeaveName = name.replace('Join', 'leave')

        if (value2 || value2 === '') {
          await _hubConnection
            .invoke(_name, value, value2)
            .catch((ex) => {
              // // eslint-disable-next-line no-console
              // console.log('connection join error', _hubConnection)
              // // eslint-disable-next-line no-console
              // console.log('connection.HubName : ', _hubConnection.HubName)
              // // eslint-disable-next-line no-console
              // console.log('connection.CallBack : ', _hubConnection.CallBack)
              // // eslint-disable-next-line no-console
              // console.log(ex)
            })
        } else if (value || value === '') {
          await _hubConnection.invoke(_name, value).catch((ex) => {
            // // eslint-disable-next-line no-console
            // console.log('connection join error', _hubConnection)
            // // eslint-disable-next-line no-console
            // console.log('connection.HubName : ', _hubConnection.HubName)
            // // eslint-disable-next-line no-console
            // console.log('connection.CallBack : ', _hubConnection.CallBack)
            // // eslint-disable-next-line no-console
            // console.log(ex)
          })
        } else {
          await _hubConnection.invoke(_name).catch((ex) => {
            // // eslint-disable-next-line no-console
            // console.log('connection join error', _hubConnection)
            // // eslint-disable-next-line no-console
            // console.log('connection.HubName : ', _hubConnection.HubName)
            // // eslint-disable-next-line no-console
            // console.log('connection.CallBack : ', _hubConnection.CallBack)
            // // eslint-disable-next-line no-console
            // console.log(ex)
          })
        }

        if (value2 || value2 === '') {
          await _hubConnection
            .invoke(LeaveName, value, value2)
            .catch((ex) => {
              // // eslint-disable-next-line no-console
              // console.log('connection leave error', _hubConnection)
              // // eslint-disable-next-line no-console
              // console.log('connection.HubName : ', _hubConnection.HubName)
              // // eslint-disable-next-line no-console
              // console.log('connection.CallBack : ', _hubConnection.CallBack)
              // // eslint-disable-next-line no-console
              // console.log(ex)
            })
          await _hubConnection
            .invoke(_name, value, value2)
            .catch((ex) => {
              // // eslint-disable-next-line no-console
              // console.log('connection join error', _hubConnection)
              // // eslint-disable-next-line no-console
              // console.log('connection.HubName : ', _hubConnection.HubName)
              // // eslint-disable-next-line no-console
              // console.log('connection.CallBack : ', _hubConnection.CallBack)
              // // eslint-disable-next-line no-console
              // console.log(ex)
            })
        } else if (value || value === '') {
          await _hubConnection.invoke(LeaveName, value).catch((ex) => {
            // // eslint-disable-next-line no-console
            // console.log('connection leave error', _hubConnection)
            // // eslint-disable-next-line no-console
            // console.log('connection.HubName : ', _hubConnection.HubName)
            // // eslint-disable-next-line no-console
            // console.log('connection.CallBack : ', _hubConnection.CallBack)
            // // eslint-disable-next-line no-console
            // console.log(ex)
          })
          await _hubConnection.invoke(_name, value).catch((ex) => {
            // // eslint-disable-next-line no-console
            // console.log('connection join', _hubConnection)
            // // eslint-disable-next-line no-console
            // console.log('connection.HubName : ', _hubConnection.HubName)
            // // eslint-disable-next-line no-console
            // console.log('connection.CallBack : ', _hubConnection.CallBack)
            // // eslint-disable-next-line no-console
            // console.log(ex)
          })
        } else {
          await _hubConnection.invoke(LeaveName).catch((ex) => {
            // // eslint-disable-next-line no-console
            // console.log('connection leave error', _hubConnection)
            // // eslint-disable-next-line no-console
            // console.log('connection.HubName : ', _hubConnection.HubName)
            // // eslint-disable-next-line no-console
            // console.log('connection.CallBack : ', _hubConnection.CallBack)
            // // eslint-disable-next-line no-console
            // console.log(ex)
          })
          await _hubConnection.invoke(_name).catch((ex) => {
            // // eslint-disable-next-line no-console
            // console.log('connection join', _hubConnection)
            // // eslint-disable-next-line no-console
            // console.log('connection.HubName : ', _hubConnection.HubName)
            // // eslint-disable-next-line no-console
            // console.log('connection.CallBack : ', _hubConnection.CallBack)
            // // eslint-disable-next-line no-console
            // console.log(ex)
          })
        }
        return _hubConnection
        // return await new Promise((resolve, reject) => resolve(_hubConnection))
      } else {
        return _hubConnection
        // return await new Promise((resolve, reject) => resolve(_hubConnection))
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log('err', err)
      // eslint-disable-next-line no-console
      console.log('err', this)

      await this.StartHub()

      await new Promise((resolve, reject) => resolve(_hubConnection))
    }
  },
  StopHub: async () => {
    await Promise.all([_hubConnection.stop()]).finally(() => {})
  },
  LeaveHubGroup: async (_callback) => {
    try {
      if (Array.isArray(_callback)) {
        const [name, value, value2] = _callback
        // // eslint-disable-next-line no-console
        // console.log(_hubName + ' ' + name, value + ' ' + value2)

        if (value2 || value2 === '') {
          await _hubConnection
            .invoke(name, value, value2)
            .catch((ex) => {
              // // eslint-disable-next-line no-console
              // console.log('connection leave error', _hubConnection)
              // // eslint-disable-next-line no-console
              // console.log('connection.HubName : ', _hubConnection.HubName)
              // // eslint-disable-next-line no-console
              // console.log('connection.CallBack : ', _hubConnection.CallBack)
              // // eslint-disable-next-line no-console
              // console.log(ex)
            })
        } else if (value || value === '') {
          await _hubConnection.invoke(name, value).catch((ex) => {
            // // eslint-disable-next-line no-console
            // console.log('connection leave error', _hubConnection)
            // // eslint-disable-next-line no-console
            // console.log('connection.HubName : ', _hubConnection.HubName)
            // // eslint-disable-next-line no-console
            // console.log('connection.CallBack : ', _hubConnection.CallBack)
            // // eslint-disable-next-line no-console
            // console.log(ex)
          })
        } else {
          await _hubConnection.invoke(name).catch((ex) => {
            // // eslint-disable-next-line no-console
            // console.log('connection leave error', _hubConnection)
            // // eslint-disable-next-line no-console
            // console.log('connection.HubName : ', _hubConnection.HubName)
            // // eslint-disable-next-line no-console
            // console.log('connection.CallBack : ', _hubConnection.CallBack)
            // // eslint-disable-next-line no-console
            // console.log(ex)
          })
        }
      } else {
        return _hubConnection
        // return await new Promise((resolve, reject) => resolve(_hubConnection))
      }
    } catch (err) {}
  },
  ReconnectHubGroup: (store) => {
    const _store = store
    try {
      setTimeout(async () => {
        await new Promise((resolve, reject) =>
          setTimeout(() => {
            const authToken = universelCookie.get(
              process.env.APP_SLUG + '_auth'
            )
            // const storage = JSON.parse(
            //   localStorage.getItem(`${process.env.LOCALSTORAGE_NEW_VERSION}`)
            // )

            // if (storage) {
            //   if (storage.auth) {
            //     if (
            //       storage.auth.isLoggedIn &&
            //       storage.auth.user &&
            //       storage.auth.token
            //     ) {
            //
            //     }
            //   }
            // }

            if (authToken) {
              _store.dispatch(
                'user/getUserWallet',
                _store.getters['user/userInformation'].guid,
                {
                  root: true
                }
              )
              _store.dispatch(
                'user/getUserNotifications',
                _store.getters['user/userInformation'].guid,
                {
                  root: true
                }
              )
              _store.dispatch(
                'market/getUserOrdersLite',
                _store.getters['user/userInformation'].guid,
                {
                  root: true
                }
              )
            }
            _store.dispatch(
              'market/getMarketOrders',
              _store.getters['market/activeMarketGuid'],
              {
                root: true
              }
            )
            _store.dispatch(
              'summaries/SET_MARKET_SUMMARIES',
              _store.getters['market/activeMarketGuid'],
              {
                root: true
              }
            )

            resolve(_hubConnection)
          }, 100)
        )
      }, 250)
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log('err', err)
      // eslint-disable-next-line no-console
      console.log('err', this)
    }
  }
}

export default (ctx, inject) => {
  ctx.$signalRHub = SignalRHub
  inject('signalRHub', SignalRHub)
}
