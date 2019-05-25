<template>
  <div id="pdfDom" :style="{width: pdfWidth, height: pdfHeght}">
    <div v-for="(item, index) in pagedata" :key="index" style="width:556.92px;height:340.16px">
      <span style="font-size:35px">{{ item.SectionNum }}</span>
      <div style="float:right">
        <div :id="'qrDom' + index" />
        <span style="font-size:35px">{{ item.GetGoodsNum }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import QRCode from 'qrcodejs2'

export default {
  data() {
    return {
      htmlTitle: new Date(),
      pagedata: [],
      pdfWidth: '556.92px',
      pdfHeght: null
    }
  },
  created() {
    this.pagedata = this.$route.params.data
    console.log(this.pagedata)
    this.$nextTick(function() {
      this.qrcode()
      this.getPdf()
    })
  },
  methods: {
    qrcode() {
      const dataLen = this.pagedata.length
      this.pdfHeght = 340.16 * dataLen + 'px'
      for (let i = 0; i < dataLen; i++) {
        new QRCode('qrDom' + i, {
          width: 240,
          height: 240,
          text: `{"section":${this.pagedata[i].SectionNum}, "shoppingcarduid": '245646'}`
        })
      }
    }
  }
}
</script>
