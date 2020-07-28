import Vue from "vue";
import Router from "vue-router";
import LoginFrom from "./components/auth/LoginFrom";
import LandingPage from './components/LandingPage';
import Profile from './components/Profile'

// import Profile from "./components/Profile";
import Register from './components/auth/registeration_form';
// import store from "./State"

Vue.use(Router);

const router= new Router({
    mode:"history",
    routes: [
        {
            path:"/home",
            name:"LandingPage",
            component:LandingPage
        },
        {
            path:"/profile" || '/:id',
            name:"Profile",
            component:Profile
        },
       
        {
            path:"/Login",
            name: "Login",
            component:LoginFrom,
           
        },

        
        {
            path:'/Signup',
            name:'Signup',
            component:Register
        }

    ]
})

// router.beforeEach((to, from, next)=>{
//     if(to.meta.requiresAuth){
//         //need login
//         if(!store.authenticatedUser){
//             next({
//                 path: "Login"
//             })
//         }else{
//             next()        
//             }
//         }else{
//         next()
//     }
// })

export default router;