import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Laravel from '../views/Laravel.vue'
import LaravelN from '../views/LaravelN.vue'
import LaravelFromTo from '../views/LaravelFromTo.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/laravel/:from/:to',
    name: 'LaravelFromTo',
    component: LaravelFromTo
  },
  {
    path: '/laravel',
    name: 'Laravel',
    component: Laravel
  },
  {
    path: '/laravel/:n',
    name: 'LaravelN',
    component: LaravelN
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
