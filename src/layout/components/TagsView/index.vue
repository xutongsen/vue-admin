<template>
  <div id="tags-view-container" class="tags-view-container">
    <scroll-pane ref="scrollPane" class="tags-view-wrapper">
      
      <router-link
        v-for="tag in visitedViews"
        ref="tag"
        :key="tag.path"
        :class="isActive(tag)?'active':''"
        :to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }"
        tag="span"
        class="tags-view-item"
        @click.middle.native="!isAffix(tag)?closeSelectedTag(tag):''"
        @contextmenu.prevent.native="openMenu(tag,$event)"
      >
        {{ tag.title }}
        <span v-if="!isAffix(tag)" class="el-icon-close" @click.prevent.stop="closeSelectedTag(tag)" />
      </router-link>
      
    </scroll-pane>
    <ul v-show="visible" :style="{left:left+'px',top:top+'px'}" class="contextmenu">
      <li @click="refreshSelectedTag(selectedTag.value)">Refresh</li>
      <li v-if="!isAffix(selectedTag.value)" @click="closeSelectedTag(selectedTag.value)">Close</li>
      <li @click="closeOthersTags">Close Others</li>
      <li @click="closeAllTags(selectedTag.value)">Close All</li>
    </ul>
  </div>
</template>


<script>
import { defineComponent, computed, ref, onMounted, watch, components, reactive } from '@vue/composition-api'
import ScrollPane from './ScrollPane'
import path from 'path'
export default defineComponent({
  components:{ ScrollPane },
  setup(props, { root, refs }) {

    // 数据 
    const routes = computed(() => {
      return root.$store.state.permission.routes
    })

    const visitedViews = computed(() => {
      return root.$store.state.tagsView.visitedViews
    })

    const route = computed(() => {
      return root.$route
    })

    const visible = ref(false)
    

    const affixTags = ref([])
    
    const left = ref(0)

    const top = ref(0)
    
    const selectedTag = reactive({
      value: {}
    })

        // 方法
    const filterAffixTags = (routes, basePath = '/') => {
      let tags = []
      
      routes.forEach( routeItem => {
        if ( routeItem.meta && routeItem.meta.affix ) {
          const tagPath = path.resolve(basePath, routeItem.path)
          tags.push({
            fullPath: tagPath,
            path: tagPath,
            name: routeItem.name,
            meta: { ... routeItem.meta }
          })
          
        }
        if ( routeItem.children ) {
          const temTags = filterAffixTags( routeItem.children, routeItem.path )
          if ( temTags.length >= 1 ) {
            tags = [...tags, ...temTags]
          }
        }
      })
      return tags
    }

  
    

    const moveToCurrentTag = () => {
     
      root.$nextTick(() => {
        let tags = refs.tag
        for (const tag of tags) {
          if (tag.to.path === root.$route.path) {
            refs.scrollPane.moveToTarget(tag)
     
            if (tag.to.fullPath !== root.$route.fullPath) {
              root.$store.dispatch('tagsView/updateVisitedView', root.$route)
            }
            break
          }
        }
      })
    }
    const initTags = () => {

      
      affixTags.value = filterAffixTags(routes.value)
      
      for(let tag of affixTags.value) {
        if( tag.name ) {
          root.$store.dispatch('tagsView/addVisitedView', tag)
        }
      }
    }

    initTags()

    const addTags = () => {
      const { name } = root.$route
      if ( name ) {
        root.$store.dispatch('tagsView/addView', root.$route)
      }
      return false
    }

    const openMenu = (tag, e) => {
      const offsetLeft = root.$el.getBoundingClientRect().left // container margin left
      const offsetWidth = root.$el.offsetWidth // container width
      const leftData = e.target.offsetLeft // 15: margin right
      
      left.value = leftData

      top.value = e.clientY
      visible.value = true
      selectedTag.value = tag
    }

    const closeOthersTags = () => {
      if( selectedTag.value.path !== route.value.path ) {
         root.$router.push(selectedTag.value)
      }
      root.$store.dispatch('tagsView/delOthersViews', selectedTag.value).then(() => {
        moveToCurrentTag()
      })
    }


    const isActive = (routeData) => {
      return routeData.path === route.value.path
    }

    const isAffix = (tag) => {
      return tag.meta && tag.meta.affix
    }
    
    const toLastView = (visitedViews, view) => {
      const latestView = visitedViews.slice(-1)[0]

      if (latestView) {

        root.$router.push(latestView.fullPath)

      } else {
        if (view.name === 'Home') {
          // to reload home page
          root.$router.replace({ path: '/redirect' + view.fullPath })
        } else {
          root.$router.push('/')
        }
      }
    }

    const refreshSelectedTag = (view) => {
      root.$store.dispatch('tagsView/delCachedView', view).then(() => {
        const { fullPath } = view
    
        root.$nextTick(() => {
          root.$router.replace({
            path: '/redirect/' + fullPath
          })
        })
      })
    }

    const closeSelectedTag = (view) => {
      root.$store.dispatch('tagsView/delView', view).then(({ visitedViews }) => {
        if (isActive(view)) {
          toLastView(visitedViews, view)
        }
      })
    }

    const closeMenu = () => {
      visible.value = false
    }

    const closeAllTags = (view) => {
      root.$store.dispatch('tagsView/delAllViews').then(({ visitedViews }) => {
        if (affixTags.value.some(tag => tag.path === view.path)) {
          return
        }
        toLastView(visitedViews, view)
      })
    }

    //监听
    watch(route,(route) => {
      if ( addTags ) {
        addTags()
      }
      if( moveToCurrentTag ) {
        moveToCurrentTag()
      }
    })

    watch(visible,(visible) => {
       if (visible) {
        document.body.addEventListener('click', closeMenu)
      } else {
        document.body.removeEventListener('click', closeMenu)
      }
    })





    return {
      openMenu,
      visitedViews,
      isActive,
      isAffix,
      closeSelectedTag,
      visible,
      top,
      left,
      refreshSelectedTag,
      selectedTag,
      closeSelectedTag,
      closeOthersTags,
      closeAllTags
    }
    

    
  }
})
</script>

<style lang="scss" scoped>
.tags-view-container {
  height: 34px;
  width: 100%;
  background: #fff;
  border-bottom: 1px solid #d8dce5;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, .12), 0 0 3px 0 rgba(0, 0, 0, .04);
  .tags-view-wrapper {
    .tags-view-item {
      display: inline-block;
      position: relative;
      cursor: pointer;
      height: 26px;
      line-height: 26px;
      border: 1px solid #d8dce5;
      color: #495060;
      background: #fff;
      padding: 0 8px;
      font-size: 12px;
      margin-left: 5px;
      margin-top: 4px;
      &:first-of-type {
        margin-left: 15px;
      }
      &:last-of-type {
        margin-right: 15px;
      }
      &.active {
        background-color: #42b983;
        color: #fff;
        border-color: #42b983;
        &::before {
          content: '';
          background: #fff;
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          position: relative;
          margin-right: 2px;
        }
      }
    }
  }
  .contextmenu {
    margin: 0;
    background: #fff;
    z-index: 3000;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, .3);
    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;
      &:hover {
        background: #eee;
      }
    }
  }
}
</style>

<style lang="scss">
//reset element css of el-icon-close
.tags-view-wrapper {
  .tags-view-item {
    .el-icon-close {
      width: 16px;
      height: 16px;
      vertical-align: 2px;
      border-radius: 50%;
      text-align: center;
      transition: all .3s cubic-bezier(.645, .045, .355, 1);
      transform-origin: 100% 50%;
      &:before {
        transform: scale(.6);
        display: inline-block;
        vertical-align: -3px;
      }
      &:hover {
        background-color: #b4bccc;
        color: #fff;
      }
    }
  }
}
</style>