<template>
  <div class="dashboard-container">

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
      <el-table-column label="当前分支" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.branchObj && scope.row.branchObj.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="问题描述" width="250" align="center">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="提交人" width="100" align="center">
        <template slot-scope="scope">
          {{ scope.row.author }}
        </template>
      </el-table-column>
      <el-table-column label="提交日期" width="100" align="center">
        <template slot-scope="scope">
          {{ scope.row.timestamp }}
        </template>
      </el-table-column>
      <el-table-column label="分支类型" width="100" align="center">
        <template slot-scope="scope">
          {{ scope.row.branchObj && scope.row.branchObj.type }}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="同步状态" width="100" align="center">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="未同步分支" width="130">
        <template slot-scope="scope">
          <span>{{ scope.row.unSyncBranch }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="操作" width="150">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="editFn(scope.row)">同步</el-button>
          <el-button slot="reference" size="mini" type="warning" @click="dialogVisible = true">驳回</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="驳回" :visible.sync="dialogVisible">
      <el-form ref="dataForm" :rules="rules" :model="option" label-position="left" label-width="100px" style="width: 600px; margin-left:50px;">
        <el-form-item label="驳回原因" prop="content">
          <el-input v-model="option.content" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">

        <el-button @click="dialogVisible = false">
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
import { fetchList } from '@/api/problem'

export default {
  name: 'Question',
  data() {
    return {
      list: [],
      dialogVisible: false,
      listLoading: false,
      option: {}
    }
  },
  mounted() {
    fetchList().then(json => {
      this.list = json.data
    })
  },
  methods: {
    handleClose() {

    },
    handleConfirm() {

    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
