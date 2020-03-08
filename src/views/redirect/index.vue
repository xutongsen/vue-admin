
<script>
import { defineComponent, props } from '@vue/composition-api';

export default defineComponent({
  setup(props,{root}) {
    const { params, query } = root.$route
    let  { path } = params
    path = path.startsWith('/')? path: `/${ path }`
    root.$router.replace({ path: path, query })
  },
    render: function(h) {
    return h() 
  }
})

</script>
