<template>
  <div class="anchor-wrap">
    <div class="anchor-table-title">
      <span class="table-title">搜索操作</span>
    </div>
    <div class="anchor-search">
      <!--<Button type="default" icon="ios-search-strong" @click="searchAction">查询</Button>-->
      <div class="anchor-search-detail">
        <div class="anchor-search-item">
          <label for="uid">主播UID</label>
          <Input v-model="uidSearch" placeholder="请输入主播UID" class="anchor-item-model" id="uid"></Input>
        </div>
        <div class="anchor-search-item">
          <label for="">查询注册时间</label>
          <DatePicker v-model="createdBegin" :editable="false" :clearable="false" type="datetime" placeholder="点击选择时间" style="width: 160px;margin-left:5px;"></DatePicker> -
          <DatePicker v-model="createdEnd" :editable="false" :clearable="false" type="datetime" placeholder="点击选择时间" style="width: 160px;"></DatePicker>
        </div>
        <div class="anchor-search-item">
          <label for="">抽奖王国ID</label>
          <Input v-model="raffleTopicIdSearch" placeholder="请输入抽奖王国id" class="anchor-item-model" id=""></Input>
        </div>
        <Button type="primary" icon="ios-search-strong" @click="searchAnchor" style="margin-bottom:10px;margin-left:20px">搜索</Button>
      </div>
    </div>
    <div class="anchor-table-title">
      <span class="table-title">邀请明细</span>
      <Button v-if="isShow" type="success" icon="ios-download-outline" @click="exportData" class="anchor-value-user-button-item exportData">导出</Button>
    </div>
    <Table ref="table2" border :columns="columns" :data="anchorList" class="anchor-table"></Table>
    <div style="margin: 20px 10px 10px;overflow: hidden">
      <div style="float: right;">
        <Page :total="totalCount" :current="pageIndex" @on-change="changePage"></Page>
      </div>
    </div>
  </div>
</template>
<script>
  import uploadImg from '@/components/uploadImg.vue'
  import imgUpload from '@/components/imgUpload.vue'
  export default {
    name: 'anchorInviteDetail',
    data() {
      return {
        columns: [{
          title: '序号',
          key: 'index',
          width: 50,
          align: 'center',
          /*fixed: 'left'*/
        }, {
          title: '主播UID',
          key: 'uid',
          align: 'center',
          width: 100
        }, {
          title: '主播昵称',
          key: 'nickName'
        }, {
          title: '真实姓名',
          key: 'realName',
          align: 'center'
        }, {
          title: '日期',
          key: 'dateTime',
          align: 'center',
          width: 120
        }, {
          title: '被邀请人UID',
          key: 'invitedUid',
          align: 'center',
          width: 100
        }, {
          title: '被邀请人昵称',
          key: 'invitedNickName'
        }, {
          title: '注册时间',
          key: 'createdAt',
          align: 'center',
          width: 160
        }, {
          title: '注册渠道',
          key: 'registerChannel',
          align: 'center',
          render: (h, params) => {
            const row = params.row;
            if (row.registerChannel) {
              return h('span', row.registerChannel);
            } else {
              return h('span', '暂无数据');
            }
          }
        }, {
          title: '是否参与抽奖',
          key: 'isJoinRaffle',
          align: 'center',
          width: 120,
          render: (h, params) => {
            const row = params.row;
            const joinRaffle = row.isJoinRaffle === 0 ? "否" : row.isJoinRaffle === 1 ? "是" : '';
            return h('span', joinRaffle);
          }
        }, {
          title: '登录设备号',
          key: 'logonDevice',
          align: 'center',
          width: 200,
          render: (h, params) => {
            const row = params.row;
            if (row.logonDevice) {
              return h('ul', {
                style: {
                  maxHeight: '120px',
                  overflow: 'auto',
                  marginRight: '-10px',
                }
              }, row.logonDevice.map(item => {
                return h('li', {
                  style: {
                    textAlign: 'center',
                    padding: '4px'
                  }
                }, item)
              }));
            } else {
              return h('span', '暂无数据');
            }
          }
        }],
        uidSearch: null,
        createdBegin: null,
        createdEnd: null,
        raffleTopicIdSearch: 61263,
        anchorList: [],
        token: '',
        pageIndex: 1,
        pageSize: 10,
        totalCount: null,
        isShow: null,
        searchStatus: false
      }
    },
    methods: {
      getToken () {
        this.token = JSON.parse(localStorage.getItem('token'));
        if (this.$route.params.index) {
          this.pageIndex = this.$route.params.index;
        }
      },
      getAnchorList (type) {
        let temData = [];
        let url;
        let httpData;
        if (type === 'get') {
          url = `/api/anchor/getAnchorInviteDetail?token=${this.token}&pageIndex=${this.pageIndex}&pageSize=${this.pageSize}`;
          httpData = this.$http.get(url);
        } else if (type === 'search') {
          url = `/api/anchor/getAnchorInviteDetailSearch`;
          let data = {
            token: this.token,
            pageIndex: this.pageIndex,
            pageSize: this.pageSize,
            uid: this.uidSearch,
            createdBegin: new Date(this.createdBegin).getTime(),
            createdEnd: new Date(this.createdEnd).getTime(),
            raffleTopicId : this.raffleTopicIdSearch
          }
          if (data.createdEnd && data.createdEnd < data.createdBegin) {
            this.$Message.error("注册时间结束时间应大于开始时间，请重新输入");
            return false;
          } else {
            if (data.raffleTopicId == '') {
              data.raffleTopicId = 61263;
            }
            httpData = this.$http.post(url, data);
          }
        }
        httpData.then(
          res => {
            if (res.data.status == 2000) {
              this.totalCount = res.data.body.total;
              this.IsPC();
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
                if(item.logonDevice!= '' && item.logonDevice!= null){
                  item.logonDevice = this.formateLogonDevice(item.logonDevice);
                }
                temData.push(item);
              })
              this.anchorList = temData;
              console.log("anchorInviteDetail list:", this.anchorList);
            } else {
              this.$Message.error(res.data.body.message);
            }
          }, err => {
            console.log(err.data);
          })
      },
      changePage(e) {
        console.log("change page info:", e);
        this.pageIndex = e;
        if (this.searchStatus) {
          this.getAnchorList('search');
        } else {
          this.getAnchorList('get');
        }

      },
      searchAction() {
        this.searchStatus = !this.searchStatus;
        if (!this.searchStatus) {
          this.getAnchorList('get');
        }
        // if (this.searchStatus) {
        //   this.parentTagList.splice(0,1,{parentTagId:-1,parentTagName:'全部'});
        // } else {
        //   this.parentTagList.splice(0,1,{parentTagId:0,parentTagName:'无'});
        // }
      },
      searchAnchor(e) {
        let pattern = /^\d{1,}$/;
        if (this.uidSearch && !pattern.test(this.uidSearch)) {
          this.$Message.error("uid必须为数字，请重新输入");
          return false;
        } else if (this.raffleTopicIdSearch && !pattern.test(this.raffleTopicIdSearch)) {
          this.$Message.error("抽奖王国id必须为数字，请重新输入");
          return false;
        } else {
          this.searchStatus = true
          console.log("search anchorInviteDetail:", e);
          this.pageIndex = 1;
          this.getAnchorList('search');
        }
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
      formateLogonDevice(data){
        let strs= new Array(); //定义一数组
        strs=data.split(","); //字符分割
        return strs;
      },
      exportData() {
        /* this.$refs.table2.exportCsv({
         filename: 'The original data'
         }) */
        let createdBegin;
        let createdEnd;
        let uid;
        if (this.createdBegin != null && this.createdBegin != '') {
          createdBegin = this.formateDate(this.createdBegin);
        } else {
          createdBegin = this.createdBegin
        }
        if (this.createdEnd != null && this.createdEnd != '') {
          createdEnd = this.formateDate(this.createdEnd);
        } else {
          createdEnd = this.createdEnd
        }
        if (this.uidSearch != null && this.uidSearch != '') {
          uid = parseInt(this.uidSearch)
        } else {
          uid = 0;
        }
        let raffleTopicId = parseInt(this.raffleTopicIdSearch);
        let url = `/api/anchor/exportAnchorInviteDetail?token=${this.token}&uid=${uid}&joinBegin=${createdBegin}&joinEnd=${createdEnd}&raffleTopicId=${raffleTopicId}`;
        window.open(window.location.origin + url)
        /* excel(this.columns, this.$refs.table2, 'table'); */
      },
      // 移动端隐藏导出按钮
      IsPC() {
        let UA = navigator.userAgent;
        let ipad = !!(UA.match(/(iPad).*OS\s([\d_]+)/)),
          isIphone = !!(!ipad && UA.match(/(iPhone\sOS)\s([\d_]+)/)),
          isAndroid = !!(UA.match(/(Android)\s+([\d.]+)/)),
          isMobile = !!(isIphone || isAndroid || ipad);
        if (isMobile) {
          this.isShow = false;
        } else {
          if(this.totalCount > 0) {
            this.isShow = true;
          } else {
            this.isShow = false;
          }
        };
      }
  },
    created() {
      this.getToken();
      this.getAnchorList('get');
    },
    watch: {
      // 如果路由有变化，会再次执行该方法
      '$route': function(route) {
        this.getAnchorList('get');
        this.searchStatus = false;
      }
    }
  }
</script>
<style scoped lang="less">
  .anchor-wrap {
    min-width:1360px;
    min-height:100%;
    border:10px solid #f0f0f0;
    border-bottom:none;
    padding-bottom: 15px;
    background: #ffffff;
    .anchor-search {
      background: #ffffff;
      padding:0 5px 5px;
      border-bottom:10px solid #f0f0f0;
      font-size: 16px;
      line-height: 24px;
      .anchor-search-detail {
        .anchor-search-item {
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
          .anchor-item-model {
            width: 180px;
            margin-left: 5px;
            text-align: left;
            vertical-align: middle;
          }
          .anchor-item-model-Count{
            width:100px ;
          }
        }
        .anchor-search-item+.anchor-search-item {
          // margin-left: 0;
        }
      }
    }
    .anchor-table-title {
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
      .add-anchor-icon {
        /*float: right;*/
        display: inline-block;
        vertical-align: middle;
        padding: 0;
        width: 60px;
        line-height: 24px;
        margin-left: 20px;
      }
      .anchor-value-user-button-item {
        display: inline-block;
        vertical-align: middle;
        padding:0;
        width: 60px;
        line-height: 24px;
        margin-left: 20px;
      }
    }
  }
  .anchor-list-con{
    text-align: left;
    margin-left:12px;
    .anchor-item {
      label {
        width: 80px;
        display: inline-block;
        vertical-align: middle;
        text-align: left;
      }
      .anchor-item-model {
        display: inline-block;
        width: 60%;
        vertical-align: middle;
        margin-left: 10px;
        .tag-item-check {
          width: 70px;
        }
      }
      .anchor-item-model-check{
        width: 400px;
      }
      .anchor-item-model:last {
        display: inline-block;
      }
    }
  }
  .anchor-item+.anchor-item {
    margin-top: 10px;
  }

  .tag-table {
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
  .anchor-search-detail{
    margin-top: 10px;
  }
  /*@media screen and (max-width:1366px){
    .anchor-wrap .anchor-table-title .exportData{
      display: none;
    }
  }*/
</style>
