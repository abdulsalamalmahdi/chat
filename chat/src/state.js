import Vuex from "vuex";
import Vue from "vue";

Vue.use(Vuex);
export default new Vuex.Store({
  state: {
    authenticatedUser: '',
    
    status: "",
    isAuthenticated:'',
  },
  getters: {
    getAuthenticatedUser: (state) => {
      console.log(state.authenticatedUser);
      return state.authenticatedUser;
    },
    isAuthenticated: state => !!state.token,

    authStatus: state => state.status,
  },

  actions: {
    setAuthenticatedUserAction({ commit }, user) {
      commit({
        type: "setAuthenticatedUser",
        ...user,
      });
      console.log("action");
      console.log(this.state.authenticatedUser);
    },
    setImageAction({ commit }, image) {
      console.log("image action");
      commit({
        type: "setImage",
        image,
      });
    },
    removeUserAction({commit}){
      commit({
        type:"removeUser"
      })
    },
    set_auth_status_action({commit}){
      let auth_status= JSON.parse(localStorage.getItem('user_token'));

      commit({
        type:"set_auth_status",
        auth_status
      })
    }
  },

  mutations: {
    setAuthenticatedUser(state, authenticatedUser) {
      
      state.authenticatedUser = { ...authenticatedUser };

      console.log(authenticatedUser);
      console.log("mutated");
      console.log(this.state.authenticatedUser);
    },
    setImage(state, image) {
      console.log("setting " + image);
      state.authenticatedUser = { image };
    },
    removeUser(state){
      state.authenticatedUser= ""
    },
    set_auth_status(state, auth_status){
       state.authStatus= auth_status;
    }
  },
});
