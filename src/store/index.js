import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import PusherModule from "@/store/pusher.js";

export default new Vuex.Store({
  modules: {
    'pusher': PusherModule
  },
  state: {
  },
  mutations: {
  },
  actions: {
  },
})
