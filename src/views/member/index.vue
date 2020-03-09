<template>
  <div class="app-container">
    <aside>
      The guide page is useful for some people who entered the project for the first time. You can briefly introduce the
      features of the project. Demo is based on
      <a href="https://github.com/kamranahmedse/driver.js" target="_blank">driver.js.</a>
    </aside>
    <el-button icon="el-icon-question" type="primary" @click.prevent.stop="guide">
      Show Guide
    </el-button>
  </div>
</template>

<script>
import Driver from 'driver.js' // import driver.js
import 'driver.js/dist/driver.min.css' // import driver.js css
import steps from './steps'
import { defineComponent, onMounted } from '@vue/composition-api';

export default defineComponent({
  name: 'Guide',
  setup(props, { root }) {
    let driver = null
    onMounted(() => {
      driver = new Driver()
    })
    const guide = () => {
      driver.defineSteps(steps)
      driver.start()
    }
    return {
      guide
    }
  }
})


</script>
