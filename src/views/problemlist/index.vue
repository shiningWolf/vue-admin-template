<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.id" placeholder="编号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
       <el-input v-model="listQuery.name" placeholder="工号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
        <el-date-picker
          v-model="daterange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        查询
      </el-button>
      <el-button  :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        导出
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column label="序号" prop="_id" sortable="custom" align="center" width="80" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row._id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="问题名称" width="160px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
       <el-table-column label="提出人" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.userId }}</span>
        </template>
      </el-table-column>
       <el-table-column label="提出时间" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.timestamp }}</span>
        </template>
      </el-table-column>
      <el-table-column label="当前分支" align="center">
        <template slot-scope="{row}">
          <span>{{ row.current }}</span>
        </template>
      </el-table-column>
      <el-table-column label="分支类型" class-name="status-col" width="100" 
      :filters="problemTypes"
      :filter-method="filterTypes"
      >
        <template slot-scope="{row}">
            {{ row.type }}
        </template>
      </el-table-column>
      <el-table-column label="同步状态" class-name="status-col" width="100" 
      :filters="statusOptions.map(text => {return {text,value:text}})"
      :filter-method="filterStatus"
      >
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="300" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button  v-if="row.status!='resolved'" type="primary" size="mini" @click="handleModifyStatus(row,'resolved')">
            同步问题
          </el-button>
          <el-button  size="mini" @click="handleUpdate(row)">
            编辑问题
          </el-button>
          <el-button  size="mini" type="danger" @click="handleDelete(row,$index)">
            删除问题
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" /> -->

    <el-dialog title="编辑" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="问题名称" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="当前分支" prop="current">
          <el-input v-model="temp.current" />
        </el-form-item>
        <el-form-item label="状态" v-if="dialogStatus!=='create'">
          <el-select v-model="temp.status" class="filter-item" placeholder="Please select">
            <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="分支类型" prop="type">
          <el-input v-model="temp.type" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="temp.remark" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="Please input" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="updateData()">
          确认
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogHistoryVisible" title="历史记录">
      <el-card class="box-card" v-for="(item,index) in history" :key="index">
          <div slot="header" >
            <span>{{item.timestamp}}</span>
          </div>
          <div>
            {{item.content }}
          </div>
        </el-card>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogHistoryVisible = false">确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, fetchDetail, updateProblem , demandHistory} from '@/api/problem'
import {getBranchList} from '@/api/branchManage'
import { parseTime } from '@/utils'
import problem from '../../../mock/problem'
//import Pagination from '@/components/Pagination' // secondary package based on el-pagination
const calendarTypeOptions = [
  { key: 'CN', display_name: 'China' },
  { key: 'US', display_name: 'USA' },
  { key: 'JP', display_name: 'Japan' },
  { key: 'EU', display_name: 'Eurozone' }
]
// arr to obj, such as { CN : "China", US : "USA" }
export default {
  name: 'problemList',
  filters: {
    statusFilter(status) {
      const statusMap = {
        resolved: 'success',
        pending: 'info'                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          
      }
      return statusMap[status]
    }
  },
  computed: {
    problemTypes() {
      return [...new Set(this.list.map(item => item.type ))].map(v => { return {text:v,value:v}})
    }
  },
  data() {
    return {
      daterange:'',
      tableKey: 0,
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        id: undefined,
        name: undefined,
        sort: '+id'
      },
      statusOptions: ['resolved', 'pending'],
      temp: {
        id: undefined,
        remark: '',
        timestamp:undefined,
        name: '',
        current: '',
        type:'',
        status: 'resloved'
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      history:null,
      dialogHistoryVisible: false,
      rules: {
      
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      Promise.all([getBranchList(),fetchList()]).then(([res1,res2]) => {
        console.log(res1,res2)
        // this.list = res1
        // console.log(res2)
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    filterStatus(value, row) {
        return row.status === value;
    },
    filterTypes(value, row) {
         return row.type === value;
    },
    showHistory() {
      this.dialogHistoryVisible = true
      demandHistory().then((response) => {
            this.history = response.data.items
          })
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作成功',
        type: 'success'
      })
      row.status = status
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        status: 'pending',
        type: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleDelete(row, index) {
      this.$notify({
        title: '成功',
        message: '删除成功',
        type: 'success',
        duration: 2000
      })
      this.list.splice(index, 1)
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.id = parseInt(Math.random() * 100)
          this.temp.author = 'yosgi'
          this.temp.excuter = 'yosgi'
          this.temp.timestamp = parseTime(+new Date(),'{y}-{m}-{d}')
          createDemand(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row)
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = parseTime(+new Date(),'{y}-{m}-{d}')
          updateProblem(tempData).then(() => {
            const index = this.list.findIndex(v => v.id === this.temp.id)
            this.list.splice(index, 1, tempData)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDownload() {
      this.downloadLoading = true
      // import('@/vendor/Export2Excel').then(excel => {
      //   const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
      //   const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
      //   const data = this.formatJson(filterVal)
      //   excel.export_json_to_excel({
      //     header: tHeader,
      //     data,
      //     filename: 'table-list'
      //   })
      //   this.downloadLoading = false
      // })
    },
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    }
  }
}
</script>