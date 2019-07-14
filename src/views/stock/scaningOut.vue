<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>扫描出库</span>
      </div>
      <el-input ref="scanInput" v-model="goodsInfo" autofocus placeholder="扫码枪输入" style="margin-bottom: 8px;" @keyup.enter.native="addGoods" @blur="getFocus" />
      <div class="tableArea">
        <el-table
          :data="tableData"
        >
          <el-table-column label="缩略图">
            <template slot-scope="scope">
              <el-popover
                placement="right-start"
                width="326"
                trigger="hover"
              >
                <img :src="'https://xkerp-pic.oss-cn-shenzhen.aliyuncs.com/' + scope.row.SectionNum + '.jpg?x-oss-process=image/resize,h_300,limit_0'" style="margin:0 auto">
                <img slot="reference" :src="'https://xkerp-pic.oss-cn-shenzhen.aliyuncs.com/' + scope.row.SectionNum + '.jpg?x-oss-process=image/resize,h_58'">
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column label="款号" prop="SectionNum" />
          <el-table-column label="颜色" prop="Color" />
          <el-table-column label="码数" prop="Size" />
          <el-table-column label="" width="50">
            <template slot-scope="scope">
              <el-button type="danger" icon="el-icon-delete" size="small" circle @click="deleteInputRow(scope.$index)" />
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="btnArea">
        <el-row type="flex" center>
          <el-button style="margin:0 auto;" type="primary" @click="pushScaning">确认出库</el-button>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script>
import { scaningOut } from '@/api/stock'
// import qs from 'qs'

export default {
  data() {
    return {
      goodsInfo: '',
      tableData: [],
      idList: []
    }
  },
  created() {
    this.getFocus()
  },
  methods: {
    addGoods() {
      const infoDetails = JSON.parse(this.goodsInfo.replace('?', ''))
      this.tableData.push(infoDetails)
      this.idList.push(infoDetails.ErpSkuId)
      this.goodsInfo = ''
    },
    getFocus() {
      this.$nextTick(() => {
        this.$refs.scanInput.$el.children[0].focus()
      })
    },
    deleteInputRow(index) {
      this.tableData.splice(index, 1)
    },
    pushScaning() {
      if (this.tableData.length === 0) return
      const ids = '[' + Array.from(this.tableData, item => item.ErpSkuId).join(',') + ']'
      this.$confirm('是否确认出库', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        scaningOut(ids).then(res => {
          if (res.success) {
            this.$message.success('出库成功!')
            this.$router.go(-1)
          }
        })
      })
      scaningOut(ids).then(res => {
        console.log(res)
      })
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
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  .tableArea {
    height: calc(100vh - 260px);
  }
  .btnArea {
    width: calc(100vw - 180px);
  }
</style>
