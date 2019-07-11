<template>
  <div id="pdfDom" v-loading.fullscreen="loading" element-loading-text="标签生成中" :style="{width: pdfWidth, height: pdfHeght}">
    <div v-for="(item_1, i) in pagedata" :key="i" style="float:left;">
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
      loading: true,
      htmlTitle: new Date(),
      printList: [],
      pagedata: [],
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
      getGoodsList(this.printList)
        .then(res => {
          if (res.success) {
            this.pagedata = res.data.rows
          }
        })
        .finally(() => {
          this.qrcode()
          this.loading = false
          this.getPdf()
        })
    },
    qrcode() {
      const skuLen = this.pagedata.length
      this.pdfHeght = (167.08 * (skuLen + 1)) + 'px'
      for (let i = 0; i < skuLen; i++) {
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
