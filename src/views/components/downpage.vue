<template>
  <div style="width: 100%;background-color:#525659">
    <div id="pdfDom" v-loading.fullscreen="loading" element-loading-text="标签生成中" style="margin: 0 auto;background-color:#ffffff" :style="{width: pdfWidth, height: pdfHeght}">
      <div v-for="(item, i) in pagedata" :key="i" style="float:left;width:558.34px;height:335px">
        <div class="tabLeft">
          <div style="width:100%;height:20%;font-size:50px;font-weight:bold">{{ item.SectionNum }}&nbsp;&nbsp;<span style="font-size:52px">{{ item.Size.replace('码', '') }}</span></div>
          <div style="display:table-cell;width:207px;height:126px;font-size:32px;text-align:center;vertical-align:middle">{{ item.Color }}</div>
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
import { getPrintList } from '@/api/stock'

export default {
  data() {
    return {
      loading: true,
      htmlTitle: new Date(),
      printList: [],
      pagedata: [],
      // pdfWidth: '891.08px',
      pdfWidth: '1116.67px',
      pdfHeght: ''
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
                for (let k = -1; k < skus[j].Amount; k++) {
                  this.pagedata.push(spu_item)
                }
              }
            }
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
      // 计算总长度
      const skuLen = this.pagedata.length
      // this.pdfHeght = (167.08 * (skuLen + 1))
      // console.log(this.pdfHeght)
      for (let i = 0; i < skuLen; i++) {
        new QRCode('qrDom' + i, {
          width: 310,
          height: 310,
          text: `{"SectionNum":"${this.pagedata[i].SectionNum}","ErpSkuId":"${this.pagedata[i].Id}","Color":"${this.pagedata[i].Color}","Size":"${this.pagedata[i].Size}"}`
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
