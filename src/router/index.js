import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import PasswordView from '../views/PasswordView.vue';
const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'password',
            component: PasswordView
        },
        {
            path: '/home',
            name: 'home',
            component: HomeView,
            meta: { requiresAuth: true }
        }
    ]
});
// 路由守卫 - 验证密码
router.beforeEach((to, from, next) => {
    const isAuthenticated = localStorage.getItem('authenticated') === 'true';
    if (to.meta.requiresAuth && !isAuthenticated) {
        next('/');
    }
    else if (to.path === '/' && isAuthenticated) {
        next('/home');
    }
    else {
        next();
    }
});
export default router;
