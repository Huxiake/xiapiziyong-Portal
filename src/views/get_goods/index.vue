<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>拿货列表</span>
      </div>
      <div class="box-tools">
        <el-row :gutter="8" type="flex" justify="right">
          <el-col :span="17">
            <el-button type="primary" @click="toPrint">打印</el-button>
            <el-button type="warning" @click="handleScanf">扫描入库</el-button>
          </el-col>
          <el-col :span="2">
            <el-select v-model="paginator.GoodsStatus" placeholder="拿货状态">
              <el-option label="全部" value="" />
              <el-option label="待拿货" value="Pending" />
              <el-option label="已拿货" value="Get" />
              <el-option label="缺货" value="Lack" />
            </el-select>
          </el-col>
          <el-col :span="4">
            <el-input
              v-model="paginator.OrderNum"
              placeholder="输入订单号可查询"
            />
          </el-col>
          <el-col :span="1.5">
            <el-button type="primary" @click="getList">查询</el-button>
          </el-col>
        </el-row>
      </div>
      <!-- <el-pagination
        :current-page="paginatorInfo.currentPage + 1"
        :page-size="paginator.limit"
        :total="paginatorInfo.totalCount"
        layout="prev, pager, next"
        style="margin-bottom:10px;float:right"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      /> -->
      <!-- 列表 -->
      <div class="box-table">
        <el-table
          v-loading="loading"
          element-loading-text="数据加载中"
          :data="tableData"
          stripe
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="40" />
          <el-table-column label="缩略图" align="center" width="80">
            <template slot-scope="scope">
              <el-popover
                placement="right-start"
                width="326"
                trigger="hover"
              >
                <img :src="scope.row.ErpSku.ErpSpu.Img" style="margin:0 auto;width:300px;height:300px">
                <img slot="reference" :src="scope.row.ErpSku.ErpSpu.Img" style="width:58px;height:58px">
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column label="订单号" align="center" width="200">
            <template slot-scope="scope">
              <div>{{ scope.row.OrderNum }}</div>
            </template>
          </el-table-column>
          <el-table-column label="款号" align="center">
            <template slot-scope="scope">
              <div>{{ scope.row.ErpSku.SectionNum }}</div>
            </template>
          </el-table-column>
          <el-table-column label="拿货编号" align="center">
            <template slot-scope="scope">
              <el-input v-if="scope.row.Id === editSkuInfo.Id" v-model="editSkuInfo.GetGoodsNum" style="width:180px" />
              <span v-if="scope.row.Id !== editSkuInfo.Id">{{ scope.row.ErpSku.ErpSpu.GetGoodsNum }}</span>
            </template>
          </el-table-column>
          <el-table-column label="SKU" align="center" width="200">
            <template slot-scope="scope">
              <el-input v-if="scope.row.Id === editSkuInfo.Id" v-model="editSkuInfo.SkuName" style="width:180px" />
              <span v-if="scope.row.Id !== editSkuInfo.Id">{{ scope.row.ErpSku.SkuName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="数量" prop="Amount" align="center" width="50">
            <template slot-scope="scope">
              <el-badge :value="scope.row.Amount" class="item" style="padding-top: 8px;" :type="Number(scope.row.Amount) > 1 ? 'danger' : 'info'" />
            </template>
          </el-table-column>
          <el-table-column label="拿货价格" align="center" width="100">
            <template slot-scope="scope">
              <el-input v-if="scope.row.Id === editSkuInfo.Id" v-model="editSkuInfo.Price" style="width:80px" />
              <span v-if="scope.row.Id !== editSkuInfo.Id">{{ scope.row.ErpSku.ErpSpu.Price }}</span>
            </template>
          </el-table-column>
          <el-table-column label="备注" prop="Remark" align="center" />
          <el-table-column label="状态" align="center" width="80">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.IsLack === 0 && scope.row.IsGet === 0" type="info" size="small">待拿货</el-tag>
              <el-tag v-if="scope.row.IsLack === 1" type="danger" size="small">缺货</el-tag>
              <el-tag v-if="scope.row.IsGet === 1" type="success" size="small">已拿货</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" prop="" align="center" width="138">
            <template slot-scope="scope">
              <!-- <el-link :underline="false" @click="handleEditGetGoodsInfo(scope.row)">编辑</el-link> -->
              <a v-if="scope.row.Id === editSkuInfo.Id" style="color:#409eff" @click="handleSkuSave()">保存<br></a>
              <a v-if="scope.row.Id === editSkuInfo.Id" @click="editSkuInfo = {}">取消</a>
              <a v-if="scope.row.Id !== editSkuInfo.Id" style="color:#409eff" @click="handleEditGetGoodsInfo(scope.row)">编辑<br></a>
              <!-- <el-link v-if="scope.row.Id !== editSkuInfo.Id" :underline="false" style="color:#f56c6c" @click="handleSkuDelete(scope.row.Id)">删除</el-link> -->
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          :current-page="paginatorInfo.currentPage"
          :page-sizes="[10, 50, 100, 200, 300, 400]"
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
    <!-- 扫码入库dialog -->
    <!-- <el-dialog :visible.sync="dialogScanfVisible"> -->
    <el-dialog title="扫码入库" :visible.sync="dialogScanfVisible" :close-on-click-modal="false" :modal="true" top="5vh" :lock-scroll="false">
      <el-input ref="scanInput" v-model="goodsInfo" autofocus placeholder="扫码枪输入" @keyup.enter.native="addGoods" @blur="getFocus" />
      <el-card style="margin-top:10px;">
        <el-tag
          v-for="(item, i) in scanfSkuList"
          :key="i"
          :type="Number(item.am) > 1 ? 'primary' : 'info'"
          closable
          style="margin: 5px"
          @close="handleClose(item)"
        >
          <el-badge :value="item.am" class="item">
            {{ item.onum + ' / ' + item.sn }}
          </el-badge>
        </el-tag>
      </el-card>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelScanf">取 消</el-button>
        <el-button type="primary" @click="emitScanf">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getGoodsList, editGetGoodsInfo, scanfMarkGet } from '@/api/getGoods'
import qs from 'qs'

export default {
  data() {
    return {
      dialogScanfVisible: false,
      tableData: [],
      loading: false,
      paginator: {
        offset: 0,
        limit: 10,
        OrderNum: '',
        GoodsStatus: 'Pending'
      },
      selectList: [],
      editSkuInfo: {
        'Id': '',
        'SkuId': null,
        'SpuId': null,
        'GetGoodsNum': '',
        'SkuName': '',
        'Price': '',
        'Amount': ''
      },
      paginatorInfo: {},
      scanfSkuList: [],
      infoArr: [],
      goodsInfo: ''
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      const searchAttrs = qs.stringify(this.paginator)
      getGoodsList(searchAttrs)
        .then(res => {
          if (res.success) {
            console.log(res)
            this.tableData = res.data.rows
            this.paginatorInfo = res.data.paginator
            this.loading = false
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
    },
    toPrint() {
      if (this.selectList.length !== 0) {
        const { href } = this.$router.resolve({
          path: '/downGetGoods',
          query: {
            id: this.selectList.join(',')
          }
        })
        window.open(href, '_blank')
      }
    },
    handleEditGetGoodsInfo(item) {
      console.log(item)
      // Id
      this.editSkuInfo.Id = item.Id
      this.editSkuInfo.SkuId = item.ErpSku.Id
      this.editSkuInfo.SpuId = item.ErpSku.ErpSpu.Id
      // Info
      this.editSkuInfo.GetGoodsNum = item.ErpSku.ErpSpu.GetGoodsNum
      this.editSkuInfo.Price = item.ErpSku.ErpSpu.Price
      this.editSkuInfo.SkuName = item.ErpSku.SkuName
    },
    handleSkuSave() {
      const getGoodsInfo = qs.stringify(this.editSkuInfo)
      editGetGoodsInfo(getGoodsInfo).then(res => {
        if (res.success) {
          this.$message.success('保存成功!')
          this.editSkuInfo = {}
          this.getList()
        } else {
          this.$message.error('处理失败，请重试!')
        }
      })
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
    getFocus() {
      this.$nextTick(() => {
        this.$refs.scanInput.$el.children[0].focus()
      })
    },
    handleScanf() {
      this.dialogScanfVisible = true
      this.getFocus()
    },
    handleClose(tag) {
      this.scanfSkuList.splice(this.scanfSkuList.indexOf(tag), 1)
    },
    // 扫码枪输入相关:
    addGoods() {
      const goodsInfoStr = this.goodsInfo.replace('?', '').replace('“', '"').replace('”', '"').replace('，', ',').replace('｛', '{').replace('｝', '}')
      const infoDetails = JSON.parse(goodsInfoStr)
      this.goodsInfo = ''
      console.log(infoDetails)
      this.scanfSkuList.push(infoDetails)
      // 存入请求参数
      const temp_info = {}
      temp_info.gid = Number(infoDetails.gid)
      temp_info.am = 1
      this.infoArr.push(temp_info)
    },
    emitScanf() {
      console.log(this.infoArr)
      console.log(qs.stringify(this.infoArr))
      console.log(this.infoArr.join(','))
      // const a = Array.from(this.infoArr, i => {
      //   Array.from(i)
      //   return i
      // })
      // const sendInfoArr = []
      // for (let i = 0; i < this.infoArr.length; i++) {
      //   const currentGid = this.infoArr[i].gid
      //   let currentAm = this.infoArr[i].am
      //   for (let j = 0; j < this.infoArr.length; j++) {
      //     if (this.infoArr[j].gid === currentGid) {
      //       const temp_info = {}
      //       temp_info.gid = this.infoArr[j].gid
      //       temp_info.am = currentAm++
      //     }
      //   }
      // }
      scanfMarkGet({ data: this.infoArr }).then(res => {
        console.log(res)
      })
    },
    cancelScanf() {
      this.dialogScanfVisible = false
      this.scanfSkuList = []
      this.goodsInfo = ''
      this.infoArr = []
    }
  }
}
</script>

<style lang="scss">
  .box-card {
    min-height: calc(100vh - 70px);
  }
</style>

