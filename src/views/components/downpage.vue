<template>
  <div id="pdfDom" :style="{width: pdfWidth, height: pdfHeght}">
    <div v-for="(item_1, i) in pagedata" :key="i">
      <div v-for="(item_2, j) in item_1.ErpSkus" :key="j" style="width:445.54px;height:340.16px">
        <!-- <div v-for="(item_2, j) in item_1.ErpSkus" :key="j" style="width:556.92px;height:340.16px"> -->
        <span style="font-size:35px">{{ item_1.SectionNum }}</span>
        <div style="float:right">
          <div :id="'qrDom' + i + j" />
          <span style="font-size:35px">{{ item_1.GetGoodsNum }}</span>
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
      htmlTitle: new Date(),
      printList: [],
      pagedata: [],
      pdfWidth: '445.54px',
      // pdfWidth: '141.73px',
      pdfHeght: null
    }
  },
  created() {
    this.printList = '[' + this.$route.params.data.join(',') + ']'
    this.getList()
    // this.$nextTick(function() {
    //   this.qrcode()
    //   this.getPdf()
    // })
  },
  methods: {
    getList() {
      getPrintList(this.printList)
        .then(res => {
          if (res.success) {
            this.pagedata = res.data.rows
          }
        })
        .finally(() => {
          this.qrcode()
          this.getPdf()
        })
    },
    qrcode() {
      const dataLen = this.pagedata.length
      this.pdfHeght = 340.16 * dataLen + 'px'
      for (let i = 0; i < dataLen; i++) {
        const erpSkusLen = this.pagedata[i].ErpSkus.length
        for (let j = 0; j < erpSkusLen; j++) {
          console.log(this.pagedata)
          new QRCode('qrDom' + i + j, {
            width: 240,
            height: 240,
            text: `{"SectionNum":${this.pagedata[i].SectionNum}, "GetGoodsNum": ${this.pagedata[i].GetGoodsNum}, "ErpSkuId": ${this.pagedata[i].ErpSkus[j].Id}, "Amount": ${this.pagedata[i].ErpSkus[j].Amount}}`
          })
        }
      }
    }
  }
}
</script>
