<template>
  <div style="width: 100%;background-color:#525659">
    <div id="pdfDom" v-loading.fullscreen="loading" element-loading-text="标签生成中" style="margin: 0 auto;background-color:#ffffff" :style="{width: pdfWidth, height: pdfHeght}">
      <div v-for="(item, i) in pagedata" :key="i" style="float:left;height:335px" :style="{width: Math.ceil(i%2) === 0 ? '591.84px' : '558.34px'}">
        <div class="tabLeft">
          <div style="width:95%;height:40%;font-size:32px;font-weight:bold;margin-left:22px;">{{ item.GetGoodsNum }}</div>
          <div style="display:table-cell;width:207px;height:90px;font-size:32px;text-align:center;vertical-align:middle">{{ item.ErpSku.SkuName }}</div>
          <div style="width:95%;height:20%;font-size:38px;font-weight:bold;margin-top:8px;margin-left:22px;">{{ item.ErpSku.ErpSpu.Price }}&nbsp;{{ item.ErpSku.ErpSpu.Price }}</div>
        </div>
        <div class="tabRight">
          <div :id="'qrDom' + i" />
        </div>
        <div class="tabBottom">
          <span style="padding-left:68px;">{{ item.OrderDetails.ErpOrder.OrderNum }}</span>
        </div>
        <div v-if="Math.ceil(i%2) === 0" style="height:335px;width:33.5px;float:right" />
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
      pdfWidth: '1150.17px',
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
          width: 263,
          height: 263,
          text: `{"GetGoodsId":"${this.pagedata[i].Id}"`
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .tabLeft {
    width: 272px;
    height: 263px;
    margin:5px;
    float:left;
    div {
      margin-top: 5px;
    }
  }
  .tabRight {
      width: 263px;
      margin:5px;
      float:left;
  }
  .tabBottom {
      height: 47px;
      margin-top: 268px;
      font-size: 45px;
  }
</style>
