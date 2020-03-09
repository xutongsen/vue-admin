<template>
  <div class="dashboard-container">
    <component :is="currentRole" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { reactive, ref, isRef, toRefs, onCreated, components, defineComponent, computed} from '@vue/composition-api';
import adminHome from './admin'
import salesmanHome from './salesman'

export default defineComponent({
  name: 'Home',
  components: { adminHome, salesmanHome }, 
  setup(props,{root}) {
    const currentRole = ref('salesmanHome')
    const roles = computed(() => {
      return root.$store.getters.roles
    })
    if (roles.value.includes('admin')) {
      currentRole.value = 'adminHome'
    }
    return {
      currentRole
    }
  }
})
</script>