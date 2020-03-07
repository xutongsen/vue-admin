import store from '@/store'


const { body } = document
const WIDTH = 992 // Bootstrap's responsive design


import { onMounted, onBeforeMount, onBeforeUnmount, watch } from '@vue/composition-api'
export default function ResizeHandler({root}) {

  watch([
    () => root.$route
  ], ([val]) => {
    const device = root.$store.state.app.device
    const opened = root.$store.state.app.sidebar.opened
    
    if (device === 'mobile' && opened) {
      store.dispatch('app/closeSideBar', { withoutAnimation: false })
    }
  })

  onMounted(() => {
    const isMobile = $_isMobile()
    if (isMobile) {
      store.dispatch('app/toggleDevice', 'mobile')
      store.dispatch('app/closeSideBar', { withoutAnimation: true })
    }
    
  })
  onBeforeMount(() => {
    window.addEventListener('resize', $_resizeHandler)
  })
  onBeforeUnmount(() => {
    window.removeEventListener('resize', $_resizeHandler)
  })
  const $_isMobile = () => {
    const rect = body.getBoundingClientRect()
    return rect.width - 1 < WIDTH
  }
  const $_resizeHandler = () => {
    if (!document.hidden) {
      const isMobile = $_isMobile()
      store.dispatch('app/toggleDevice', isMobile ? 'mobile' : 'desktop')

      if (isMobile) {
        store.dispatch('app/closeSideBar', { withoutAnimation: true })
      }
    }
  }
}