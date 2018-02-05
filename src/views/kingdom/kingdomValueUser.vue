<template>
  <div class="kingdom-value-wrap">
    <div class="kingdom-value-user-title">
      <span class="table-title">搜索操作</span>
    </div>
    <div class="kingdom-value-user-search">
      <!--<Button type="default" icon="ios-search-strong" @click="searchAction" style="margin-bottom:10px">查询</Button>-->
      <div class="kingdom-value-user-search-detail">
        <div class="kingdom-value-user-search-item">
          <label for="fragment-name">评论内容</label>
          <Input v-model="fragment" placeholder="请输入评论内容" class="tag-item-model" id="fragment-name"></Input>
        </div>
        <div class="kingdom-value-user-search-item">
          <label for="">发言时间</label>
          <DatePicker v-model="joinBegin" :editable="false" :clearable="false" type="datetime" placeholder="开始时间" style="width: 160px;margin-left:5px;"></DatePicker> -
          <DatePicker v-model="joinEnd" :editable="false" :clearable="false" type="datetime" placeholder="结束时间" style="width: 160px;"></DatePicker>
        </div>
        <div class="kingdom-value-user-search-item">
          <label for="">是否第一次</label>
          <Select v-model="isFirstReview" style="width:100px;text-align:left;vertical-align:middle;margin-left:5px;" class="kingdom-value-user-search-model">
            <Option :value="0">全部</Option>
            <Option v-for="item in reviewData" :value="item.id" :key="item.id">{{ item.type }}</Option>
          </Select>
        </div>
        <Button type="primary" icon="ios-search-strong" @click="searchKingdomUser" style="margin-bottom:10px;margin-left:20px">搜索</Button>
      </div>
    </div>
    <div class="kingdom-value-user-title">
      <span class="table-title">王国发言用户列表</span>
      <Button v-if="isShow" type="success" icon="ios-download-outline" @click="exportData" class="kingdom-value-user-button-item exportData">导出</Button>
      <Button type="default" icon="arrow-return-left" @click="backToAction" class="kingdom-value-user-button-item">返回</Button>
    </div>
    <Table refs="table2" border :columns="columns" :data="kingdomUserList" class="kingdom-value-user"></Table>
    <div style="margin: 20px 10px 10px;overflow: hidden">
      <div style="float: right;">
        <Page :total="totalCount" :current="pageIndex" @on-change="changePage"></Page>
      </div>
    </div>
  </div>
</template>
<script>

export default {
  name: 'kingdomValueUser',
  data() {
    return {
      columns: [{
        title: '序号',
        key: 'index',
        width: 50,
        align: 'center'
      }, {
        title: '用户ID',
        key: 'uid',
        align: 'center',
        width: 120
      }, {
        title: '用户Me号',
        key: 'meNumber',
        width: 90,
        align: 'center'
      }, {
        title: '用户名',
        key: 'userNick'
      }, {
        title: '发言日期',
        key: 'dateTime',
        width: 120,
        align: 'center'
      }, {
        title: '注册时间',
        key: 'joinAt',
        width: 140,
        align: 'center'
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
        title: '登录设备',
        key: 'logonDevice',
        align: 'center',
        width: 200,
        className: 'scroll-wrap',
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
        title: '留言数',
        key: 'reviewCount',
        width: 80,
        align: 'center'
      }, {
        title: '是否第一次留言',
        key: 'isFirstReview',
        align: 'center',
        width: 120,
        render: (h, params) => {
          const row = params.row;
          const topicId = this.$route.params.id;
          const firstName = row.isFirstReview === 1 ? "是" : row.isFirstReview === 2 ? "否" : '';
          return h('span', firstName);
        }
      }],
      fragment: '',
      joinBegin: null,
      joinEnd: null,
      isFirstReview: 0,
      token: '',
      pageIndex: 1,
      pageSize: 10,
      totalCount: null,
      isShow: null,
      searchStatus: false,
      topicId: null,
      kingdomUserList: [],
      index: null
    }
  },
  methods: {
    getToken() {
      this.token = JSON.parse(localStorage.getItem('token'));
      this.index = this.$route.params.index;
      // console.log("route info:", this.$route.query, this.$route.params);

    },
    getAllkingdomUserList(type) {
      this.topicId = this.$route.params.id;
      let temData = [];
      let url;
      let httpData;
      if (type === 'get') {
        url = `/api/kingdom/getKingdomUsers?token=${this.token}&pageIndex=${this.pageIndex}&pageSize=${this.pageSize}&topicId=${this.topicId}`;
        httpData = this.$http.get(url);
      } else if (type === 'search') {
        url = `/api/kingdom/getKingdomUserSearch`;
        let data = {
          token: this.token,
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
          fragment: this.fragment,
          joinBegin: new Date(this.joinBegin).getTime(),
          joinEnd: new Date(this.joinEnd).getTime(),
          isFirstReview: this.isFirstReview,
          topicId: this.topicId
        }
        if (data.joinEnd && data.joinEnd < data.joinBegin) {
          this.$Message.error("注册时间结束时间应大于开始时间，请重新输入");
          return false;
        } else {
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
              item.joinAt = this.formateDate(item.joinAt);
              if(item.logonDevice!= '' && item.logonDevice!= null){
                item.logonDevice = this.formateLogonDevice(item.logonDevice);
              }
              temData.push(item);
            })
            this.kingdomUserList = temData;
            console.log("kingdom user list:", this.kingdomUserList);
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
        this.getAllkingdomUserList('search');
      } else {
        this.getAllkingdomUserList('get');
      }

    },
    searchAction() {
      this.searchStatus = !this.searchStatus;
      if (!this.searchStatus) {
        this.getAllkingdomUserList('get');
      }
    },
    searchKingdomUser(e) {
      this.searchStatus = true;
      console.log("search tag:", e);
      this.pageIndex = 1;
      this.getAllkingdomUserList('search');
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
    backToAction() {
      // this.$router.go(-1);
      // this.$router.push({ path: '/kingprice/king-price-property',params:{'articleId': 1}});
      this.$router.push({ name: 'king-price-property', params:{ index: this.index}});
    },
    exportData() {
      /* this.$refs.table2.exportCsv({
       filename: 'The original data'
       }) */
      let joinBegin;
      let joinEnd;
      if (this.joinBegin != null && this.joinBegin != '') {
        joinBegin = this.formateDate(this.joinBegin);
      } else {
        joinBegin = this.joinBegin
      }
      if (this.joinEnd != null && this.joinEnd != '') {
        joinEnd = this.formateDate(this.joinEnd);
      } else {
        joinEnd = this.joinEnd
      }
      let url = `/api/kingdom/exportKingdomUsers?token=${this.token}&fragment=${this.fragment}&joinBegin=${joinBegin}&joinEnd=${joinEnd}&isFirstReview=${this.isFirstReview}&topicId=${this.topicId}`;
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
  computed: {
    reviewData: function() {
      let data = [{ id: 2, type: '否' }, { id: 1, type: '是' }];
      return data;
    }
  },
  created () {
    this.getToken();
    this.getAllkingdomUserList('get');
  }
}
</script>
<style scoped lang="less">
.kingdom-value-wrap {
  min-width: 1280px;
  min-height:100%;
  border:10px solid #f0f0f0;
  border-bottom:none;
  padding-bottom: 15px;
  background: #ffffff;
  .kingdom-value-user-search {
    background: #ffffff;
    padding:0 5px 5px;
    border-bottom:10px solid #f0f0f0;
    font-size: 16px;
    line-height: 24px;
    .kingdom-value-user-search-detail {
      .kingdom-value-user-search-item {
        display: inline-block;
        vertical-align: middle;
        margin-left: 15px;
        margin-bottom: 10px;
        label {
          display: inline-block;
          vertical-align: middle;
          font-size: 12px;
        }
        .tag-item-model {
          width: 180px;
          margin-left: 5px;
          text-align: left;
          vertical-align: middle;
        }
      }
      .kingdom-value-user-search-item+.kingdom-value-user-search-item {
        // margin-left: 0;
      }
    }
  }
  .kingdom-value-user-title {
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
    .add-tag-icon {
      padding:0;
      width: 60px;
      line-height: 24px;
    }
    .kingdom-value-user-button-item {
      display: inline-block;
      vertical-align: middle;
      padding:0;
      width: 60px;
      line-height: 24px;
      margin-left: 20px;
    }
  }
}

.tag-item {
  label {
    width: 120px;
    display: inline-block;
    vertical-align: middle;
    text-align: left;
  }
  .tag-item-model {
    display: inline-block;
    width: 65%;
    vertical-align: middle;
    margin-left: 10px;
    .tag-item-check {
      width: 70px;
    }
  }
  .tag-item-model:last {
    display: inline-block;
  }
}

.tag-item+.tag-item {
  margin-top: 10px;
}

.tag-img {
  display: inline-block;
  text-align: left;
  .tag-img-pre {
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

.kingdom-value-user {
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
/*@media screen and (max-width:1366px){
  .kingdom-value-wrap .kingdom-value-user-title .exportData{
    display: none;
  }
}*/
</style>
