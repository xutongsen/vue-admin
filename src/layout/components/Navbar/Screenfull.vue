<template>
<div>
    <svg-icon :icon-class="isFullscreen?'exit-fullscreen':'fullscreen'" @click="fullscreenClick" />
</div>

</template>

<script>
import screenfull from 'screenfull'

import { defineComponent, ref, onMounted, onUnmounted, props } from '@vue/composition-api';
export default defineComponent({
  setup(props, {root}) {
    const isFullscreen = ref(false)

    const change = () => {
      isFullscreen.value = screenfull.isFullscreen
    }

    const init = () => {
       if (screenfull.isEnabled) {
        screenfull.on('change', change)
      }
    }
    const destroy = () => {
      if (screenfull.isEnabled) {
        screenfull.off('change', change)
      }
    }
    const fullscreenClick = () => {
      
      if (!screenfull.isEnabled) {
        root.$message({
          message: 'you browser can not work',
          type: 'warning'
        })
        return false
      }
      screenfull.toggle()
    }
    onMounted(() => {
      init()
    })
    onUnmounted(() => {
      destroy()
    })
    return {
      isFullscreen,
      fullscreenClick
    }

  }
})
</script>