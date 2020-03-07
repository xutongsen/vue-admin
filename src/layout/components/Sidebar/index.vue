<template>
  <div :class="{'has-logo':showLogo}">
    <Logo v-if="showLogo" :collapse="isCollapse" />
    
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item v-for="route in permission_routes" :key="route.path" :item="route" :base-path="route.path" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import { ref,defineComponent,mixins, computed, onMounted, } from '@vue/composition-api'
import variables from '@/styles/variables.scss'
let variablesData  = {...variables}

export default defineComponent({
  components: {
    Logo,
    SidebarItem
  },
  setup(props, {root}) {
    const showLogo = computed(() => {
      return root.$store.state.settings.sidebarLogo
    })
    const isCollapse = computed(() => {
      return !root.$store.state.app.sidebar.opened
    })


    const activeMenu = computed(() => {
      const route = root.$route
      const { meta, path } = route

      // 判断是不是该导航上的子路由 且不在 chailren 下
      if( meta.activeMenu ) {
        return meta.activeMenu
      }

      return path
    })

    
    

    const permission_routes = computed(() => {
      return root.$store.getters.permission_routes
    })
    return {
      showLogo,
      isCollapse,
      variables:variablesData,
      permission_routes,
      activeMenu
    }
  }
})
</script>