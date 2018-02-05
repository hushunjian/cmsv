
<!-- 组件图片上传 -->
<template>
  <div class="img-wrap">
    <div class="img-pre">
      <img :src="previewImg" alt="" id="upload-pic">
    </div>
    <input type="file" accept="image/*" @change="handleChange" id="fileinput1" class="fileinput" />
    <label class="filelabel" for="fileinput1">
      <Icon type="image"></Icon>&nbsp;{{imageStatus?"修改":"选择"}}</label>
    </label>
    <Button  type="primary" class="img-icon" icon="plus-round" @click="uploadImg">上传</Button>
    <Button v-if="imageStatus" type="primary" icon="close" @click="deletePic">删除</Button>
  </div>
</template>
<script>
export default {
  name: 'uploadImg',
  data() {
    return {
      previewImg: this.preview,
      originImg: this.preview,
      fileName: '',
      baseUrl: 'https://cdn.me-to-me.com/',
      imageStatus: false,
      imageType: this.type
    }
  },
  props: ['preview', 'type'],
  methods: {
    handleChange(e) {
      // this.originImg = this.preview;
      let file = e.target.files[0];
      const sizeLimit = 1024 * 1024 * 10 //图片大小<10MB
      console.log("file info:", file);
      if (file && file['size'] > sizeLimit) {
        this.$Message.success('上传图片大小不能超过10MB');
        return;
      }
      let reader = new FileReader();
      let img = document.getElementById("upload-pic");
      reader.onload = (function(aImg) {
        return function(e) {
          aImg.src = e.target.result;
          this.previewImg = e.target.result;
        }
      })(img);
      reader.readAsDataURL(file);
    },
    uploadImg() {
      let formData = new FormData();
      let fileInput = document.getElementById("fileinput1");
      let file = fileInput.files[0];
      formData.append('file', file);
      console.log("formData info:", formData);
      this.$http.post('/api/file/uploadImage', formData)
        .then(
          res => {
            if (res.data.status == 2000) {
              this.$Message.success('上传图片成功');
              console.log("图片信息：", res.data.body);
              this.fileName = res.data.body.fileName;
              this.previewImg = this.baseUrl + this.fileName;
              this.imageStatus = true;
              let data = {
                img: this.previewImg,
                fileName: this.fileName,
                type: this.imageType
              }
              this.$emit("transferData", data);
            } else {
              this.$Message.error(res.data.body.message);
            }
          }, err => {
            console.log(err.data);
            this.$Message.success('上传图片失败!');
          })
    },
    deletePic() {
      this.previewImg = this.originImg;
      this.imageStatus = false;
      let data = {
        type: this.imageType
      }
      this.$emit("transferData",data);
    }
  },
  computed: {

  },
  created() {

  },
  watch: {
    preview(val) {
      this.previewImg = val;
      this.originImg = val;
      // 新增preview的watch，监听变更并同步到previewImg上
    }
  }
}

</script>
<style scoped lang="less">
.img-pre {
  width: 200px;
  min-height: 120px;
  max-height: 200px;
  overflow: hidden;
  border: 1px solid #dddee1;
  border-radius: 4px;
  padding: 5px;
  margin-bottom: 10px;
  img {
    width: 100%;
  }
}
.img-icon {
  margin-right: 20px;
}
.fileinput {
  display: none;
}

.filelabel {
  display: inline-block;
  width: auto !important;
  padding: 6px 10px;
  margin-right: 20px;
  background: #2d8cf0;
  border: 1px solid #2d8cf0;
  border-radius: 4px;
  cursor: pointer;
  color: white;
  font-size: 12px;
  text-align: center;
  transition: all .2s;
  &:hover {
    background: #5cadff;
    border: 1px solid #5cadff;
    transition: all .2s;
  }
}

</style>
