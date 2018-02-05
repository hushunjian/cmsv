<template>
  <div class="waiting">
    <p>
      功能开发中，请稍后……
    </p>
  </div>
</template>
<script>
export default {
  name: 'test1',
}
</script>
<style scoped lang="less">
.waiting {
  position: relative;
  width: 100%;
  height: 100%;
  p {
    position: absolute;
    left: 50%;
    top: 20%;
    transform:translate(-50%);
    font-size: 22px;
    letter-spacing: 5px;
  }
}
</style>