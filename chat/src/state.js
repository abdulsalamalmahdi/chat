import Vuex from "vuex";
import Vue from "vue";
import axios from "axios";

Vue.use(Vuex);
axios.defaults.baseURL = "http://localhost:3000";
const state = {
  user: {},
  messages:[],
  users: [],
  token: localStorage.getItem("user_token") || null,
  status: "",
};
const getters = {
  getUser: (state) => {
   
    return state.user;
  },
  getUsers: (state) => {
    return state.users;
  },
  loggedIn: (state) => !!state.token,
  getMsgs: (state) => {
  // console.log(state.messages)
    return state.messages;
  },
};

const actions = {

  removeUser({commit}){
    commit("removeUser")
  },
  retrieveToken({dispatch, commit, state},opts) {
     //console.log(opts)
    return new Promise( (resolve, reject) => {
     
      axios
        .post("/login", opts)
        .then( (res) => {
          //console.log(res)
          const token = res.data.token;
          const _id = res.data.user._id;
         // console.log(res.data.user._id);
          localStorage.setItem("user_token", token);
          localStorage.setItem("_id", _id);
         
            setTimeout(()=>{
              localStorage.removeItem('user_token');
              localStorage.removeItem('_id')
            }, 3600000);
         
           commit("retrieveToken", token);
           console.log(state.user._d);
            dispatch("retrieveUser");
            // this.$router.push('/profile')
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
 async retrieveUsers({ commit }) {
    
    return new Promise((resolve, reject)=>{
        axios.get('/users')
        .then(res =>{
         // console.log(res.data)
          commit("retrieveUsers", res.data);
          
          resolve(res)
        }).catch(err =>{
          //console.log(err)
          reject(err)
        })
    })
   
  },
  async retrieveUser({ commit, state }) {
    const _id = await localStorage.getItem("_id");
  //  console.log(_id);
    return new Promise((resolve, reject) => {
     // console.log( state.token)
     
    
    // console.log("Bearer "+ (state.token))
       axios.defaults.headers.common = {Authorization:  "Bearer " + state.token}
 
      axios
        .get(`/users/${_id}`)
        .then(async (res) => {
      //  console.log(res)
       const opts={user: res.data.user, messages: res.data.messages}
          commit("retrieveUser",opts );
          resolve(res);
        })
        .catch((err) => {
        //  console.log(err)
          if(err.response.status === 401 ){
             localStorage.removeItem('user_token');
             localStorage.removeItem('_id')

          }else if (err.request){
           console.log(err.request);
          }else{
            console.log('Error',err.message)
          }
          console.log(err);
          reject(err);
        });
    });
  },
  setImageAction({ commit }, image) {
    console.log("image action");
    commit({
      type: "setImage",
      image,
    });
  },
  set_auth_status_action({ commit }) {
    let auth_status = JSON.parse(localStorage.getItem("user_token"));

    commit({
      type: "set_auth_status",
      auth_status,
    });
  },
};

const mutations = {
  retrieveToken(state, token) {
    state.token = token;
  },
  retrieveUser(state, opts) {
    state.user = opts.user;
    state.messages= opts.messages
   // console.log(state.messages)
  
  },
  retrieveUsers(state, users) {
    state.users = users;
    
  },
  setImage(state, image) {
    //console.log("setting " + image);
    state.authenticatedUser = { image };
  },
  removeUser(state) {
    localStorage.removeItem('user_token');
    localStorage.removeItem('_id');
     state.token = '';

    
  },
  set_auth_status(state, auth_status) {
    state.authStatus = auth_status;
  },
};

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions,
});
