<template>
  <!-- <div id="pdfDom" v-loading.fullscreen="loading" element-loading-text="标签生成中" :style="{width: pdfWidth, height: pdfHeght}">
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
  </div> -->
  <div style="width: 100%;background-color:#525659">
    <div id="pdfDom" v-loading.fullscreen="loading" element-loading-text="标签生成中" style="margin: 0 auto;background-color:#ffffff" :style="{width: pdfWidth, height: pdfHeght}">
      <div v-for="(item, i) in pagedata" :key="i" style="float:left;width:558.34px;height:335px">
        <div class="tabLeft">
          <div style="width:100%;height:20%;font-size:50px;font-weight:bold">{{ item.ErpSku.ErpSpu.SectionNum }}&nbsp;&nbsp;<span style="font-size:52px">{{ item.ErpSku.Size.replace('码', '') }}</span></div>
          <div style="display:table-cell;width:207px;height:126px;font-size:32px;text-align:center;vertical-align:middle">{{ item.ErpSku.Color }}</div>
          <div style="width:100%;height:40%;font-size:38px;font-weight:bold;margin-top:8px">{{ item.GetGoodsNum.replace(/\#+/g, `&#10;`).replace(/\*/g, `&nbsp;&nbsp;`) }}</div>
        </div>
        <div class="tabRight">
          <div :id="'qrDom' + i" />
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
      pdfWidth: '1116.67px',
      pdfHeght: ''
    }
  },
  created() {
    this.printList = 'ids=[' + this.$route.query.id + ']'
    this.getList()
  },
  methods: {
    getList() {
      getGoodsList(this.printList)
        .then(res => {
          if (res.success) {
            this.pagedata = res.data.rows
            this.pdfHeght = (167.08 * (this.pagedata.length + 1)) + 'px'
          }
        })
        .finally(() => {
          this.qrcode()
          this.loading = false
          // this.getPdf()
        })
    },
    qrcode() {
      console.log(this.pagedata)
      const skuLen = this.pagedata.length
      console.log(skuLen)
      for (let i = 0; i < skuLen; i++) {
        new QRCode('qrDom' + i, {
          width: 310,
          height: 310,
          text: `{"SectionNum":"${this.pagedata[i].ErpSku.ErpSpu.SectionNum}","GetGoodsNum":"${this.pagedata[i].GetGoodsNum}","ErpSkuId":"${this.pagedata[i].ErpSku.Id}","Color":"${this.pagedata[i].ErpSku.Color}","Size":"${this.pagedata[i].ErpSku.Size}"}`
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .tabLeft {
    width: 208px;
    height: 315px;
    margin:10px;
    float:left;
    div {
      margin-top: 10px;
    }
  }
  .tabRight {
      width: 310px;
      margin:10px;
      float:right;
  }
</style>
