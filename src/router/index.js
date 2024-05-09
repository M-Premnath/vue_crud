import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import StudentView from '../views/students/View.vue'
import StudentCreate from '../views/students/Create.vue'
import StudentEdit from '../views/students/Edit.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/students',
      name: 'students',
      component: StudentView
    },
    {
      path: '/students/create',
      name: 'studentsCreate',
      component: StudentCreate // uncommented this line
    },
    {
      path: '/students/:id',
      name: 'studentsEdit',
      component: StudentEdit // uncommented this line
    },
  ]
})

export default router