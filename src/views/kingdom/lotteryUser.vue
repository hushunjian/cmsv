<template>
  <div class="lottery-user-wrap">
    <div class="lottery-table-title">
      <span class="table-title">搜索操作</span>
    </div>
    <div class="lottery-user-search">
      <!--<Button type="default" icon="ios-search-strong" @click="searchAction">查询</Button>-->
      <div class="lottery-user-search-item">
        <label for="topic-name">用户名称：</label>
        <Input v-model="userNick" placeholder="请输入用户昵称" class="lottery-item-model" id="topic-name"></Input>
      </div>
      <div class="lottery-user-search-item">
        <label for="">是否指定：</label>
        <Select v-model="isAppoint" style="width:65%;text-align:left;vertical-align:middle;" class="ad-search-model">
          <Option v-for="item in isAppointStatus" :value="item.id" :key="item.id">{{ item.type }}</Option>
        </Select>
      </div>
      <Button type="primary" icon="ios-search-strong"  @click="searchLotteryUser">搜索</Button>
    </div>
    <div class="lottery-table-title">
      <span class="table-title">抽奖参与用户列表</span>
      <Button type="default" icon="arrow-return-left" @click="backToAction" class="tag-button-item">返回</Button>
    </div>
    <Table refs="table2" border :columns="columns" :data="lotteryUserList"></Table>
    <div style="margin: 20px 10px 10px;overflow: hidden">
      <div style="float: right;">
        <Page :total="totalCount" :current="pageIndex" @on-change="changePage"></Page>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'lotteryUser',
  data() {
    return {
      columns: [{
        title: '序号',
        key: 'index',
        width: 50,
        align: 'center'
        /*fixed: 'left'*/
      }, {
          title: '昵称',
          key: 'userNick',
          /*width: 80,*/
          align: 'center'
        }, {
          title: 'UID',
          key: 'userId',
          align: 'center'
          // width: 200
        }, {
          title: '参与时间',
          key: 'joinTime',
          width: 160,
          align: 'center'
        }, {
          title: '状态',
          key: 'statusName',
          align: 'center'
        }, {
          title: '是否指定',
          key: 'appointName',
          align: 'center',
          render: (h, params) => {
            const row = params.row;
            const color = row.isAppoint === 0 ? 'blue' : row.isAppoint === 1 ? 'green' : 'red';
            return h('Tag', {
              props: {
                type: 'dot',
                color: color
              }
            }, params.row.appointName);
          }
        }, {
          title: '邀请人数',
          key: 'invitationNum',
          align: 'center'
        }, {
          title: '操作',
          key: 'action',
          width: 100,
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
                    this.appointAction(params.index, params)
                  }
                }
              }, params.row.appointStatus)
            ]);
          }
        }
      ],
      lotteryId: undefined,
      userNick: '',
      lotteryName: '',
      lotteryUserList: [],
      selectedIndex: undefined,
      token: '',
      joinTime: '',
      pageIndex: 1,
      pageSize: 10,
      totalCount: undefined,
      searchStatus: false,
      isAppoint: 0,
      appointStatus: '',
      index: null
    }
  },
  methods: {
    getToken() {
      this.token = JSON.parse(localStorage.getItem('token'));
      this.index = this.$route.params.index;
    },
    getAllLotteryUserList(type) {
      this.lotteryId = this.$route.params.id;
      let temData = [];
      let url;
      let httpData;
      if (type === 'get') {
        url = `/api/kingdom/getLotteryUsers?token=${this.token}&pageIndex=${this.pageIndex}&pageSize=${this.pageSize}&lotteryId=${this.lotteryId}`;
        httpData = this.$http.get(url);
      } else if (type === 'search') {
        url = `/api/kingdom/getLotteryUserSearch`;
        let data = {
          token: this.token,
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
          lotteryId: this.lotteryId,
          userNick: this.userNick,
          isAppoint: this.isAppoint
        }
        httpData = this.$http.post(url, data);
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
              if (item.status == 0) {
                item.statusName = "被屏蔽";
              } else if (item.status == 1) {
                item.statusName = "已中奖";
              } else if (item.status == 2) {
                item.statusName = "未中奖";
              }
              if (item.isAppoint == 0) {
                item.appointName = "否";
                item.appointStatus = "指定";
              } else if (item.isAppoint == 1) {
                item.appointName = "是";
                item.appointStatus = "取消指定";
              }
              item.createdAt = this.formateDate(item.createdAt);
              item.validAt = this.formateDate(item.validAt);
              item.joinTime = this.formateDate(item.joinTime);
              temData.push(item);
            })
            this.lotteryUserList = temData;
            console.log("lottery list:", this.lotteryUserList);
          } else {
            this.$Message.error(res.data.body.message);
          }
        }, err => {
          console.log(err.data);
        })
    },
    appointAction(indexNum, params) {
      console.log("lottery user index:", indexNum, params);
      let isAppoint;
      if (params.row.isAppoint == 0) {
        isAppoint = 1;
      } else if (params.row.isAppoint == 1) {
        isAppoint = 0;
      }
      let data = {
        token: this.token,
        userId: params.row.userId,
        lotteryId: params.row.lotteryId,
        isAppoint: isAppoint
      }
      this.$http.post('/api/kingdom/setLotteryAppoint', data)
        .then(
          res => {
            if (res.data.status == 2000) {
              this.$Message.success('修改成功');
              this.lotteryUserList.map((item, index) => {
                if (indexNum === index) {
                  item.isAppoint = data.isAppoint;
                  if (item.isAppoint == 0) {
                    item.appointName = "否";
                    item.appointStatus = "指定";
                  } else if (item.isAppoint == 1) {
                    item.appointName = "是";
                    item.appointStatus = "取消指定";
                  }
                }
              })
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
      if (searchStatus) {
        this.getAllLotteryUserList('search');
      } else {
        this.getAllLotteryUserList('get');
      }

    },
    searchAction() {
      this.searchStatus = !this.searchStatus;
      if (!this.searchStatus) {
        this.getAllLotteryUserList('get');
      }
    },
    searchLotteryUser (e) {
      this.searchStatus = true;
      console.log("search ad:", e);
      this.pageIndex = 1;
      this.getAllLotteryUserList('search');
    },
    backToAction () {
      // this.$router.go(-1);
      this.$router.push({ name: 'king-lottery',params:{index: this.index}});
    },
    formateDate (data) {
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
    isAppointStatus: function() {
      let data = [{ id: 0, type: '全部' }, { id: 1, type: '指定' }, { id: 2, type: '未指定' }];
      return data;
    }
  },
  created () {
    this.getToken();
    this.getAllLotteryUserList('get');
  }
}
</script>
<style scoped lang="less">
.lottery-user-wrap {
  min-width:820px;
  min-height:100%;
  border:10px solid #f0f0f0;
  border-bottom:none;
  padding-bottom: 15px;
  background: #ffffff;
  .lottery-user-search {
    background: #ffffff;
    padding:0 5px 15px;
    border-bottom:10px solid #f0f0f0;
    font-size: 16px;
    line-height: 24px;
    span {
      vertical-align: middle;
    }
    .lottery-user-search-item {
      display: inline-block;
      width: 240px;
      vertical-align: middle;
      margin-left:15px;
      label {
        display: inline-block;
        vertical-align: middle;
        font-size: 12px;
      }
      .lottery-item-model {
        width: 60%;
        text-align: left;
        vertical-align: middle;
      }
    }
    .lottery-user-search-item+.lottery-user-search-item {
      margin-left: 0;
    }
  }
  .lottery-table-title {
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
    .tag-button-item {
      display: inline-block;
      vertical-align: middle;
      margin-left: 20px;
      padding: 0;
      width: 60px;
      line-height: 24px;
    }
  }
}
</style>
