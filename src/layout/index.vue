<template>
  <div :class="classObj" class="app-wrapper">
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
    <sidebar class="sidebar-container" />
    <div class="main-container">
      <div :class="{'fixed-header':fixedHeader}">
        <navbar />
      </div>
      <app-main />
    </div>
    <iframe ref="myAudio" style="display:none" src="" />
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain } from './components'
import ResizeMixin from './mixin/ResizeHandler'
import { getFeedback } from '@/api/getGoods'

export default {
  name: 'Layout',
  components: {
    Navbar,
    Sidebar,
    AppMain
  },
  mixins: [ResizeMixin],
  data() {
    return {
      newNotice: []
    }
  },
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar
    },
    device() {
      return this.$store.state.app.device
    },
    fixedHeader() {
      return this.$store.state.settings.fixedHeader
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    }
  },
  created() {
    this.getUnRead()
    setInterval(() => {
      this.getUnRead()
    }, 30000)
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    },
    // 拉取未读拿货反馈
    getUnRead() {
      getFeedback('IsRead=no').then(res => {
        if (res.success) {
          this.newNotice = res.data.rows === null ? [] : res.data.rows
          if (this.newNotice.length > 0) {
            this.sendNotice()
          }
        }
      })
    },
    // 开启弹窗
    sendNotice() {
      const notice = new Notification('未读的缺货反馈', {
        body: '有' + this.newNotice.length + '条未读的缺货反馈，请及时处理！',
        icon: 'https://xkerp-pic.oss-cn-shenzhen.aliyuncs.com/logo.jpg'
      })
      this.$nextTick(() => {
        console.log(this.$refs.myAudio.src = 'https://xkerp-pic.oss-cn-shenzhen.aliyuncs.com/8407.mp3')
      })
      console.log(notice)
      notice.onclick = e => {
        window.open
        this.$router.push({ path: '/goods/feedback' })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/mixin.scss";
  @import "~@/styles/variables.scss";

  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
    &.mobile.openSidebar{
      position: fixed;
      top: 0;
    }
  }
  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }

  .fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 9;
    width: calc(100% - #{$sideBarWidth});
    transition: width 0.28s;
  }

  .hideSidebar .fixed-header {
    width: calc(100% - 54px)
  }

  .mobile .fixed-header {
    width: 100%;
  }
</style>
