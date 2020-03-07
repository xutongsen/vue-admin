<template>
  <div v-if="!item.hidden">
    <template v-if="hasOneShowingChild(item.children,item) && (!onlyOneChild.children||onlyOneChild.noShowingChildren)&&!item.alwaysShow">
      <app-link v-if="onlyOneChild.value.meta" :to="resolvePath(onlyOneChild.value.path)">
        <el-menu-item :index="resolvePath(onlyOneChild.value.path)" :class="{'submenu-title-noDropdown':!isNest}">
          <Item :icon="onlyOneChild.value.meta.icon||(item.meta&&item.meta.icon)" :title="onlyOneChild.value.meta.title" />
        </el-menu-item>
      </app-link>
    </template>
    <el-submenu v-else ref="subMenu" :index="resolvePath(item.path)" popper-append-to-body>
  
      <template slot="title">
        <Item v-if="item.meta" :icon="item.meta && item.meta.icon" :title="item.meta.title" />
      </template>
      <sidebar-item
        v-for="child in item.children"
        :key="child.path"
        :is-nest="true"
        :item="child"
        :base-path="resolvePath(child.path)"
        class="nest-menu"
      />
    </el-submenu>
  </div>
</template>


<script>
import path from 'path'
import { ref,reactive,mixins,components,defineComponent } from '@vue/composition-api'
import { isExternal } from '@/utils/validate'
import Item from './Item'
import AppLink from './Link'
import FixiOSBug from './FixiOSBug'


export default defineComponent({
  name: 'SidebarItem',
  props: {
    item: {
      type: Object,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    },
    basePath: {
      type: String,
      default: ''
    }
  },
  mixins:[FixiOSBug],
  components:{AppLink,Item},
  setup(props, { root, refs }) {
   
    let onlyOneChild =  reactive({})

    const hasOneShowingChild = (children = [], parent) => {
      const showingChildren = children.filter(item => {
        if ( item.hidden ) {
          return false
        } else {
          onlyOneChild.value = item
          return true
        }
      })


      if ( showingChildren.length === 1 ) {
        return true
      }

      if ( showingChildren.length === 0 ) {
        onlyOneChild.value = { ... parent, path: '', noShowingChildren: true }
        return true
      }
      
      

      return false
    }

    const resolvePath = (routePath) => {
      if (isExternal(routePath)) {
        return routePath
      }
      if (isExternal(props.basePath)) {
        return props.basePath
      }
      return path.resolve(props.basePath, routePath)
    }

    return {
      hasOneShowingChild,
      resolvePath,
      onlyOneChild
    }

  }
}) 
</script>