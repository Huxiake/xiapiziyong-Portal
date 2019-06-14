<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>全部订单</span>
      </div>
      <div class="box-tools">
        <el-row :gutter="16" type="flex" justify="right">
          <el-col :span="3" :offset="20">
            <el-input
              v-model="paginator.OrderNum"
              size="medium"
              placeholder="请输入款号"
            />
          </el-col>
          <el-col :span="1.5">
            <el-button type="primary" size="medium" @click="getList">查询</el-button>
          </el-col>
        </el-row>
        <el-row style="margin-top:20px;margin-bottom:20px">
          <el-col :span="22">
            <el-button type="primary" size="medium" @click="dealWithOrder">配货</el-button>
            <el-button size="medium" @click="1">标记待货</el-button>
          </el-col>
          <el-col :span="2">
            <el-button type="warning" style="float:right" size="medium" @click="1">导入订单</el-button>
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
          <el-table-column type="expand">
            <template slot-scope="scope">
              <div class="expand-header">订单明细:</div>
              <el-table
                :data="scope.row.ErpOrderDetails"
                header-row-class-name="testStyle"
                border
              >
                <el-table-column label="款号" prop="SectionNum" align="center" />
                <el-table-column label="颜色" prop="Color" align="center" />
                <el-table-column label="尺码" prop="Size" align="center" />
                <el-table-column label="数量" prop="Amount" align="center" />
                <el-table-column label="状态" prop="ErpStatus" align="center">
                  <template slot-scope="subScope">
                    <el-tag v-if="subScope.row.ErpStatus === 'pending'" type="info">未处理</el-tag>
                    <el-tag v-if="subScope.row.ErpStatus === 'inStock'" type="success">现货</el-tag>
                    <el-tag v-if="subScope.row.ErpStatus === 'forPickup'" type="danger">待拿货</el-tag>
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </el-table-column>
          <el-table-column label="订单编号" prop="OrderNum" align="center" />
          <el-table-column label="时间" align="center">
            <template slot-scope="scope">
              {{ $moment(scope.row.OrderCreateTime).format('YYYY-MM-DD hh:mm:ss') }}
            </template>
          </el-table-column>
          <el-table-column label="买家公司名" prop="BuyerCompanyName" align="center" />
          <el-table-column label="买家会员名" prop="BuyerMemberName" align="center" />
          <!-- <el-table-column label="订单总金额" prop="GoodsTotalPrice" align="center" width="80" /> -->
          <el-table-column label="实付金额" prop="GoodsRealPrice" align="center" width="80" />
          <el-table-column label="买家留言" prop="BuyerRemake" align="center" />
          <el-table-column label="备注" prop="Rename" align="center" />
          <el-table-column label="订单状态" prop="OrderStatus" align="center" />
          <el-table-column label="仓库状态" prop="ErpStatus" align="center" width="80">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.ErpStatus === 'pending'" type="info">新订单</el-tag>
              <el-tag v-if="scope.row.ErpStatus === 'forPickup'">处理中</el-tag>
              <el-tag v-if="scope.row.ErpStatus === 'waiting'" type="warning">待货</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="80">
            <template slot-scope="scope">
              <el-button type="danger" size="mini" icon="el-icon-delete" circle @click="deleteOrder(scope.row.Id)" />
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script>
import { orderList, toGetGoodsList } from '@/api/order'
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
      orderList(searchAttrs)
        .then(res => {
          if (res.success) {
            this.tableData = res.data.rows
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    dealWithOrder() {
      const orderList = 'OrderList=[' + this.selectList.join(',') + ']'
      toGetGoodsList(orderList)
        .then(res => {
          console.log(res)
        })
        .catch(err => {
          console.log(err)
        })
    },
    handleSelectionChange(list) {
      const selectList_temp = []
      for (const i in list) {
        console.log(list[i]['Id'])
        selectList_temp.push(list[i]['Id'])
      }
      this.selectList = selectList_temp
      // this.selectList = list
      console.log(this.selectList)
    },
    deleteOrder(id) {
      console.log(id)
    }
  }
}
</script>

<style lang="scss">
  .box-card {
    min-height: calc(100vh - 70px);
    .expand-header {
      font-size: 15px;
      font-weight: bold;
      padding-bottom: 5px;
    }
    .testStyle {
      color: #000;
    }
    .el-table td, .el-table th {
      padding: 8px 0;
    }
  }
</style>
