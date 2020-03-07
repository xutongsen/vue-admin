import Vue from "vue";
import VueRouter from "vue-router";

/* 页面框架 */
import Layout from '@/layout'

Vue.use(VueRouter);

export const constantRoutes = [
  {
    path: "/",
    component: Layout,
    redirect: '/home',
    children: [
      {
        path: 'home',
        component: () => import('@/views/home/index'),
        name: 'Home',
        meta: { title: 'Home', icon: 'dashboard', affix: true }
      }
    ]
  },
  {
    path: "/login",
    name: "Login",
    hidden: true,
    meta: {
      name: "登录"
    },
    component: () => import("../views/login/index.vue")
  },
  {
    path: "/404",
    name: "404",
    hidden: true,
    meta: {
      name: "404错误"
    },
    component: () => import("../views/error-page/404")
  },

];
const createRouter = () => new VueRouter({
  scrollBehavior: () => ({y:0}),
  routes: constantRoutes
});
const router = createRouter()


export const asyncRoutes = [
  {
    path: '/user',
    component: Layout,
    redirect: '/user/index',
    meta: {
      title: 'User',
      roles: ['admin', 'editor'],
    },
    children:[
      {
        path: 'index',
        component: () => import("../views/user/index.vue"),
        name: 'PageUser',
        meta: {
          title: 'PageUser',
          roles: ['admin', 'editor'], // or you can only set roles in sub nav
          icon: 'documentation'
        }
      }
    ]
  },
  {
    path: '/marketing',
    component: Layout,
    redirect: 'noRedirect',
    meta: {
      title: 'Marketing',
      roles: ['admin', 'editor'],
      icon: 'documentation'
    },
    children:[
      {
        path: 'index',
        component: () => import("../views/marketing/index.vue"),
        name: 'Marketing',
        meta: {
          title: 'MarketingIndex',
          roles: ['admin', 'editor'], // or you can only set roles in sub nav
          icon: 'documentation'
        }
      },
      {
        path: 'member',
        component: () => import("../views/member/index.vue"),
        meta: {
          title: 'Marketing Member',
          roles: ['admin', 'editor'],
          icon: 'documentation'
        }
      }
    ]
  },

  

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

// 注销路由
export function resetRouter() {
  const newRouter = createRouter()
  // 清空路由缓存
  router.matcher = newRouter.matcher 
}


export default router;
