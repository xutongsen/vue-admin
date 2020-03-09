<template>

  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="userData.listQuery.title" placeholder="Title" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="userData.listQuery.importance" placeholder="Imp" clearable style="width: 90px" class="filter-item">
        <el-option v-for="item in userData.importanceOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <el-select v-model="userData.listQuery.type" placeholder="Type" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name+'('+item.key+')'" :value="item.key" />
      </el-select>
      <el-select v-model="userData.listQuery.sort" style="width: 140px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in userData.sortOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>

      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        添加
      </el-button>
      <el-button v-waves :loading="userData.downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        下载
      </el-button>
      <el-checkbox v-model="userData.showReviewer" class="filter-item" style="margin-left:15px;" @change="userData.tableKey=userData.tableKey+1">
        审核
      </el-checkbox>
    </div>

    <el-table
      :key="userData.tableKey"
      v-loading="userData.listLoading"
      :data="userData.list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column label="ID" prop="id" sortable="custom" align="center" width="80" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="时间" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.timestamp | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="名称" min-width="150px">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.title }}</span>
          <el-tag>{{ row.type | typeFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="作者" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.author }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="userData.showReviewer" label="Reviewer" width="110px" align="center">
        <template slot-scope="{row}">
          <span style="color:red;">{{ row.reviewer }}</span>
        </template>
      </el-table-column>
      <el-table-column label="星级" width="80px">
        <template slot-scope="{row}">
          <svg-icon v-for="n in + row.importance" :key="n" icon-class="star" class="meta-item__icon" />
        </template>
      </el-table-column>
      <el-table-column label="统计" align="center" width="95">
        <template slot-scope="{row}">
          <span v-if="row.pageviews" class="link-type" @click="handleFetchPv(row.pageviews)">{{ row.pageviews }}</span>
          <span v-else>0</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" class-name="status-col" width="100">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">
            {{ statusText(row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            修改
          </el-button>
          <el-button v-if="row.status!='published'" size="mini" type="success" @click="handleModifyStatus(row,'published')">
            发布
          </el-button>
          <el-button v-if="row.status!='draft'" size="mini" @click="handleModifyStatus(row,'draft')">
            草稿
          </el-button>
          <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row,$index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="userData.total>0" :total="userData.total" :page.sync="userData.listQuery.page" :limit.sync="userData.listQuery.limit" @pagination="getList" />


    <el-dialog :title="userData.textMap[userData.dialogStatus]" :visible.sync="userData.dialogFormVisible">
      <el-form ref="dataForm" :rules="userData.rules" :model="userData.temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="Type" prop="type">
          <el-select v-model="userData.temp.type" class="filter-item" placeholder="Please select">
            <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item label="Date" prop="timestamp">
          <el-date-picker v-model="userData.temp.timestamp" type="datetime" placeholder="Please pick a date" />
        </el-form-item>
        <el-form-item label="Title" prop="title">
          <el-input v-model="userData.temp.title" />
        </el-form-item>
        <el-form-item label="Status">
          <el-select v-model="userData.temp.status" class="filter-item" placeholder="Please select">
            <el-option v-for="item in userData.statusOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="Imp">
          <el-rate v-model="userData.temp.importance" :colors="['#99A9BF', '#F7BA2A', '#FF9900']" :max="3" style="margin-top:8px;" />
        </el-form-item>
        <el-form-item label="Remark">
          <el-input v-model="userData.temp.remark" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="Please input" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="userData.dialogFormVisible = false">
          Cancel
        </el-button>
        <el-button type="primary" @click="userData.dialogStatus==='create'?createData():updateData()">
          Confirm
        </el-button>
      </div>
    </el-dialog>


    <el-dialog :visible.sync="userData.dialogPvVisible" title="阅读统计">
      <el-table :data="userData.pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="userData.dialogPvVisible = false">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
  
</template>

<script>
import { fetchList, fetchPv, createArticle, updateArticle, components } from '@/api/article'
import { defineComponent, reactive, directives, ref, filters, props } from '@vue/composition-api';
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination' 

const calendarTypeOptions = [
      { key: 'CN', display_name: 'China' },
      { key: 'US', display_name: 'USA' },
      { key: 'JP', display_name: 'Japan' },
      { key: 'EU', display_name: 'Eurozone' }
    ]


const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})
export default defineComponent({
  name: 'PageUser',
  components: { Pagination },
  directives: { waves },
  filters:{
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    }
  },
  setup(props, { root, refs }) {
    const userData = reactive({
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      total: 0,
      importanceOptions: [1, 2, 3],
      statusOptions: ['published', 'draft', 'deleted'],
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      tableKey: 0,
      downloadLoading: false,
      showReviewer: false,
      listLoading: true,
      list: null,
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogFormVisible: false,
      dialogStatus: '',
      temp: {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        type: '',
        status: 'published'
      },
       dialogPvVisible: false,
       pvData: [],
       rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
    })
    const handleFilter = () => {
      userData.listQuery.page = 1
      getList()
    }

    const resetTemp = () => {
      userData.temp = {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        status: 'published',
        type: ''
      }
    }
    const handleCreate = () => {
      userData.dialogStatus = 'create'
      userData.dialogFormVisible = true
      root.$nextTick(() => {
        refs.dataForm.clearValidate()
      })
    }

    const handleDownload = () => {

    }
    const sortByID = (order) => {
      if (order === 'ascending') {
        userData.listQuery.sort = '+id'
      } else {
        userData.listQuery.sort = '-id'
      }
      handleFilter()
    }
    const sortChange = (data) =>  {
      const { prop, order } = data
      if (prop === 'id') {
        sortByID(order)
      }
    }

    const getSortClass = (key) => {
      const sort = userData.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    }

    const handleUpdate = (row) => {
      userData.temp = Object.assign({}, row)
      userData.temp.timestamp = new Date(userData.temp.timestamp)
      userData.dialogStatus = 'update'
      userData.dialogFormVisible = true
      root.$nextTick(() => {
        refs.dataForm.clearValidate()
      })
    }

    const handleModifyStatus = ( row, status ) => {
      root.$message({
        message: '操作Success',
        type: 'success'
      })
      row.status = status
    }
    
    const handleDelete = (row, index) => {{
      root.$notify({
        title: 'Success',
        message: '删除成功',
        type: 'success',
        duration: 2000
      })
    
      userData.list.splice(index, 1)
    }}
    
    const handleFetchPv = (pv) => {
      fetchPv(pv).then(response => {
        userData.pvData = response.data.pvData
        userData.dialogPvVisible = true
      })
    }

    const getList = () => {
      userData.listLoading = true
      fetchList(userData.listQuery).then(response => {
        userData.list = response.data.items
        userData.total = response.data.total

        // 模拟callback time
        setTimeout(() => {
          userData.listLoading = false
        }, 2000)
      })
    }

    const createData = () => {
      refs.dataForm.validate((valid) => {
        if (valid) {
          userData.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          userData.temp.author = 'vue-admin'
          createArticle(userData.temp).then(() => {
            userData.list.unshift(userData.temp)
            userData.dialogFormVisible = false
            root.$notify({
              title: 'Success',
              message: '添加成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    }

    const updateData = () => {
      refs.dataForm.validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, userData.temp)
          tempData.timestamp = +new Date(tempData.timestamp) 
          updateArticle(tempData).then(() => {
            const index = userData.list.findIndex(v => v.id === userData.temp.id)
            userData.list.splice(index, 1, userData.temp)
            userData.dialogFormVisible = false
            root.$notify({
              title: 'Success',
              message: '修改成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    }
    const statusText = (status) => {
      const statusMap = {
        published: '发布',
        draft: '草稿',
        deleted: '删除'
      }
      return statusMap[status]
    }

    getList()
   
    return {
      userData,
      handleFilter,
      calendarTypeOptions,
      handleCreate,
      handleDownload,
      sortChange,
      getSortClass,
      handleUpdate,
      handleModifyStatus,
      handleDelete,
      getList,
      createData,
      updateData,
      handleFetchPv,
      statusText
    }
  }
})
</script>
<style lang="scss" scoped>
.filter-item {
  margin-right: 4px
}
</style>