<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>订单管理</span>
      </div>
      <div class="box-tools">
        <el-row :gutter="16" type="flex" justify="right">
          <el-col :span="5" :offset="18">
            <el-input
              v-model="parmas.first"
              placeholder="请输入款号"
            />
          </el-col>
          <el-col :span="1.5">
            <el-button type="primary" @click="handleGetPaper">查询</el-button>
          </el-col>
        </el-row>
        <el-row style="margin-top:20px;margin-bottom:20px">
          <el-col :span="22">
            <el-button type="primary" @click="handleNew">完成拣货</el-button>
          </el-col>
        </el-row>
      </div>
      <div class="box-table">
        <el-table>
          <el-table-column
            label="订单编号"
            align="center"
          />
          <el-table-column
            label="时间"
            align="center"
          />
          <el-table-column
            label="买家公司名"
            align="center"
          />
          <el-table-column
            label="买家会员名"
            align="center"
          />
          <el-table-column
            label="状态"
            align="center"
          />
          <el-table-column
            label="订单总金额"
            align="center"
          />
          <el-table-column
            label="实付金额"
            align="center"
          />
          <el-table-column
            label="买家留言"
            align="center"
          />
          <el-table-column
            label="备注"
            align="center"
          />
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      parmas: {
        first: ''
      }
    }
  },
  methods: {
  }
}
</script>

<style lang="scss">
  .box-card {
    min-height: calc(100vh - 70px);
  }
</style>

