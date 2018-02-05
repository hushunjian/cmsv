<template>
  <div class="lightbox-wrap">
    <div class="lightBox-table-title">
      <span class="table-title">搜索操作</span>
    </div>
    <div class="lightbox-search">
      <!--<Button type="default" icon="ios-search-strong" @click="searchAction">查询</Button>-->
      <div class="lightbox-search-detail">
        <label for="search-time">查询时间：</label>
        <DatePicker v-model="searchTime" :editable="false" :clearable="false" type="datetime" placeholder="点击选择时间" style="width: 65%;margin-left: 5px;"></DatePicker>
      </div>
      <Button type="primary" icon="ios-search-strong" @click="searchlightBox">搜索</Button>
    </div>
    <div class="lightBox-table-title">
      <span class="table-title">App灯箱页列表</span>
      <Button type="success" class="add-lightBox-icon" icon="plus-round" @click="addAction">添加</Button>
    </div>
    <Table refs="table2" border :columns="columns" :data="appLightBoxList" class="lightBox-table"></Table>
    <div style="margin: 20px 10px 10px;overflow: hidden">
      <div style="float: right;">
        <Page :total="totalCount" :current="pageIndex" @on-change="changePage"></Page>
      </div>
    </div>
    <Modal v-model="modalLightBox" width="480" class-name="vertical-center-modal">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="information-circled"></Icon>
        <span>{{ lightBoxTitle }}</span>
      </p>
      <div style="text-align:center;">
        <div class="lightbox-item">
          <label for="lightbox-image-name">图片<b class="text-require">*</b></label>
          <Input v-model="image" placeholder="请输入图片名称" class="lightbox-item-model" id="lightbox-image-name"></Input>
        </div>
        <div class="lightbox-item">
          <label for="lightbox-mainText">主文本</label>
          <Input v-model="mainText" type="text" placeholder="请输入主文本" class="lightbox-item-model" id="lightbox-mainText"></Input>
        </div>
        <div class="lightbox-item">
          <label for="lightbox-subText">副文本</label>
          <Input v-model="subText" type="text" placeholder="请输入副文本" class="lightbox-item-model" id="lightbox-subText"></Input>
        </div>
        <div class="lightbox-item">
          <label for="lightbox-mainColor">主色调<b class="text-require">*</b></label>
          <Input v-model="mainColor" type="text" placeholder="请输入主色调" class="lightbox-item-model" id="lightbox-mainColor"></Input>
        </div>
        <div class="lightbox-item">
          <label for="lightbox-link">跳转链接<b class="text-require">*</b></label>
          <Input v-model="link" type="text" placeholder="请输入跳转链接" class="lightbox-item-model" id="lightbox-link"></Input>
        </div>
        <div class="lightbox-item">
          <label>开始时间<b class="text-require">*</b></label>
          <DatePicker v-model="beginTime" :editable="false" :clearable="false" placement="top-start" type="datetime" placeholder="点击选择时间" style="width: 65%;margin-left:10px;"></DatePicker>
        </div>
        <div class="lightbox-item">
          <label for="">结束时间<b class="text-require">*</b></label>
          <DatePicker v-model="endTime" :editable="false" :clearable="false" placement="top-start" type="datetime" placeholder="点击选择时间" style="width: 65%;margin-left:10px;"></DatePicker>
        </div>
        <div class="lightbox-item">
          <label for="">状态</label>
          <Select v-model="status" class="lightbox-item-model">
            <Option v-for="item in statusData" :value="item.id" :key="item.id">{{ item.type }}</Option>
          </Select>
        </div>
      </div>
      <div slot="footer">
        <Button type="primary" :loading="modal_loading" @click="handleSubmit">确定</Button>
        <Button type="default" @click="handleDismiss">取消</Button>
      </div>
    </Modal>
    <Modal v-model="modalDelLightBox" width="360" class-name="vertical-center-modal">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="information-circled"></Icon>
        <span>删除确认</span>
      </p>
      <div style="text-align:center">
        <p>是否确认删除此条标签信息？</p>
        <p class="del-item">{{ selectedLightBoxName }}</p>
        <p style="color:red;font-weight:600;margin-top:20px;">谨慎操作，此操作会删除数据（物理删除），不可恢复！</p>
      </div>
      <div slot="footer">
        <Button type="error" size="large" long :loading="modal_loading" @click="handleDel">删除</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import uploadImg from '@/components/uploadImg.vue'

export default {
  name: 'appLightBox',
  components: {
    uploadImg
  },
  data() {
    return {
      columns: [{
          title: '序号',
          key: 'index',
          width: 50,
          align: 'center',
          /*fixed: 'left'*/
        }, {
          title: '图片',
          key: 'image',
          // align: 'center',
          width: 200
        }, {
          title: '主文本',
          key: 'mainText'/*,
          width: 160*/
        }, {
          title: '副文本',
          key: 'subText'/*,
          width: 160*/
        },
        {
          title: '主色调',
          key: 'mainColor',
          width: 120
        }, {
          title: '跳转链接',
          key: 'link'/*,
          width: 200*/
        }, {
          title: '开始时间',
          key: 'beginAt',
          align: 'center',
          width: 140
        }, {
          title: '结束时间',
          key: 'endAt',
          align: 'center',
          width: 140
        }, {
          title: '状态',
          key: 'status',
          align: 'center',
          width: 90,
          render: (h, params) => {
            const row = params.row;
            const statusName = row.status === 0 ? "启用" : row.status === 1 ? "不启用" : '';
            return h('span', statusName);
          }
        }, {
          title: '操作',
          key: 'action',
          width: 130,
          align: 'center',
          /*fixed: 'right',*/
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
                    this.deleteAction(params.index)
                  }
                }
              }, '删除')
            ]);
          }
        }
      ],
      searchTime: null,
      selectedIndex: undefined,
      appLightBoxList: [],
      id: null,
      token: '',
      pageIndex: 1,
      pageSize: 10,
      totalCount: undefined,
      searchStatus: false,
      image: null,
      mainText: null,
      subText: null,
      mainColor: null,
      link: null,
      beginTime: null,
      endTime: null,
      status: 0,
      selectedLightBoxName: null,
      modalLightBox: false,
      modalDelLightBox: false,
      modal_loading: false,
      modifyOrAddLightBox: '',
    }
  },
  methods: {
    getToken() {
      this.token = JSON.parse(localStorage.getItem('token'));
    },
    getAllAppLightBoxList(type) {
      let temData = [];
      let url;
      if (type === 'get') {
        url = `/api/appconfig/getLightBoxes?token=${this.token}&pageIndex=${this.pageIndex}&pageSize=${this.pageSize}`;
      } else if (type === 'search') {
        let time = new Date(this.searchTime).getTime();
        url = `/api/appconfig/getLightBoxesByTime?token=${this.token}&pageIndex=${this.pageIndex}&pageSize=${this.pageSize}&searchTime=${time}`;
      }
      this.$http.get(url).then(
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
              item.beginAt = this.formateDate(item.beginAt);
              item.endAt = this.formateDate(item.endAt);
              temData.push(item);
            })
            this.appLightBoxList = temData;
            console.log("applightbox list:", this.appLightBoxList);
          } else {
            this.$Message.error(res.data.body.message);
          }
        }, err => {
          console.log(err.data);
        })
    },
    addAction() {
      this.modalLightBox = true;
      this.modifyOrAddLightBox = 'addLightBox';
      this.image = '';
      this.mainText = '';
      this.subText = '';
      this.mainColor = '';
      this.link = '';
      this.beginTime = '';
      this.endTime = '';
      // this.status = null;
    },
    modifyAction(index) {
      this.modalLightBox = true;
      this.modifyOrAddLightBox = 'modifyLightBox';
      this.id = this.appLightBoxList[index].id;
      this.image = this.appLightBoxList[index].image;
      this.mainText = this.appLightBoxList[index].mainText;
      this.subText = this.appLightBoxList[index].subText;
      this.mainColor = this.appLightBoxList[index].mainColor;
      this.link = this.appLightBoxList[index].link;
      this.beginTime = this.appLightBoxList[index].beginAt;
      this.endTime = this.appLightBoxList[index].endAt;
      this.status = this.appLightBoxList[index].status;
    },
    deleteAction(index) {
      this.modalDelLightBox = true;
      this.id = this.appLightBoxList[index].id;
      console.log('del id:', this.id);
      this.selectedIndex = index;
      this.selectedLightBoxName = this.appLightBoxList[index].mainText;
    },
    handleDel() {
      this.modal_loading = true;
      setTimeout(() => {
        this.modal_loading = false;
        this.modalDelLightBox = false;
        this.deleteLightBox(this.id);
      }, 1500);
    },
    openlightBoxKingdomAction(index) {
      console.log("lightBox index:", index);
      let lightBoxId = this.appLightBoxList[index].lightBoxId;
      this.$router.push({ name: 'lightBox-kingdom', params: { id: lightBoxId } });
    },
    // 分页操作
    changePage(e) {
      console.log("change page info:", e);
      this.pageIndex = e;
      if (this.searchStatus) {
        this.getAllAppLightBoxList('search');
      } else {
        this.getAllAppLightBoxList('get');
      }
    },
    searchAction() {
      this.searchStatus = !this.searchStatus;
      if (!this.searchStatus) {
        this.getAllAppLightBoxList('get');
      }
    },
    // 搜索
    searchlightBox(e) {
      if (this.searchTime) {
        this.searchStatus = true;
        console.log("search lightBox:", e);
        this.pageIndex = 1;
        this.getAllAppLightBoxList('search');
      } else {
        this.$Message.error("请输入日期后查询");
        return;
      }
    },
    // 添加
    addLightBox(lightBoxData) {
      this.$http.post('/api/appconfig/addLightBox', lightBoxData)
        .then(
          res => {
            if (res.data.status == 2000) {
              this.$Message.success('添加成功');
              if (this.searchStatus) {
                this.getAllAppLightBoxList('search');
              } else {
                this.getAllAppLightBoxList('get');
              }
              this.modalLightBox = false;
              // let temData = Object.assign({}, { id: '' }, lightBoxData,{beginAt: this.formateDate(lightBoxData.beginAt)},{endAt: this.formateDate(lightBoxData.endAt)});
              // this.appLightBoxList.push(temData);
            } else {
              this.$Message.error(res.data.body.message);
              this.modalLightBox = true;
            }
          }, err => {
            console.log(err.data)
          })
    },
    // 修改
    modifyLightBox(lightBoxData) {
      this.$http.post('/api/appconfig/updateLightBox', lightBoxData).then(
        res => {
          if (res.data.status == 2000) {
            console.log('add lightBox info:', res.data);
            this.$Message.success('修改成功');
            if (this.searchStatus) {
              this.getAllAppLightBoxList('search');
            } else {
              this.getAllAppLightBoxList('get');
            }
            this.modalLightBox = false;
            console.log("modified lightBox list:", this.appLightBoxList);
          } else {
            this.$Message.error(res.data.body.message);
            this.modalLightBox = true;
          }
        }, err => {
          console.log(err.data);
        })
    },
    // 删除
    deleteLightBox(id) {
      let data = { token: this.token, id: id };
      this.$http.post('/api/appconfig/deleteLightBox', data)
        .then(
          res => {
            if (res.data.status == 2000) {
              this.$Message.success('删除成功');
              this.appLightBoxList.splice(this.selectedIndex, 1);
            } else {
              this.$Message.error(res.data.body.message);
            }
          }, err => {
            console.log(err.data)
          })
    },
    handleSubmit() {
      if (!this.image || !this.mainColor || !this.beginTime || !this.endTime || !this.link) {
        this.$Message.error('请完善信息后提交');
      } else {
        this.modal_loading = true;
        setTimeout(() => {
          this.modal_loading = false;

          switch (this.modifyOrAddLightBox) {
            case 'modifyLightBox':
              let data = {
                token: this.token,
                id: this.id,
                image: this.image,
                mainText: this.mainText,
                subText: this.subText,
                mainColor: this.mainColor,
                link: this.link,
                beginAt: new Date(this.beginTime).getTime(),
                endAt: new Date(this.endTime).getTime(),
                status: this.status
              }
              console.log("modify lightbox:", data);
              this.modifyLightBox(data);
              break;
            case 'addLightBox':
              let data2 = {
                token: this.token,
                image: this.image,
                mainText: this.mainText,
                subText: this.subText,
                mainColor: this.mainColor,
                link: this.link,
                beginAt: new Date(this.beginTime).getTime(),
                endAt: new Date(this.endTime).getTime(),
                status: this.status
              }
              console.log("add lightBox:", data2);
              this.addLightBox(data2);
              break;
          }
        }, 1500)
      }
    },
    handleDismiss() {
      this.modal_loading = false;
      this.modalLightBox = false;
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
    }

  },
  computed: {
    statusData: function() {
      let data = [{ id: 0, type: '启用' }, { id: 1, type: '不启用' }];
      return data;
    },
    lightBoxTitle: function() {
      if (this.modifyOrAddLightBox === 'modifyLightBox') {
        return "修改灯箱";
      } else if (this.modifyOrAddLightBox === 'addLightBox') {
        return "添加灯箱";
      }
    }
  },
  created() {
    this.getToken();
    this.getAllAppLightBoxList('get');
  },
  watch: {
    // 如果路由有变化，会再次执行该方法
    '$route': function(route) {
      this.getAllAppLightBoxList('get');
      this.searchStatus = false;
    }
  }
}
</script>
<style scoped lang="less">
.lightbox-wrap {
  min-width: 1400px;
  min-height:100%;
  border:10px solid #f0f0f0;
  border-bottom:none;
  padding-bottom: 15px;
  background: #ffffff;
  .lightbox-search {
    background: #ffffff;
    border-bottom:10px solid #f0f0f0;
    padding:0 5px 15px;
    font-size: 16px;
    line-height: 24px;
    .lightbox-search-detail {
      display: inline-block;
      width: 330px;
      vertical-align: middle;
      margin-left: 15px;
      label {
        vertical-align: middle;
        font-size: 12px;
      }
      .lightbox-search-model {
        width: 65%;
        text-align: left;
        vertical-align: middle;
      }
    }
  }
  .lightBox-table-title {
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
    .add-lightBox-icon {
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

.lightbox-item {
  label {
    width: 120px;
    display: inline-block;
    vertical-align: middle;
    text-align: left;
  }
  .lightbox-item-model {
    display: inline-block;
    width: 65%;
    vertical-align: middle;
    margin-left: 10px;
    text-align: left;
    .lightbox-item-check {
      width: 70px;
    }
  }
  .lightbox-item-model:last {
    display: inline-block;
  }
}

.lightbox-item+.lightbox-item {
  margin-top: 10px;
}

.lightBox-img {
  display: inline-block;
  text-align: left;
  .lightBox-img-pre {
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
}

.range {
  width: 150px;
  display: inline-block;
  vertical-align: middle;
  margin-left: 10px;
  line-height: 10px;
}

.text-require {
  color: #FF6C60;
  font-weight: 700;
  margin-left: 3px;
}

.lightBox-table {
  .ivu-table {
    .ivu-table-body {
      .ivu-table-tbody {
        .ivu-table-row {
          td {
            .ivu-table-cell {
              padding-left: 5px;
              padding-right: 5px;
            }
          }
        }
      }
    }
  }
}

.del-item {
  color: red;
  margin-top: 20px;
  font-size: 15px;
  font-weight: 600;
}

.ivu-modal {
  top: 30px;
}

</style>
