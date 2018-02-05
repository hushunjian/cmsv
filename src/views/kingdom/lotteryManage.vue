<template>
  <div class="lottery-wrap">
    <div class="lottery-table-title">
      <span class="table-title">搜索操作</span>
    </div>
    <div class="lottery-search">
      <!--<Button type="default" icon="ios-search-strong" @click="searchAction">查询</Button>-->
      <div class="lottery-search-item">
        <label for="topic-name">王国名称：</label>
        <Input v-model="topicName" placeholder="请输入王国名称" class="lottery-item-model" id="topic-name"></Input>
      </div>
      <div class="lottery-search-item">
        <label for="lottery-name">抽奖名称：</label>
        <Input v-model="lotteryName" placeholder="请输入抽奖名称" class="lottery-item-model" id="lottery-name"></Input>
      </div>
      <Button type="primary" icon="ios-search-strong" @click="searchLottery">搜索</Button>
    </div>
    <div class="lottery-table-title">
      <span class="table-title">抽奖列表</span>
    </div>
    <Table refs="table2" border :columns="columns" :data="lotteryList"></Table>
    <div style="margin: 20px 10px 10px;overflow: hidden">
      <div style="float: right;">
        <Page :total="totalCount" :current="pageIndex" @on-change="changePage"></Page>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'lotteryManage',
  data() {
    return {
      columns: [{
        title: '序号',
        key: 'index',
        width: 50,
        align: 'center',
        /*fixed: 'left'*/
      }, {
        title: '王国ID',
        key: 'topicId',
        width: 70,
        align: 'center'
      }, {
        title: '王国名称',
        key: 'topicName',
        // width: 200
      }, {
        title: '抽奖名称',
        key: 'lotteryName',
        // width: 130,
      }, {
        title: '发布时间',
        key: 'createdAt',
        width: 160,
        align: 'center'
      }, {
        title: '抽奖结束时间',
        key: 'validAt',
        width: 160,
        align: 'center'
      }, {
        title: '状态',
        key: 'statusName',
        width: 80,
        align: 'center'
      }, {
        title: '操作',
        key: 'action',
        width: 150,
        align: 'center',
        render: (h, params) => {
          return h('div', [
            h('Button', {
              props: {
                type: 'primary',
                size: 'small'
              },
              on: {
                click: () => {
                  this.openLotteryUserAction(params.index)
                }
              }
            }, '查看参与名单')
          ]);
        }
      }],
      lotteryId: undefined,
      topicName: '',
      lotteryName: '',
      lotteryList: [],
      selectedIndex: undefined,
      token: '',
      pageIndex: 1,
      pageSize: 10,
      totalCount: undefined,
      searchStatus: false
    }
  },
  methods: {
    getToken() {
      this.token = JSON.parse(localStorage.getItem('token'));
      if (this.$route.params.index) {
        this.pageIndex = this.$route.params.index;
      }
    },
    getAllLotteryList(type) {
      let temData = [];
      let url;
      if (type === 'get') {
        url = `/api/kingdom/getAllLotteries?token=${this.token}&pageIndex=${this.pageIndex}&pageSize=${this.pageSize}`;
      } else if (type === 'search') {
        url = `/api/kingdom/getLotterySearch?token=${this.token}&pageIndex=${this.pageIndex}&pageSize=${this.pageSize}&topicName=${this.topicName}&lotteryName=${this.lotteryName}`;
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
              if (item.status == 0) {
                item.statusName = "等待抽奖";
              } else if (item.status == 1) {
                item.statusName = "进行中";
              } else if (item.status == 2) {
                item.statusName = "抽奖结束";
              }
              item.createdAt = this.formateDate(item.createdAt);
              item.validAt = this.formateDate(item.validAt);
              temData.push(item);
            })
            this.lotteryList = temData;
            console.log("lottery list:", this.lotteryList);
          } else {
            this.$Message.error(res.data.body.message);
          }
        }, err => {
          console.log(err.data);
        })
    },
    openLotteryUserAction(index) {
      console.log("tag index:", index);
      let lotteryId = this.lotteryList[index].lotteryId;
      this.$router.push({ name: 'lottery-user', params: { id: lotteryId, index: this.pageIndex } });
    },
    changePage(e) {
      console.log("change page info:", e);
      this.pageIndex = e;
      if (this.searchStatus) {
        this.getAllLotteryList('search');
      } else {
        this.getAllLotteryList('get');
      }

    },
    searchAction() {
      this.searchStatus=!this.searchStatus;
      if (!this.searchStatus) {
        this.getAllLotteryList('get');
      }
    },
    searchLottery(e) {
      this.searchStatus = true;
      console.log("search ad:", e);
      this.pageIndex = 1;
      this.getAllLotteryList('search');
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
  },
  created() {
    this.getToken();
    this.getAllLotteryList('get');
  },
  watch: {
    // 如果路由有变化，会再次执行该方法
    '$route': function(route) {
      this.getAllLotteryList('get');
      this.searchStatus = false;
    }
  }
}
</script>
<style scoped lang="less">
.lottery-wrap {
  min-width:1000px;
  min-height:100%;
  border:10px solid #f0f0f0;
  border-bottom:none;
  padding-bottom: 15px;
  background: #ffffff;
  .lottery-search {
    background: #ffffff;
    padding:0 5px 15px;
    border-bottom:10px solid #f0f0f0;
    font-size: 16px;
    line-height: 24px;
    span {
      vertical-align: middle;
    }
    .lottery-search-item {
      display: inline-block;
      width: 240px;
      vertical-align: middle;
      margin-left:15px;
      label {
        display: inline-block;
        vertical-align: middle;
        font-size:12px;
      }
      .lottery-item-model {
        width: 60%;
        text-align: left;
        vertical-align: middle;
      }
    }
    .lottery-search-item + .lottery-search-item {
      margin-left: 0;
    }
  }
  .lottery-table-title {
    background: #ffffff;
    border-bottom: 1px solid #f0f0f0;
    padding:10px 5px 5px;
    margin-bottom: 10px;
    font-size: 16px;
    line-height: 24px;
    .table-title{
      display: inline-block;
      vertical-align: middle;
    }
  }
}
</style>
