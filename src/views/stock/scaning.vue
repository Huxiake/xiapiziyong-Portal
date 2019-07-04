<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>扫描入库</span>
      </div>
      <el-input ref="scanInput" v-model="goodsInfo" autofocus placeholder="扫码枪输入" style="margin-bottom: 8px;" @keyup.enter.native="addGoods" @blur="getFocus" />
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
              <img :src="scope.row.Img + '?x-oss-process=image/resize,h_300,limit_0'" style="margin:0 auto">
              <img slot="reference" :src="scope.row.Img + '?x-oss-process=image/resize,h_58'">
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="款号" prop="SectionNum" />
        <el-table-column label="颜色" prop="Color" />
        <el-table-column label="码数" prop="Size" />
        <el-table-column label="" width="50">
          <template>
            <el-button type="danger" icon="el-icon-delete" size="small" circle />
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
// import { stockList } from '@/api/stock'
// import qs from 'qs'

export default {
  data() {
    return {
      goodsInfo: '',
      tableData: []
    }
  },
  created() {
    this.getFocus()
  },
  methods: {
    addGoods() {
      this.tableData.push(JSON.parse(this.goodsInfo))
      this.goodsInfo = ''
    },
    getFocus() {
      this.$nextTick(() => {
        this.$refs.scanInput.$el.children[0].focus()
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
</style>

