<template>
  <div id="app">
    <!-- <img src="./assets/logo.png"> -->
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>

*,*:before,*:after{box-sizing:border-box;}
html,body{
  width: 100%;
  height:100%;
}
body{
  position: relative;
}
#app {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /*text-align: center;*/
  color: #2c3e50;
  /*margin-top: 60px;*/
  width: 100%;
  height: 100%;
}
.ivu-page-item:hover {
  border-color: #dddee1;
}
.ivu-page-item:hover a {
  color: #495060;
}
.ivu-page-item-active {
  border-color: #dddee1;
}
</style>

