import Vue from "vue";
import Router from "vue-router";
import LoginFrom from "./components/auth/LoginFrom";
import LandingPage from './components/LandingPage';
import Profile from './components/Profile';
import about from './components/about';
import Logout from './components/auth/logout';
import message from './components/message';
import store from '../src/state'
import HelloWorld from './components/HelloWorld'
// import Profile from "./components/Profile";
import Register from './components/auth/registeration_form';
import Search from './components/search';


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
            path: "/",
            name:"LandingPage",
            component:LandingPage
        },
        {
            path:"/profile" || '/:id',
            name:"profile",
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
            path:'/register',
            name:'Registeration',
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
        {
            path:'/search',
            name:'Search',
            component:Search,
        },
        {
            path:'/hello',
            name:'HelloWorld',
            component: HelloWorld,
        }
        
    ]
})

router.beforeEach(async function(to, from, next){
    
    if(to.meta.requiresAuth){
        //need login
      //  console.log(store.getters.loggedIn)
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