<template>
  <div class="drawer-container">
    <div>
      <h3 class="drawer-title">页面设置</h3>

      <div class="drawer-item">
        <span>颜色选择器</span>
        <theme-picker style="float: right;height: 26px;margin: -3px 8px 0 0;" @change="themeChange" />
      </div>

      <div class="drawer-item">
        <span>导航标题选择器</span>
        <el-switch v-model="tagsView" class="drawer-switch" />
      </div>

      <div class="drawer-item">
        <span>头部固定选择器</span>
        <el-switch v-model="fixedHeader" class="drawer-switch" />
      </div>

      <div class="drawer-item">
        <span>LOGO选择器</span>
        <el-switch v-model="sidebarLogo" class="drawer-switch" />
      </div>

    </div>
  </div>
</template>

<script>
import ThemePicker from './ThemePicker'
import { defineComponent, computed, components } from '@vue/composition-api'
export default defineComponent({
  components: { ThemePicker },
  setup(props, {root, refs}) {
    const fixedHeader = computed({
      get: () => {
        return root.$store.state.settings.fixedHeader
      },
      set: (val) => {
        root.$store.dispatch('settings/changeSetting', {
          key: 'fixedHeader',
          value: val
        })
      }
    })
    
    const tagsView = computed({
      get: () => {
        return root.$store.state.settings.tagsView
      },
      set: (val) => {
        root.$store.dispatch('settings/changeSetting', {
          key: 'tagsView',
          value: val
        })
      }
    })

    const sidebarLogo = computed({
      get: () => {
        return root.$store.state.settings.sidebarLogo 
      },
      set: (val) => {
        root.$store.dispatch('settings/changeSetting', {
          key: 'sidebarLogo',
          value: val
        })
      }
    })

    const themeChange = (val) => {
      root.$store.dispatch('settings/changeSetting', {
        key: 'theme',
        value: val
      })
    }

    return {
      fixedHeader,
      tagsView,
      sidebarLogo,
      themeChange
    }
  }
})

</script>

<style lang="scss" scoped>
.drawer-container {
  padding: 24px;
  font-size: 14px;
  line-height: 1.5;
  word-wrap: break-word;

  .drawer-title {
    margin-bottom: 12px;
    color: rgba(0, 0, 0, .85);
    font-size: 14px;
    line-height: 22px;
  }

  .drawer-item {
    color: rgba(0, 0, 0, .65);
    font-size: 14px;
    padding: 12px 0;
  }

  .drawer-switch {
    float: right
  }
}
</style>
