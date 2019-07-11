<template>
  <div style="width: 100%;background-color:#525659">
    <div id="pdfDom" v-loading.fullscreen="loading" element-loading-text="标签生成中" style="margin: 0 auto;background-color:#ffffff" :style="{width: pdfWidth, height: pdfHeght}">
      <div v-for="(item, i) in pagedata" :key="i" style="float:left;width:445.54px;height:335px">
        <div class="tabLeft">
          <div style="font-size:30px">{{ item.SectionNum }}</div>
          <div style="font-size:30px">{{ item.Color }}</div>
          <div style="font-size:30px">{{ item.Size }}</div>
        </div>
        <div class="tabRight">
          <div :id="'qrDom' + i" />
          <span style="font-size:35px">{{ item.GetGoodsNum }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import QRCode from 'qrcodejs2'
import { getPrintList } from '@/api/stock'

export default {
  data() {
    return {
      loading: true,
      htmlTitle: new Date(),
      printList: [],
      pagedata: [],
      // pdfWidth: '891.08px',
      pdfWidth: '891.08px',
      pdfHeght: null
    }
  },
  created() {
    this.printList = '[' + this.$route.query.id + ']'
    this.getList()
  },
  methods: {
    getList() {
      getPrintList(this.printList)
        .then(res => {
          if (res.success) {
            // this.pagedata = res.data.rows
            const spu = res.data.rows
            // 处理data
            const spuLen = spu.length
            for (let i = 0; i < spuLen; i++) {
              const skus = spu[i].ErpSkus
              const skuLen = skus.length
              for (let j = 0; j < skuLen; j++) {
                const spu_item = {
                  Img: spu[i].Img,
                  Price: spu[i].Price,
                  SectionNum: spu[i].SectionNum,
                  Name: spu[i].Name,
                  GetGoodsNum: spu[i].GetGoodsNum,
                  Color: skus[j].Color,
                  Size: skus[j].Size,
                  Id: skus[j].Id
                }
                for (let k = 0; k < skus[j].Amount; k++) {
                  this.pagedata.push(spu_item)
                }
              }
            }
          }
        })
        .finally(() => {
          this.qrcode()
          this.loading = false
          this.getPdf()
        })
    },
    qrcode() {
      // 计算总长度
      const skuLen = this.pagedata.length
      this.pdfHeght = (167.08 * (skuLen + 1)) + 'px'
      for (let i = 0; i < skuLen; i++) {
        new QRCode('qrDom' + i, {
          width: 240,
          height: 240,
          text: `{"Img":"${this.pagedata[i].Img}","SectionNum":"${this.pagedata[i].SectionNum}","GetGoodsNum":"${this.pagedata[i].GetGoodsNum}","ErpSkuId":"${this.pagedata[i].Id}","Color":"${this.pagedata[i].Color}","Size":"${this.pagedata[i].Size}"}`
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .tabLeft {
    width: 97px;
    margin:16px 18px;
    float:left;
    div {
      margin-top: 10px;
    }
  }
  .tabRight {
      width: 240px;
      margin:16px 18px;
      float:right;
  }
</style>
