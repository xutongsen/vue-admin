<template>
  <div class="tab-container">
    <el-tag>mounted times ：{{ createdTimes }}</el-tag>
    <el-alert :closable="false" style="width:200px;display:inline-block;vertical-align: middle;margin-left:30px;" title="Tab with keep-alive" type="success" />
    <el-tabs v-model="activeName" style="margin-top:15px;" type="border-card">
      <el-tab-pane v-for="item in tabMapOptions" :key="item.key" :label="item.label" :name="item.key">
        <keep-alive>
          <tab-pane v-if="activeName==item.key" :type="item.key" @create="showCreatedTimes" />
        </keep-alive>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import tabPane from './components/TabPane'

import { defineComponent, components, watch, ref } from '@vue/composition-api'

export default defineComponent ({
  name: 'Tab',
  components: { tabPane },
  setup(props, { root, refs }) {
    const activeName = ref('CN')
    const createdTimes  = ref(0)
    const tabMapOptions = [
      { label: 'China', key: 'CN' },
      { label: 'USA', key: 'US' },
      { label: 'Japan', key: 'JP' },
      { label: 'Eurozone', key: 'EU' }
    ]
    const showCreatedTimes = () => {
      createdTimes.value += 1
    }
    const tab = root.$route.query.tab
    if (tab) {
      activeName.value = tab
    }

    watch(activeName,(val) => {
      root.$router.push(`${root.$route.path}?tab=${val}`)
    })

    return {
      activeName,
      createdTimes,
      tabMapOptions,
      showCreatedTimes
    }
  }
})

</script>

<style scoped>
  .tab-container {
    margin: 30px;
  }
</style>
