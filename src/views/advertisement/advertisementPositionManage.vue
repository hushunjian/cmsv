<template>
  <div class="ad-position-wrap">
    <div class="ad-table-title">
      <span class="table-title">广告位列表</span>
      <Button type="success" class="add-ad-icon" icon="plus-round" @click="addAction">添加</Button>
    </div>
    <Table refs="table2" border :columns="columns" :data="adPositionList"></Table>
    <div style="margin: 20px 10px 10px;overflow: hidden">
      <div style="float: right;">
        <Page :total="totalCount" :current="pageIndex" @on-change="changePage"></Page>
      </div>
    </div>
    <Modal v-model="modalDelAdPosition" width="360">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="information-circled"></Icon>
        <span>删除确认</span>
      </p>
      <div style="text-align:center">
        <p>是否确认删除此条广告位？</p>
        <p>{{ selectedAdPositionName }}</p>
      </div>
      <div slot="footer">
        <Button type="error" size="large" long :loading="modal_loading" @click="handleDel">删除</Button>
      </div>
    </Modal>
    <Modal v-model="modalAddAdPosition" width="480" class-name="vertical-center-modal">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="information-circled"></Icon>
        <span>{{ adPositionTitle }}</span>
      </p>
      <div style="text-align:center;">
        <div class="ad-position-item">
          <label for="ad-name">广告位名称<b class="text-require">*</b></label>
          <Input v-model="adPositionName" placeholder="请输入广告位名" class="ad-position-item-model" id="ad-name"></Input>
        </div>
        <div class="ad-position-item">
          <label for="ad-location">广告位随机位置<b class="text-require">*</b></label>
          <Input v-model="adPositionLocation" placeholder="请输入广告位位置('-'隔开 例：3-5)" class="ad-position-item-model" id="ad-location"></Input>
        </div>
        <div class="ad-position-item">
          <label for="ad-height">广告位高度<b class="text-require">*</b></label>
          <Input v-model="adPositionHeight" placeholder="请输入广告位高度(请输入数字)" class="ad-position-item-model" id="ad-height"></Input>
        </div>
        <div class="ad-position-item">
          <label for="ad-width">广告位宽度<b class="text-require">*</b></label>
          <Input v-model="adPositionWidth" type="text" placeholder="请输入广告位宽度(请输入数字)" class="ad-position-item-model" id="ad-width"></Input>
        </div>
        <div class="ad-position-item">
          <label for="">类型<b class="text-require">*</b></label>
          <Select v-model="adType" style="width:65%;text-align:left;vertical-align:middle;" class="ad-position-item-model">
            <Option v-for="item in adPositionType" :value="item.id" :key="item.id">{{ item.type }}</Option>
          </Select>
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
export default {
  name: 'advertisementPositionManage',
  data() {
    return {
      columns: [{
        title: '序号',
        key: 'index',
        width: 50,
        align: 'center'
      }, {
        title: '广告位名称',
        key: 'name',
      }, {
        title: '广告位位置',
        key: 'position',
        /*width: 90,*/
        align: 'center'
      }, {
        title: '广告位高度',
        key: 'height',
        /*width: 90,*/
        align: 'center'
      }, {
        title: '广告位宽度',
        key: 'width',
        /*width: 90,*/
        align: 'center'
      }, {
        title: '创建时间',
        width: 160,
        key: 'createdAt',
        align: 'center'
      }, {
        title: '操作',
        key: 'action',
        width:200,
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
            }, '修改'),
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
                  this.openTag(params.index)
                }
              }
            }, '关联标签')
          ]);
        }
      }],
      modalDelAdPosition: false,
      modalAddAdPosition: false,
      modal_loading: false,
      adPositionId: undefined,
      adPositionName: '',
      adPositionLocation: '',
      adPositionHeight: undefined,
      adPositionWidth: undefined,
      adType: null,
      modifyOrAddPosition: '',
      adPositionList: [],
      selectedIndex: undefined,
      selectedAdPositionName: '',
      token: '',
      pageIndex: 1,
      pageSize: 10,
      totalCount: undefined
    }
  },
  methods: {
    getToken() {
      this.token = JSON.parse(localStorage.getItem('token'));
      if (this.$route.params.index) {
        this.pageIndex = this.$route.params.index;
      }
    },
    getAlladPositionList() {
      let temData = [];
      this.$http.get(`/api/advertisement/getAllAdvertisementPositions?token=${this.token}&pageIndex=${this.pageIndex}&pageSize=${this.pageSize}`).then(
        res => {
          if (res.data.status == 2000) {
            this.totalCount = res.data.body.total;
            let indexNumber;
            res.data.body.data.map((item,index) => {
              if (this.pageIndex == 1) {
                indexNumber = index+1;
              } else {
                if (index === 9) {
                  indexNumber = this.pageIndex+ (0).toString();
                } else {
                  indexNumber = this.pageIndex-1+ (index+1).toString();
                }
              }
              item.index = indexNumber;
              item.createdAt = this.formateDate(item.createdAt);
              temData.push(item);
            })
            this.adPositionList = temData;
            console.log("adPosition list:", this.adPositionList);
          } else {
            this.$Message.error(res.data.body.message);
          }
        }, err => {
          console.log(err.data);
        })
    },
    modifyAction(index) {
      this.modalAddAdPosition = true;
      this.adPositionId = this.adPositionList[index].id;
      this.adPositionName = this.adPositionList[index].name;
      this.adPositionLocation = this.adPositionList[index].position;
      this.adPositionHeight = this.adPositionList[index].height;
      this.adPositionWidth = this.adPositionList[index].width;
      this.adType = this.adPositionList[index].type;
      console.log('modify adPositionId:', this.adPositionId);
      this.selectedIndex = index;
      this.modifyOrAddPosition = 'modifyAdPosition';
    },
    removeAction(index) {
      this.modalDelAdPosition = true;
      this.adPositionId = this.adPositionList[index].id;
      console.log('del adPositionId:', this.adPositionId);
      this.selectedIndex = index;
      this.selectedAdPositionName = this.adPositionList[index].name;
    },
    openTag(index) {
      console.log("tag index:", index);
      let id = this.adPositionList[index].id;
      this.$router.push({ name: 'advertisement-tag', params: { id: id, index: this.pageIndex } });
    },
    addAction() {
      this.modalAddAdPosition = true;
      this.modifyOrAddPosition = 'addAdPosition';
      this.adPositionName = '';
      this.adPositionLocation = '';
      this.adPositionHeight = '';
      this.adPositionWidth = '';
      this.adType = null;
    },
    handleDel() {
      this.modal_loading = true;
      setTimeout(() => {
        this.modal_loading = false;
        this.modalDelAdPosition = false;
        this.deleteAdPosition(this.adPositionId);
      }, 1500);
    },
    deleteAdPosition(adPositionId) {
      let data = { token: this.token, id: adPositionId };
      this.$http.post('/api/advertisement/deleteAdvertisementPosition', data)
        .then(
          res => {
            if (res.data.status == 2000) {
              this.$Message.success('删除成功');
              this.getAlladPositionList();
              // this.adPositionList.splice(this.selectedIndex, 1);
            } else {
              this.$Message.error(res.data.body.message);
            }
          }, err => {
            console.log(err.data)
          })
    },
    addAdPosition(adPositionData) {
      console.log('add adPosition item:', adPositionData)
      this.$http.post('/api/advertisement/addAdvertisementPosition', adPositionData)
        .then(
          res => {
            if (res.data.status == 2000) {
              console.log('add adPosition info:', res.data);
              this.$Message.success('添加成功');
              this.getAlladPositionList();
              this.modalAddAdPosition = false;
            } else {
              this.$Message.error(res.data.body.message);
              this.modalAddAdPosition = true;
            }

          }, err => {
            console.log(err.data)
          })
    },
    modifyAdPosition(adPositionData) {
      console.log("modify adPosition item:", adPositionData);
      this.$http.post('/api/advertisement/updateAdvertisementPosition', adPositionData).then(
        res => {
          if (res.data.status == 2000) {
            console.log('add feature info:', res.data);
            this.$Message.success('修改成功');
            this.getAlladPositionList();
            this.modalAddAdPosition = false;
            console.log("modified feature list:", this.adPositionList);
          } else {
            this.$Message.error(res.data.body.message);
            this.modalAddAdPosition = true;
          }

        }, err => {
          console.log(err.data);
        })
    },
    handleSubmit() {
      if (!this.adPositionName || !this.adPositionLocation || !this.adPositionHeight || !this.adPositionWidth || this.adType == null) {
        this.$Message.error('请完善信息后提交!');
        return false;
      } else {
        let pattern = /^\d{1,}$/;
        var re1 = '(\\d+)';	// Integer Number 1
        var re2 = '(.)';	// Any Single Character 1
        var re3 = '(\\d+)';	// Integer Number 2i
        var pattern2 = new RegExp(re1 + re2 + re3, ['i']);
        if (this.adPositionLocation && pattern2.exec(this.adPositionLocation) == null) {
          this.$Message.error("广告位随机位置设置错误，请重新输入");
          // this.adPositionWidth = null;
          return false;
        } else if (this.adPositionWidth && !pattern.test(this.adPositionWidth)) {
          this.$Message.error("广告位宽度必须为数字，请重新输入");
          // this.adPositionWidth = null;
          return false;
        } else if (this.adPositionHeight && !pattern.test(this.adPositionHeight)) {
          this.$Message.error("广告位高度必须为数字，请重新输入");
          // this.adPositionHeight = null;
          return false;
        }  else {
          this.modal_loading = true;
          setTimeout(() => {
            this.modal_loading = false;

            switch (this.modifyOrAddPosition) {
              case 'modifyAdPosition':
                let data = {
                  token: this.token,
                  id: this.adPositionId,
                  name: this.adPositionName,
                  position: this.adPositionLocation,
                  width: this.adPositionWidth,
                  height: this.adPositionHeight,
                  type: this.adType
                }
                this.modifyAdPosition(data);
                break;
              case 'addAdPosition':
                let data2 = {
                  token: this.token,
                  name: this.adPositionName,
                  position: this.adPositionLocation,
                  width: this.adPositionWidth,
                  height: this.adPositionHeight,
                  type: this.adType
                }
                this.addAdPosition(data2);
                break;
            }
          }, 1500)
        }
      }
    },
    handleDismiss() {
      this.modal_loading = false;
      this.modalAddAdPosition = false;
    },
    changePage(e) {
      console.log("change page info:", e);
      this.pageIndex = e;
      this.getAlladPositionList();
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
    adPositionTitle: function() {
      console.log("feature Title:", this.modifyOrAddPosition);
      if (this.modifyOrAddPosition === 'modifyAdPosition') {
        return "修改广告位";
      } else if (this.modifyOrAddPosition === 'addAdPosition') {
        return "添加广告位";
      }
    },
    adPositionType: function() {
      let data = [{ id: 0, type: '首页和标签' }, { id: 1, type: '首页' }, { id: 2, type: '标签' }];
      return data;
    }
  },
  created() {
    this.getToken();
    this.getAlladPositionList();
  },
  watch: {
    // 如果路由有变化，会再次执行该方法
    '$route': function(route) {
      this.getAlladPositionList();
    }
  }
}
</script>
<style scoped lang="less">
.ad-position-wrap {
  min-width: 768px;
  min-height:100%;
  border:10px solid #f0f0f0;
  border-bottom:none;
  padding-bottom: 15px;
  background: #ffffff;
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

.ad-position-item {
  label {
    width: 100px;
    display: inline-block;
    vertical-align: middle;
    text-align: left;
  }
  .ad-position-item-model {
    width: 65%;
    vertical-align: baseline;
    margin-left: 10px;
  }
}

.ad-position-item+.ad-position-item {
  margin-top: 10px;
}

.text-require {
  color: #FF6C60;
  font-weight: 700;
  margin-left: 3px;
}

</style>
