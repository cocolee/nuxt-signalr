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
const baseUrl = process.env.hubUrl || "https://hub.bitbu.com";
const hubSlug = "<%= options.url %>";

export class signalR {
  constructor(ctx) {
    this._hubConnection;
    this.$ctx = ctx;
  }
  async ConnectHub() {
    const connection = new HubConnectionBuilder()
      .withUrl(`${baseUrl}/${hubSlug}`, {
        transport: HttpTransportType.WebSockets,
        logMessageContent: true,
        accessTokenFactory: () => {
          let accessToken = "";

          const authToken = universelCookie.get(process.env.APP_SLUG + "_auth");

          // console.log("nuxt-signalr authToken", authToken);

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

    connection.onclose(async (e) => {
      //eslint-disable-next-line no-console
      console.log("connection.HubName : ", await this._hubConnection);
      // eslint-disable-next-line no-console
      console.log('connection.CallBack : ', hubConnection.CallBack)
      if (e) {
        // eslint-disable-next-line no-console
        console.log("Connection closed with error: " + e);
      } else {
        // eslint-disable-next-line no-console
        console.log("Disconnected");
      }

      if (this._hubConnection.connectionStarted === false) {
        if (this._hubConnection.connectionState !== "Connected") {
          // await this.Connect()
          await this.StartHub();
          this.ReconnectHubGroup();
        }
        // await this.StartHub()
      }
    });
    connection.onreconnecting(async (e) => {
      // eslint-disable-next-line no-console
      console.log('connection onclose : ', hubConnection)
      // eslint-disable-next-line no-console
      console.log("connection.HubName : ", await this._hubConnection);
      // eslint-disable-next-line no-console
      console.log(
        "connection.HubName methods: ",
        await this._hubConnection.methods
      );
      // eslint-disable-next-line no-console
      console.log("Connection onreconnecting: " + e);
    });
    connection.onreconnected(async (e) => {
      // eslint-disable-next-line no-console
      console.log('connection onclose : ', hubConnection)
      // eslint-disable-next-line no-console
      console.log("connection.HubName : ", await this._hubConnection);
      // eslint-disable-next-line no-console
      console.log("Connection conreconnected: " + e);

      if (this._hubConnection.connectionStarted === false) {
        if (this._hubConnection.connectionState !== "Connected") {
          await this.StartHub();
        }
      }

      this.ReconnectHubGroup();
    });

    this._hubConnection = connection;
  }
  Connection() {
    return this._hubConnection;
  }
  async ReConnection() {
    await this.StopHub();
    await this.StartHub();
  }
  async StartHub() {
    // eslint-disable-next-line no-console
    // console.log('connection.start StartHub: ', _hubConnection)

    // _hubConnection.start().then(() => {})
    await this._hubConnection.start().then((res) => {
      // console.log("start then res", res);
    });

    // eslint-disable-next-line no-console
    // console.log('connection.start StartHub 2: ', _hubConnection)

    return await new Promise((resolve) =>
      setTimeout(() => {
        resolve(this._hubConnection);
      }, 100)
    );
  }
  async JoinHubGroup(_callback) {
    try {
      if (Array.isArray(_callback)) {
        const [name, value, value2] = _callback;
        const _name = name.replace("Join", "join");
        const LeaveName = name.replace("Join", "leave");

        // console.log('JoinHubGroup name', name)

        // console.log('JoinHubGroup value', value)

        // console.log('JoinHubGroup value2', value2)

        if (value !== undefined && value2 === undefined) {
          await this._hubConnection.invoke(_name, value).catch((ex) => {
            // eslint-disable-next-line no-console
            console.log("connection join error value", this._hubConnection);
            // eslint-disable-next-line no-console
            console.log("connection.HubName value: ", this._hubConnection.HubName);
            // eslint-disable-next-line no-console
            console.log("connection.CallBack value: ", this._hubConnection.CallBack);
            // eslint-disable-next-line no-console
            console.log(ex);
          });
        } else if (value !== undefined && value2 !== undefined) {
          await this._hubConnection.invoke(_name, value, value2).catch((ex) => {
            // eslint-disable-next-line no-console
            console.log("connection join error value2", this._hubConnection);
            // eslint-disable-next-line no-console
            console.log("connection.HubName value2: ", this._hubConnection.HubName);
            // eslint-disable-next-line no-console
            console.log("connection.CallBack value2: ", this._hubConnection.CallBack);
            // eslint-disable-next-line no-console
            console.log(ex);
          });
        } else if (value === undefined && value2 === undefined){
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

        return this._hubConnection;
        // return await new Promise((resolve, reject) => resolve(this._hubConnection))
      } else {
        return this._hubConnection;
        // return await new Promise((resolve, reject) => resolve(this._hubConnection))
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log("err", err);

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
    // eslint-disable-next-line no-console
    console.log('_hubName _callback ======>' + ' ' + _callback)
    try {
      if (Array.isArray(_callback)) {
        const [name, value, value2] = _callback;
        // eslint-disable-next-line no-console
        // console.log('_hubName======>' + ' ' + name, value + ' ' + value2)

        if (value !== undefined && value2 === undefined) {
          await this._hubConnection.invoke(name, value).catch((ex) => {
            // eslint-disable-next-line no-console
            console.log('connection leave error value', this._hubConnection)
            // eslint-disable-next-line no-console
            console.log('connection.HubName : ', this._hubConnection.HubName)
            // eslint-disable-next-line no-console
            console.log('connection.CallBack : ', this._hubConnection.CallBack)
            // eslint-disable-next-line no-console
            console.log(ex)
          });
        } else if (value !== undefined && value2 !== undefined) {
          await this._hubConnection.invoke(name, value, value2).catch((ex) => {
            // eslint-disable-next-line no-console
            console.log('connection leave error value2', this._hubConnection)
            // eslint-disable-next-line no-console
            console.log('connection.HubName : ', this._hubConnection.HubName)
            // eslint-disable-next-line no-console
            console.log('connection.CallBack : ', this._hubConnection.CallBack)
            // eslint-disable-next-line no-console
            console.log(ex)
          });
        } else if (value === undefined && value2 === undefined) {
          await this._hubConnection.invoke(name).catch((ex) => {
            // eslint-disable-next-line no-console
            console.log('connection leave error not valued', this._hubConnection)
            // eslint-disable-next-line no-console
            console.log('connection.HubName : ', this._hubConnection.HubName)
            // eslint-disable-next-line no-console
            console.log('connection.CallBack : ', this._hubConnection.CallBack)
            // eslint-disable-next-line no-console
            console.log(ex)
          });
        }
      } else {
        return this._hubConnection;
        // return await new Promise((resolve, reject) => resolve(this._hubConnection))
      }
    } catch (err) {}
  }
  ReconnectHubGroup() {
    this.$ctx.store.dispatch('hub/reJoinHubGroup')
  }
}

export default (ctx, inject) => {
  const sgnlrHub = new signalR(ctx);
  ctx.$signalRHub = sgnlrHub;
  inject("signalRHub", sgnlrHub);
  // console.log("export default store", ctx);
  // ctx.$signalRHubConnection = sgnlrHub.Connection();
  // inject("signalRHubConnection", sgnlrHub.Connection());
};
