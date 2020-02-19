<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" type="primary"  @click="handleCreate">增加</el-button>
      <el-button
        :loading="downloadLoading"
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        @click="handleDownload"
      >导出</el-button>
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
      <!-- <el-table-column label="序号" prop="_id" sortable="custom" align="center" width="80" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row._id }}</span>
        </template>
      </el-table-column>-->
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
      <!-- <el-table-column label="提出时间" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.timestamp | parseTime }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="当前分支" align="center">
        <template slot-scope="{row}">
          <span>{{ row.branchObj.name }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="分支类型"
        class-name="status-col"
        width="100"
        :filters="problemTypes"
        :filter-method="filterTypes"
      >
        <template slot-scope="{row}">{{ row.branchObj.type }}</template>
      </el-table-column>
      <el-table-column label="未同步分支" class-name="status-col" width="150">
        <template slot-scope="{row}">
          <el-tag
            type="info"
            v-for="(item,index) in row.branchIdList"
            :key="index"
          >{{ branchObj[item].name}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="300" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button size="mini" @click="handleUpdate(row)">编辑问题</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(row,$index)">删除问题</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" /> -->

    <el-dialog :title="textMap[dialogStatus]"  :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="100px"
        style="margin-left:50px;"
      >
        <el-form-item label="问题名称" prop="name">
          <el-input v-model="temp.name" style="width:50%"/>
        </el-form-item>
        <el-form-item label="当前分支" prop="branchName">
           <el-autocomplete
            style="width:50%"
            v-model="temp.branchName"
            :fetch-suggestions="querySearch"
            placeholder="请输入内容"
            @select="handleSelect"
          ></el-autocomplete>
        </el-form-item>
        <el-form-item label="未同步分支" prop="branchIdList">
          <el-select style="width:100%" v-model="temp.branchIdList" multiple placeholder="请选择"  >
            <el-option
              v-for="item in Object.values(branchObj)"
              :key="item._id"
              :label="item.name"
              :value="item._id">
            </el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="备注">
          <el-input
            style="width:50%"
            v-model="temp.remark"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder="Please input"
          />
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, updateProblem, deleteProblem,createProblem } from "@/api/problem";
import { getBranchList } from "@/api/branchManage";
import { parseTime } from "@/utils";
import problem from "../../../mock/problem";
//import Pagination from '@/components/Pagination' // secondary package based on el-pagination
const calendarTypeOptions = [
  { key: "CN", display_name: "China" },
  { key: "US", display_name: "USA" },
  { key: "JP", display_name: "Japan" },
  { key: "EU", display_name: "Eurozone" }
];
// arr to obj, such as { CN : "China", US : "USA" }
export default {
  name: "problemList",
  filters: {
    statusFilter(status) {
      const statusMap = {
        resolved: "success",
        pending: "info"
      };
      return statusMap[status];
    },
    parseTime(v) {
      return parseTime(v, "{y}-{m}-{d}");
    }
  },
  computed: {
    problemTypes() {
      return [...new Set(Object.values(this.branchObj).map(item => item.type))].map(v => {
        return { text: v, value: v };
      });
    }
  },
  data() {
    return {
      daterange: "",
      tableKey: 0,
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        id: undefined,
        name: undefined,
        sort: "+id"
      },
      statusOptions: ["resolved", "pending"],
      temp: {
        name: ""
      },
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "编辑",
        create: "创建"
      },
      history: null,
      dialogHistoryVisible: false,
      rules: {},
      downloadLoading: false,
      branchObj: {}
    };
  },
  created() {
    this.getList();
  },
  methods: {
    createFilter(queryString) {
        return (v) => {
          return (v.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
    },
    querySearch(queryString, cb) {
      var branchNames = Object.values(this.branchObj).map(v => {
        return {value:v.name,label:'as'}
      })
      var results = queryString ? branchNames.filter(this.createFilter(queryString)) : branchNames;
      cb(results);
    },
    handleSelect(item) {
        console.log(item);
    },
    getList() {
      this.listLoading = true;
      Promise.all([getBranchList(), fetchList()]).then(([res1, res2]) => {
        let branchObj = {};
        res1.data.forEach(item => {
          branchObj[item._id] = item;
        });
        this.branchObj = branchObj;
        res2.data.forEach(item => {
          item.branchObj = branchObj[item.branchId];
        });
        this.list = res2.data;
        this.listLoading = false;
      });
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    filterStatus(value, row) {
      return row.status === value;
    },
    filterTypes(value, row) {
      return row.branchObj.type === value;
    },
    showHistory() {
      this.dialogHistoryVisible = true;
      demandHistory().then(response => {
        this.history = response.data.items;
      });
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: "操作成功",
        type: "success"
      });
      row.status = status;
    },
    sortChange(data) {
      const { prop, order } = data;
      if (prop === "id") {
        this.sortByID(order);
      }
    },
    sortByID(order) {
      if (order === "ascending") {
        this.listQuery.sort = "+id";
      } else {
        this.listQuery.sort = "-id";
      }
      this.handleFilter();
    },
    resetTemp() {
      this.temp = {
        name:'',
        userId:'90913',
        branchId:'',
        branchIdList:[],
        branchName:''
      };
    },
    handleCreate() {
      this.resetTemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    handleDelete(row, index) {
      deleteProblem(row).then(() => {
        this.getList();
        this.$notify({
          title: "成功",
          message: "删除成功",
          type: "success",
          duration: 2000
        });
      });
    },
    createData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          let branchId = ''
          for(let key in this.branchObj) {
            if (this.branchObj[key].name === this.temp.branchName) {
              this.temp.branchId = this.branchObj[key]._id
              break
            }
          }
          createProblem(this.temp).then(() => {
            this.getList()
            this.dialogFormVisible = false;
            this.$notify({
              title: "成功",
              message: "创建成功",
              type: "success",
              duration: 2000
            });
          });
        }
      });
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row);
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    updateData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          const tempData = Object.assign({}, this.temp);
          console.log(this.temp);
          updateProblem(tempData).then(() => {
            this.getList();
            this.dialogFormVisible = false;
            this.$notify({
              title: "成功",
              message: "更新成功",
              type: "success",
              duration: 2000
            });
          });
        }
      });
    },
    handleDownload() {
      this.downloadLoading = true;
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
      return this.list.map(v =>
        filterVal.map(j => {
          if (j === "timestamp") {
            return parseTime(v[j]);
          } else {
            return v[j];
          }
        })
      );
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort;
      return sort === `+${key}` ? "ascending" : "descending";
    }
  }
};
</script>