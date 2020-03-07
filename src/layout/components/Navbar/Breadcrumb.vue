<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <transition-group name="breadcrumb">
     <el-breadcrumb-item v-for="(item,index) in levelList.data" :key="item.path">
        <span v-if="item.redirect==='noRedirect'||index==levelList.data.length-1" class="no-redirect">{{ item.meta.title }}</span>
        <a v-else @click.prevent="handleLink(item)">{{ item.meta.title }}</a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script>
import { defineComponent, props, onMounted, reactive, ref, watch } from '@vue/composition-api';
import { urlEncode } from '@/utils/app'
import { compile } from 'path-to-regexp';

export default defineComponent({
  setup(props, {root}) {
    watch([() => root.$route],([data]) => {
       if ( getBreadcrumb ){
         getBreadcrumb()
       }
    })
    let levelList = reactive({
      data:[]
    })
    const getBreadcrumb = () => {
      let matched = root.$route.matched.filter(item => item.meta && item.meta.title)
      const first = matched[0]
      if (!isHome(first)) {
        matched = [{ path: '/home', meta: { title: 'Home' }}].concat(matched)
      }

      levelList.data = matched.filter(item => item.meta && item.meta.title && item.meta.breadcrumb !== false).map(item => item)
    }
    const isHome = (route) => {
      const name = route && route.name
      if (!name) {
        return false
      }
      return name.trim().toLocaleLowerCase() === 'Home'.toLocaleLowerCase()
    }

    
    const pathCompile = (path) => {
      const { params, query } = root.$route
    
      // https://www.npmjs.com/package/path-to-regexp 使用文档
      let toPath = compile("/user/:id")
      
      path = toPath({ id: 123 }) + urlEncode(query,1)

      return path
     

    }
    const handleLink = (item) => {
      const { redirect, path } = item
      if (redirect) {
        this.$router.push(redirect)
        return
      }

      // 如要加 params 或 query path 调用一下 pathCompile
      // pathCompile(path)
      
      root.$router.push(path)
    
    }
    onMounted(() => {
      getBreadcrumb()
    })
    return {
     levelList,
     handleLink
    }
  }
})
</script>

<style lang="scss" scoped>
.app-breadcrumb.el-breadcrumb {
  display: inline-block;
  font-size: 14px;
  line-height: 50px;
  margin-left: 8px;

  .no-redirect {
    color: #97a8be;
    cursor: text;
  }
}
</style>