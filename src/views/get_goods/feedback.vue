<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>拿货反馈</span>
      </div>
      <div class="box-tools">
        <el-row :gutter="16" type="flex" justify="right">
          <el-col :span="3" :offset="20">
            <el-input
              v-model="paginator.OrderNum"
              placeholder="请输入订单号"
            />
          </el-col>
          <el-col :span="1.5">
            <el-button type="primary" size="medium" @click="1">查询</el-button>
          </el-col>
        </el-row>
      </div>
      <div class="box-table">
        <el-table
          :data="tableData"
          stripe
          @selection-change="handleSelectionChange"
        >
          <!-- <el-table-column type="selection" width="55" /> -->
          <el-table-column label="缩略图" align="center" width="80">
            <template slot-scope="scope">
              <el-popover
                placement="right-start"
                width="326"
                trigger="hover"
              >
                <img :src="scope.row.ErpGetGoods.ErpSku.ErpSpu.Img + '?x-oss-process=image/resize,h_300,limit_0'" style="margin:0 auto">
                <img slot="reference" :src="scope.row.ErpGetGoods.ErpSku.ErpSpu.Img + '?x-oss-process=image/resize,h_58'">
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column label="订单号" align="center" width="200">
            <template slot-scope="scope">
              <div>{{ scope.row.ErpGetGoods.OrderNum }}</div>
            </template>
          </el-table-column>
          <el-table-column label="款号" align="center" width="150">
            <template slot-scope="scope">
              <div>{{ scope.row.ErpGetGoods.ErpSku.SectionNum }}</div>
            </template>
          </el-table-column>
          <el-table-column label="拿货编号" align="center">
            <template slot-scope="scope">
              <el-input v-if="scope.row.Id === editSkuInfo.Id" v-model="editSkuInfo.GetGoodsNum" style="width:180px" @change="editFeedbackItem('GetGoodsNum')" />
              <div v-if="scope.row.Id !== editSkuInfo.Id">{{ scope.row.ErpGetGoods.ErpSku.ErpSpu.GetGoodsNum }}</div>
            </template>
          </el-table-column>
          <el-table-column label="颜色" align="center">
            <template slot-scope="scope">
              <el-input v-if="scope.row.Id === editSkuInfo.Id" v-model="editSkuInfo.Color" style="width:180px" @change="editFeedbackItem('Color')" />
              <div v-if="scope.row.Id !== editSkuInfo.Id">{{ scope.row.ErpGetGoods.ErpSku.Color }}</div>
            </template>
          </el-table-column>
          <el-table-column label="码数" align="center">
            <template slot-scope="scope">
              <el-input v-if="scope.row.Id === editSkuInfo.Id" v-model="editSkuInfo.Size" style="width:180px" @change="editFeedbackItem('Size')" />
              <div v-if="scope.row.Id !== editSkuInfo.Id">{{ scope.row.ErpGetGoods.ErpSku.Size }}</div>
            </template>
          </el-table-column>
          <el-table-column label="价格" align="center">
            <template slot-scope="scope">
              <el-input v-if="scope.row.Id === editSkuInfo.Id" v-model="editSkuInfo.Price" style="width:180px" @change="editFeedbackItem('Price')" />
              <div v-if="scope.row.Id !== editSkuInfo.Id">{{ scope.row.ErpGetGoods.ErpSku.ErpSpu.Price }}</div>
            </template>
          </el-table-column>
          <el-table-column label="数量" align="center">
            <template slot-scope="scope">
              <el-input v-if="scope.row.Id === editSkuInfo.Id" v-model="editSkuInfo.Amount" style="width:180px" @change="editFeedbackItem('Amount')" />
              <div v-if="scope.row.Id !== editSkuInfo.Id">{{ scope.row.ErpGetGoods.Amount }}</div>
            </template>
          </el-table-column>
          <!-- <el-table-column label="状态" align="center" width="100">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.IsDeal === 0" type="info">未处理</el-tag>
              <el-tag v-if="scope.row.IsDeal === 1" type="success">已处理</el-tag>
            </template>
          </el-table-column> -->
          <el-table-column label="操作" align="center" width="200">
            <template slot-scope="scope">
              <el-button v-if="scope.row.Id === editSkuInfo.Id" type="primary" size="mini" @click="handleSkuSave()">保存</el-button>
              <el-button v-if="scope.row.Id === editSkuInfo.Id" size="mini" @click="cancelSkuSave()">取消</el-button>
              <el-button v-if="scope.row.Id !== editSkuInfo.Id" type="primary" size="mini" @click="handleSkuEdit(scope.row)">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getFeedback, markRead, dealFeedback } from '@/api/getGoods'
import qs from 'qs'

export default {
  data() {
    return {
      tableData: [],
      paginator: {
        offset: 0,
        limit: 20,
        OrderNum: '',
        deal: 0
      },
      editSkuInfo: {
        'Id': '',
        'FeedbackId': null,
        'GetGoodsId': null,
        'SkuId': null,
        'SpuId': null,
        'GetGoodsNum': '',
        'Color': '',
        'Size': '',
        'Price': '',
        'Amount': ''
      },
      sendSkuInfo: {},
      feedbackIdList: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      const searchAttrs = qs.stringify(this.paginator)
      getFeedback(searchAttrs)
        .then(res => {
          if (res.success) {
            this.tableData = res.data.rows
            const dataLen = this.tableData.length
            for (let i = 0; i < dataLen; i++) {
              this.feedbackIdList.push(this.tableData[i].Id)
            }
            console.log(this.feedbackIdList)
            this.markRead()
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    markRead() {
      const idList = '[' + this.feedbackIdList.join(',') + ']'
      markRead(idList).then(res => {
        console.log(res)
      })
    },
    handleSelectionChange(list) {
      const selectList_temp = []
      for (const i in list) {
        console.log(i)
        selectList_temp.push(list[i]['Id'])
      }
      this.selectList = selectList_temp
    },
    handleSkuEdit(item) {
      // Id
      this.editSkuInfo.Id = item.Id
      this.sendSkuInfo.FeedbackId = item.Id
      this.sendSkuInfo.GetGoodsId = item.ErpGetGoods.Id
      this.sendSkuInfo.SkuId = item.ErpGetGoods.ErpSku.Id
      this.sendSkuInfo.SpuId = item.ErpGetGoods.ErpSku.ErpSpu.Id
      // Info
      this.editSkuInfo.GetGoodsNum = item.ErpGetGoods.ErpSku.ErpSpu.GetGoodsNum
      this.editSkuInfo.Price = item.ErpGetGoods.ErpSku.ErpSpu.Price
      this.editSkuInfo.Color = item.ErpGetGoods.ErpSku.Color
      this.editSkuInfo.Size = item.ErpGetGoods.ErpSku.Size
      this.editSkuInfo.Amount = item.ErpGetGoods.Amount
    },
    cancelSkuSave() {
      this.editSkuInfo = {}
      console.log(this.sendSkuInfo)
    },
    editFeedbackItem(key) {
      this.sendSkuInfo[key] = this.editSkuInfo[key]
    },
    handleSkuSave() {
      const skuInfo = qs.stringify(this.sendSkuInfo)
      dealFeedback(skuInfo).then(res => {
        if (res.success) {
          this.$message.success('处理成功!')
          this.editSkuInfo = {}
          this.getList()
        } else {
          this.$message.error('处理失败，请重试!')
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
