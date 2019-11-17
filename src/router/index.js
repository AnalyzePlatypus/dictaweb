import Vue from 'vue'
import VueRouter from 'vue-router'

import Landing from '@/views/Landing.vue';
import DesktopMode from "@/views/DesktopMode.vue";
import MobileMode from "@/views/MobileMode.vue";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'landing',
    component: Landing
  },
  {
    path: '/desktop',
    name: 'desktop',
    component: DesktopMode
  },
  {
    path: '/mobile',
    name: 'mobile',
    component: MobileMode
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
