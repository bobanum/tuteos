import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Laravel from '../views/Laravel.vue'
import LaravelN from '../views/LaravelN.vue'
import LaravelFromTo from '../views/LaravelFromTo.vue'

Vue.use(VueRouter)
const ifNotAuthenticated = (to, from, next) => {
  if (localStorage.token) {
    localStorage.clear();
    next("/");
  } else {
    next();
  }
};
const login = (to, from, next) => {
  if (!to.query.code) {
    next();
    return;
  }
  import("axios").then(data => {
    var axios = data.default;
    axios.get("http://localhost:8000/api/login.php?code="+to.query.code).then(data2 => {
      for (let k in data2.data) {
        localStorage[k] = data2.data[k];  
      }
    });
  });
  // console.log(to, to.query.code);
};


const ifAuthenticated = (to, from, next) => {
  if (localStorage.token) {
    next();
  } else {
    next("/login");
  }
};

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/laravel/:from/:to',
    name: 'LaravelFromTo',
    component: LaravelFromTo,
    beforeEnter: ifAuthenticated
  },
  {
    path: '/laravel',
    name: 'Laravel',
    component: Laravel,
    beforeEnter: ifAuthenticated,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    beforeEnter: login,
  },
  {
    path: '/laravel/:n',
    name: 'LaravelN',
    component: LaravelN,
    beforeEnter: ifAuthenticated
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
