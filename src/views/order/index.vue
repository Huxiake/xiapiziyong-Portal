<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>订单管理</span>
      </div>
      <div class="box-tools">
        <el-row :gutter="16" type="flex" justify="right">
          <el-col :span="3" :offset="17">
            <el-input
              v-model="parmas.first"
              placeholder="请输入款号"
            />
          </el-col>
          <el-col :span="3">
            <el-select v-model="parmas.first" placeholder="请选择">
              <el-option
                label="全部"
                value=""
              />
              <el-option
                label="已配货"
                value="enabled"
              />
              <el-option
                label="未配货"
                value="disabled"
              />
            </el-select>
          </el-col>
          <el-col :span="1.5">
            <el-button type="primary" @click="handleGetPaper">查询</el-button>
          </el-col>
        </el-row>
        <el-row style="margin-top:20px;margin-bottom:20px">
          <el-col :span="22">
            <el-button type="primary" @click="handleNew">配货</el-button>
            <el-button type="primary" @click="handleNew">生成拿货单</el-button>
          </el-col>
          <el-col :span="2">
            <el-button type="warning" style="float:right" @click="handleNew">导入订单</el-button>
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

