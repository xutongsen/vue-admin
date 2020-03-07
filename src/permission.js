import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css'
import { getToken } from '@/utils/app' // get token from cookie

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // 不需要做登陆的数组

router.beforeEach(async(to, from, next) => {
  NProgress.start()

  // 获取cookie
  const hasToken = getToken()

  if (hasToken) {

    if (to.path === '/login') {

      next({ path: '/' })
      NProgress.done()

    } else {
      const hasRoles = store.getters.roles && store.getters.roles.length > 0

      if ( hasRoles ) {
        next()
      
      } else {
   
        try {
          const { roles } = await store.dispatch('user/getInfo')

          // 获取权限路由 
          const accessRoutes = await store.dispatch('permission/generateRoutes', roles)

          // 添加路由
          router.addRoutes(accessRoutes)
          
          next({ ...to, replace: true })
        } catch (error) {
          // 清空token
          await store.dispatch('user/resetToken')

          typeof error === 'string'  && Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)

          NProgress.done()
        }
      } 
    }

  } else {

    if (whiteList.indexOf(to.path) !== -1) {
      // 不需要做登陆的数组
      next()

    } else {

      // 保存路由
      next(`/login?redirect=${to.path}`)
      NProgress.done()

    }


  }
})


router.afterEach(() => {
  // 关闭进度
  NProgress.done()
})