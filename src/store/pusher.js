import Pusher from 'pusher-js';

const state = {
  app_id: process.env.VUE_APP_PUSHER_APP_ID,
  key: process.env.VUE_APP_PUSHER_KEY,
  cluster: process.env.VUE_APP_PUSHER_CLUSTER,
  pusherInstance: undefined,
  channels:{},
  queuedActions: []
};

export const getters = {
  getChannel(state) {
    return state.pusherInstance.channel(channel_id);
  },
  connectionState(state) {
    return (state.pusherInstance && state.pusherInstance.connection && state.pusherInstance.connection.state) || "not_initialized";
  }
};



export const mutations = {
 
};

export const actions = {
  init({state, dispatch}, role) {
    // Pusher.log = function (message) {
    //   if (window.console && window.console.log) { window.console.log(message); }
    // };

    state.pusherInstance = new Pusher(state.key, { 
      cluster: state.cluster,
      forceTLS: true,
      authEndpoint: process.env.VUE_APP_PUSHER_AUTH_ENDPOINT + "?role=" + role,
    });
    state.pusherInstance.logToConsole = true;
    
    var callback = function(eventName, data) {
      console.log(`bind global: The event ${eventName} was triggered with data ${JSON.stringify(data)}`);
    };

    dispatch('executeQueue');

    // bind to all events on the connection
    state.pusherInstance.bind_global(callback);
    state.pusherInstance.bind('pusher:error', (e) => console.log(e));
    state.pusherInstance.bind('state_change', (e) => console.log(e))
  },

  subscribe({state}, {channel_id, onSuccess, onFailure}) {
    const channel = state.pusherInstance.subscribe(channel_id);
    channel.bind('pusher:subscription_succeeded', onSuccess);
    channel.bind('pusher:subscription_error', onFailure);
  },


  unsubscribe({state}, channel_id) {
    console.log(`unsubscribe: ${channel_id}`);
    if(!state.pusherInstance) {
      state.queuedActions.push({ action: 'unsubscribe', payload: {channel_id} })
      return;
    }
    return state.pusherInstance.unsubscribe(channel_id);
  },

  bind({state}, {eventName, channel_id, callback}) {
    // console.log(`bind: ${channel_id}:${eventName}`);
    if(!state.pusherInstance || !state.pusherInstance.channel(channel_id)) {
      state.queuedActions.push({ action: 'bind', payload: {eventName, channel_id, callback} });
      console.log("Pusher not initialized. Queuing.");
      
      return;
    }
    state.pusherInstance.channel(channel_id).bind(eventName, callback);
  },
  unbind({state}, {channel_id, eventName}) {
    console.log(`unbind: ${channel_id}:${eventName}`);
    state.pusherInstance.channel(channel_id).unbind(eventName);
  },
  trigger({state}, {channel_id, eventName, data}) {
    console.log(`trigger: ${channel_id}:${eventName} ${data}`);
    return state.pusherInstance.channel(channel_id).trigger(eventName, data);
  },
  executeQueue({state, dispatch}) {
    console.log('Executing queue');
    
    state.queuedActions.forEach(action => {
      console.log(`${action.action} ${action.payload}`);
      
      dispatch(action.action, action.payload);
    }) 
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}