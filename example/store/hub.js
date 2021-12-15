export const state = () => ({
  hubStatus: "a",
});
export const mutations = {};
export const actions = {
  RE_JOIN_HUB_GROUP({ dispatch, rootGetters }, payload) {
    const authToken = this.$eatTheCookies.get(process.env.APP_SLUG + "_auth");

    if (authToken) {
      dispatch("wallet/GET_WALLET", rootGetters["user/userInformation"].guid, {
        root: true,
      });
      dispatch(
        "user/getUserNotifications",
        rootGetters["user/userInformation"].guid,
        {
          root: true,
        }
      );
      dispatch(
        "market/getUserOrdersLite",
        rootGetters["user/userInformation"].guid,
        {
          root: true,
        }
      );
    }
    dispatch("market/getMarketOrders", rootGetters["market/activeMarketGuid"], {
      root: true,
    });
    dispatch(
      "summaries/SET_MARKET_SUMMARIES",
      rootGetters["market/activeMarketGuid"],
      {
        root: true,
      }
    );
  },
};
export const getters = {};
