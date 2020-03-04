import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

export const constantRoutes = [
  {
    path: "/",
    redirect: "login",
    hidden: true,
    meta: {
      name: "主页"
    }
  },
  {
    path: "/login",
    name: "Login",
    hidden: true,
    meta: {
      name: "登录"
    },
    component: () => import("../views/Login/index.vue")
  },
  {
    path: "/404",
    name: "404",
    hidden: true,
    meta: {
      name: "404错误"
    },
    component: () => import("../views/Error/index.vue")
  },
  
  
];
const createRouter = () => new VueRouter({
  scrollBehavior: () => ({y:0}),
  routes: constantRoutes
});
const router = createRouter()


// 注销路由
export function resetRouter() {
  const newRouter = createRouter()
  // 清空路由缓存
  router.matcher = newRouter.matcher 
}


export default router;
