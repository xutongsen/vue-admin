<template>
  <div :class="classObj"  class="app-wrapper">  
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
    <sidebar class="sidebar-container" />
    <div :class="{hasTagsView:needTagsView}" class="main-container">
      <div :class="{'fixed-header':fixedHeader}">
        <navbar />
        <tags-view v-if="needTagsView" />
      </div>
      <app-main />
      <right-panel v-if="showSettings">
        <settings />
      </right-panel>
    </div>
  </div>
</template>

<script>
import { ref,defineComponent,mixins, computed, onMounted, } from '@vue/composition-api'
import { Sidebar, Navbar, TagsView, AppMain, RightPanel, Settings } from './components'
import ResizeMixin from './mixin/ResizeHandler'

import { mapState } from 'vuex'
export default defineComponent({
  components: { Sidebar, Navbar, TagsView, AppMain, RightPanel,Settings }, 
  setup(props, {root}) {


    onMounted(() => {
   
    })

    const sidebar = computed(() => {
      return root.$store.state.app.sidebar
    })
    

    const device = computed(() => {
      return root.$store.state.app.device
    })
    
    const needTagsView = computed(() => {
      return root.$store.state.settings.tagsView
    })

    const fixedHeader = computed(() => {
      return root.$store.state.settings.fixedHeader
    })
    
    const showSettings = computed(() => {
      console.log(root.$store.state.settings)
      return root.$store.state.settings.showSettings
    })

    
    
    const classObj = computed(() => {    
      return {
        hideSidebar: !sidebar.value.opened,
        openSidebar: sidebar.value.opened,
        withoutAnimation: sidebar.value.withoutAnimation,
        mobile: device.value === 'mobile'
      }
    })

    ResizeMixin({root})

    const handleClickOutside = () => {
       root.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    }
  

  
    return {
      sidebar,
      device,
      handleClickOutside,
      classObj,
      needTagsView,
      fixedHeader,
      showSettings
    }
    
  },
  

})
</script>


<style lang="scss" scoped>
  @import "~@/styles/mixin.scss";
  @import "~@/styles/variables.scss";

  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;

    &.mobile.openSidebar {
      position: fixed;
      top: 0;
    }
  }

  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }

  .fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 9;
    width: calc(100% - #{$sideBarWidth});
    transition: width 0.28s;
  }

  .hideSidebar .fixed-header {
    width: calc(100% - 54px)
  }

  .mobile .fixed-header {
    width: 100%;
  }
</style>
