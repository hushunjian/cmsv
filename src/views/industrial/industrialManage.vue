<template>
  <div class="industrialManage-wrap">
    <div class="industrialManage-table-title">
      <span class="table-title">搜索操作</span>
    </div>
    <div class="industrialManage-search">
      <!--<Button type="default" icon="ios-search-strong" @click="searchAction">查询</Button>-->
      <div class="industrialManage-search-detail">
        <div class="industrialManage-search-item">
          <label for="topic-name">行业名称</label>
          <Input v-model="firmNameSearch" placeholder="请输入标签名" class="industrialManage-item-model" id="topic-name"></Input>
        </div>
        <div class="industrialManage-search-item">
          <label for="">创建时间</label>
          <DatePicker v-model="createdBegin" :editable="false" :clearable="false" type="datetime" placeholder="点击选择时间" style="width: 160px;margin-left:5px;"></DatePicker> -
          <DatePicker v-model="createdEnd" :editable="false" :clearable="false" type="datetime" placeholder="点击选择时间" style="width: 160px;margin-left:5px;"></DatePicker>
        </div>
        <Button type="primary" icon="ios-search-strong" @click="searchIndustrial" style="margin-bottom:10px;margin-left:20px">搜索</Button>
      </div>
    </div>
    <div class="industrialManage-table-title">
      <span class="table-title">标签列表</span>
      <Button type="success" class="add-industrialManage-icon" icon="plus-round" @click="addAction">添加</Button>
    </div>
    <Table refs="table2" border :columns="columns" :data="industrialList" class="industrialManage-table"></Table>
    <!--<div style="margin: 20px 10px 10px;overflow: hidden">
      <div style="float: right;">
        <Page :total="totalCount" :current="pageIndex" @on-change="changePage"></Page>
      </div>
    </div>-->
    <Modal v-model="modalIndustrial" width="400" class-name="vertical-center-modal">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="information-circled"></Icon>
        <span>{{ industrialTitle }}</span>
      </p>
      <div class="industrialManage-list-con">
        <div class="industrialManage-item">
          <label for="industrialManage-name">行业名称<b class="text-require">*</b></label>
          <Input v-model="firmName" placeholder="请输入行业名称" class="industrialManage-item-model" id="industrialManage-name"></Input>
        </div>
        <div class="industrialManage-item ">
          <label for="industrialManage-name" style="vertical-align: top">行业介绍</label>
          <Input v-model="introduce" placeholder="请输入行业名称" type="textarea" :rows="4" class="industrialManage-item-model" id="industrialManage-name" style="vertical-align: top"></Input>
        </div>
        <div class="industrialManage-item">
          <label for="" style="vertical-align: top">背景图<b class="text-require">*</b></label>
          <div class="industrialManage-img industrialManage-item-model" style="vertical-align: top">
            <div class="industrialManage-img-pre">
              <img :src="coverImage" alt="">
              <span v-if="!coverImage">暂无图片</span>
            </div>
            <imgUpload :type="imgType" @transferData="getData"></imgUpload>
          </div>
        </div>
      </div>
      <div slot="footer">
        <Button type="primary" :loading="modal_loading" @click="handleSubmit">确定</Button>
        <Button type="default" @click="handleDismiss">取消</Button>
      </div>
    </Modal>
    <Modal v-model="modalDelIndustrial" width="360" class-name="vertical-center-modal">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="information-circled"></Icon>
        <span>删除确认</span>
      </p>
      <div style="text-align:center">
        <p>是否确认删除此条标签信息？</p>
        <p class="del-item">{{ firmName }}</p>
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
  import imgUpload from '@/components/imgUpload.vue'
  export default {
    name: 'industrialManage',
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
          align: 'center',
          /*fixed: 'left'*/
        }, {
          title: '行业名',
          key: 'firmName',
          align: 'center'
        }, {
          title: '封面',
          key: 'coverImage',
          align: 'center',
          render: (h, params) => {
            let row = params.row;
            let imgStatus = row.coverImage.match(/https\:\/\/cdn.me-to-me.com\/(.*)/)[1];
            if (imgStatus) {
              return h('img', {
                attrs: {
                  src: params.row.coverImage,
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
          title: '行业介绍',
          key: 'introduce',
          align: 'center'
        }, {
          title: '创建时间',
          key: 'createdAt',
          align: 'center',
          width: 160
        }, {
          title: '操作',
          key: 'action',
          width: 160,
          align: 'center',
          /*fixed: 'right',*/
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'primary',
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
                  type: 'info',
                  size: 'small'
                },
                style: {
                  marginRight: '5px',
                },
                on: {
                  click: () => {
                    this.toUpAction(params.index);
                  }
                }
              }, '上移'),
              h('Button', {
                props: {
                  type: 'info',
                  size: 'small'
                },
                style: {
                  marginRight: '5px',
                },
                on: {
                  click: () => {
                    this.todownAction(params.index);
                  }
                }
              }, '下移')
            ])
          }
        }],
        id: undefined,
        firmName: '',
        firmNameSearch: '',
        introduce: '',
        createdBegin: null,
        createdEnd: null,
        industrialList: [],
        token: '',
        pageIndex: 1,
        pageSize: 10,
        totalCount: undefined,
        searchStatus: false,
        modalIndustrial: false,
        modalDelIndustrial: false,
        modal_loading: false,
        modifyOrAddIndustrial: '',
        coverImage: '',
        fileName: '',
        baseUrl: 'https://cdn.me-to-me.com/',
        originFileName: '',
        originImg: '',
        imgType: 'image',
        sortNum: null
      }
    },
    methods: {
      getToken () {
        this.token = JSON.parse(localStorage.getItem('token'));
        if (this.$route.params.index) {
          this.pageIndex = this.$route.params.index;
        }
      },
      getIndustrialList (type) {
        let temData = [];
        let url;
        let httpData;
        if (type === 'get') {
          url = `/api/industrial/getIndustrialManage?token=${this.token}`;
          httpData = this.$http.get(url);
        } else if (type === 'search') {
          url = `/api/industrial/getIndustrialManageSearch`;
          let data = {
            token: this.token,
            firmName: this.firmNameSearch,
            createdBegin: new Date(this.createdBegin).getTime(),
            createdEnd: new Date(this.createdEnd).getTime()
          }
          if (data.createdEnd && data.createdEnd < data.createdBegin) {
            this.$Message.error("创建时间结束时间应大于开始时间，请重新输入");
            this.loading = false;
            return false;
          } else {
            httpData = this.$http.post(url, data);
          }
        }
        httpData.then(
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
                item.createdAt = this.formateDate(item.createdAt);
                if (item.coverImage && item.coverImage!='') {
                  item.coverImage = this.baseUrl + item.coverImage;
                }
                temData.push(item);
              })
              this.industrialList = temData;
              if (this.industrialList.length > 0) {
                this.sortNum = this.industrialList[this.industrialList.length - 1].sort + 1;
              } else {
                this.sortNum = 1;
              }
              console.log("industrial list:", this.industrialList);
            } else {
              this.$Message.error(res.data.body.message);
            }
          }, err => {
            console.log(err.data);
          })
      },
      addAction () {
        this.modalIndustrial = true;
        this.modifyOrAddIndustrial = 'addIndustrial';
        this.firmName = '';
        this.introduce = '';
        this.coverImage = '';
      },
      modifyAction (index) {
        let imgStatus = this.industrialList[index].coverImage.match(/https\:\/\/cdn.me-to-me.com\/(.*)/)[1];

        this.modalIndustrial = true;
        this.modifyOrAddIndustrial = 'modifyIndustrial';
        this.id = this.industrialList[index].id;
        this.firmName = this.industrialList[index].firmName;
        this.introduce = this.industrialList[index].introduce;
        this.coverImage = imgStatus ? this.industrialList[index].coverImage : '';
        // this.fileName = this.coverImage.match(/https\:\/\/cdn.me-to-me.com\/(.*)/)[1];
        this.fileName = imgStatus ? imgStatus : '';
        this.originFileName = this.fileName;
      },
      removeAction (index) {
        this.modalDelIndustrial = true;
        this.id = this.industrialList[index].id;
        console.log('del tagId:', this.id);
      },
      handleDel () {
        this.modal_loading = true;
        setTimeout(() => {
          this.modal_loading = false;
          this.modalDelIndustrial = false;
          this.deleteIndustrial(this.id);
        }, 1500);
      },
      changePage(e) {
        console.log("change page info:", e);
        this.pageIndex = e;
        if (this.searchStatus) {
          this.getIndustrialList('search');
        } else {
          this.getIndustrialList('get');
        }
      },
      searchIndustrial(e) {
        this.searchStatus = true
        console.log("search tag:", e);
        this.pageIndex = 1;
        this.getIndustrialList('search');
      },
      addIndustrial(IndustrialData) {
        this.$http.post('/api/industrial/addIndustrial', IndustrialData)
          .then(
            res => {
              if (res.data.status == 2000) {
                this.$Message.success('添加成功');
                if (this.searchStatus) {
                  this.getIndustrialList('search');
                } else {
                  this.getIndustrialList('get');
                }
                this.modalIndustrial = false;
                this.fileName = '';
              } else {
                this.$Message.error(res.data.body.message);
                this.modalIndustrial = true;
              }
            }, err => {
              console.log(err.data)
            })
      },
      modifyIndustrial(IndustrialData) {
        this.$http.post('/api/industrial/updateIndustrial', IndustrialData).then(
          res => {
            if (res.data.status == 2000) {
              console.log('add industrial info:', res.data);
              this.$Message.success('修改成功');
              if (this.searchStatus) {
                this.getIndustrialList('search');
              } else {
                this.getIndustrialList('get');
              }
              this.modalIndustrial = false;
              this.fileName = '';
              console.log("modified industrial list:", this.industrialList);
            } else {
              this.$Message.error(res.data.body.message);
              this.modalIndustrial = true;
            }
          }, err => {
            console.log(err.data);
          })
      },
      deleteIndustrial(id) {
        let data = { token: this.token, id: id };
        this.$http.post('/api/industrial/deleteIndustrial', data)
          .then(
            res => {
              if (res.data.status == 2000) {
                this.$Message.success('删除成功');
                if (this.searchStatus) {
                  this.getIndustrialList('search');
                } else {
                  this.getIndustrialList('get');
                }
                // this.tagList.splice(this.selectedIndex, 1);
              } else {
                this.$Message.error(res.data.body.message);
              }
            }, err => {
              console.log(err.data)
            })
      },
      handleSubmit() {
        if (!this.firmName || this.firmName=='') {
          this.$Message.error('行业名称不能为空!');
          return false;
        } else if (this.fileName=='') {
          this.$Message.error('封面图片不能为空!');
          return false;
        } else {
          this.modal_loading = true;
          setTimeout(() => {
            this.modal_loading = false;
            switch (this.modifyOrAddIndustrial) {
              case 'modifyIndustrial':
                let data = {
                  token: this.token,
                  id: this.id,
                  firmName: this.firmName,
                  introduce: this.introduce,
                  coverImage: this.fileName
                }
                console.log("modify industrial:", data);
                this.modifyIndustrial(data);
                break;
              case 'addIndustrial':
                let data2 = {
                  token: this.token,
                  firmName: this.firmName,
                  introduce: this.introduce,
                  coverImage: this.fileName,
                  sort: this.sortNum
                }
                console.log("add industrial:", data2);
                this.addIndustrial(data2);
                break;
            }
          }, 1500)
          return false;
        }
      },
      handleDismiss() {
        this.modal_loading = false;
        this.modalIndustrial = false;
      },
      getData(msg) {
        console.log("transfer Data:", msg);
        if (msg.type === 'image') {
          this.coverImage = msg.img;
          this.fileName = msg.fileName;
          // if (msg.img) {
          //   this.coverImage = msg.img;
          //   this.fileName = msg.fileName;
          // } else {
          //   this.coverImage = this.originImg;
          //   this.fileName = this.originFileName;
          // }
        }
      },
      toUpAction(index) {
        if (index === 0) {
          return;
        } else {
          let currentData = Object.assign({}, this.industrialList[index]);
          let firstData = Object.assign({}, this.industrialList[index - 1]);
          let sort = currentData.sort;
          currentData.sort = firstData.sort;
          firstData.sort = sort;
          this.industrialList.splice(index - 1, 2, currentData, firstData);
          let temData = [];
          let temObj;
          let temObjNext;
          temObj = Object.assign({}, { id: this.industrialList[index - 1].id }, { sort: this.industrialList[index - 1].sort });
          temObjNext = Object.assign({}, { id: this.industrialList[index].id }, { sort: this.industrialList[index].sort });
          temData.push(temObj, temObjNext);
          //下面是返回所有列表
          /*this.listRankList.map(tem => {
             let temObj;
             temObj = Object.assign({}, { id: tem.id }, { sort: tem.sort });
             temData.push(temObj);
          })*/
          console.log("sort data1:", temData);
          let targetData = {
            token: this.token,
            targetData: temData
          }
          this.sortIndustrialList(targetData);
          // this.sortOnlineList(temData);
        }

      },
      todownAction(index) {
        let length = this.industrialList.length;
        if (index === length - 1) {
          return;
        } else {
          let currentData = Object.assign({}, this.industrialList[index]);
          let firstData = Object.assign({}, this.industrialList[index + 1]);
          let sort = currentData.sort;
          currentData.sort = firstData.sort;
          firstData.sort = sort;
          this.industrialList.splice(index, 2, firstData, currentData);
          let temData = [];
          let temObj;
          let temObjNext;
          temObj = Object.assign({}, { id: this.industrialList[index].id }, { sort: this.industrialList[index].sort });
          temObjNext = Object.assign({}, { id: this.industrialList[index + 1].id }, { sort: this.industrialList[index + 1].sort });
          temData.push(temObj, temObjNext);
          //下面是返回所有列表
          /*this.industrialList.map(tem => {
              let temObj;
              temObj = Object.assign({}, { id: tem.id }, { sort: tem.sort });
              temData.push(temObj);
          })*/
          console.log("sort data12:", temData);
          let targetData = {
            token: this.token,
            targetData: temData
          }
          this.sortIndustrialList(targetData);
        }
      },
      sortIndustrialList(data) {
        this.$http.post('/api/industrial/sortEntry', data)
          .then(
            res => {
              if (res.data.status == 2000) {
                this.$Message.success('排序成功');
              } else {
                this.$Message.error(res.data.body.message);
              }
            }, err => {
              console.log(err.data)
            })
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
      industrialTitle: function() {
        if (this.modifyOrAddIndustrial === 'modifyIndustrial') {
          return "修改行业";
        } else if (this.modifyOrAddIndustrial === 'addIndustrial') {
          return "添加行业";
        }
      }
    },
    created() {
      this.getToken();
      this.getIndustrialList('get');
    },
    watch: {
      // 如果路由有变化，会再次执行该方法
      '$route': function(route) {
        this.getIndustrialList('get');
        this.searchStatus = false;
      }
    }
  }
</script>
<style scoped lang="less">
  .industrialManage-wrap {
    min-width:1000px;
    min-height:100%;
    border:10px solid #f0f0f0;
    border-bottom:none;
    padding-bottom: 15px;
    background: #ffffff;
    .industrialManage-search {
      background: #ffffff;
      padding:0 5px 5px;
      border-bottom:10px solid #f0f0f0;
      font-size: 16px;
      line-height: 24px;
      .industrialManage-search-detail {
        .industrialManage-search-item {
          display: inline-block;
          /*width: 240px;*/
          vertical-align: middle;
          margin-left: 15px;
          margin-bottom: 10px;
          label {
            display: inline-block;
            vertical-align: middle;
            font-size: 12px;
          }
          .industrialManage-item-model {
            width: 180px;
            margin-left: 5px;
            text-align: left;
            vertical-align: middle;
          }
        }
        .industrialManage-search-item+.industrialManage-search-item {
          /*margin-left: 0;*/
        }
      }
    }
    .industrialManage-table-title {
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
      .add-industrialManage-icon {
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
  .industrialManage-list-con{
    text-align: left;
    margin-left:12px;
    .industrialManage-item {
      label {
        width:60px;
        display: inline-block;
        vertical-align: middle;
        text-align: left;
      }
      .industrialManage-item-model {
        display: inline-block;
        width: 75%;
        vertical-align: middle;
        margin-left: 10px;
        .industrialManage-item-check {
          width: 70px;
        }
      }
      .industrialManage-item-model-check{
        width: 400px;
      }
      .industrialManage-item-model:last {
        display: inline-block;
      }
    }
  }
  .industrialManage-item+.industrialManage-item {
    margin-top: 10px;
  }

  .industrialManage-img {
    display: inline-block;
    text-align: left;
    .industrialManage-img-pre {
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
  .range {
    width: 150px;
    display: inline-block;
    vertical-align: middle;
    margin-left: 10px;
    line-height: 10px;
  }


  .del-item {
    color: red;
    margin-top: 20px;
    font-size: 15px;
    font-weight: 600;
  }

  .industrialManage-search-detail{
    margin-top: 10px;
  }

</style>
