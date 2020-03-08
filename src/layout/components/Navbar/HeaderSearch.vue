<template>
   <div :class="{'show':show}" class="header-search">
    <svg-icon class-name="search-icon" icon-class="search" @click.stop="click" />
    <el-select
      ref="headerSearchSelect"
      v-model="search"
      :remote-method="querySearch"
      filterable
      default-first-option
      remote
      placeholder="Search"
      class="header-search-select"
      @change="change"
    >
      <el-option v-for="item in options" :key="item.path" :value="item" :label="item.title.join(' > ')" />
    </el-select>
  </div>
</template>

<script>
import { defineComponent,watch, computed, ref  } from '@vue/composition-api'
import path from 'path'
import Fuse from 'fuse.js'
export default defineComponent({
  setup(porps, { root, refs }) {
    const routes = computed(() => {
      // return generateRoutes(root.$store.getters.permission_routes) 
      return root.$store.getters.permission_routes
    })
    // 递归路由 压平
    const generateRoutes = (routes, basePath = '/', prefixTitle = [] ) => {
      let res = []

      for (const router of routes) {
        if (router.hidden) { continue }
        const data = {
          path: path.resolve(basePath, router.path),
          title: [...prefixTitle]
        }
        if (router.meta && router.meta.title) {
          data.title = [...data.title, router.meta.title]

          if (router.redirect !== 'noRedirect') {
            res.push(data)
          }
        }
        
        if (router.children) {
          const tempRoutes = generateRoutes(router.children, data.path, data.title)
          if (tempRoutes.length >= 1) {
            res = [...res, ...tempRoutes]
          }
        }
      }
      return res
    }
    const search = ref('')
    const options = ref([])
    const show = ref(false)
    

    let fuse = undefined

    const click = () => {
      show.value = !show.value
      if ( show ) {
        refs.headerSearchSelect && refs.headerSearchSelect.focus()
      }
    }
    const close = () => {
      refs.headerSearchSelect && refs.headerSearchSelect.blur()
      options.value = []
      show.value = false
    }
    const change = (val) => {
      root.$router.push(val.path)
      search.value = ''
      options.value = []
      root.$nextTick(() => {
        show.value = false
      })
    }
    const initFuse = (list) => {
      fuse = new Fuse(list, {
        shouldSort: true,
        threshold: 0.4,
        location: 0,
        distance: 100,
        maxPatternLength: 32,
        minMatchCharLength: 1,
        keys: [{
          name: 'title',
          weight: 0.7
        }, {
          name: 'path',
          weight: 0.3
        }]
      })
    }
    const querySearch = (query) => {
      console.log(query,'query');
      if (query !== '') {
        options.value = fuse.search(query)
      } else {
        options.value = []
      }
    }

    watch(show,(show, prevShow) => {
      if (show) {
        document.body.addEventListener('click', close)
      } else {
        document.body.removeEventListener('click',close)
      }
    })
    watch(routes,(routes, prevRoutes) => {
      let searchPool = generateRoutes(root.$store.getters.permission_routes) 
      initFuse(searchPool)
    })

    
    return {
      search,
      options,
      show,
      click,
      close,
      change,
      querySearch
    }
      
  }
})
</script>

<style lang="scss" scoped>
.header-search {
  font-size: 0 !important;

  .search-icon {
    cursor: pointer;
    font-size: 18px;
    vertical-align: middle;
  }

  .header-search-select {
    font-size: 18px;
    transition: width 0.2s;
    width: 0;
    overflow: hidden;
    background: transparent;
    border-radius: 0;
    display: inline-block;
    vertical-align: middle;

    /deep/ .el-input__inner {
      border-radius: 0;
      border: 0;
      padding-left: 0;
      padding-right: 0;
      box-shadow: none !important;
      border-bottom: 1px solid #d9d9d9;
      vertical-align: middle;
    }
  }

  &.show {
    .header-search-select {
      width: 210px;
      margin-left: 10px;
    }
  }
}
</style>
