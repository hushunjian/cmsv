<template>
  <div class="list-wrap">
    <div class="list-table-title">
      <span class="table-title">榜单列表</span>
      <Button type="success" class="add-list-icon" icon="plus-round" @click="addAction">添加</Button>
    </div>
    <Table refs="table2" border :columns="columns" :data="listRankList" class="tableContent"></Table>
    <div style="margin: 20px 10px 10px;overflow: hidden">
      <div style="float: right;">
        <Page :total="totalCount" :current="pageIndex" @on-change="changePage"></Page>
      </div>
    </div>
    <Modal v-model="modalDelListRank" width="360" class-name="vertical-center-modal">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="information-circled"></Icon>
        <span>删除确认</span>
      </p>
      <div style="text-align:center">
        <p>是否确认删除此条榜单信息？</p>
        <p class="del-item">{{ selectedListRankName }}</p>
      </div>
      <div slot="footer">
        <Button type="error" size="large" long :loading="modal_loading" @click="handleDel">删除</Button>
      </div>
    </Modal>
    <Modal v-model="modalListRank" width="480" class-name="vertical-center-modal">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="information-circled"></Icon>
        <span>{{ listRankTitle }}</span>
      </p>
      <div style="text-align:center;">
        <div class="list-rank-item">
          <label for="list-rank-name">榜单名称<b class="text-require">*</b></label>
          <Input v-model="listRankName" placeholder="请输入榜单名称" class="list-rank-item-model" id="list-rank-name"></Input>
        </div>
        <div v-if="modifyOrAddListRank === 'addListRank'" class="list-rank-item">
          <label for="">榜单模式</label>
          <Select v-model="listRankMode" style="width:65%;text-align:left;vertical-align:middle;" class="list-rank-item-model">
            <Option v-for="item in listRankModes" :value="item.modeId" :key="item.modeId">{{ item.name }}</Option>
          </Select>
          <p class="list-rank-mark">保存之后不可修改</p>
        </div>
        <div v-if="modifyOrAddListRank === 'addListRank'" class="list-rank-item">
          <label for="">榜单类型</label>
          <Select v-model="listRankType" style="width:65%;text-align:left;vertical-align:middle;" class="list-rank-item-model">
            <Option v-for="item in listRankTypes" :value="item.id" :key="item.id">{{ item.type }}</Option>
          </Select>
          <p class="list-rank-mark">保存之后不可修改</p>
        </div>
        <div class="list-rank-item">
          <label for="list-rank-summary">摘要内容</label>
          <Input v-model="listRankSummary" type="textarea" :rows="3" placeholder="请输入摘要内容" class="list-rank-item-model" id="list-rank-summary"></Input>
        </div>
        <div class="list-rank-item">
          <label for="list-rank-bgcolor">背景色</label>
          <Input v-model="listRankColor" placeholder="请输入背景色" class="list-rank-item-model" id="list-rank-bgcolor"></Input>
        </div>
        <div class="list-rank-item">
          <label for="" style="vertical-align: top">背景图</label>
          <!-- <div class="list-rank-img list-rank-item-model">
            <uploadImg :preview="previewImg" :type="imgType" @transferData="getData"></uploadImg>
          </div> -->
          <div class="list-rank-img list-rank-item-model">
            <div class="list-rank-img-pre">
              <img :src="previewImg" alt="">
            </div>
            <imgUpload :type="imgType" @transferData="getData"></imgUpload>
          </div>
        </div>
        <div class="list-rank-item">
          <label for="list-rank-imgWidth">背景图宽度</label>
          <Input v-model="listRankWidth" placeholder="请输入背景图宽度" class="list-rank-item-model" id="list-rank-imgWidth"></Input>
        </div>
        <div class="list-rank-item">
          <label for="list-rank-imgHeight">背景图高度</label>
          <Input v-model="listRankHeight" placeholder="请输入背景图高度" class="list-rank-item-model" id="list-rank-imgHeight"></Input>
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
// import { listRankDataData } from './mockData.js'
import uploadImg from '@/components/uploadImg.vue'
import imgUpload from '@/components/imgUpload.vue'
export default {
  name: 'listRankManage',
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
        title: '类型',
        key: 'type',
        width: 100,
        align: 'center',
        render: (h, params) => {
          const row = params.row;
          let typeName;
          switch (row.type) {
            case 1:
              typeName = "王国榜单";
              break;
            case 2:
              typeName = "用户榜单";
              break;
            case 3:
              typeName = "榜单集合";
              break;
          }
          return h('span', typeName);
        }
      }, {
        title: '名称',
        key: 'name'
      }, {
        title: '摘要',
        key: 'summary'
      }, {
        title: '封面',
        key: 'img',
        width: 100,
        render: (h, params) => {
          let row = params.row;
          let imgStatus = row.img.match(/https\:\/\/cdn.me-to-me.com\/(.*)/)[1];
          if (imgStatus) {
            return h('img', {
              attrs: {
                src: params.row.img,
              },
              style: {
                display: 'inline-block',
                width: '100%',
                marginTop: '5px'
              },
            })
          } else {
            return h('span', '暂无图片');
          }
        }
      }, {
        title: '操作',
        key: 'action',
        width: 180,
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
                size: 'small',
                // disabled: 'disabled'
              },
              on: {
                click: () => {
                  this.openListRankAction(params.index)
                }
              }
            }, '排行管理')
          ]);
        }
      }],
      modalDelListRank: false,
      modalListRank: false,
      modal_loading: false,

      id: null,
      listRankName: '',
      listRankMode: 0,
      listRankType: 1,
      listRankSummary: '',
      listRankWidth: null,
      listRankHeight: null,
      modifyOrAddListRank: '',
      listRankList: [],
      listRankModes: [],
      selectedIndex: null,
      selectedListRankName: '',
      listRankColor: null,
      token: '',
      pageIndex: 1,
      pageSize: 10,
      totalCount: null,
      baseUrl: 'https://cdn.me-to-me.com/',
      previewImg: '',
      originImg: '',
      fileName: '',
      originFileName: '',
      imgType: 'image'
    }
  },
  methods: {
    getToken() {
      this.token = JSON.parse(localStorage.getItem('token'));
      if (this.$route.params.index) {
        this.pageIndex = this.$route.params.index;
      }
    },
    getAllListRankList() {
      let temData = [];
      this.$http.get(`/api/listRank/getAllListRanks?token=${this.token}&pageIndex=${this.pageIndex}&pageSize=${this.pageSize}&type=-1`).then(
        res => {
          if (res.data.status == 2000) {
            this.totalCount = res.data.body.total;
            res.data.body.data.map((item, index) => {
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
              item.img = this.baseUrl + item.img;
              temData.push(item);
            })
            this.listRankList = temData;
            console.log("list rank list:", this.listRankList);
          } else {
            this.$Message.error(res.data.body.message);
          }
        }, err => {
          console.log(err.data);
        })
    },
    getAllListRankMode() {
      let temData = [];
      this.$http.get(`/api/listRank/getAllListRankModes?token=${this.token}`).then(
        res => {
          if (res.data.status == 2000) {
            res.data.body.data.map(item => {
              temData.push(item);
            })
            this.listRankModes = temData;
            console.log("listRankModes list:", this.listRankModes);
          } else {
            this.$Message.error(res.data.body.message);
          }
        }, err => {
          console.log(err.data);
        })
    },
    modifyAction(index) {
      this.modalListRank = true;
      this.modifyOrAddListRank = 'modifyListRank';
      this.id = this.listRankList[index].id;
      this.listRankName = this.listRankList[index].name;
      this.previewImg = this.listRankList[index].img;
      this.originImg = this.listRankList[index].img;
      this.listRankSummary = this.listRankList[index].summary;
      this.listRankColor = this.listRankList[index].bgColor;
      this.listRankWidth = this.listRankList[index].imgWidth;
      this.listRankHeight = this.listRankList[index].imgHeight;
      this.selectedIndex = index;
      this.fileName = this.previewImg.match(/https\:\/\/cdn.me-to-me.com\/(.*)/)[1];
      this.originFileName = this.fileName;
    },
    removeAction(index) {
      this.modalDelListRank = true;
      this.id = this.listRankList[index].id;
      this.selectedIndex = index;
      this.selectedListRankName = this.listRankList[index].name;
    },
    openListRankAction(index) {
      console.log("list rank index:", index);
      let id = this.listRankList[index].id;
      let name = this.listRankList[index].name;
      let mode = this.listRankList[index].mode;
      let type = this.listRankList[index].type;
      this.$router.push({ name: 'list-rank-manage', params: { id: id, name: name, mode: mode, type: type, index: this.pageIndex } });
    },
    addAction() {
      this.modalListRank = true;
      this.modifyOrAddListRank = 'addListRank';
      this.listRankName = '';
      this.previewImg = '';
      this.listRankSummary = '';
      this.listRankColor = '';
      this.listRankWidth = null;
      this.listRankHeight = null;
      this.fileName = '';
    },
    handleDel() {
      this.modal_loading = true;
      setTimeout(() => {
        this.modal_loading = false;
        this.modalDelListRank = false;
        this.deleteListRank(this.id);
      }, 1500);
    },
    deleteListRank(id) {
      let data = { token: this.token, id: id };
      this.$http.post('/api/listRank/deleteListRank', data)
        .then(
          res => {
            if (res.data.status == 2000) {
              this.$Message.success('删除成功');
              this.getAllListRankList();
              // this.listRankList.splice(this.selectedIndex, 1);
            } else {
              this.$Message.error(res.data.body.message);
            }
          }, err => {
            console.log(err.data)
          })
    },
    addListRank(listRankData) {
      console.log('add listRankData item:', listRankData)
      this.$http.post('/api/listRank/addListRank', listRankData)
        .then(
          res => {
            if (res.data.status == 2000) {
              console.log('add listRankData info:', res.data);
              this.$Message.success('添加成功');
              this.getAllListRankList();
              this.modalListRank = false;
            } else {
              this.$Message.error(res.data.body.message);
              this.modalListRank = true;
            }
          }, err => {
            console.log(err.data)
          })
    },
    modifyListRank(listRankData) {
      console.log("modify listRankData item:", listRankData);
      this.$http.post('/api/listRank/updateListRank', listRankData).then(
        res => {
          if (res.data.status == 2000) {
            console.log('add feature info:', res.data);
            this.$Message.success('修改成功');
            this.getAllListRankList();
            this.modalListRank = false;
            console.log("modified listRank list:", this.listRankList);
          } else {
            this.$Message.error(res.data.body.message);
            this.modalListRank = true;
          }
        }, err => {
          console.log(err.data);
        })
    },
    handleSubmit() {
      if (!this.listRankName) {
        this.$Message.error('榜单名称必填，请完善信息!');
        return false;
      } else {
        let pattern = /^\d{1,}$/;
        if (this.listRankWidth && !pattern.test(this.listRankWidth)) {
          this.$Message.error("背景图宽度必须为数字，请重新输入");
          return false;
        } else if (this.listRankHeight && !pattern.test(this.listRankHeight)) {
          this.$Message.error("背景图高度必须为数字，请重新输入");
          return false;
        } else {
          this.modal_loading = true;
          setTimeout(() => {
            this.modal_loading = false;

            switch (this.modifyOrAddListRank) {
              case 'modifyListRank':
                let data = {
                  token: this.token,
                  id: this.id,
                  name: this.listRankName,
                  img: this.fileName,
                  summary: this.listRankSummary,
                  bgColor: this.listRankColor ? this.listRankColor : null,
                  imgWidth: this.listRankWidth,
                  imgHeight: this.listRankHeight
                }
                this.modifyListRank(data);
                break;
              case 'addListRank':
                let data2 = {
                  token: this.token,
                  name: this.listRankName,
                  img: this.fileName,
                  summary: this.listRankSummary,
                  bgColor: this.listRankColor ? this.listRankColor : null,
                  imgWidth: this.listRankWidth,
                  imgHeight: this.listRankHeight,
                  mode: this.listRankMode,
                  type: this.listRankType
                }
                this.addListRank(data2);
                break;
            }
          }, 1500)
          return false;
        }
        return false;
      }
    },
    handleDismiss() {
      this.modal_loading = false;
      this.modalListRank = false;
    },
    changePage(e) {
      console.log("change page info:", e);
      this.pageIndex = e;
      this.getAllListRankList();
    },
    getData(msg) {
      // 外层调用组件方注册变更方法，将组件内的数据变更，同步到组件外的数据状态中
      console.log("transfer Data:", msg);
      if (msg.type === 'image') {
        this.previewImg = msg.img;
        this.fileName = msg.fileName;
        // if (msg.img) {
        //   this.previewImg = msg.img;
        //   this.fileName = msg.fileName;
        // } else {
        //   this.previewImg = this.originImg;
        //   this.fileName = this.originFileName;
        // }
      }
    },
  },
  computed: {
    listRankTitle: function() {
      console.log("feature Title:", this.modifyOrAddListRank);
      if (this.modifyOrAddListRank === 'modifyListRank') {
        return "修改榜单";
      } else if (this.modifyOrAddListRank === 'addListRank') {
        return "添加榜单";
      }
    },
    listRankTypes: function() {
      let data = [{ id: 1, type: '王国榜单' }, { id: 2, type: '用户榜单' }, { id: 3, type: '榜单集合' }];
      return data;
    }
  },
  created() {
    this.getToken();
    this.getAllListRankMode();
    this.getAllListRankList();
  }
}

</script>
<style scoped lang="less">
.list-wrap {
  min-width: 768px;
  min-height:100%;
  border:10px solid #f0f0f0;
  border-bottom:none;
  padding-bottom: 15px;
  background: #ffffff;
  .list-table-title {
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
    .add-list-icon {
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

.list-rank-item {
  label {
    width: 100px;
    display: inline-block;
    vertical-align: middle;
    text-align: left;
  }
  .list-rank-item-model {
    width: 65%;
    vertical-align: baseline;
    margin-left: 10px;
  }
}

.list-rank-item+.list-rank-item {
  margin-top: 10px;
}

.list-rank-img {
  display: inline-block;
  text-align: left;
  .list-rank-img-pre {
    width:120px;
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

.del-item {
  color: red;
  margin-top: 20px;
  font-size: 15px;
  font-weight: 600;
}

.list-rank-mark {
  text-align: left;
  margin-left: 140px;
  margin-top: 5px;
  color: red;
}

</style>
