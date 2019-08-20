<template>
  <div style="width: 100%;background-color:#525659">
    <div id="pdfDom" v-loading.fullscreen="loading" element-loading-text="标签生成中" style="margin: 0 auto;background-color:#ffffff;" :style="{width: pdfWidth, height: pdfHeght}">
      <div v-for="(item, i) in pagedata" :key="i" style="float:left;height:328.8px;" :style="{width: Math.ceil(i%2) === 0 ? '600.93px' : '566.92px'}">
        <div class="tabLeft">
          <div style="width:267px;height:105px;font-size:34px;font-weight:bold;margin-left:20px;">{{ item.GetGoodsNum.replace(/金富|大西|大时|三|跨客|女人|非|宝|柏|新潮|泓|景|国/g, '').replace('新金', 'J').replace('佰', 'B') }}</div>
          <div style="display:table-cell;width:40%;height:90px;font-size:32px;text-align:center;vertical-align:middle">{{ item.ErpSku.SkuName }}</div>
          <div style="width:100%;height:20%;font-size:30px;font-weight:bold;margin-top:8px;">{{ item.ErpSku.ErpSpu.Price }}&nbsp;{{ item.Remark }}</div>
        </div>
        <div class="tabRight">
          <div :id="'qrDom' + i" />
        </div>
        <div class="tabBottom">
          <span style="padding-left:6px;">{{ item.OrderNum }}</span>
          <span style="padding-left:12px;">{{ (item.OrderDetails.ErpOrder.ShopName).substring(0, 2) }}</span>
        </div>
        <div v-if="Math.ceil(i%2) === 0" style="height:328.8px;width:34.01px;float:right" />
      </div>
    </div>
  </div>
</template>

<script>
import QRCode from 'qrcodejs2'
import { getGoodsList } from '@/api/getGoods'
import qs from 'qs'

export default {
  data() {
    return {
      loading: true,
      htmlTitle: new Date(),
      printList: [],
      pagedata: [],
      pdfWidth: '1167.85px',
      pdfHeght: '',
      paginator: {
        offset: 0,
        limit: 10
      }
    }
  },
  created() {
    this.printList = 'ids=[' + this.$route.query.id + ']'
    this.paginator.limit = this.$route.query.id.length
    this.getList()
  },
  methods: {
    getList() {
      const data = qs.stringify(this.paginator)
      getGoodsList(this.printList + '&' + data)
        .then(res => {
          if (res.success) {
            const data = res.data.rows
            const temp_data = []
            let mlCount = 0
            Object.assign(temp_data, data)
            for (let i = 0; i < data.length; i++) {
              if (Number(data[i].Amount) > 1) {
                for (let j = 0; j < Number(data[i].Amount) - 1; j++) {
                  mlCount++
                  temp_data.splice(i + j + mlCount, 0, data[i])
                }
              }
            }
            this.pagedata = temp_data
            this.pdfHeght = (167.08 * (this.pagedata.length + 1)) + 'px'
          }
        })
        .finally(() => {
          this.qrcode()
          this.loading = false
          this.getPdf()
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
          text: `{"gid":"${this.pagedata[i].Id}","onum":"${this.pagedata[i].OrderNum.substr(this.pagedata[i].OrderNum.length - 5)}","sn":"${this.pagedata[i].ErpSku.SkuName}","sid":"${this.pagedata[i].ErpSku.Id}"}`
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .tabLeft {
    width: 267px;
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
      width: 558px;
      margin-top: 268px;
      font-size: 40px;
  }
</style>
