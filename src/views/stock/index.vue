<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>库存管理</span>
      </div>
      <div class="box-tools">
        <el-row :gutter="16" type="flex" justify="right">
          <el-col :span="20">
            <el-button type="primary">上传款式</el-button>
            <el-button type="primary" @click="toPdf()">打印标签</el-button>
          </el-col>
          <el-col :span="3">
            <el-input
              v-model="parmas.first"
              placeholder="请输入款式名"
            />
          </el-col>
          <!-- <el-col :span="3">
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
          </el-col> -->
          <el-col :span="1.5">
            <el-button type="primary">查询</el-button>
          </el-col>
        </el-row>
      </div>
      <div class="box-table">
        <el-table
          :data="sotckData"
        >
          <el-table-column
            type="selection"
            width="55"
          />
          <el-table-column
            label="缩略图"
            align="center"
            width="80"
          >
            <template slot-scope="scope">
              <el-popover
                placement="right-start"
                width="300"
                trigger="hover"
              >
                <img :src="scope.row.Img + '?x-oss-process=image/resize,h_300'">
                <img slot="reference" :src="scope.row.Img + '?x-oss-process=image/resize,h_58'">
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column
            label="标题"
            align="center"
            prop="Name"
          />
          <el-table-column
            label="款号"
            align="center"
            prop="SectionNum"
          />
          <el-table-column
            label="拿货编号"
            align="center"
            prop="GetGoodsNum"
          />
          <el-table-column
            label="价格"
            align="center"
            prop="Price"
          />
          <el-table-column
            label="备注"
            align="center"
            prop="Remark"
          />
          <el-table-column
            label="状态"
            align="center"
            prop="Status"
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
import { stockList } from '@/api/stock'

export default {
  data() {
    return {
      htmlTitle: '123456',
      parmas: {
        first: ''
      },
      sotckData: [],
      paginator: {
        offset: 0,
        limit: 20
      }
    }
  },
  created() {
    this.getStockList(this.paginator.offset, this.paginator.limit)
  },
  methods: {
    getStockList(offset, limit) {
      stockList(offset, limit).then(res => {
        if (res.success) {
          this.sotckData = res.data.rows
        }
      })
    },
    toPdf() {
      // this.getPdf()
      this.$router.push({
        name: 'downpage',
        params: {
          data: this.sotckData
        }
      })
    }
  }
}
</script>

<style lang="scss">
  .box-card {
    min-height: calc(100vh - 70px);
  }
</style>

