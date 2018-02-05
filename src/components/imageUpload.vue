<!-- 弹窗图片上传 -->
<template>
  <div class="image-wrap" v-if="showStatus">
    <div class="image-content">
      <h3>图片上传</h3>
      <Icon type="close-circled" class="close" @click.native="closeImg"></Icon>
      <div class="image-preview">
        <p>图片
          <br>预览</p>
        <div>
          <img :src="previewImg" alt="预览图片" id="pic-preview">
        </div>
      </div>
      <div style="text-align:center">
        <input type="file" accept="image/*" @change="handleChange" id="fileinput" class="fileinput" />
        <Button type="primary" class="action-button" icon="aperture" @click="checkImg">选择图片</Button>
        <Button type="primary" class="action-button" icon="upload" @click="uploadImg">上传图片</Button>
        <Button type="default" class="action-button" icon="close-round" @click="cancel">取消</Button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'imageUpload',
  data() {
    return {
      previewImg: this.preview,
      showStatus: true,
      baseUrl: 'https://cdn.me-to-me.com/',
      imageType: this.type
    }
  },
  props: ['preview', 'type'],
  methods: {
    checkImg() {
      let inputButton = document.getElementById("fileinput");
      inputButton.click();
    },
    closeImg() {
      this.showStatus = false;
      console.log("show status:", this.showStatus);
      let data = {
        type: this.imageType
      }
      this.$emit("transferData", data);
      // this.$emit("transferData", "");
      setTimeout(() => {
        this.showStatus = true;
      }, 1500)
    },
    handleChange(e) {
      console.log("change pic:", e);
      let file = e.target.files[0];
      const sizeLimit = 1024 * 1024 * 10 //图片大小<10MB
      console.log("file info:", file);
      if (file && file['size'] > sizeLimit) {
        this.$Message.success('上传图片大小不能超过10MB');
        return;
      }
      let reader = new FileReader();
      let img = document.getElementById("pic-preview");
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
      let fileInput = document.getElementById("fileinput");
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
              this.showStatus = false;
              let data = {
                img: this.previewImg,
                fileName: this.fileName,
                type: this.imageType
                // status: false
              }
              this.$emit("transferData", data);
               setTimeout(() => {
                this.showStatus = true;
               }, 1500)
            } else {
              this.$Message.error(res.data.body.message);
            }
          }, err => {
            console.log(err.data);
            this.$Message.success('上传图片失败!');
          })
    },
    cancel() {
      this.showStatus = false;
      console.log("show status 1:", this.showStatus);
      let data = {
        type: this.imageType
      }
      this.$emit("transferData", data);
      setTimeout(() => {
        this.showStatus = true;
      }, 1500)
    }
  },
  computed: {

  },
  created() {

  },
  watch: {
    preview(val) {
      this.previewImg = val;
      // 新增preview的watch，监听变更并同步到previewImg上
    }
  },
}

</script>
<style scoped lang="less">
@import "../main.less";
.image-wrap {
  position: fixed;
  top: 0;
  /* border: 0; */
  left: 0;
  /* right: 0; */
  width: 100%;
  height: 100%;
  background: #bbbec4c4;
  z-index: 100;
  margin: 0 auto;
}

.image-content {
  position: absolute;
  left: 50%;
  top: 40%;
  transform: translate(-50%, -50%);
  width: 480px;
  height: 350px;
  background: #fff;
  padding: 20px;
  h3 {
    text-align: center;
    border-bottom: 1px solid #aeb1b5;
    font-size: 18px;
    font-weight: 400;
  }
  .close {
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 16px;
    cursor: pointer;
    &:hover {
      color: #2b85e4;
    }
  }
  .image-preview {
    display: flex;
    align-items: center;
    margin: 10px 0;
    p {
      width: 60px;
      text-align: center;
      border-radius: 4px;
      border: 1px solid #2d8cf0;
      font-size: 15px;
    }
    div {
      flex: 1;
      margin: 20px 0 10px 20px;
      min-width: 100px;
      min-height: 100px;
      height: 200px;
      text-align: center;
      img {
        width: 100%;
        max-height: 100%;
        max-width: 100%;
        border-radius: 10px;
      }
    }
  }
  .fileinput {
    display: none;
  }
  .action-button {

    width: 100px;
  }
  .action-button+.action-button {
    margin-left: 40px;
  }
}

</style>
