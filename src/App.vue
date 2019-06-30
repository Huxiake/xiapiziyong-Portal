<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  created() {
    // 询问是否允许通知
    Notification.requestPermission(ms => {
      console.log(ms)
    })
  }
}
</script>
