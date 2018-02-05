<template>
  <div class="emotion-pack-wrap">
    <div class="emotion-table-title">
      <span class="table-title">表情包列表</span>
      <Button type="success" class="add-emotion-icon" icon="plus-round" @click="addAction">添加</Button>
    </div>
    <Table refs="table2" border :columns="columns" :data="emotionPackList"></Table>
    <div style="margin: 20px 10px 10px;overflow: hidden">
      <div style="float: right;">
        <Page :total="totalCount" :current="pageIndex" @on-change="changePage"></Page>
      </div>
    </div>
    <Modal v-model="modalDelEmotionPack" width="360">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="information-circled"></Icon>
        <span>删除确认</span>
      </p>
      <div style="text-align:center">
        <p>是否确认删除此条表情包？</p>
        <p>{{ selectedEmotionPackName }}</p>
      </div>
      <div slot="footer">
        <Button type="error" size="large" long :loading="modal_loading" @click="handleDel">删除</Button>
      </div>
    </Modal>
    <Modal v-model="modalEmotionPack" width="480" class-name="vertical-center-modal">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="information-circled"></Icon>
        <span>{{ emotionPackTitle }}</span>
      </p>
      <div style="text-align:center;">
        <div class="emotion-pack-item">
          <label for="emotion-pack-name">表情包名称<b class="text-require">*</b></label>
          <Input v-model="emotionPackName" placeholder="请输入表情包名称" class="emotion-pack-item-model" id="emotion-pack-name"></Input>
        </div>
        <div class="emotion-pack-item">
          <label for="">模式</label>
          <Select v-model="emotionPackType" style="width:65%;text-align:left;vertical-align:middle;" class="emotion-pack-item-model">
            <Option v-for="item in emotionPackTypes" :value="item.id" :key="item.id">{{ item.type }}</Option>
          </Select>
        </div>
        <div class="emotion-pack-item">
          <label for="">是否有效</label>
          <Select v-model="emotionPackValid" style="width:65%;text-align:left;vertical-align:middle;" class="emotion-pack-item-model">
            <Option v-for="item in emotionPackValidStatus" :value="item.id" :key="item.id">{{ item.type }}</Option>
          </Select>
        </div>
        <div class="emotion-pack-item">
          <label for="" style="vertical-align: top">封面图</label>
          <!-- <div class="emotion-img emotion-pack-item-model">
            <uploadImg :preview="previewImg" :type="imgType" @transferData="getData"></uploadImg>
          </div> -->
          <!-- <div class="emotion-img emotion-pack-item-model">
            <div class="emotion-img-pre">
              <img :src="previewImg" alt="" id="emotion-pic">
            </div>
            <Button v-if="modifyOrAddEmotionPack === 'modifyEmotionPack' && !picAction" type="primary" @click="openPic">修改图片</Button>
            <Button v-if="modifyOrAddEmotionPack === 'addEmotionPack' && !picAction" type="primary" @click="openPic">选择上传图片</Button> -->
          <!-- 调用图片上传组件 -->
          <!-- <div v-if="picAction">
              <Button type="primary" @click="openPic">修改</Button>
              <Button type="primary" @click="deletePic">删除</Button>
            </div>
            <imageUpload v-if="picCom" :preview="previewImg" @transferData="getData"></imageUpload>
          </div> -->
          <div class="emotion-img emotion-pack-item-model">
            <div class="emotion-img-pre">
              <img :src="previewImg" alt="" id="emotion-pic">
            </div>
            <imgUpload :type="imgType" @transferData="getData"></imgUpload>
          </div>
        </div>
        <div class="emotion-pack-item">
          <label for="emotion-pack-version">表情包版本<b class="text-require">*</b></label>
          <Input v-model="emotionPackVersion" placeholder="请输入表情包版本" class="emotion-pack-item-model" id="emotion-pack-version"></Input>
        </div>
        <div class="emotion-pack-item">
          <label for="emotion-pack-analy">分析器版本<b class="text-require">*</b></label>
          <Input v-model="emotionPackAnalyVersion" placeholder="请输入分析器版本" class="emotion-pack-item-model" id="emotion-pack-analy"></Input>
        </div>
        <div class="emotion-pack-item">
          <label for="emotion-pack-order">排序号<b class="text-require">*</b></label>
          <Input v-model="emotionPackOrder" type="text" placeholder="请输入排序号" class="emotion-pack-item-model" id="emotion-pack-order"></Input>
        </div>
        <div class="emotion-pack-item">
          <label for="emotion-pack-extra">附加信息</label>
          <Input v-model="emotionPackExtra" type="text" placeholder="请输入附加信息" class="emotion-pack-item-model" id="emotion-pack-extra"></Input>
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
import { emotionPackData } from './mockData.js'
import uploadImg from '@/components/uploadImg.vue'
import imgUpload from '@/components/imgUpload.vue'
export default {
  name: 'emotionPackManage',
  components: {
    uploadImg,
    imgUpload
  },
  data() {
    return {
      columns: [{
        title: '序号',
        // type: 'index',
        key: 'index',
        width: 50,
        align: 'center',
      }, {
        title: '名称',
        key: 'name',
        align: 'center'
      }, {
        title: '封面',
        key: 'cover',
        align: 'center',
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
        title: '类型',
        key: 'type',
        align: 'center',
        render: (h, params) => {
          const row = params.row;
          const typeName = row.type === 0 ? "中表情" : row.type === 1 ? "大表情" : '';
          return h('span', typeName);
        }
      }, {
        title: '版本',
        key: 'packVersion',
        align: 'center'
      }, {
        title: '操作',
        key: 'action',
        width: 200,
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
              style: {
                marginRight: '5px'
              },
              on: {
                click: () => {
                  this.removeAction(params.index)
                }
              }
            }, '删除'),
            h('Button', {
              props: {
                type: 'primary',
                size: 'small'
              },
              on: {
                click: () => {
                  this.openEmotionAction(params.index)
                }
              }
            }, '表情管理')
          ]);
        }
      }],
      modalDelEmotionPack: false,
      modalEmotionPack: false,
      modal_loading: false,
      emotionPackId: undefined,
      emotionPackName: '',
      emotionPackVersion: '',
      emotionPackAnalyVersion: undefined,
      emotionPackOrder: undefined,
      emotionPackType: 0,
      emotionPackValid: 0,
      emotionPackExtra: '',
      modifyOrAddEmotionPack: '',
      emotionPackList: [],
      selectedIndex: undefined,
      selectedEmotionPackName: '',
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
      imgStatus: false
    }
  },
  methods: {
    getToken() {
      this.token = JSON.parse(localStorage.getItem('token'));
      if (this.$route.params.index) {
        this.pageIndex = this.$route.params.index;
      }
    },
    getAllEmotionPackList() {
      let temData = [];
      this.$http.get(`/api/emotion/getAllEmotionPacks?token=${this.token}&pageIndex=${this.pageIndex}&pageSize=${this.pageSize}`).then(
        res => {
          if (res.data.status == 2000) {
            this.totalCount = res.data.body.total;
            let indexNumber;
            res.data.body.data.map((item,index) => {
              if (this.pageIndex == 1) {
                indexNumber = index + 1;
              } else {
                if (index === 9) {
                  indexNumber = this.pageIndex + (0).toString();
                } else {
                  indexNumber = this.pageIndex - 1 + (index + 1).toString();
                }
              }
              item.cover = this.baseUrl + item.cover;
              item.index = indexNumber;
              temData.push(item);
            })
            this.emotionPackList = temData;
            console.log("emotionPack list:", this.emotionPackList);
          } else {
            this.$Message.error(res.data.body.message);
          }
        }, err => {
          console.log(err.data);
        })
    },
    modifyAction(index) {
      let imgStatus = this.emotionPackList[index].cover.match(/https\:\/\/cdn.me-to-me.com\/(.*)/)[1];

      this.modalEmotionPack = true;
      this.emotionPackId = this.emotionPackList[index].id;
      this.emotionPackName = this.emotionPackList[index].name;
      this.previewImg = imgStatus ? this.emotionPackList[index].cover : '';
      this.originImg = imgStatus ? this.emotionPackList[index].cover : '';
      /* this.previewImg = this.emotionPackList[index].cover;
      this.originImg = this.emotionPackList[index].cover; */
      this.emotionPackType = this.emotionPackList[index].type;
      this.emotionPackValid = this.emotionPackList[index].isValid;
      this.emotionPackVersion = this.emotionPackList[index].packVersion;
      this.emotionPackAnalyVersion = this.emotionPackList[index].analyVersion;
      this.emotionPackOrder = this.emotionPackList[index].order;
      this.emotionPackExtra = this.emotionPackList[index].extra;
      console.log('modify emotionPackId:', this.emotionPackId);
      this.selectedIndex = index;
      this.modifyOrAddEmotionPack = 'modifyEmotionPack';
      /* this.fileName = this.previewImg.match(/https\:\/\/cdn.me-to-me.com\/(.*)/)[1]; */
      this.fileName = imgStatus ? imgStatus : '';
      this.originFileName = this.fileName;
    },
    removeAction(index) {
      this.modalDelEmotionPack = true;
      this.emotionPackId = this.emotionPackList[index].id;
      console.log('del emotionPackId:', this.emotionPackId);
      this.selectedIndex = index;
      this.selectedEmotionPackName = this.emotionPackList[index].name;
    },
    openEmotionAction(index) {
      console.log("tag index:", index);
      let id = this.emotionPackList[index].id;
      this.$router.push({ name: 'emotion-control', params: { id: id, index: this.pageIndex } });
    },
    addAction() {
      this.modalEmotionPack = true;
      this.modifyOrAddEmotionPack = 'addEmotionPack';
      this.emotionPackName = '';
      this.previewImg = '';
      this.emotionPackType = 0;
      this.emotionPackValid = 0;
      this.emotionPackVersion = null;
      this.emotionPackAnalyVersion = null;
      this.emotionPackOrder = null;
      this.emotionPackExtra = '';
    },
    handleDel() {
      this.modal_loading = true;
      setTimeout(() => {
        this.modal_loading = false;
        this.modalDelEmotionPack = false;
        this.deleteEmotionPack(this.emotionPackId);
      }, 1500);
    },
    deleteEmotionPack(emotionPackId) {
      let data = { token: this.token, id: emotionPackId };
      this.$http.post('/api/emotion/deleteEmotionPack', data)
        .then(
          res => {
            if (res.data.status == 2000) {
              this.$Message.success('删除成功');
              this.getAllEmotionPackList();

            } else {
              this.$Message.error(res.data.body.message);
            }
          }, err => {
            console.log(err.data)
          })
    },
    addEmotionPack(emotionPack) {
      console.log('add emotionPack item:', emotionPack)
      this.$http.post('/api/emotion/addEmotionPack', emotionPack)
        .then(
          res => {
            if (res.data.status == 2000) {
              console.log('add emotionPack info:', res.data);
              this.$Message.success('添加成功');
              this.getAllEmotionPackList();
              this.modalEmotionPack = false;
              this.fileName = '';
            } else {
              this.$Message.error(res.data.body.message);
              this.modalEmotionPack = true;
            }
          }, err => {
            console.log(err.data)
          })
    },
    modifyEmotionPack(emotionPack) {
      console.log("modify emotionPack item:", emotionPack);
      this.$http.post('/api/emotion/updateEmotionPack', emotionPack).then(
        res => {
          if (res.data.status == 2000) {
            console.log('add feature info:', res.data);
            this.$Message.success('修改成功');
            this.getAllEmotionPackList();
            this.modalEmotionPack = false;
            this.fileName = '';
            console.log("modified feature list:", this.emotionPackList);
          } else {
            this.$Message.error(res.data.body.message);
            this.modalEmotionPack = true;
          }
        }, err => {
          console.log(err.data);
        })
    },
    handleSubmit() {
      if (!this.emotionPackName || !this.emotionPackVersion || !this.emotionPackAnalyVersion || !this.emotionPackOrder) {
        this.$Message.error('请完善信息后提交!');
      } else {
        let pattern = /^\d{1,}$/;
        if (!pattern.test(this.emotionPackVersion)) {
          this.$Message.error("表情包版本必须为数字，请重新输入");
          return false;
        } else if (!pattern.test(this.emotionPackAnalyVersion)) {
          this.$Message.error("分析器版本必须为数字，请重新输入");
          return false;
        } else if (!pattern.test(this.emotionPackOrder)) {
          this.$Message.error("排序号必须为数字，请重新输入");
          return false;
        } else {
          this.modal_loading = true;
          setTimeout(() => {
            this.modal_loading = false;

            switch (this.modifyOrAddEmotionPack) {
              case 'modifyEmotionPack':
                let data = {
                  token: this.token,
                  id: this.emotionPackId,
                  name: this.emotionPackName,
                  cover: this.fileName,
                  type: this.emotionPackType,
                  isValid: this.emotionPackValid,
                  packVersion: this.emotionPackVersion,
                  analyVersion: this.emotionPackAnalyVersion,
                  order: this.emotionPackOrder,
                  extra: this.emotionPackExtra
                }
                this.modifyEmotionPack(data);
                break;
              case 'addEmotionPack':
                let data2 = {
                  token: this.token,
                  name: this.emotionPackName,
                  cover: this.fileName,
                  type: this.emotionPackType,
                  isValid: this.emotionPackValid,
                  packVersion: this.emotionPackVersion,
                  analyVersion: this.emotionPackAnalyVersion,
                  order: this.emotionPackOrder,
                  extra: this.emotionPackExtra
                }
                this.addEmotionPack(data2);
                break;
            }
          }, 1500)
        }
      }
    },
    handleDismiss() {
      this.modal_loading = false;
      this.modalEmotionPack = false;
    },
    changePage(e) {
      console.log("change page info:", e);
      this.pageIndex = e;
      this.getAllEmotionPackList();
    },
    getData(msg) {

      // 外层调用组件方注册变更方法，将组件内的数据变更，同步到组件外的数据状态中
      console.log("transfer Data:", msg);
      if (msg.type === 'image') {
        this.previewImg = msg.img;
        this.fileName = msg.fileName;
      }
    },
  },
  computed: {
    emotionPackTitle: function() {
      console.log("feature Title:", this.modifyOrAddEmotionPack);
      if (this.modifyOrAddEmotionPack === 'modifyEmotionPack') {
        return "修改表情包";
      } else if (this.modifyOrAddEmotionPack === 'addEmotionPack') {
        return "添加表情包";
      }
    },
    imgActionName: function() {
      if (this.modifyOrAddEmotionPack === 'modifyEmotionPack') {
        return "修改图片";
      } else if (this.modifyOrAddEmotionPack === 'addEmotionPack') {
        return "上传图片";
      }
    },
    emotionPackTypes: function() {
      let data = [{ id: 0, type: '中表情' }, { id: 1, type: '大表情' }];
      return data;
    },
    emotionPackValidStatus: function() {
      let data = [{ id: 0, type: '有效' }, { id: 1, type: '无效' }];
      return data;
    }
  },
  created() {
    this.getToken();
    this.getAllEmotionPackList();
  }
}

</script>
<style scoped lang="less">
.emotion-pack-wrap {
  min-width:780px;
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
    .add-emotion-icon {
      /*float: right;*/
      display: inline-block;
      vertical-align: middle;
      padding: 0;
      width: 60px;
      line-height: 24px;
      margin-left: 20px;
    }
  }
}

.emotion-pack-item {
  label {
    width: 100px;
    display: inline-block;
    vertical-align: middle;
    text-align: left;
  }
  .emotion-pack-item-model {
    width: 65%;
    vertical-align: baseline;
    margin-left: 10px;
  }
}

.emotion-pack-item+.emotion-pack-item {
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
