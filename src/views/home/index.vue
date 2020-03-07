<template>
  <div>
    <div>sdsdsd</div>
    <component :is="currentRole" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { reactive, ref, isRef, toRefs, onCreated, components, defineComponent} from '@vue/composition-api';
import adminHome from './admin'
import salesmanHome from './salesman'

export default defineComponent({
  name: 'Home',
  components: { adminHome, salesmanHome }, 
  setup(props,{root}) {
    const currentRole = ref('adminHome')
    onCreated(() => {
    
    })
    return {
      currentRole
    }
  }
  // components: { adminHome, salesmanHome },
  // data() {
  //   return {
  //     currentRole: 'adminHome'
  //   }
  // },
  // computed: {
  //   ...mapGetters([
  //     'roles'
  //   ])
  // },
  // created() {
  //   if (!this.roles.includes('admin')) {
  //     this.currentRole = 'salesmanHome'
  //   }
  // }
})
</script>