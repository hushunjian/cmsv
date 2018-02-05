<!-- 组件图片上传 -->
<template>
  <div class="img-wrap">
    <Upload ref="upload" action="/api/file/uploadImage" :format="['jpg','jpeg','png']" :max-size="2048" :on-format-error="handleFormatError" :on-success="handleSuccess" :on-remove="handleRemove" :show-upload-list="false">
      <Button type="ghost" icon="ios-cloud-upload-outline" style="margin-right:25px;">上传图片</Button>
      <Button v-if="imgStatus" type="ghost" icon="ios-trash-outline" @click="deleteImg">删除</Button>
    </Upload>
  </div>
</template>
<script>
export default {
  name: 'imgUpload',
  data() {
    return {
      previewImg: '',
      fileName: '',
      imgStatus: false,
      imageType: this.type,
      baseUrl: 'https://cdn.me-to-me.com/',
    }
  },
  props: ['type'],
  methods: {
    handleFormatError(file) {
      this.$Notice.warning({
        title: '上传图片格式不正确',
        desc: '上传图片 ' + file.name + ' 格式不正确，请选择jpg 或 png图片上传.'
      });
    },
    handleSuccess(res, file, fileList) {
      console.log("图片上传成功:", res, file, fileList);
      this.fileName = res.body.fileName;
      this.previewImg = this.baseUrl + this.fileName;
      this.imgStatus = true;
      let data = {
        img: this.previewImg,
        fileName: this.fileName,
        type: this.imageType
      }
      this.$emit("transferData", data);
    },
    deleteImg(file) {
      file.preventDefault();
      file.stopPropagation();
      console.log('delete file:', file);
      this.fileName = '';
      this.previewImg = '';
      this.imgStatus = false;
      let data = {
        type: this.imageType,
        img: '',
        fileName: ''
      }
      this.$emit("transferData", data);
    },
    handleRemove(file, fileList) {
      console.log("删除图片信息:", file, fileList);
    },
  },
  computed: {
    imgActionName: function() {
      if (this.modifyOrAddEmotionPack === 'modifyEmotionPack') {
        return "修改图片";
      } else if (this.modifyOrAddEmotionPack === 'addEmotionPack') {
        return "上传图片";
      }
    },
  },
  created() {

  },
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
