import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../store/auth';

const routes = [
  {
    path: '/',
    redirect: '/revenue'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/auth/Login.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/auth/Register.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/revenue',
    component: () => import('../views/RevenueAnalysis.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/inventory',
    component: () => import('../views/InventoryManagement.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/products',
    component: () => import('../views/ProductRegistration.vue'),
    meta: { requiresAuth: true }
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_API_URL),
  routes
});

router.beforeEach(async (to, _from, next) => {
  const authStore = useAuthStore();
  
  // Initialize auth state
  if (!authStore.isInitialized) {
    await authStore.initialize();
  }

  if (to.meta.requiresAuth) {
    if (authStore.isAuthenticated) {
      // Validate token on protected routes
      if (authStore.token && !authStore.isTokenValid(authStore.token)) {
        authStore.logout();
        return next('/login');
      }
      next();
    } else {
      next('/login');
    }
  } else {
    if (authStore.isAuthenticated) {
      next('/');
    } else {
      next();
    }
  }
});

export default router;