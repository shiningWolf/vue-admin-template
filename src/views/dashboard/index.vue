<template>
  <div class="dashboard-container">
    <el-row :gutter="10" style="margin-bottom: 10px">
      <el-col :span="8">
        <el-card class="box-card" @click.native="set=1">
          我提的问题 (<span>0</span>)
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="box-card" @click.native="set=2">
          我提的需求 (<span>0</span>)
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="box-card" @click.native="set=3">
          我负责的分支的问题 (<span>0</span>)
        </el-card>
      </el-col>
    </el-row>
    <div v-if="set===1">
      <question />
    </div>
    <div v-if="set===2">
      <demand />
    </div>
    <div v-if="set===3">
      <in-charge />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import question from './question'
import demand from './demand'
import inCharge from './inCharge'

export default {
  name: 'Dashboard',
  components: {
    question,
    demand,
    inCharge
  },
  data: function() {
    return {
      set: 1,
      list: [],
      listLoading: false
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  methods: {
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
