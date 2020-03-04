import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import { getToken } from '@utils/app' // get token from cookie

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  NProgress.start()

  // 获取cookie
  const hasToken = getToken()

  if (hasToken) {

    if (to.path === '/login') {

      next({ path: '/' })
      NProgress.done()

    } else {

    }

  } else {

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
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