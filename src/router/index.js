import Vue from "vue";
import VueRouter from "vue-router";

/* 页面框架 */
import Layout from '@/layout'

Vue.use(VueRouter);

export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
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
    redirect: 'noRedirect',
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
        name: 'Member',
        meta: {
          title: 'Marketing Member',
          roles: ['admin', 'editor'],
          icon: 'documentation'
        }
      },
      {
        path: 'member1',
        component: () => import("../views/member/index.vue"),
        name: 'Member1',
        meta: {
          title: 'Marketing Member1',
          roles: ['admin', 'editor'],
          icon: 'documentation'
        }
      },
      {
        path: 'member2',
        component: () => import("../views/member/index.vue"),
        name: 'Member2',
        meta: {
          title: 'Marketing Member2',
          roles: ['admin', 'editor'],
          icon: 'documentation'
        }
      },
      {
        path: 'member3',
        component: () => import("../views/member/index.vue"),
        name: 'Member3',
        meta: {
          title: 'Marketing Member3',
          roles: ['admin', 'editor'],
          icon: 'documentation'
        }
      },
      {
        path: 'member4',
        component: () => import("../views/member/index.vue"),
        name: 'Member4',
        meta: {
          title: 'Marketing Member4',
          roles: ['admin', 'editor'],
          icon: 'documentation'
        }
      },
      {
        path: 'member5',
        component: () => import("../views/member/index.vue"),
        name: 'Member5',
        meta: {
          title: 'Marketing Member4',
          roles: ['admin', 'editor'],
          icon: 'documentation'
        }
      }
      ,
      {
        path: 'member6',
        component: () => import("../views/member/index.vue"),
        name: 'Member6',
        meta: {
          title: 'Marketing Member4',
          roles: ['admin', 'editor'],
          icon: 'documentation'
        }
      }
      ,
      {
        path: 'member7',
        component: () => import("../views/member/index.vue"),
        name: 'Member7',
        meta: {
          title: 'Marketing Member4',
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
