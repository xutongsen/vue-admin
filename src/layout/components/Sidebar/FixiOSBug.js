import { computed, onMounted, defineComponent } from '@vue/composition-api'
export default defineComponent({
  props:{
    item: {
      type: Object,
      required: true
    },
  },
  setup(props, {root, refs}) {
    
    const device = computed(() => {
      return root.$store.app.device
    })

    const fixBugIniOS = ()  => {
      const $subMenu = refs.subMenu

      if ($subMenu) {
        const handleMouseleave = $subMenu.handleMouseleave
        $subMenu.handleMouseleave = (e) => {
          if (device === 'mobile') {
            return
          }
          handleMouseleave(e)
        }
      }
      
      
    }
    onMounted(() => {
      fixBugIniOS()
    })

  }
})