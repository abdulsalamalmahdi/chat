import Vue from "vue";
import Router from "vue-router";
import LoginFrom from "./components/auth/LoginFrom";
import LandingPage from './components/LandingPage';
import Profile from './components/Profile';
import about from './components/about';
import Logout from './components/auth/logout';
import message from './components/message';
import store from '../src/state'

// import Profile from "./components/Profile";
import Register from './components/auth/registeration_form';

// import store from "./State"

Vue.use(Router);

const router= new Router({
    mode:"history",
    routes: [
        {
            path:"/logout",
            name:"Logout",
            component:Logout,
            meta:{
                requiresAuth:true
            }   
        },
        {
            path:"/home",
            name:"LandingPage",
            component:LandingPage
        },
        {
            path:"/Profile" || '/:id',
            name:"Profile",
            component:Profile,
            meta:{
                requiresAuth:true
            }
        },
       
        {
            path:"/login",
            name: "login",
            component:LoginFrom,
           
        },

        
        {
            path:'/Signup',
            name:'Signup',
            component:Register
        },
        {
            path:'/about',
            name:'about',
            component:about
        },
        {
            path:'/texts/:_id',
            name:'message',
            component:message,
            meta:{
                requiresAuth:true
            }
        },
        
    ]
})

router.beforeEach(async function(to, from, next){
    
    if(to.meta.requiresAuth){
        //need login
        console.log(store.getters.loggedIn)
        if(!store.getters.loggedIn){
            next({
                path: "/login"
            })
        }else{
            next()        
            }
        }else{
        next()
    }
})

export default router;