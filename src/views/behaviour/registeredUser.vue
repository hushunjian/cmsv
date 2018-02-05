<template>
  <div class="registeredUser-wrap">
    <div class="registeredUser-table-title">
      <span class="table-title">搜索操作</span>
    </div>
    <div class="registeredUser-search">
      <div class="registeredUser-search-detail">
        <div class="registeredUser-search-item">
          <label for="">查询时间</label>
          <DatePicker v-model="createdBegin" :editable="false" :clearable="false" type="datetime" placeholder="点击选择时间" style="width: 160px;margin-left:5px;"></DatePicker> -
          <DatePicker v-model="createdEnd" :editable="false" :clearable="false" type="datetime" placeholder="点击选择时间" style="width: 160px;"></DatePicker>
        </div>
        <div class="registeredUser-search-item">
          <label for="">注册渠道</label>
          <Select v-model="registerChannelSearch" style="width:100px;text-align:left;vertical-align:middle;margin-left:5px;" class="registeredUser-item-model">
            <Option :value="-1">全部</Option>
            <Option v-for="item in registerChannelData" :value="item.code" :key="item.id">{{ item.channelName }}</Option>
          </Select>
        </div>
        <Button type="primary" icon="ios-search-strong" @click="searchRegisteredUser" style="margin-bottom:10px;margin-left:20px">搜索</Button>
      </div>
    </div>
    <div class="registeredUser-table-title">
      <span class="table-title">新注册用户列表</span>
    </div>
    <Table refs="table2" border :columns="columns" :data="registeredUserList" class="registeredUser-table"></Table>
    <div style="margin: 20px 10px 10px;overflow: hidden">
      <div style="float: right;">
        <Page :total="totalCount" :current="pageIndex" @on-change="changePage"></Page>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'registeredUser',
    data() {
      return {
        columns: [{
          title: '序号',
          key: 'index',
          width: 50,
          align: 'center',
          /*fixed: 'left'*/
        }, {
          title: 'UID',
          key: 'uid',
          align: 'center'
        }, {
          title: '昵称',
          key: 'nickName'
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
        },  {
          title: '登录设备',
          key: 'logonDevice',
          align: 'center',
          width: 200,
          render: (h, params) => {
            const row = params.row;
            if (row.logonDevice) {
              return h('ul', {
                style: {
                  maxHeight: '140px',
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
        }, {
          title: '注册时间',
          key: 'registerTime',
          align: 'center'
        }],
        uid: null,
        nickName: '',
        registerChannel: '',
        logonDevice: '',
        registerTime: null,
        createdBegin: null,
        createdEnd: null,
        registeredUserList: [],
        registerChannelData: [],
        registerChannelSearch: -1,
        token: '',
        pageIndex: 1,
        pageSize: 10,
        totalCount: undefined,
        searchStatus: false
      }
    },
    methods: {
      getToken () {
        this.token = JSON.parse(localStorage.getItem('token'));
      },
      getRegisteredUser (type) {
        let temData = [];
        let url;
        let httpData;
        if (type === 'get') {
          url = `/api/behaviour/registeredUser?token=${this.token}&pageIndex=${this.pageIndex}&pageSize=${this.pageSize}`;
          httpData = this.$http.get(url);
        } else if (type === 'search') {
          url = `/api/behaviour/registeredUserSearch`;
          let data = {
            token: this.token,
            pageIndex: this.pageIndex,
            pageSize: this.pageSize,
            createdBegin: new Date(this.createdBegin).getTime(),
            createdEnd: new Date(this.createdEnd).getTime(),
            registerChannelCode: this.registerChannelSearch
          }
          if (data.createdEnd && data.createdEnd < data.createdBegin) {
            this.$Message.error("创建时间结束时间应大于开始时间，请重新输入");
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
                item.registerTime = this.formateDate(item.registerTime);
                if(item.logonDevice!= '' && item.logonDevice!= null){
                  item.logonDevice = this.formateLogonDevice(item.logonDevice);
                }
                temData.push(item);
              })
              this.registeredUserList = temData;
              console.log("registeredUser list:", this.registeredUserList);
            } else {
              this.$Message.error(res.data.body.message);
            }
          }, err => {
            console.log(err.data);
          })
      },
      getUsersRegisterChannel() {
        this.$http.post(`/api/appuser/getUsersRegisterChannel?token=${this.token}`)
          .then(
            res => {
              if (res.data.status == 2000) {
                this.registerChannelData = res.data.body;
                console.log("usersRegisterChannel list:", this.registerChannelData);
              } else {
                this.$Message.error(res.data.body.message);
              }
            }, err => {
              console.log(err.data)
            })
      },
      changePage(e) {
        console.log("change page info:", e);
        this.pageIndex = e;
        if (this.searchStatus) {
          this.getRegisteredUser('search');
        } else {
          this.getRegisteredUser('get');
        }

      },
      searchRegisteredUser(e) {
        this.searchStatus = true
        console.log("search tag:", e);
        this.pageIndex = 1;
        this.getRegisteredUser('search');
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
      }
    },
    created() {
      this.getToken();
      this.getRegisteredUser('get');
      this.getUsersRegisterChannel();
    },
    watch: {
      // 如果路由有变化，会再次执行该方法
      '$route': function(route) {
        this.getRegisteredUser('get');
        this.getUsersRegisterChannel();
        this.searchStatus = false;
      }
    }
  }

</script>
<style scoped lang="less">
.registeredUser-wrap {
  min-width:1000px;
  min-height:100%;
  border:10px solid #f0f0f0;
  border-bottom:none;
  padding-bottom: 15px;
  background: #ffffff;
  .registeredUser-search {
    background: #ffffff;
    padding:0 5px 5px;
    border-bottom:10px solid #f0f0f0;
    font-size: 16px;
    line-height: 24px;
    .registeredUser-search-detail {
      .registeredUser-search-item {
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
        .registeredUser-item-model {
          width: 180px;
          margin-left: 5px;
          text-align: left;
          vertical-align: middle;
        }
      }
    }
  }
  .registeredUser-table-title {
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
  }
}
.registeredUser-search-detail{
  margin-top: 10px;
}

</style>
