<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>扫描入库</span>
      </div>
      <el-input ref="scanInput" v-model="goodsInfo" autofocus placeholder="扫码枪输入" @keyup.enter.native="addAnswer" @blur="getFocus" />
    </el-card>
  </div>
</template>

<script>
// import { stockList } from '@/api/stock'
// import qs from 'qs'

export default {
  data() {
    return {
      goodsInfo: ''
    }
  },
  created() {
    this.getFocus()
  },
  methods: {
    addAnswer() {
      console.log(this.goodsInfo)
    },
    getFocus() {
      this.$nextTick(() => {
        console.log(this.$refs.scanInput.$el.children[0].focus())
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

