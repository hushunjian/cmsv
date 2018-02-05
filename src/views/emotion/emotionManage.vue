<template>
  <div class="emotion-wrap">
    <div class="emotion-table-title">
      <span class="table-title">表情列表</span>
      <div class="emotion-button">
        <Button type="success" icon="plus-round" @click="addAction" class="emotion-button-item">添加</Button>
        <Button type="default" icon="arrow-return-left" @click="backToAction" class="emotion-button-item">返回</Button>
      </div>
    </div>
    <Table refs="table" border :columns="columns" :data="emotionList"></Table>
    <div style="margin: 20px 10px 10px;overflow: hidden">
      <div style="float: right;">
        <Page :total="totalCount" :current="pageIndex" @on-change="changePage"></Page>
      </div>
    </div>
    <Modal v-model="modalDelEmotion" width="360">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="information-circled"></Icon>
        <span>删除确认</span>
      </p>
      <div style="text-align:center">
        <p>是否确认删除此条表情？</p>
        <p>{{ selectedEmotionName }}</p>
      </div>
      <div slot="footer">
        <Button type="error" size="large" long :loading="modal_loading" @click="handleDel">删除</Button>
      </div>
    </Modal>
    <Modal v-model="modalEmotion" width="480" class-name="vertical-center-modal">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="information-circled"></Icon>
        <span>{{ emotionTitle }}</span>
      </p>
      <div style="text-align:center;">
        <div class="emotion-item">
          <label for="emotion-name">表情名称<b class="text-require">*</b></label>
          <Input v-model="emotionName" placeholder="请输入表情名称" class="emotion-item-model" id="emotion-name"></Input>
        </div>
        <div class="emotion-item">
          <label for="emotion-order">排序号<b class="text-require">*</b></label>
          <Input v-model="emotionOrder" placeholder="请输入排序号" class="emotion-item-model" id="emotion-order"></Input>
        </div>
        <div class="emotion-item">
          <label for="" style="vertical-align: top">封面图</label>
          <div class="emotion-img emotion-item-model">
            <div class="emotion-img-pre">
              <img :src="previewImg" alt="">
            </div>
             <imgUpload :type="imgType" @transferData="getData"></imgUpload>
          </div>
          <!-- <div class="emotion-img emotion-item-model">
            <uploadImg :preview="previewImg" :type="imgType" @transferData="getData"></uploadImg>
          </div> -->
        </div>
        <div class="emotion-item">
          <label for="emotion-width">宽度<b class="text-require">*</b></label>
          <Input v-model="emotionWidth" placeholder="请输入宽度" class="emotion-item-model" id="emotion-width"></Input>
        </div>
        <div class="emotion-item">
          <label for="emotion-height">高度<b class="text-require">*</b></label>
          <Input v-model="emotionHeight" placeholder="请输入高度" class="emotion-item-model" id="emotion-height"></Input>
        </div>
        <div class="emotion-item">
          <label for="emotion-extra">附件信息</label>
          <Input v-model="emotionExtra" placeholder="请输入附件信息" class="emotion-item-model" id="emotion-extra"></Input>
        </div>
      </div>
      <div slot="footer">
        <Button type="primary" :loading="modal_loading" @click="handleSubmit">确定</Button>
        <Button type="default" @click="handleDismiss">取消</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import { emotionData } from './mockData.js'
import uploadImg from '@/components/uploadImg.vue'
import imgUpload from '@/components/imgUpload.vue'
export default {
  name: 'emotionManage',
  components: {
    uploadImg,
    imgUpload
  },
  data() {
    return {
      columns: [{
        title: '序号',
        key: 'index',
        width: 50,
        align: 'center'
      }, {
        title: '表情名',
        key: 'name'
      }, {
        title: '图像',
        align: 'center',
        key: 'cover',
        render: (h, params) => {
          let row = params.row;
          let imgStatus = row.cover.match(/https\:\/\/cdn.me-to-me.com\/(.*)/)[1];
          if (imgStatus) {
            return h('img', {
              attrs: {
                src: params.row.cover,
              },
              style: {
                display: 'inline-block',
                width: '100%',
                marginTop: '5px',
                width: '120px'
              }
            })
          } else {
            return h('span', '暂无图片');
          }
        }
      }, {
        title: '操作',
        key: 'action',
        width: 150,
        align: 'center',
        render: (h, params) => {
          return h('div', [
            h('Button', {
              props: {
                type: 'info',
                size: 'small'
              },
              style: {
                marginRight: '5px'
              },
              on: {
                click: () => {
                  this.modifyAction(params.index)
                }
              }
            }, '编辑'),
            h('Button', {
              props: {
                type: 'error',
                size: 'small'
              },
              on: {
                click: () => {
                  this.removeAction(params.index)
                }
              }
            }, '删除')
          ])
        }
      }],
      emotionList: [],
      modal_loading: false,
      modalDelEmotion: false,
      modalEmotion: false,
      selectedEmotionName: '',
      selectedEmotionIndex: undefined,
      emotionId: undefined,
      emotionName: '',
      emotionOrder: null,
      emotionWidth: null,
      emotionHeight: null,
      emotionExtra: '',
      modifyOrAddEmotion: '',
      packId: undefined,
      token: '',
      pageIndex: 1,
      pageSize: 10,
      totalCount: undefined,
      baseUrl: 'https://cdn.me-to-me.com/',
      previewImg: '',
      originImg: '',
      fileName: '',
      originFileName: '',
      imgType: 'image',
      index: null
    }
  },
  methods: {
    getToken() {
      this.token = JSON.parse(localStorage.getItem('token'));
      this.index = this.$route.params.index;
    },
    getAllEmotionList() {
      this.packId = this.$route.params.id;
      let temData = [];
      this.$http.get(`/api/emotion/getAllEmotions?token=${this.token}&packId=${this.packId}&pageIndex=${this.pageIndex}&pageSize=${this.pageSize}`).then(
        res => {
          if (res.data.status == 2000) {
            this.totalCount = res.data.body.total;
            res.data.body.data.map((item,index) => {
              let indexNumber;
              if (this.pageIndex == 1) {
                indexNumber = index + 1;
              } else {
                if (index === 9) {
                  indexNumber = this.pageIndex + (0).toString();
                } else {
                  indexNumber = this.pageIndex - 1 + (index + 1).toString();
                }
              }
              item.index = indexNumber;
              item.cover = this.baseUrl + item.cover;
              temData.push(item);
            })
            this.emotionList = temData;
            console.log("adLinked emotion list:", this.emotionList);
          } else {
            this.$Message.error(res.data.body.message);
          }
        }, err => {
          console.log(err.data);
        })
    },
    addAction() {
      this.modalEmotion = true;
      this.modifyOrAddEmotion = 'addEmotion';
      this.emotionName = '';
      this.previewImg = '';
      this.emotionOrder = null;
      this.emotionWidth = null;
      this.emotionHeight = null;
      this.emotionExtra = '';
    },
    modifyAction(index) {
      let imgStatus = this.emotionList[index].cover.match(/https\:\/\/cdn.me-to-me.com\/(.*)/)[1];

      this.modalEmotion = true;
      this.modifyOrAddEmotion = 'modifyEmotion';
      this.emotionId = this.emotionList[index].id;
      this.emotionName = this.emotionList[index].name;
      this.previewImg = imgStatus ? this.emotionList[index].cover : '';
      this.originImg = imgStatus ? this.emotionList[index].cover : '';
      /* this.previewImg = this.emotionList[index].cover;
      this.originImg = this.emotionList[index].cover; */
      this.emotionOrder = this.emotionList[index].order;
      this.emotionWidth = this.emotionList[index].width;
      this.emotionHeight = this.emotionList[index].height;
      this.emotionExtra = this.emotionList[index].extra;
      this.selectedEmotionIndex = index;
      /* this.fileName = this.previewImg.match(/https\:\/\/cdn.me-to-me.com\/(.*)/)[1]; */
      this.fileName = imgStatus ? imgStatus : '';
      this.originFileName = this.fileName;
    },
    backToAction() {
      // this.$router.go(-1);
      this.$router.push({ name: 'emotion-pack-control',params:{index: this.index}});
    },
    removeAction(index) {
      this.modalDelEmotion = true;
      this.emotionId = this.emotionList[index].id;
      this.selectedEmotionIndex = index;
      this.selectedEmotionName = this.emotionList[index].name;
    },
    handleDel() {
      this.modal_loading = true;
      setTimeout(() => {
        this.modal_loading = false;
        this.modalDelEmotion = false;
        this.deleteEmotion(this.emotionId);
      }, 1500);
    },
    deleteEmotion(emotionId) {
      let data = { token: this.token, id: emotionId, packId: this.packId };
      this.$http.post('/api/emotion/deleteEmotion', data)
        .then(
          res => {
            if (res.data.status == 2000) {
              console.log('delete emotion info:', res.data);
              this.$Message.success('删除成功');
              this.getAllEmotionList();
              // this.emotionList.splice(this.selectedEmotionIndex, 1);
            } else {
              this.$Message.error(res.data.body.message);
            }
          }, err => {
            console.log(err.data);
            this.$Message.success('删除失败');
          })
    },
    addEmotion(emotionData) {
      console.log("add emotion item:", emotionData);
      this.$http.post('/api/emotion/addEmotion', emotionData)
        .then(
          res => {
            if (res.data.status == 2000) {
              console.log('add emotion info:', res.data);
              this.$Message.success('添加表情成功');
              this.getAllEmotionList();
              this.modalEmotion = false;
              this.fileName = '';
            } else {
              this.$Message.error(res.data.body.message);
              this.modalEmotion = true;
            }
          }, err => {
            this.$Message.success('添加表情失败');
          })
    },
    modifyEmotion(emotionData) {
      console.log("modify emotionData item:", emotionData);
      this.$http.post('/api/emotion/updateEmotion', emotionData).then(
        res => {
          if (res.data.status == 2000) {
            console.log('add feature info:', res.data);
            this.$Message.success('修改成功');
            this.getAllEmotionList();
            this.modalEmotion = false;
            this.fileName = '';
            console.log("modified feature list:", this.emotionList);
          } else {
            this.$Message.error(res.data.body.message);
            this.modalEmotion = true;
          }
        }, err => {
          console.log(err.data);
        })
    },
    handleSubmit() {
      if (!this.emotionName || !this.emotionOrder || !this.emotionWidth || !this.emotionHeight) {
        this.$Message.error("请完善信息后提交！");
      } else {
        let pattern = /^\d{1,}$/;
        if (!pattern.test(this.emotionOrder)) {
          this.$Message.error("排序号必须为数字，请重新输入");
          return false;
        } else if (!pattern.test(this.emotionWidth)) {
          this.$Message.error("宽度必须为数字，请重新输入");
          return false;
        } else if (!pattern.test(this.emotionHeight)) {
          this.$Message.error("高度必须为数字，请重新输入");
          return false;
        } else {
          this.modal_loading = true;
          setTimeout(() => {
            this.modal_loading = false;

            switch (this.modifyOrAddEmotion) {
              case 'modifyEmotion':
                let modifyData = {
                  token: this.token,
                  packId: this.packId,
                  id: this.emotionId,
                  name: this.emotionName,
                  cover: this.fileName,
                  order: this.emotionOrder,
                  extra: this.emotionExtra,
                  width: this.emotionWidth,
                  height: this.emotionHeight
                }
                this.modifyEmotion(modifyData);
                break;
              case 'addEmotion':
                let addData = {
                  token: this.token,
                  packId: this.packId,
                  name: this.emotionName,
                  cover: this.fileName,
                  order: this.emotionOrder,
                  extra: this.emotionExtra,
                  width: this.emotionWidth,
                  height: this.emotionHeight
                };
                this.addEmotion(addData);
                break;
            }
          }, 1500);
        }
      }
    },
    handleDismiss() {
      this.modal_loading = false;
      this.modalEmotion = false;
    },
    changePage(e) {
      console.log("change page info:", e);
      this.pageIndex = e;
      this.getAllEmotionList();
    },
    getData(msg) {
      // 外层调用组件方注册变更方法，将组件内的数据变更，同步到组件外的数据状态中
      console.log("transfer Data:", msg);
      if (msg.type === 'image') {
          this.previewImg = msg.img;
          this.fileName = msg.fileName;
        // else {
        //   this.previewImg = this.originImg;
        //   this.fileName = this.originFileName;
        // }
      }
    },
  },
  computed: {
    emotionTitle: function() {
      if (this.modifyOrAddEmotion === 'modifyEmotion') {
        return "修改表情";
      } else if (this.modifyOrAddEmotion === 'addEmotion') {
        return "添加表情"
      }
    }
  },
  created() {
    this.getToken();
    this.getAllEmotionList();
  }
}

</script>
<style scoped lang="less">
.emotion-wrap {
  min-width:500px;
  min-height:100%;
  border:10px solid #f0f0f0;
  border-bottom:none;
  padding-bottom: 15px;
  background: #ffffff;
  .emotion-table-title {
    background: #ffffff;
    border-bottom: 1px solid #f0f0f0;
    padding:10px 5px 5px;
    margin-bottom: 10px;
    overflow: hidden;
    font-size: 16px;
    line-height: 24px;
    .table-title{
      display: inline-block;
      vertical-align: middle;
    }
    .emotion-button {
      display: inline-block;
      vertical-align: middle;
      margin-left: 20px;
      .emotion-button-item {
        padding: 0;
        width: 60px;
        line-height: 24px;
      }
    }
  }
}

.emotion-item {
  label {
    width: 70px;
    display: inline-block;
    vertical-align: middle;
    text-align: left;
  }
  .emotion-item-model {
    width: 65%;
    vertical-align: baseline;
    margin-left: 10px;
  }
}

.emotion-item+.emotion-item {
  margin-top: 10px;
}

.emotion-img {
  display: inline-block;
  text-align: left;
  .emotion-img-pre {
    width: 120px;
    min-height: 90px;
    max-height: 120px;
    overflow: hidden;
    border: 1px solid #dddee1;
    border-radius: 4px;
    padding: 5px;
    margin-bottom: 10px;
    img {
      width: 100%;
    }
  }
}

.text-require {
  color: #FF6C60;
  font-weight: 700;
  margin-left: 3px;
}

</style>
