<template>
  <el-table :data="tableData.list" style="width: 100%;padding-top: 15px;">
    <el-table-column label="Order_No" min-width="200">
      <template slot-scope="scope">
        {{ scope.row.order_no | orderNoFilter }}
      </template>
    </el-table-column>
    <el-table-column label="金额" width="195" align="center">
      <template slot-scope="scope">
        ¥{{ scope.row.price | toThousandFilter }}
      </template>
    </el-table-column>
    <el-table-column label="标签" width="100" align="center">
      <template slot-scope="{row}">
        <el-tag :type="row.status">
          {{ row.status | statusFilter }}
        </el-tag>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { transactionList } from '@/api/remote-search'
import { defineComponent, filters, props, reactive, onMounted } from '@vue/composition-api';
export default defineComponent({
  filters: {
    statusFilter(status) {
      const statusMap = {
        success: 'success',
        pending: 'danger'
      }
      return statusMap[status]
    },
    orderNoFilter(str) {
      return str.substring(0, 30)
    }
  },
  setup(props, { root }) {
    let tableData = reactive({
      list: null
    })
    const fetchData = () => {
      transactionList().then(response => {
        let res = response.data
        tableData.list = res.items.slice(0, 8)
      })
    }
    onMounted(() => {
      fetchData()  
    })
    return {
      tableData
    }
  }
})
</script>
