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
          {{ scope.row.branch }}
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
          <span>{{ scope.row.branchType }}</span>
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
          {{ scope.row.branchManager }}
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

    <el-dialog :title="isEdit ? '编辑' : '添加'" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="option" label-position="left" label-width="100px" style="width: 600px; margin-left:50px;">
        <el-form-item label="分支" prop="branch">
          <el-input v-model="option.branch" />
        </el-form-item>
        <el-form-item label="分支类型" prop="branch">
          <el-input v-model="option.branchType" />
        </el-form-item>
        <el-form-item label="分支责任人" prop="branch">
          <el-input v-model="option.branchManager" />
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
import { getBranchList, updateBranch } from '@/api/branchManage'

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
        branch: [{ required: true, message: '内容必须填写', trigger: 'blur' }]
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
          return item.value === list.branchType
        })) {
          data.push({ text: list.branchType, value: list.branchType })
        }
      })
      return data
    },
    filterPersonData() {
      const data = []
      this.list.forEach(list => {
        if (!data.some(item => {
          return item.value === list.branchManager
        })) {
          data.push({ text: list.branchManager, value: list.branchManager })
        }
      })
      return data
    },
    ...mapGetters([
      'name'
    ])
  },
  mounted() {
    getBranchList(this.listQuery).then(json => {
      console.log(json)
      this.list = json.data.items
    })
  },
  methods: {
    editFn(row) {
      this.isEdit = true
      this.dialogFormVisible = true
      this.option = row
    },
    deleteFn(row) {
      this.list = this.list.filter(item => item.id !== row.id)
    },
    filterType(value, row) {
      return row.branchType === value
    },
    filterPerson(value, row) {
      return row.branchManager === value
    },
    handleConfirm() {
      // updateBranch().then(() => {
      //   this.list.unshift(this.option)
      // })
      this.dialogFormVisible = false
      this.list.unshift(this.option)
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
