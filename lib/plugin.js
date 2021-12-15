// import * as signalRCore from '@microsoft/signalr'
import {
  HubConnectionBuilder,
  HttpTransportType,
  JsonHubProtocol,
  LogLevel,
} from "@microsoft/signalr";
import Debug from "debug";
import cookieUniversal from "cookie-universal";
import { Store } from "vuex";

const universelCookie = cookieUniversal();

const debug = Debug("nuxt-signalr");
const baseUrl = process.env.hubUrl || "https://kraken.bitbu.com";
const hubSlug = "<%= options.url %>";

class signalR {
  constructor() {
    this._hubConnection = new HubConnectionBuilder()
      .withUrl(`${baseUrl}/${hubSlug}`, {
        transport: HttpTransportType.WebSockets,
        logMessageContent: true,
        accessTokenFactory: () => {
          let accessToken = "";

          const authToken = universelCookie.get(process.env.APP_SLUG + "_auth");

          if (authToken) {
            accessToken = authToken;
            return `${accessToken}`;
          }

          return `${accessToken}`;
        },
      })
      .withAutomaticReconnect([0, 1000, 10000, 30000])
      .withHubProtocol(new JsonHubProtocol())
      .configureLogging((log) => {
        process.env.NODE_ENV === "production"
          ? LogLevel.Critical
          : LogLevel.Critical;
        log.AddConsole();
      })
      .build();
  }
  // async ConnectHub() {
  //   const connection =

  //   this._hubConnection = connection;
  // }
  Connection() {
    return this._hubConnection;
  }
  async ReConnection() {
    console.log("re connection");
    await this.StopHub();
    await this.StartHub();
  }
  async StartHub() {
    // eslint-disable-next-line no-console
    console.log("Starthub _hubConnection before start: ", this._hubConnection);
    await this._hubConnection.start();
    // eslint-disable-next-line no-console
    console.log("Starthub store state access: ", Store.state);
    // eslint-disable-next-line no-console
    console.log("Starthub _hubConnection after start: ", this._hubConnection);

    // return await new Promise((resolve) =>
    //   setTimeout(() => {
    //     resolve(this._hubConnection);
    //   }, 100)
    // );
  }
  async CallHubMethods() {
    this._hubConnection.onclose(async (e) => {
      // // eslint-disable-next-line no-console
      // // console.log('connection onclose : ', hubConnection)
      // // eslint-disable-next-line no-console
      // console.log("connection.HubName : ", await _hubConnection);
      // // // eslint-disable-next-line no-console
      // // console.log('connection.CallBack : ', hubConnection.CallBack)
      // if (e) {
      //   // eslint-disable-next-line no-console
      //   console.log("Connection closed with error: " + e);
      // } else {
      //   // eslint-disable-next-line no-console
      //   console.log("Disconnected");
      // }

      if (_hubConnection.connectionStarted === false) {
        if (_hubConnection.connectionState !== "Connected") {
          // await this.Connect()
          await SignalRHub.StartHub();
        }
        // await this.StartHub()
      }

      SignalRHub.ReconnectHubGroup();
    });
    this._hubConnection.onreconnecting(async (e) => {
      // eslint-disable-next-line no-console
      // console.log('connection onclose : ', hubConnection)
      // eslint-disable-next-line no-console
      console.log("connection.HubName : ", await _hubConnection);
      // eslint-disable-next-line no-console
      console.log("connection.HubName methods: ", await _hubConnection.methods);
      // eslint-disable-next-line no-console
      console.log("Connection onreconnecting: " + e);
    });
    this._hubConnection.onreconnected(async (e) => {
      // eslint-disable-next-line no-console
      // console.log('connection onclose : ', hubConnection)
      // eslint-disable-next-line no-console
      console.log("connection.HubName : ", await _hubConnection);
      // eslint-disable-next-line no-console
      console.log("Connection conreconnected: " + e);

      if (_hubConnection.connectionStarted === false) {
        if (_hubConnection.connectionState !== "Connected") {
          // await this.Connect()
          await SignalRHub.StartHub();
        }
        // await this.StartHub()
      }

      SignalRHub.ReconnectHubGroup();
    });
  }
  async JoinHubGroup(_callback) {
    try {
      if (Array.isArray(_callback)) {
        const [name, value, value2] = _callback;
        const _name = name.replace("Join", "join");
        const LeaveName = name.replace("Join", "leave");

        if (value2 || value2 === "") {
          await this._hubConnection.invoke(_name, value, value2).catch((ex) => {
            // eslint-disable-next-line no-console
            console.log("connection join error", this._hubConnection);
            // eslint-disable-next-line no-console
            console.log("connection.HubName : ", this._hubConnection.HubName);
            // eslint-disable-next-line no-console
            console.log("connection.CallBack : ", this._hubConnection.CallBack);
            // eslint-disable-next-line no-console
            console.log(ex);
          });
        } else if (value || value === "") {
          await this._hubConnection.invoke(_name, value).catch((ex) => {
            // eslint-disable-next-line no-console
            console.log("connection join error", this._hubConnection);
            // eslint-disable-next-line no-console
            console.log("connection.HubName : ", this._hubConnection.HubName);
            // eslint-disable-next-line no-console
            console.log("connection.CallBack : ", this._hubConnection.CallBack);
            // eslint-disable-next-line no-console
            console.log(ex);
          });
        } else {
          await this._hubConnection.invoke(_name).catch((ex) => {
            // eslint-disable-next-line no-console
            console.log("connection join error", this._hubConnection);
            // eslint-disable-next-line no-console
            console.log("connection.HubName : ", this._hubConnection.HubName);
            // eslint-disable-next-line no-console
            console.log("connection.CallBack : ", this._hubConnection.CallBack);
            // eslint-disable-next-line no-console
            console.log(ex);
          });
        }

        if (value2 || value2 === "") {
          await this._hubConnection
            .invoke(LeaveName, value, value2)
            .catch((ex) => {
              // eslint-disable-next-line no-console
              console.log("connection leave error", this._hubConnection);
              // eslint-disable-next-line no-console
              console.log("connection.HubName : ", this._hubConnection.HubName);
              // eslint-disable-next-line no-console
              console.log(
                "connection.CallBack : ",
                this._hubConnection.CallBack
              );
              // eslint-disable-next-line no-console
              console.log(ex);
            });
          await this._hubConnection.invoke(_name, value, value2).catch((ex) => {
            // eslint-disable-next-line no-console
            console.log("connection join error", this._hubConnection);
            // eslint-disable-next-line no-console
            console.log("connection.HubName : ", this._hubConnection.HubName);
            // eslint-disable-next-line no-console
            console.log("connection.CallBack : ", this._hubConnection.CallBack);
            // eslint-disable-next-line no-console
            console.log(ex);
          });
        } else if (value || value === "") {
          await this._hubConnection.invoke(LeaveName, value).catch((ex) => {
            // eslint-disable-next-line no-console
            console.log("connection leave error", this._hubConnection);
            // eslint-disable-next-line no-console
            console.log("connection.HubName : ", this._hubConnection.HubName);
            // eslint-disable-next-line no-console
            console.log("connection.CallBack : ", this._hubConnection.CallBack);
            // eslint-disable-next-line no-console
            console.log(ex);
          });
          await this._hubConnection.invoke(_name, value).catch((ex) => {
            // // eslint-disable-next-line no-console
            // console.log('connection join', this._hubConnection)
            // // eslint-disable-next-line no-console
            // console.log('connection.HubName : ', this._hubConnection.HubName)
            // // eslint-disable-next-line no-console
            // console.log('connection.CallBack : ', this._hubConnection.CallBack)
            // // eslint-disable-next-line no-console
            // console.log(ex)
          });
        } else {
          await this._hubConnection.invoke(LeaveName).catch((ex) => {
            // // eslint-disable-next-line no-console
            // console.log('connection leave error', this._hubConnection)
            // // eslint-disable-next-line no-console
            // console.log('connection.HubName : ', this._hubConnection.HubName)
            // // eslint-disable-next-line no-console
            // console.log('connection.CallBack : ', this._hubConnection.CallBack)
            // // eslint-disable-next-line no-console
            // console.log(ex)
          });
          await this._hubConnection.invoke(_name).catch((ex) => {
            // // eslint-disable-next-line no-console
            // console.log('connection join', this._hubConnection)
            // // eslint-disable-next-line no-console
            // console.log('connection.HubName : ', this._hubConnection.HubName)
            // // eslint-disable-next-line no-console
            // console.log('connection.CallBack : ', this._hubConnection.CallBack)
            // // eslint-disable-next-line no-console
            // console.log(ex)
          });
        }
        return this._hubConnection;
        // return await new Promise((resolve, reject) => resolve(this._hubConnection))
      } else {
        return this._hubConnection;
        // return await new Promise((resolve, reject) => resolve(this._hubConnection))
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log("err", err);
      // eslint-disable-next-line no-console
      console.log("err", this);

      await this.StartHub();

      await new Promise((resolve, reject) => resolve(_hubConnection));
    }
  }
  async StopHub() {
    await new Promise((resolve) => {
      this._hubConnection.stop();
      resolve(this._hubConnection);
    });
  }
  async LeaveHubGroup(_callback) {
    try {
      if (Array.isArray(_callback)) {
        const [name, value, value2] = _callback;
        // // eslint-disable-next-line no-console
        // console.log(_hubName + ' ' + name, value + ' ' + value2)

        if (value2 || value2 === "") {
          await this._hubConnection.invoke(name, value, value2).catch((ex) => {
            // // eslint-disable-next-line no-console
            // console.log('connection leave error', this._hubConnection)
            // // eslint-disable-next-line no-console
            // console.log('connection.HubName : ', this._hubConnection.HubName)
            // // eslint-disable-next-line no-console
            // console.log('connection.CallBack : ', this._hubConnection.CallBack)
            // // eslint-disable-next-line no-console
            // console.log(ex)
          });
        } else if (value || value === "") {
          await this._hubConnection.invoke(name, value).catch((ex) => {
            // // eslint-disable-next-line no-console
            // console.log('connection leave error', this._hubConnection)
            // // eslint-disable-next-line no-console
            // console.log('connection.HubName : ', this._hubConnection.HubName)
            // // eslint-disable-next-line no-console
            // console.log('connection.CallBack : ', this._hubConnection.CallBack)
            // // eslint-disable-next-line no-console
            // console.log(ex)
          });
        } else {
          await this._hubConnection.invoke(name).catch((ex) => {
            // // eslint-disable-next-line no-console
            // console.log('connection leave error', this._hubConnection)
            // // eslint-disable-next-line no-console
            // console.log('connection.HubName : ', this._hubConnection.HubName)
            // // eslint-disable-next-line no-console
            // console.log('connection.CallBack : ', this._hubConnection.CallBack)
            // // eslint-disable-next-line no-console
            // console.log(ex)
          });
        }
      } else {
        return this._hubConnection;
        // return await new Promise((resolve, reject) => resolve(this._hubConnection))
      }
    } catch (err) {}
  }
  ReconnectHubGroup() {
    console.log("ReconnectHubGroup store", Store);
    const _store = Store;
    try {
      setTimeout(async () => {
        await new Promise((resolve, reject) =>
          setTimeout(() => {
            _store.dispatch("hub/RE_JOIN_HUB_GROUP");

            resolve(this._hubConnection);
          }, 100)
        );
      }, 250);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log("err", err);
      // eslint-disable-next-line no-console
      console.log("err", this);
    }
  }
}

export default (ctx, inject) => {
  const sgnlrHub = new signalR();
  ctx.$signalRHub = sgnlrHub;
  inject("signalRHub", sgnlrHub);
  // ctx.$signalRHubConnection = sgnlrHub.Connection();
  // inject("signalRHubConnection", sgnlrHub.Connection());
};
