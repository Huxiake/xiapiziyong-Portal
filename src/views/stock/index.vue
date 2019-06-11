<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>库存管理</span>
      </div>
      <div class="box-tools">
        <el-row :gutter="16" type="flex" justify="right">
          <el-col :span="3" :offset="20">
            <el-input
              v-model="parmas.first"
              placeholder="请输入款号"
            />
          </el-col>
          <el-col :span="1.5">
            <el-button type="primary" @click="1">查询</el-button>
          </el-col>
        </el-row>
        <el-row style="margin-top:20px;margin-bottom:20px" type="flex" justify="space-around">
          <el-col :span="22">
            <el-button type="primary" @click="1">扫描入库</el-button>
            <el-button type="primary" @click="toPrint()">打印标签</el-button>
          </el-col>
          <el-col :span="2">
            <el-upload
              class="upload-demo"
              action=""
              style="float:right"
              :show-file-list="false"
              :before-upload="beforeXlsUpload"
              :http-request="uploadXlsFile"
            >
              <el-button type="warning">上传款式</el-button>
            </el-upload>
          </el-col>
        </el-row>
      </div>
      <div class="box-table">
        <!-- spu列表 -->
        <el-table
          :data="stockData"
          stripe
          @row-click="toSectionDetails"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column label="缩略图" align="center" width="80">
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
          <el-table-column label="标题" align="center" prop="Name" />
          <el-table-column label="款号" align="center" prop="SectionNum" />
          <el-table-column label="拿货编号" align="center" prop="GetGoodsNum" />
          <el-table-column label="价格" align="center" prop="Price" />
          <el-table-column label="备注" align="center" prop="Remark" />
          <el-table-column label="操作" align="center" width="150">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="handleSpuEdit(scope.row.Id)">编辑</el-button>
              <el-button size="mini" @click="handleSpuDelete(scope.row.Id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
    <!-- 编辑spu的dialog -->
    <el-dialog title="编辑款式" :visible.sync="dialogEditVisible">
      <el-form :model="editSpuInfo" label-position="right" label-width="100px">
        <el-form-item label="图片">
          <el-upload
            ref="spuImgUpload"
            class="avatar-uploader"
            action=""
            :show-file-list="false"
            :auto-upload="false"
            :on-change="handleImgChange"
            :http-request="uploadImgFile"
          >
            <img v-if="imageUrl_temp" :src="imageUrl_temp" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>
        <el-form-item label="标题">
          <el-input v-model="editSpuInfo.Name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="款号">
          <el-input v-model="editSpuInfo.SectionNum" autocomplete="off" />
        </el-form-item>
        <el-form-item label="拿货编号">
          <el-input v-model="editSpuInfo.GetGoodsNum" autocomplete="off" />
        </el-form-item>
        <el-form-item label="价格">
          <el-input v-model="editSpuInfo.Price" autocomplete="off" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="editSpuInfo.Remark" type="textarea" autocomplete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogEditVisible = false">取 消</el-button>
        <el-button type="primary" @click="editSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { stockList, uploadSpuXls, uploadSpuPic, updateErpSpu, deleteErpSpu } from '@/api/stock'
// import qs from 'qs'

export default {
  data() {
    return {
      dialogEditVisible: false,
      parmas: {
        first: ''
      },
      imageUrl_temp: '',
      editSpuInfo: {
        Id:	'',
        Status: '',
        SectionNum: '',
        Name: '',
        Img: '',
        GetGoodsNum: '',
        Price: '',
        Remark: ''
      },
      stockData: [],
      paginator: {
        offset: 0,
        limit: 20
      },
      printList: []
    }
  },
  created() {
    this.getStockList(this.paginator.offset, this.paginator.limit)
  },
  methods: {
    getStockList(offset, limit) {
      stockList(offset, limit).then(res => {
        if (res.success) {
          this.stockData = res.data.rows
        }
      })
    },
    toPrint() {
      // this.getPdf()
      this.$router.push({
        name: 'downpage',
        params: {
          data: this.printList
        }
      })
    },
    toSectionDetails(row, column, event) {
      console.log(event.target.innerHTML)
      if (event.target.innerHTML !== '编辑' && event.target.innerHTML !== '删除') {
        this.$router.push({
          name: 'stockDetails',
          params: { id: row.Id }
        })
      }
    },
    handleSpuEdit(id) {
      const stockDataLen = this.stockData.length
      for (let i = 0; i < stockDataLen; i++) {
        if (this.stockData[i]['Id'] === id) {
          this.editSpuInfo = JSON.parse(JSON.stringify(this.stockData[i]))
          this.imageUrl_temp = this.editSpuInfo['Img']
        }
      }
      this.dialogEditVisible = true
    },
    handleSpuDelete(id) {
      this.$confirm('此操作将删除该款式, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteErpSpu(id).then(res => {
          if (res.success) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getStockList()
          }
        })
      })
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
      uploadSpuXls(form).then(res => {
        if (res.success) {
          this.$message.success(res.msg)
          this.getStockList()
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    handleImgChange(file) {
      console.log(file)
      const isJPG = file.raw.type === 'image/jpeg' || file.raw.type === 'image/png'
      const isLt200KB = file.raw.size < 307200

      if (!isJPG) {
        this.$message.error('图片只能是 JPG 或 PNG 格式')
      }
      if (!isLt200KB) {
        this.$message.error('图片大小不能超过 300KB')
      }
      if (isJPG && isLt200KB) {
        this.imageUrl_temp = URL.createObjectURL(file.raw)
      }
    },
    uploadImgFile(item) {
      const fileObj = item.file
      // FormData 对象
      const form = new FormData()
      // 文件对象
      form.append('img', fileObj)
      form.append('size', fileObj.size)
      form.append('sectionNum', this.editSpuInfo.SectionNum)
      uploadSpuPic(form).then(res => {
        if (!res.success) {
          this.$message.error('图片上传失败')
        }
      })
    },
    editSubmit() { // 提交修改
      this.dialogEditVisible = false
      this.editSpuInfo.Img = 'https://xkerp-pic.oss-cn-shenzhen.aliyuncs.com/' + this.editSpuInfo.SectionNum + '.jpg'
      updateErpSpu(this.editSpuInfo).then(res => {
        if (res.success) {
          this.$refs.spuImgUpload.submit()
          this.getStockList()
          this.editSpuInfo = {}
        } else {
          this.$message.error('修改失败，请稍后重试')
        }
      })
    },
    handleSelectionChange(list) {
      const printList_temp = []
      for (const i in list) {
        console.log(i)
        printList_temp.push(list[i]['Id'])
      }
      this.printList = printList_temp
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

