<template>
  <div id="pdfDom" :style="{width: pdfWidth, height: pdfHeght}">
    <div v-for="(item, index) in pagedata" :key="index" style="width:141.73px;height:85.04px">
      {{ item.SectionNum }}
      {{ item.GetGoodsNum }}
      <div :id="'qrDom' + index" />
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
      pdfWidth: '141.73px',
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
      this.pdfHeght = 85.04 * dataLen + 'px'
      for (let i = 0; i < dataLen; i++) {
        new QRCode('qrDom' + i, {
          width: 30,
          height: 30,
          text: `{"section":${this.pagedata[i].SectionNum}, "shoppingcarduid": '245646'}`
        })
      }
    }
  }
}
</script>
