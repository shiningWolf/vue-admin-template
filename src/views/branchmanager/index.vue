<template>
  <div class="branchmanager">
    <div style="margin-bottom: 10px">
      <el-button type="primary" @click="dialogFormVisible=true">添加</el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="序号" width="95">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="分支" align="center">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column
        label="分支类型"
        width="220"
        align="center"
        :filters="filterTypeData"
        :filter-method="filterType"
        filter-placement="bottom-end"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.type }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="分支责任人"
        width="200"
        align="center"
        :filters="filterPersonData"
        :filter-method="filterPerson"
        filter-placement="bottom-end"
      >
        <template slot-scope="scope">
          {{ scope.row.userId }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <div>
            <el-button type="primary" size="mini" @click="editFn(scope.row)">编辑</el-button>
            <el-button slot="reference" size="mini" type="warning" @click="deleteFn(scope.row)">删除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="isEdit ? '编辑' : '添加'" :visible.sync="dialogFormVisible" @close="handleClose">
      <el-form ref="dataForm" :rules="rules" :model="option" label-position="left" label-width="100px" style="width: 600px; margin-left:50px;">
        <el-form-item label="分支" prop="name">
          <el-input v-model="option.name" />
        </el-form-item>
        <el-form-item label="分支类型" prop="type">
          <el-input v-model="option.type" />
        </el-form-item>
        <el-form-item label="分支责任人" prop="userId">
          <el-input v-model="option.userId" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">

        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="handleConfirm">
          确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getBranchList, createBranch, deleteBranch, updateBranch } from '@/api/branchManage'

export default {
  name: 'Branchmanager',

  data: function() {
    return {
      set: 1,
      list: [],
      listLoading: false,
      isEdit: false,
      dialogFormVisible: false,
      rules: {
        name: [{ required: true, message: '内容必须填写', trigger: 'blur' }],
        type: [{ required: true, message: '内容必须填写', trigger: 'blur' }],
        userId: [{ required: true, message: '内容必须填写', trigger: 'blur' }]
      },
      option: {

      },
      listQuery: {
        page: 1,
        limit: 20,
        id: undefined,
        name: undefined,
        sort: '+id'
      }
    }
  },
  computed: {
    filterTypeData() {
      const data = []
      this.list.forEach(list => {
        if (!data.some(item => {
          return item.value === list.type
        })) {
          data.push({ text: list.type, value: list.type })
        }
      })
      return data
    },
    filterPersonData() {
      const data = []
      this.list.forEach(list => {
        if (!data.some(item => {
          return item.value === list.userId
        })) {
          data.push({ text: list.userId, value: list.userId })
        }
      })
      return data
    },
    ...mapGetters([
      'name'
    ])
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      return getBranchList(this.listQuery).then(json => {
        this.list = json.data
      })
    },
    editFn(row) {
      this.isEdit = true
      this.dialogFormVisible = true
      this.option = row
    },
    deleteFn(row) {
      // this.list = this.list.filter(item => item.id !== row.id)
      const obj = {
        _id: row._id
      }
      this.listLoading = true
      deleteBranch(obj).then(json => {
        if (json.code === 20000) {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.getData().then(() => {
            this.listLoading = false
          })
        }
      })
      console.log(row)
    },
    filterType(value, row) {
      return row.type === value
    },
    filterPerson(value, row) {
      return row.userId === value
    },
    handleConfirm() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          // 添加
          if (!this.isEdit) {
            createBranch(this.option).then((json) => {
              if (json.code === 20000) {
                this.getData()
                this.$message({
                  message: '操作成功',
                  type: 'success'
                })
                this.dialogFormVisible = false
              }
            })
          } else {
            // 编辑
            updateBranch(this.option).then(json => {
              if (json.code === 20000) {
                this.getData()
                this.option = {}
                this.isEdit = false
                this.$message({
                  message: '操作成功',
                  type: 'success'
                })
                this.dialogFormVisible = false
              }
            })
          }
        } else {
          return false
        }
      })
    },
    handleClose() {
      console.log('close')
      this.isEdit = false
      this.option = {}
    }
  }
}
</script>

<style  lang="scss" scoped>
.branchmanager {
  padding: 30px;
  >>> .el-dialog {
    min-width: 700px;
  }
}

</style>
