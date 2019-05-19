<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>库存管理</span>
      </div>
      <div class="box-tools">
        <el-row :gutter="16" type="flex" justify="right">
          <el-col :span="17">
            <el-button type="primary" @click="handleNew">添加款式</el-button>
          </el-col>
          <el-col :span="3">
            <el-input
              v-model="parmas.first"
              placeholder="请输入款式名"
            />
          </el-col>
          <el-col :span="3">
            <el-select v-model="parmas.first" placeholder="请选择">
              <el-option
                label="全部"
                value=""
              />
              <el-option
                label="上架"
                value="enabled"
              />
              <el-option
                label="下架"
                value="disabled"
              />
            </el-select>
          </el-col>
          <el-col :span="1.5">
            <el-button type="primary" @click="handleGetPaper">查询</el-button>
          </el-col>
        </el-row>
      </div>
      <div class="box-table">
        <el-table>
          <el-table-column
            label="缩略图"
            align="center"
          />
          <el-table-column
            label="标题"
            align="center"
          />
          <el-table-column
            label="款号"
            align="center"
          />
          <el-table-column
            label="拿货编号"
            align="center"
          />
          <el-table-column
            label="价格"
            align="center"
          />
          <el-table-column
            label="备注"
            align="center"
          />
          <el-table-column
            label="状态"
            align="center"
          />
          <el-table-column
            label="操作"
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

