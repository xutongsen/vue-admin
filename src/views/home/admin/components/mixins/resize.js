import { debounce } from '@/utils/app'

import { onMounted, onActivated, onDeactivated, onBeforeUnmount } from '@vue/composition-api'


export default function(root,chartObj) {
  let resizeHandler = null
  let sidebarElm = null
  const initResizeEvent = () => {
    window.addEventListener('resize', resizeHandler)
  }

  const destroyResizeEvent = () => {
    window.removeEventListener('resize', resizeHandler)
  }

  const sidebarResizeHandler = (e) =>  {
    if (e.propertyName === 'width') {
      resizeHandler()
    }
  }
  const initSidebarResizeEvent = () =>  {
    sidebarElm = document.getElementsByClassName('sidebar-container')[0]
    sidebarElm && sidebarElm.addEventListener('transitionend', sidebarResizeHandler)
  }
  const destroySidebarResizeEvent = () => {
    sidebarElm && sidebarElm.removeEventListener('transitionend', sidebarResizeHandler)
  }
  onMounted(() => {
    root.$nextTick(() => {
      if (chartObj.chart) {
        resizeHandler = debounce(() => {
          if (chartObj.chart) {
            chartObj.chart.resize()
          }
        }, 100)
        initResizeEvent()
        initSidebarResizeEvent()
      }
    })
  })

  onBeforeUnmount(() =>{
    destroyResizeEvent()
    destroySidebarResizeEvent()
  })

  onActivated(() => {
    initResizeEvent()
    initSidebarResizeEvent()
  })

  onDeactivated(() => {
    destroyResizeEvent()
    destroySidebarResizeEvent()
  })

}
