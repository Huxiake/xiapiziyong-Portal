<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>款式详情</span>
      </div>
      <div class="box-tools">
        <el-row :gutter="16" type="flex" justify="right" style="margin-left:0px;">
          <el-popover
            placement="right-start"
            width="300"
            trigger="hover"
          >
            <img :src="sectionData.Img + '?x-oss-process=image/resize,h_300'">
            <img slot="reference" :src="sectionData.Img + '?x-oss-process=image/resize,h_58'">
          </el-popover>
          <div>标题：{{ sectionData.Name }}</div>
          <br>
          <span>款号：{{ sectionData.SectionNum }}</span>
          <br>
          <span>拿货编号：{{ sectionData.GetGoodsNum }}</span>
          <br>
        </el-row>
      </div>
      <div class="box-table">
        <el-table
          :data="detailsData"
        >
          <el-table-column
            label="颜色"
            align="center"
            prop="Color"
          />
          <el-table-column
            label="尺码"
            align="center"
            prop="Size"
          />
          <el-table-column
            label="数量"
            align="center"
            prop="Amount"
          />
          <el-table-column
            label="操作"
            align="center"
          >
            <template slot-scope="scope">
              <a @click="handleSkuEdit(scope.row.Id)">编辑</a>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script>
import { stockDetails } from '@/api/stock'
export default {
  data() {
    return {
      parmas: {
        first: ''
      },
      sectionId: '',
      sectionData: [],
      detailsData: []
    }
  },
  created() {
    this.sectionId = this.$route.params.id
    this.getStockDetails()
  },
  methods: {
    getStockDetails() {
      stockDetails(this.sectionId).then(res => {
        if (res.success) {
          this.sectionData = res.data.rows
          this.detailsData = res.data.rows.ErpSkus
          console.log(this.detailsData)
        }
      })
    },
    handleSkuEdit(id) {
      console.log(id)
    }
  }
}
</script>

<style lang="scss">
  .box-card {
    min-height: calc(100vh - 70px);
    & a {
      color: #409eff;
    }
  }
</style>

