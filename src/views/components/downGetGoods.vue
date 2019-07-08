<template>
  <div id="pdfDom" :style="{width: pdfWidth, height: pdfHeght}">
    <div v-for="(item_1, i) in pagedata" :key="i">
      <!-- <div style="width:445.54px;height:336.16px"> -->
      <div style="width:445.54px;height:334px">
        <div class="tabLeft">
          <div style="font-size:35px">{{ item_1.ErpSku.ErpSpu.SectionNum }}</div>
          <div style="font-size:30px">{{ item_1.ErpSku.Color }}</div>
          <div style="font-size:35px">{{ item_1.ErpSku.Size }}</div>
        </div>
        <div class="tabRight">
          <div :id="'qrDom' + i" />
          <span style="font-size:35px">{{ item_1.GetGoodsNum }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import QRCode from 'qrcodejs2'
import { getGoodsList } from '@/api/getGoods'

export default {
  data() {
    return {
      htmlTitle: new Date(),
      printList: [],
      pagedata: [],
      pdfWidth: '445.54px',
      // pdfWidth: '141.73px',
      pdfHeght: null
    }
  },
  created() {
    this.printList = '?id=[' + this.$route.params.data.join(',') + ']'
    this.getList()
    // this.$nextTick(function() {
    //   this.qrcode()
    //   this.getPdf()
    // })
  },
  methods: {
    getList() {
      getGoodsList(this.printList)
        .then(res => {
          if (res.success) {
            this.pagedata = res.data.rows
            console.log(this.pagedata)
          }
        })
        .finally(() => {
          this.qrcode()
          this.getPdf()
        })
    },
    qrcode() {
      console.log('this.pagedata', this.pagedata)
      const skuLen = this.pagedata.length
      // 计算总长度
      // let skuLen = 0
      // for (let j = 0; j < spuLen; j++) {
      //   skuLen = skuLen + this.pagedata[j].ErpSkus.length
      // }
      console.log('skuLen', skuLen)
      this.pdfHeght = 334.16 * skuLen + 'px'
      for (let i = 0; i < skuLen; i++) {
        // const erpSkusLen = this.pagedata[i].ErpSkus.length
        new QRCode('qrDom' + i, {
          width: 240,
          height: 240,
          text: `{"Img":"${this.pagedata[i].ErpSku.ErpSpu.Img}","SectionNum":"${this.pagedata[i].ErpSku.ErpSpu.SectionNum}","GetGoodsNum":"${this.pagedata[i].GetGoodsNum}","ErpSkuId":"${this.pagedata[i].ErpSku.Id}","Color":"${this.pagedata[i].ErpSku.Color}","Size":"${this.pagedata[i].ErpSku.Size}"}`
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .tabLeft {
    width: 97px;
    margin:18px 18px;
    float:left;
    div {
      margin-top: 10px;
    }
  }
  .tabRight {
      width: 240px;
      margin:18px 18px;
      float:right;
  }
</style>
