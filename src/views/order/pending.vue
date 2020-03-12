<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>待处理订单</span>
      </div>
      <div class="box-tools">
        <el-row :gutter="4" type="flex" justify="end">
          <el-col :span="4">
            <el-input
              v-model="paginator.OrderNum"
              size="mini"
              placeholder="输入订单号查询"
            />
          </el-col>
          <el-col :span="1.5">
            <el-button type="primary" size="mini" @click="getList">查询</el-button>
          </el-col>
        </el-row>
        <el-row :gutter="16" style="margin-top:15px;margin-bottom:15px" type="flex" justify="space-between">
          <el-col :span="4">
            <el-button type="primary" size="mini" @click="dealWithOrder">配货</el-button>
            <el-button type="warning" size="mini" @click="calcProfit">计算利润</el-button>
          </el-col>
          <el-col :span="2">
            <el-button size="mini" type="primary" style="font-size:12px;" @click="addOrder">新增</el-button>
            <el-upload
              class="upload-demo"
              action=""
              style="float:right"
              :show-file-list="false"
              :before-upload="beforeXlsUpload"
              :http-request="uploadXlsFile"
            >
              <el-button size="mini" type="warning" style="font-size:12px;">导入</el-button>
            </el-upload>
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
          <el-table-column type="selection" width="45" />
          <el-table-column type="expand" width="20">
            <template slot-scope="scope">
              <el-table
                :data="scope.row.ErpOrderDetails"
                :show-header="false"
                header-row-class-name="expand-header"
                border
                style="padding:0px;"
                @cell-mouse-enter="enterOrderDetailsOption"
                @cell-mouse-leave="leaveOrderDetailsOption"
              >
                <!-- 商品信息框 -->
                <el-table-column width="305">
                  <template slot-scope="subScope">
                    <div class="goodsInfo-left">
                      <el-popover
                        placement="right-start"
                        width="326"
                        trigger="hover"
                      >
                        <img :src="subScope.row.SpuPicURL" style="margin:0 auto;width:300px;height:300px">
                        <img slot="reference" :src="subScope.row.SpuPicURL" style="width:66px;height:66px;border:2px solid #e3e3e3;">
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
                <el-table-column align="center" />
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
                <el-table-column align="center" width="180">
                  <template slot-scope="subScope">
                    <a v-show="deleteOrderDetailsBtnId === subScope.row.Id" type="primary" size="small" @click="handleDeleteOrderDetails(subScope.row.Id)">
                      删除
                    </a>
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </el-table-column>
          <el-table-column label="商品信息" width="245">
            <template slot-scope="scope">
              <span :style="{ color: calcIsOverTime(scope.row.OrderCreateTime) ? '#CE0000' : '' }">{{ scope.row.OrderNum }}</span>
              <el-tag v-if="calcIsOverTime(scope.row.OrderCreateTime) === 3" size="mini" style="background-color:#CE0000;color:#FFFFFF;margin-left: 5px">急</el-tag>
              <el-tag v-else-if="calcIsOverTime(scope.row.OrderCreateTime) === 2" size="mini" style="background-color:#fac900;color:#FFFFFF;margin-left: 5px">紧</el-tag>
            </template>
          </el-table-column>
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
          <el-table-column :formatter="tableFormatter" label="买家信息" prop="BuyerMemberName" align="center">
            <template slot-scope="scope">
              {{ scope.row.AreaName + ' ' + scope.row.BuyerMemberName }}
            </template>
          </el-table-column>
          <el-table-column :formatter="tableFormatter" label="买家留言" prop="BuyerRemake" align="center" />
          <el-table-column :formatter="tableFormatter" label="备注" prop="Remark" align="center" />
          <el-table-column :formatter="tableFormatter" label="订单利润" prop="Profit" align="center" />
          <el-table-column :formatter="tableFormatter" label="店铺" prop="ShopName" align="center" />
          <el-table-column label="仓库状态" prop="ErpStatus" align="center" width="100">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.ErpStatus === 'pending'" type="info" size="small">新订单</el-tag>
              <el-tag v-if="scope.row.ErpStatus === 'forPickup'" size="small">处理中</el-tag>
              <el-tag v-if="scope.row.ErpStatus === 'waiting'" type="danger" size="small">待货</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="180">
            <template slot-scope="scope">
              <el-button type="danger" size="mini" @click="handleDeleteOrder(scope.row.Id)">
                删除
              </el-button>
              <el-button size="mini" @click="addOrderDetails(scope.row.Id)">
                添加
              </el-button>
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
    <!-- 新增订单 -->
    <el-dialog title="新增订单" :visible.sync="dialogAddOrderVisible">
      <el-form :model="newOrderInfo" label-position="right" label-width="100px">
        <el-form-item label="订单编号">
          <el-input v-model="newOrderInfo.OrderNum" autocomplete="off" />
        </el-form-item>
        <el-form-item label="买家公司">
          <el-input v-model="newOrderInfo.BuyerCompanyName" autocomplete="off" />
        </el-form-item>
        <el-form-item label="买家名">
          <el-input v-model="newOrderInfo.BuyerMemberName" autocomplete="off" />
        </el-form-item>
        <el-form-item label="订单金额">
          <el-input v-model="newOrderInfo.GoodsRealPrice" autocomplete="off" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="newOrderInfo.Remark" type="textarea" autocomplete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAddOrderVisible = false">取 消</el-button>
        <el-button type="primary" @click="newOrderSubmit">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 添加明细 -->
    <el-dialog title="添加订单明细" :visible.sync="dialogAddOrderDetalisVisible">
      <el-form :model="newOrderDetailsInfo" label-position="right" label-width="100px">
        <el-form-item>
          <img style="width: 100px; height: 100px" :src="newOrderDetailsInfo.SpuPicURL !== '' ? newOrderDetailsInfo.SpuPicURL : 'https://xkerp-pic.oss-cn-shenzhen.aliyuncs.com/zhanwei.png'">
        </el-form-item>
        <el-form-item label="款式编号">
          <el-input v-model="newOrderDetailsInfo.SectionNum" autocomplete="off" @change="changeSectionID" />
        </el-form-item>
        <el-form-item label="SKU">
          <el-select v-model="newOrderDetailsInfo.SkuName">
            <el-option
              v-for="(item, index) in skuInfo"
              :key="index"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="售价">
          <el-input v-model="newOrderDetailsInfo.SalePrice" autocomplete="off" />
        </el-form-item>
        <el-form-item label="数量">
          <el-input v-model="newOrderDetailsInfo.Amount" autocomplete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAddOrderDetalisVisible = false;skuInfo = {};newOrderDetailsInfoInit()">取 消</el-button>
        <el-button type="primary" @click="newOrderDetalisSubmit">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 扫描入库 -->
    <el-dialog title="扫码配货" :visible.sync="dialogPickVisible">
      <el-form :model="newOrderInfo" label-position="right" label-width="100px">
        <el-form-item label="订单编号">
          <el-input v-model="newOrderInfo.OrderNum" autocomplete="off" />
        </el-form-item>
        <el-form-item label="买家公司">
          <el-input v-model="newOrderInfo.BuyerCompanyName" autocomplete="off" />
        </el-form-item>
        <el-form-item label="买家名">
          <el-input v-model="newOrderInfo.BuyerMemberName" autocomplete="off" />
        </el-form-item>
        <el-form-item label="订单金额">
          <el-input v-model="newOrderInfo.GoodsRealPrice" autocomplete="off" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="newOrderInfo.Remark" type="textarea" autocomplete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAddOrderVisible = false">取 消</el-button>
        <el-button type="primary" @click="newOrderSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  orderList,
  toGetGoodsList,
  markWaiting,
  uploadOrder,
  deleteOrder,
  addErpOrder,
  addErpOrderDetails,
  deleteOrderDetails,
  getSpuInfoBySectionID,
  calcProfitByOrderIDList
} from '@/api/order'
import qs from 'qs'

export default {
  /**
   * pending 待处理
   * waiting 待货
   * forPickup 拿货中
   * fulfilled 已配货
   * complete 完成
   */
  data() {
    return {
      dialogAddOrderVisible: false,
      dialogAddOrderDetalisVisible: false,
      dialogPickVisible: false,
      deleteOrderDetailsBtnId: '',
      tableLoading: false,
      newOrderInfo: {},
      newOrderDetailsInfo: {
        ErpOrder: {
          Id: ''
        },
        SectionNum: '',
        Color: '',
        Size: '',
        SkuName: '',
        SalePrice: '',
        Amount: '',
        ErpStatus: 'pending',
        SpuPicURL: '',
        SaleURL: ''
      },
      tableData: [],
      paginator: {
        offset: 0,
        limit: 50,
        OrderNum: '',
        ErpStatus: '["pending","waiting","forPickup"]'
      },
      selectList: [],
      skuInfo: {},
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
    newOrderDetailsInfoInit() {
      this.newOrderDetailsInfo = {
        ErpOrder: {
          Id: ''
        },
        SectionNum: '',
        Color: '',
        Size: '',
        Amount: '',
        ErpStatus: 'pending',
        SpuPicURL: '',
        SaleURL: ''
      }
    },
    dealWithOrder() {
      this.tableLoading = true
      const orderList = 'OrderList=[' + this.selectList.join(',') + ']'
      toGetGoodsList(orderList)
        .then(res => {
          this.$message.success('配货成功！等待拿货')
          this.getList()
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => {
          this.tableLoading = false
        })
    },
    handleSelectionChange(list) {
      const selectList_temp = []
      for (const i in list) {
        console.log(list[i]['Id'])
        selectList_temp.push(list[i]['Id'])
      }
      this.selectList = selectList_temp
    },
    handleMarkWaiting() {
      const orderList = 'OrderList=[' + this.selectList.join(',') + ']'
      markWaiting(orderList).then(res => {
        if (res.success) {
          this.$message.success('标记成功')
          this.getList()
        }
      })
        .catch(e => {
          console.log(e)
        })
    },
    handleDeleteOrder(id) {
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
    beforeXlsUpload(file) {
      const pattern = /^(\S)*.xlsx/
      const isXlsx = pattern.test(file.name)

      if (!isXlsx) {
        this.$message.error('文件只能是 xlsx 格式')
      }
      return isXlsx
    },
    uploadXlsFile(item) {
      const fileObj = item.file
      // FormData 对象
      const form = new FormData()
      // 文件对象
      form.append('file', fileObj)
      uploadOrder(form).then(res => {
        if (res.success) {
          this.$message.success(res.msg)
          this.getList()
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    addOrder() {
      this.dialogAddOrderVisible = true
    },
    addOrderDetails(orderId) {
      this.dialogAddOrderDetalisVisible = true
      this.newOrderDetailsInfo.ErpOrder.Id = orderId
    },
    newOrderSubmit() {
      this.newOrderInfo.ErpStatus = 'pending'
      addErpOrder(this.newOrderInfo).then(res => {
        if (res.success) {
          this.dialogAddOrderVisible = false
          this.newOrderInfo = {}
          this.$message.success('新增成功！')
          this.getList()
        }
      }).catch(e => {
        console.log(e)
      })
    },
    newOrderDetalisSubmit() {
      console.log(this.newOrderDetailsInfo)
      addErpOrderDetails(this.newOrderDetailsInfo).then(res => {
        if (res.success) {
          this.dialogAddOrderDetalisVisible = false
          this.$message.success('添加订单详情成功！')
          this.newOrderDetailsInfoInit()
          this.getList()
        }
      }).catch(e => {
        console.log(e)
      })
    },
    handleDeleteOrderDetails(Id) {
      this.$confirm('此操作将删除该订单详情, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteOrderDetails(Id).then(res => {
          this.$message.success('删除成功!')
          this.getList()
        })
      })
    },
    // 根据填入的款式ID获取spu详情
    changeSectionID(sID) {
      getSpuInfoBySectionID(sID).then(res => {
        if (res.success) {
          const data = res.data.rows
          console.log('data', data)
          this.skuInfo = Array.from(data.ErpSkus, item => item.SkuName)
          this.newOrderDetailsInfo.SpuPicURL = data.Img
          this.newOrderDetailsInfo.SaleURL = data.OriginURL
        }
        console.log('newOrderDetailsInfo', this.newOrderDetailsInfo)
      }).catch(e => {
        console.log(e)
      })
    },
    scanEnter() {
      this.dialogPickVisible = true
    },
    enterOrderDetailsOption(row, column, cell, event) {
      this.deleteOrderDetailsBtnId = row.Id
    },
    leaveOrderDetailsOption(row, column, cell, event) {
      if (this.deleteOrderDetailsBtnId === row.Id) {
        this.deleteOrderDetailsBtnId = ''
      }
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
    },
    // 计算是否超时
    calcIsOverTime(orderTime) {
      // orderTime - now
      if (this.$moment(this.$moment(orderTime).add(3, 'days').format('YYYY-MM-DD')).isBefore(this.$moment())) {
        return 3
      } else if (this.$moment(this.$moment(orderTime).add(2, 'days').format('YYYY-MM-DD')).isBefore(this.$moment())) {
        return 2
      }
      return false
    },
    calcProfit() {
      this.tableLoading = true
      const orderList = 'OrderList=[' + this.selectList.join(',') + ']'
      calcProfitByOrderIDList(orderList)
        .then(res => {
          this.$message.success('计算成功！')
          this.getList()
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => {
          this.tableLoading = false
        })
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

