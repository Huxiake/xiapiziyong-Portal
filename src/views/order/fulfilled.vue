<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>已配货订单</span>
      </div>
      <div class="box-tools">
        <el-row :gutter="16" type="flex" justify="right">
          <el-col :span="3" :offset="20">
            <el-input
              v-model="paginator.OrderNum"
              size="mini"
              placeholder="请输入款号"
            />
          </el-col>
          <el-col :span="1.5">
            <el-button type="primary" size="mini" @click="getList">查询</el-button>
          </el-col>
        </el-row>
        <el-row style="margin-top:20px;margin-bottom:20px">
          <el-col :span="22">
            <el-button type="primary" size="mini" @click="dealWithOrder">完成拣货</el-button>
          </el-col>
        </el-row>
      </div>
      <div class="box-table">
        <el-table
          v-loading="tableLoading"
          element-loading-text=""
          :data="tableData"
          header-cell-class-name="orderHeaderStyle"
          cell-class-name="testStyle"
          :default-expand-all="true"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="40" />
          <el-table-column type="expand" width="20">
            <template slot-scope="scope">
              <el-table
                :data="scope.row.ErpOrderDetails"
                :show-header="false"
                header-row-class-name="expand-header"
                border
                style="padding:0px;"
              >
                <!-- 商品信息框 -->
                <el-table-column width="265">
                  <template slot-scope="subScope">
                    <div class="goodsInfo-left">
                      <el-popover
                        placement="right-start"
                        width="326"
                        trigger="hover"
                      >
                        <img :src="subScope.row.SpuPicURL" style="margin:0 auto;width:300px;height:300px">
                        <img slot="reference" :src="subScope.row.SpuPicURL" style="width:58px;height:58px;border:2px solid #e3e3e3;">
                      </el-popover>
                    </div>
                    <div class="goodsInfo-right">
                      <div style="line-height:16px;">
                        <a :href="subScope.row.SaleURL" target="_blank" style="color:#428bca">{{ subScope.row.SkuName }}</a>
                        <span>*</span>
                        <el-badge :value="subScope.row.Amount" class="item" style="padding-top: 8px;" :type="Number(subScope.row.Amount) > 1 ? 'danger' : 'info'" />
                      </div>
                      <div>
                        {{ subScope.row.SectionNum }}
                      </div>
                      <div>
                        {{ scope.row.CurrencyCode + ' ' + subScope.row.SalePrice }}
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <!-- 中间的 -->
                <el-table-column align="center">
                  <!-- <template slot-scope="subScope">
                    <el-input v-if="subScope.row.ErpOrder.Id = newOrderDetailsInfo.ErpOrder.Id && subScope.row.new" v-model="newOrderDetailsInfo.Amount" />
                    <span v-else>{{ subScope.row.Amount }}</span>
                  </template> -->
                </el-table-column>
                <!-- 状态框 -->
                <el-table-column prop="ErpStatus" align="center" width="100">
                  <template slot-scope="subScope">
                    <el-tag v-if="subScope.row.ErpStatus === 'pending'" type="info" size="small">未处理</el-tag>
                    <el-tag v-if="subScope.row.ErpStatus === 'fulfilled'" type="success" size="small">现货</el-tag>
                    <el-tag v-if="subScope.row.ErpStatus === 'get'" type="success" size="small">已拿货</el-tag>
                    <el-tag v-if="subScope.row.ErpStatus === 'forPickup'" type="warning" size="small">待拿货</el-tag>
                    <el-tag v-if="subScope.row.ErpStatus === 'lack'" type="danger" size="small">待处理缺货</el-tag>
                  </template>
                </el-table-column>
                <!-- 操作框 -->
                <el-table-column align="center" width="80">
                  <!-- <template slot-scope="subScope"> -->
                  <!-- <el-button v-if="subScope.row.ErpOrder.Id = newOrderDetailsInfo.ErpOrder.Id && subScope.row.new" type="primary" size="small" @click="newOrderDetalisSubmit">保存</el-button> -->
                  <!-- <el-button v-else size="small" @click="handleDeleteOrderDetails(subScope.row.Id)">删除</el-button> -->
                  <!-- </template> -->
                </el-table-column>
              </el-table>
            </template>
          </el-table-column>
          <el-table-column label="商品信息" prop="OrderNum" width="205" />
          <el-table-column label="时间" align="center">
            <template slot-scope="scope">
              {{ $moment(scope.row.OrderCreateTime).format('YYYY-MM-DD hh:mm:ss') }}
            </template>
          </el-table-column>
          <el-table-column :formatter="tableFormatter" label="订单金额" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.CurrencyCode + ' ' + scope.row.GoodsTotalPrice }}</span>
            </template>
          </el-table-column>
          <el-table-column :formatter="tableFormatter" label="买家会员名" prop="BuyerMemberName" align="center" />
          <el-table-column :formatter="tableFormatter" label="买家留言" prop="BuyerRemake" align="center" />
          <el-table-column :formatter="tableFormatter" label="备注" prop="Remark" align="center" />
          <el-table-column :formatter="tableFormatter" label="店铺" prop="ShopName" align="center" />
          <el-table-column label="仓库状态" prop="ErpStatus" align="center" width="100">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.ErpStatus === 'fulfilled'" type="success" size="small">已配货</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="80">
            <template slot-scope="scope">
              <el-button type="danger" size="mini" icon="el-icon-delete" circle @click="handleDeleteOrder(scope.row.Id)" />
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          :current-page="paginatorInfo.currentPage + 1"
          :page-sizes="[50, 100, 200, 300, 400]"
          :page-size="paginator.limit"
          :total="paginatorInfo.totalCount"
          layout="total, sizes, prev, pager, next, jumper"
          style="margin-top:20px;margin-bottom:20px;float:right"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          @prev-click="prevPage"
          @next-click="nextPage"
        />
      </div>
    </el-card>
  </div>
</template>

<script>
import { orderList, markCompleted, deleteOrder } from '@/api/order'
import qs from 'qs'

export default {
  data() {
    return {
      tableData: [],
      tableLoading: false,
      paginator: {
        offset: 0,
        limit: 20,
        OrderNum: '',
        ErpStatus: '["fulfilled"]'
      },
      selectList: [],
      paginatorInfo: {}
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.tableLoading = true
      const searchAttrs = qs.stringify(this.paginator)
      orderList(searchAttrs)
        .then(res => {
          if (res.success) {
            this.tableData = res.data.rows
            this.paginatorInfo = res.data.paginator
            this.tableLoading = false
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    dealWithOrder() {
      const orderList = 'OrderList=[' + this.selectList.join(',') + ']'
      markCompleted(orderList)
        .then(res => {
          if (res.success) {
            this.$message.success('标记成功')
            this.getList()
          }
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
      this.$confirm('此操作将删除该订单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteOrder(id).then(res => {
          if (res.success) {
            this.$message.success('删除成功!')
            this.getList()
          }
        })
      })
    },
    tableFormatter(row, column, cellValue) {
      let res = false
      if (cellValue === '') {
        res = true
      }
      return res ? '-' : cellValue
    },
    // 分页下一页
    handleCurrentChange(val) {
      this.paginator.offset = this.paginator.limit * (val - 1)
      this.getList()
    },
    // 分页size改变
    handleSizeChange(val) {
      this.paginator.limit = val
      this.getList()
    },
    prevPage() {
      this.paginator.offset = this.paginator.offset - this.paginator.limit
    },
    nextPage() {
      this.paginator.offset = this.paginator.offset + this.paginator.limit
    }
  }
}
</script>

<style lang="scss">
  .box-card {
    min-height: calc(100vh - 70px);
    .orderHeaderStyle {
      background-color: #EEE;
    }
    .expand-header {
      height: 0px;
    }
    .testStyle {
      background-color: #fafafa;
      border-bottom: 0;
    }
    .el-table td, .el-table th {
      padding: 8px 0;
      .el-table__expanded-cell {
        padding: 0px;
      }
    }
    .goodsInfo-left {
      width: 70px;
      float: left;
    }
    .goodsInfo-right {
      width: 174px;
      float: left;
    }
  }
</style>

<style lang="scss">
  .el-table__body {
    // border-left: 1px solid #ebeef5;
    // border-right: 1px solid #ebeef5;
  }
</style>
