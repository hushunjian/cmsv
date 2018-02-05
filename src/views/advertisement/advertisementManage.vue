<template>
  <div class="ad-wrap">
    <div class="ad-table-title">
      <span class="table-title">搜索操作</span>
    </div>
    <div class="ad-search">
      <!-- <span>搜索</span> -->
      <!--<Button type="default" class="add-ad-icon" icon="ios-search-strong" @click="searchAction">查询</Button>-->
      <div class="ad-search-select">
        <label for="">广告位：</label>
        <Select v-model="searchPositionId" style="width:65%;text-align:left;vertical-align:middle;" class="ad-search-model">
          <Option :value="0">全部</Option>
          <Option v-for="item in adSearchPositionList" :value="item.id" :key="item.id">{{ item.name }}</Option>
        </Select>
      </div>
      <Button  type="primary" class="add-ad-icon" icon="ios-search-strong" @click="searchAd">搜索</Button>
    </div>
    <div class="ad-table-title">
      <span class="table-title">广告信息列表</span>
      <Button type="success" class="add-ad-icon" icon="plus-round" @click="addAction">添加</Button>
    </div>
    <Table refs="table2" border :columns="columns" :data="adList"></Table>
    <div style=" margin: 20px 10px 10px;overflow: hidden;">
      <div style="float: right;">
        <Page :total="totolCount" :current="pageIndex" @on-change="changePage"></Page>
      </div>
    </div>
    <Modal v-model="modalDelAd" width="360" class-name="vertical-center-modal">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="information-circled"></Icon>
        <span>删除确认</span>
      </p>
      <div style="text-align:center">
        <p>是否确认删除此条广告信息？</p>
        <p>{{ selectedAdName }}</p>
      </div>
      <div slot="footer">
        <Button type="error" size="large" long :loading="modal_loading" @click="handleDel">删除</Button>
      </div>
    </Modal>
    <Modal v-model="modalAddAd" width="480" class-name="vertical-center-modal">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="information-circled"></Icon>
        <span>{{ adTitle }}</span>
      </p>
      <div style="text-align:center;">
        <div class="ad-item">
          <label for="ad-name">广告名称<b class="text-require">*</b></label>
          <Input v-model="adName" placeholder="请输入广告名称" class="ad-item-model" id="ad-name"></Input>
        </div>
        <div class="ad-item">
          <label for="">广告位<b class="text-require">*</b></label>
          <Select v-model="positionId" style="width:65%;text-align:left;vertical-align:middle;" class="ad-item-model">
            <Option v-for="item in adPositionList" :value="item.id" :key="item.id">{{ item.name }}</Option>
          </Select>
        </div>
        <div class="ad-item">
          <label for="ad-kingId">广告封面图片<b class="text-require">*</b></label>
          <!-- <div class="ad-img ad-item-model">
            <uploadImg :preview="previewImg" :type="imgType" @transferData="getData"></uploadImg>
          </div> -->
          <div class="ad-img ad-item-model">
            <div class="ad-img-pre">
              <img :src="previewImg" alt="">
            </div>
             <imgUpload :type="imgType" @transferData="getData"></imgUpload>
          </div>
        </div>
        <div class="ad-item">
          <label for="ad-width">广告封面宽度<b class="text-require">*</b></label>
          <Input v-model="adWidth" type="text" placeholder="请输入广告封面宽度(请输入数字)" class="ad-item-model" id="ad-width"></Input>
        </div>
        <div class="ad-item">
          <label for="ad-height">广告封面高度<b class="text-require">*</b></label>
          <Input v-model="adHeight" placeholder="请输入广告封面高度(请输入数字)" class="ad-item-model" id="ad-height"></Input>
        </div>
        <div class="ad-item">
          <label>有效时间<b class="text-require">*</b></label>
          <DatePicker v-model="adTime" :editable="false" :clearable="false" type="datetime" placement="top-start" placeholder="点击选择时间" style="width: 65%;margin-left: 10px;"></DatePicker>
        </div>
        <div class="ad-item">
          <label>显示概率(0-100整数)<b class="text-require">*</b></label>
          <!-- <InputNumber :max="100" :min="0" v-model="probability" class="ad-item-model" @on-blur="change"></InputNumber> -->
          <Input v-model="probability" placeholder="请输入显示概率(0-100整数)" class="ad-item-model"></Input>
        </div>
        <div class="ad-item">
          <label for="">广告类型<b class="text-require">*</b></label>
          <Select v-model="adType" style="width:65%;text-align:left;vertical-align:middle;" class="ad-item-model">
            <Option v-for="item in adTypes" :value="item.id" :key="item.id">{{ item.type }}</Option>
          </Select>
        </div>
        <div class="ad-item">
          <label for="ad-kingId">王国ID</label>
          <Input v-model="topicId" placeholder="请输入王国ID" class="ad-item-model" id="ad-kingId"></Input>
        </div>
        <div class="ad-item">
          <label for="ad-link">链接</label>
          <Input v-model="adLink" placeholder="请输入链接" class="ad-item-model" id="ad-link"></Input>
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
import uploadImg from '@/components/uploadImg.vue'
import imgUpload from '@/components/imgUpload.vue'

export default {
  name: 'advertisementManage',
  components: {
    uploadImg,
    imgUpload
  },
  data() {
    return {
      columns: [{
        title: '广告名称',
        key: 'name',
        /*fixed: 'left',*/
        /*width: 130,*/
      }, {
        title: '广告封面',
        width: 120,
        align: 'center',
        key: 'cover',
        render: (h, params) => {
          return h('img', {
            attrs: {
              src: params.row.cover,
            },
            style: {
              display: 'inline-block',
              width: '100%',
              marginTop: '5px'
            },
          })
        }
      }, {
        title: '所属广告位',
        key: 'positionName',
        /*width: 100,*/
      }, {
        title: '显示概率',
        key: 'probability',
        align: 'center',
        width: 80
      }, {
        title: '广告封面高度',
        width: 120,
        align: 'center',
        key: 'coverWidth'
      }, {
        title: '广告封面宽度',
        width: 120,
        align: 'center',
        key: 'coverHeight'
      }, {
        title: '有效时间',
        width: 160,
        align: 'center',
        key: 'validAt'
      }, {
        title: '类型',
        key: 'type',
        align: 'center',
        width: 60,
        render: (h,params) => {
          const row = params.row;
          const typeName = row.type === 0 ?  "链接" : row.type === 1 ? "王国" : '';
          return h('span', typeName);
        }
      }, {
        title: '王国ID',
        key: 'topicId',
        align: 'center',
        width: 90
      }, {
        title: '广告URL',
        /*width: 130,*/
        align: 'center',
        key: 'url'
      }, {
        title: '创建时间',
        key: 'createdAt',
        align: 'center',
        width: 160
      }, {
        title: '操作',
        key: 'action',
        width: 130,
        /*fixed: 'right',*/
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
          ]);
        }
      }],
      modalDelAd: false,
      modalAddAd: false,
      modal_loading: false,
      adId: null,
      adName: '',
      positionId: null,
      adHeight: null,
      adWidth: null,
      adTime: null,
      probability: null,
      adType: null,
      topicId: null,
      adLink: '',
      modifyOrAddAd: '',
      adList: [],
      adPositionList: [],
      selectedIndex: null,
      selectedAdName: '',
      previewImg: '',
      fileName: '',
      originImg: '',
      originFileName: '',
      token: '',
      pageIndex: 1,
      pageSize: 10,
      totolCount: null,
      baseUrl: 'https://cdn.me-to-me.com/',
      searchStatus: false,
      searchPositionId: 0,
      adSearchPositionList: [],
      imgType: 'image'
    }
  },
  methods: {
    getToken() {
      this.token = JSON.parse(localStorage.getItem('token'));
    },
    getAllAdList(type) {
      let temData = [];
      let url;
      if (type === 'get') {
        url = `/api/advertisement/getAllAdvertisements?token=${this.token}&pageIndex=${this.pageIndex}&pageSize=${this.pageSize}`;
      } else if (type === 'search') {
        url = `/api/advertisement/getAdvertisementsByPositionId?token=${this.token}&positionId=${this.searchPositionId}&pageIndex=${this.pageIndex}&pageSize=${this.pageSize}`;
      }
      this.$http.get(url).then(
        res => {
          if (res.data.status == 2000) {
            this.totolCount = res.data.body.total;
            res.data.body.data.map(item => {
              item.cover = this.baseUrl + item.cover;
              item.validAt = this.formateDate(item.validAt);
              item.createdAt = this.formateDate(item.createdAt);
              temData.push(item);
            })
            this.adList = temData;
            console.log("user adList:", this.adList);
          } else {
            this.$Message.error(res.data.body.message);
          }
        }, err => {
          console.log(err.data);
        })
    },
    getAllAdPositionList() {
      let temData = [];
      this.$http.get(`/api/advertisement/getAllAdvertisementPositions?token=${this.token}&pageIndex=${this.pageIndex}&pageSize=100`).then(
        res => {
          if (res.data.status == 2000) {
            res.data.body.data.map(item => {
              temData.push(item);
            })
            this.adPositionList = temData;
            this.adSearchPositionList = [].concat(JSON.parse(JSON.stringify(temData)));
            // this.adSearchPositionList.unshift({ id: 0, name: "全部" });
            console.log("adPosition list:", this.adPositionList, this.adSearchPositionList);
          } else {
            this.$Message.error(res.data.body.message);
          }
        }, err => {
          console.log(err.data);
        })
    },
    modifyAction(index) {
      let imgStatus = this.adList[index].cover.match(/https\:\/\/cdn.me-to-me.com\/(.*)/)[1];

      this.modalAddAd = true;
      this.adId = this.adList[index].id;
      this.adName = this.adList[index].name;
      this.previewImg = imgStatus ? this.adList[index].cover : '';
      this.originImg = imgStatus ? this.adList[index].cover : '';
      /* this.previewImg = this.adList[index].cover;
      this.originImg = this.adList[index].cover; */
      this.positionId = this.adList[index].positionId;
      this.adHeight = this.adList[index].coverHeight;
      this.adWidth = this.adList[index].coverWidth;
      this.probability = this.adList[index].probability;
      this.adTime = this.adList[index].validAt;
      this.adType = this.adList[index].type;
      this.topicId = this.adList[index].topicId;
      this.adLink = this.adList[index].url;
      this.selectedIndex = index;
      this.modifyOrAddAd = 'modifyAd';
      /* this.fileName = this.previewImg.match(/https\:\/\/cdn.me-to-me.com\/(.*)/)[1]; */
      this.fileName = imgStatus ? imgStatus : '';
      this.originFileName = this.fileName;
      console.log("modify ad:", this.adList[index], this.previewImg);
    },
    removeAction(index) {
      this.modalDelAd = true;
      this.adId = this.adList[index].id;
      console.log('del adId:', this.adId);
      this.selectedIndex = index;
      this.selectedAdName = this.adList[index].name;
    },
    openTag(index) {
      console.log("tag index:", index);
      this.$router.push({ name: 'ad-tag' });
    },
    addAction(e) {
      this.modalAddAd = true;
      this.modifyOrAddAd = 'addAd';
      this.adName = '';
      this.previewImg = '';
      this.positionId = null;
      this.adHeight = '';
      this.adWidth = '';
      this.probability = null;
      this.adTime = '';
      this.adType = null;
      this.topicId = null;
      this.adLink = '';

    },
    handleDel() {
      this.modal_loading = true;
      setTimeout(() => {
        this.modal_loading = false;
        this.modalDelAd = false;
        this.deleteAd(this.adId);
      }, 1500);
    },
    deleteAd(adId) {
      let data = { token: this.token, id: adId };
      this.$http.post('/api/advertisement/deleteAdvertisement', data)
        .then(
          res => {
            if (res.data.status == 2000) {
              this.$Message.success('删除成功');
              if (this.searchStatus) {
                this.getAllAdList("search");
              } else {
                this.getAllAdList('get');
              }
              // this.adList.splice(this.selectedIndex, 1);
            } else {
              this.$Message.error(res.data.body.message);
            }
          }, err => {
            console.log(err.data)
          })
    },
    addAd(adData) {
      console.log('add ad item:', adData);
      let positionName;
      this.adPositionList.map(item => {
        if (item.id === adData.positionId) {
          positionName = item.name;
        }
      })
      this.$http.post('/api/advertisement/addAdvertisement', adData)
        .then(
          res => {
            if (res.data.status == 2000) {
              console.log('add ad info:', res.data);
              this.$Message.success('添加成功');
              if (this.searchStatus) {
                this.getAllAdList("search");
              } else {
                this.getAllAdList('get');
              }
              this.modalAddAd = false;
              this.fileName = '';
              // let temData = Object.assign({}, { id: '' }, adData, { cover: this.baseUrl + adData.cover }, { positionName: positionName });
              // this.adList.push(temData);
            } else {
              this.$Message.error(res.data.body.message);
              this.modalAddAd = true;
            }
          }, err => {
            console.log(err.data)
          })
    },
    modifyAd(adData) {
      console.log("modify ad item:", adData);
      this.$http.post('/api/advertisement/updateAdvertisement', adData).then(
        res => {
          if (res.data.status == 2000) {
            console.log('add feature info:', res.data);
            this.$Message.success('修改成功');
            if (this.searchStatus) {
              this.getAllAdList("search");
            } else {
              this.getAllAdList('get');
            }
            this.modalAddAd = false;
            this.fileName = '';
            console.log("modified feature list:", this.adList);
          } else {
            // if (res.data.body && res.data.body.message) {
              this.$Message.error(res.data.body.message);
              this.modalAddAd = true;
            // } else {
            //   this.$Message.error(res.data.body);
            // }
          }
        }, err => {
          console.log(err.data);
        })
    },
    handleSubmit() {
      console.log("this. previewImg:", this.adName, this.positionId, this.adHeight, this.adWidth, this.adType, this.fileName, this.probability, this.adTime);
      if (!this.adName || !this.adHeight || !this.adWidth || !this.fileName || !this.probability || this.adType == null || !this.adTime || this.positionId == null) {
        this.$Message.error('请完善信息后提交!');
        return false;
      } else {
        let pattern = /^\d{1,}$/;
        if (this.adWidth && !pattern.test(this.adWidth)) {
          this.$Message.error("广告宽度必须为数字，请重新输入");
          // this.adWidth = null;
          return false;
        } else if (this.adHeight && !pattern.test(this.adHeight)) {
          this.$Message.error("广告高度必须为数字，请重新输入");
          // this.adHeight = null;
          return false;
        } else if (this.probability && !pattern.test(this.probability)) {
          this.$Message.error("显示概率必须为数字，请重新输入");
          // this.probability = null;
          return false;

        } else if (this.probability && this.probability < 0 || this.probability > 100) {
          this.$Message.error("显示概率必须为0-100间的数字，请重新输入");
          // this.probability = null;
          return false;
        } else if (this.topicId && !pattern.test(this.topicId)) {
          this.$Message.error("王国ID必须为数字，请重新输入");
          // this.topicId = null;
          return false;
        } else {
          this.modal_loading = true;
          if (this.adType === 1) {
            this.topicId = this.topicId ? this.topicId : 0;
            this.adLink = '';
          } else if (this.adType === 0) {
            this.adLink = this.adLink ? this.adLink : '';
            this.topicId = 0;
          }
          setTimeout(() => {
            this.modal_loading = false;

            switch (this.modifyOrAddAd) {
              case 'modifyAd':
                let data = {
                  token: this.token,
                  id: this.adId,
                  name: this.adName,
                  cover: this.fileName,
                  positionId: this.positionId,
                  coverWidth: this.adWidth,
                  coverHeight: this.adHeight,
                  probability: this.probability,
                  validAt: new Date(this.adTime).getTime(),
                  type: this.adType,
                  topicId: this.topicId,
                  url: this.adLink
                }
                console.log("modify Data1:", data);
                this.modifyAd(data);
                break;
              case 'addAd':
                let data2 = {
                  token: this.token,
                  name: this.adName,
                  cover: this.fileName,
                  positionId: this.positionId,
                  coverWidth: this.adWidth,
                  coverHeight: this.adHeight,
                  probability: this.probability,
                  validAt: new Date(this.adTime).getTime(),
                  type: this.adType,
                  topicId: this.topicId,
                  url: this.adLink
                }
                this.addAd(data2);
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
      this.modalAddAd = false;
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
    changePage(e) {
      console.log("change page info:", e);
      this.pageIndex = e;
      if (this.searchStatus) {
        this.getAllAdList("search");
      } else {
        this.getAllAdList('get');
      }
    },
    searchAction() {
      this.searchStatus = !this.searchStatus;
      if (!this.searchStatus) {
        this.getAllAdList('get');
      }
    },
    searchAd() {
      this.searchStatus = true;
      this.pageIndex = 1;
      console.log("search PositionId:", this.searchPositionId);
      this.getAllAdList('search');
    },
    formateDate(data) {
      let date = new Date(data);
      let year = date.getFullYear();
      let month = date.getMonth() < 9 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
      let day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
      let hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
      let minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
      let seconds = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
      return `${year}-${month}-${day} ${hour}:${minutes}:${seconds}`
    },
  },
  computed: {
    adTitle: function() {
      console.log("feature Title:", this.modifyOrAddAd);
      if (this.modifyOrAddAd === 'modifyAd') {
        return "修改广告";
      } else if (this.modifyOrAddAd === 'addAd') {
        return "添加广告";
      }
    },
    adTypes: function() {
      let data = [{ id: 0, type: '链接' }, { id: 1, type: '王国' }];
      return data;
    }
  },
  created() {
    this.getToken();
    this.getAllAdList('get');
    this.getAllAdPositionList();
  },
  watch: {
    // 如果路由有变化，会再次执行该方法
    '$route': function(route) {
      this.getAllAdList('get');
      this.getAllAdPositionList();
      this.searchStatus = false;
    }
  }
}
</script>
<style scoped lang="less">
@import "../../main.less";
.ad-wrap {
  min-width: 1460px;
  min-height:100%;
  border:10px solid #f0f0f0;
  border-bottom:none;
  padding-bottom: 15px;
  background: #ffffff;
  .ad-search {
    background: #ffffff;
    border-bottom:10px solid #f0f0f0;
    padding:0 5px 15px;
    font-size: 16px;
    line-height: 24px;
    span {
      vertical-align: middle;
    }
    .ad-search-select {
      display: inline-block;
      width: 240px;
      vertical-align: middle;
      margin-left: 15px;
      label {
        vertical-align: middle;
        font-size: 15px;
      }
      .ad-search-model {
        width: 200px;
        text-align: left;
        vertical-align: middle;
      }
    }
  }
  .ad-table-title {
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
    .add-ad-icon {
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

.ad-item {
  label {
    width: 120px;
    display: inline-block;
    vertical-align: middle;
    text-align: left;
  }
  .ad-item-model {
    width: 65%;
    vertical-align: middle;
    margin-left: 10px;
  }
}

.ad-item+.ad-item {
  margin-top: 10px;
}

.ad-img {
  display: inline-block;
  text-align: left;
  .ad-img-pre {
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

.text-require {
  color: #FF6C60;
  font-weight: 700;
  margin-left: 3px;
}


</style>
