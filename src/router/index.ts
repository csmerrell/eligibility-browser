import { createRouter, createWebHistory } from 'vue-router'
import EligibilityDashboard from '@/views/eligibility/EligibilityDashboard.vue' // Adjust the path as needed

const routes = [
  {
    path: '/',
    name: 'EligibilityDashboard',
    component: EligibilityDashboard
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
