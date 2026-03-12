import Vue from "vue";
import Vuex from "vuex";

import raceStore from "./raceStore";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    raceStore,
  },
});
