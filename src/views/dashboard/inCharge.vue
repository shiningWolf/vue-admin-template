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
          <span>{{ scope.row.branch }}</span>
        </template>
      </el-table-column>
      <el-table-column label="问题描述" width="250" align="center">
        <template slot-scope="scope">
          {{ scope.row.description }}
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
          {{ scope.row.branchType }}
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
          <el-button type="primary" size="mini" @click="editFn(scope.row)">同步当前分支</el-button>
          <el-button slot="reference" size="mini" type="warning" @click="deleteFn(scope.row)">同步所有分支</el-button>
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>

<script>
import { getInChargeBranchList } from '@/api/dashboard'

export default {
  name: 'Question',
  data() {
    return {
      list: [],
      listLoading: false
    }
  },
  mounted() {
    getInChargeBranchList().then(json => {
      console.log(json)
      this.list = json.data.items
    })
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
