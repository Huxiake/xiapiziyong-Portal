<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>拿货列表</span>
      </div>
      <div class="box-tools">
        <el-row :gutter="16" type="flex" justify="right">
          <el-col :span="20">
            <el-button type="primary" @click="1">打印</el-button>
          </el-col>
          <el-col :span="3">
            <el-input
              v-model="paginator.OrderNum"
              placeholder="请输入订单号"
            />
          </el-col>
          <el-col :span="1.5">
            <el-button type="primary" @click="1">查询</el-button>
          </el-col>
        </el-row>
      </div>
      <div class="box-table">
        <el-table
          :data="tableData"
          stripe
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column label="缩略图" align="center">
            <template slot-scope="scope">
              <el-popover
                placement="right-start"
                width="326"
                trigger="hover"
              >
                <img :src="scope.row.ErpSku.ErpSpu.Img + '?x-oss-process=image/resize,h_300,limit_0'" style="margin:0 auto">
                <img slot="reference" :src="scope.row.ErpSku.ErpSpu.Img + '?x-oss-process=image/resize,h_58'">
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column label="款号" align="center">
            <template slot-scope="scope">
              <div>{{ scope.row.ErpSku.SectionNum }}</div>
            </template>
          </el-table-column>
          <el-table-column label="拿货编号" align="center">
            <template slot-scope="scope">
              <div>{{ scope.row.ErpSku.ErpSpu.GetGoodsNum }}</div>
            </template>
          </el-table-column>
          <el-table-column label="价格" align="center">
            <template slot-scope="scope">
              <div>{{ scope.row.ErpSku.ErpSpu.Price }}</div>
            </template>
          </el-table-column>
          <el-table-column label="数量" prop="Amount" align="center" />
          <el-table-column label="备注" prop="Remark" align="center" />
          <el-table-column label="操作" prop="" align="center" />
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getGoodsList } from '@/api/getGoods'
import qs from 'qs'

export default {
  data() {
    return {
      tableData: [],
      paginator: {
        offset: 0,
        limit: 20,
        OrderNum: ''
      },
      selectList: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      const searchAttrs = qs.stringify(this.paginator)
      getGoodsList(searchAttrs)
        .then(res => {
          if (res.success) {
            console.log(res)
            this.tableData = res.data.rows
            console.log('tabledata', this.tableData)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    handleSelectionChange(list) {
      const selectList_temp = []
      for (const i in list) {
        console.log(i)
        selectList_temp.push(list[i]['Id'])
      }
      this.selectList = selectList_temp
    }
  }
}
</script>

<style lang="scss">
  .box-card {
    min-height: calc(100vh - 70px);
  }
</style>

