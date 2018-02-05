<template>
  <div class="kingdom-listed-wrap">
    <div class="kingdom-listed-table-title">
      <span class="table-title">搜索操作</span>
    </div>
    <div class="kingdom-listed-search">
      <!--<Button type="default" icon="ios-search-strong" @click="searchAction">查询</Button>-->
      <div class="kingdom-listed-search-detail">
        <div class="kingdom-listed-search-item">
          <label for="topic-name">王国名称:</label>
          <Input v-model="topicName" placeholder="请输入王国标题" class="kingdom-listed-item-model" id="topic-name"></Input>
        </div>
        <Button type="primary" icon="ios-search-strong" @click="searchPendingListedKingdoms" style="margin-left:20px;">搜索</Button>
      </div>
    </div>
    <div class="kingdom-listed-table-title">
      <span class="table-title">上市王国列表</span>
    </div>
    <Table refs="table2" border :columns="columns" :data="kingPending"></Table>
    <div style="margin: 20px 10px 10px;overflow: hidden">
      <div style="float: right;">
        <Page :total="totalCount" :current="pageIndex" @on-change="changePage"></Page>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'kingPending',
  data() {
    return {
      columns: [{
        title: '序号',
        key: 'index',
        width: 50,
        align: 'center',
        /*fixed: 'left'*/
      }, {
        title: '王国名称',
        key: 'topicName',
        /*width: 200*/
      }, {
        title: '持有人',
        key: 'topicOwnerName',
        /*width: 130*/
      }, {
        title: '上市时间',
        key: 'listedAt',
        align: 'center',
        width: 160
      }, {
        title: '购买人',
        key: 'buyerName',
        /*width: 130,*/
        render: (h, params) => {
          const row = params.row;
          const buyerName = row.buyerId === 0 ? "" : row.buyerName;
          return h('span', buyerName);
        }
      }, {
        title: '购买时间',
        key: 'purchaseAt',
        align: 'center',
        width: 160
      }, {
        title: '新王国米汤号',
        key: 'meNumber',
        width: 200,
        align: 'center',
        render: (h, params) => {
          return h('Input', {
            props: {
              value: params.row.meNumber
            },
            on: {
              input: (val) => {
                params.row.meNumber = val
              },
              blur: () => {
                this.change()
              }
            }
          })
        }
      }, {
        title: '操作',
        key: 'action',
        width: 100,
        /*fixed: 'right',*/
        align: 'center',
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
                  this.setKingdomTransaction(params)
                }
              }
            }, '确定')
          ]);
        }
      }],
      id: null,
      topicName: '',
      topicId: null,
      topicOwnerName: '',
      listedAt: '',
      buyerName: '',
      purchaseAt: '',
      meNumber: null,
      status: -1,
      kingPending: [],
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
    },
    getPendingListedKingdoms(type) {
      let temData = [];
      let url;
      let httpData;
      if (type === 'get') {
        url = `/api/kingdom/getPendingListedKingdoms?token=${this.token}&pageIndex=${this.pageIndex}&pageSize=${this.pageSize}`;
        httpData = this.$http.get(url);
      } else if (type === 'search') {
        url = `/api/kingdom/getPendingListedKingdomSearch?token=${this.token}&pageIndex=${this.pageIndex}&pageSize=${this.pageSize}&topicName=${this.topicName}`;
        httpData = this.$http.get(url);
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
              item.listedAt = this.formateDate(item.listedAt);
              item.purchaseAt = this.formateDate(item.purchaseAt);
              temData.push(item);
            })
            this.kingPending = temData;
            console.log("kingdom list:", this.kingPending);
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
        this.getPendingListedKingdoms('search');
      } else {
        this.getPendingListedKingdoms('get');
      }

    },
    searchAction() {
      this.searchStatus = !this.searchStatus;
      if (!this.searchStatus) {
        this.getPendingListedKingdoms('get');
      }
    },
    searchPendingListedKingdoms(e) {
      this.searchStatus = true;
      console.log("search ad:", e);
      this.pageIndex = 1;
      this.getPendingListedKingdoms('search');
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
    change(e) {
      let pattern = /^\d{1,}$/;
      if (this.meNumber && !pattern.test(this.meNumber)) {
        this.$Message.error("新国王米汤号必须为数字，请重新输入");
        this.meNumber = null;
        return;
      }
    },
    setKingdomTransaction(params) {
      let index = params.index;
      this.id = this.kingPending[index].id;
      this.selectedIndex = index;
      let data = {
        token: this.token,
        id: this.id,
        meNumber: params.row.meNumber
      }
      if (data.meNumber != null) {
        this.$http.post('/api/kingdom/kingdomTransaction', data)
          .then(
            res => {
              if (res.data.status == 2000) {
                this.$Message.success('操作成功');
                if (this.searchStatus) {
                  this.getPendingListedKingdoms('search');
                } else {
                  this.getPendingListedKingdoms('get');
                }
              } else {
                this.$Message.error(res.data.body.message);
              }
            }, err => {
              console.log(err.data)
            })
      } else {
        this.$Message.error("meNumber 不可为空");
      }
    }
  },
  computed: {},
  created() {
    this.getToken();
    this.getPendingListedKingdoms('get');
  },
  watch: {
    // 如果路由有变化，会再次执行该方法
    '$route': function(route) {
      this.getPendingListedKingdoms('get');
      this.searchStatus = false;
    }
  }
}
</script>
<style scoped lang="less">
.kingdom-listed-wrap {
  min-width: 1200px;
  min-height:100%;
  border:10px solid #f0f0f0;
  border-bottom:none;
  padding-bottom: 15px;
  background: #ffffff;
  .kingdom-listed-search {
    background: #ffffff;
    padding:0 5px 15px;
    border-bottom: 10px solid #f0f0f0;
    font-size: 16px;
    line-height: 24px;
    .kingdom-listed-search-detail {
      display: inline-block;
      vertical-align: middle;
      .kingdom-listed-search-item {
        display: inline-block;
        width: 240px;
        vertical-align: middle;
        margin-left: 15px;
        label {
          display: inline-block;
          vertical-align: middle;
          font-size: 12px;
        }
        .kingdom-listed-item-model {
          width: 65%;
          margin-left: 5px;
          text-align: left;
          vertical-align: middle;
        }
      }
      .kingdom-listed-search-item+.kingdom-listed-search-item {
        margin-left: 0;
        width: 140px;
      }
    }
  }
  .kingdom-listed-table-title {
    padding:10px 5px 5px;
    font-size: 16px;
    line-height: 24px;
    border-bottom: 1px solid #f0f0f0;
    margin-bottom: 10px;
    .table-title{
      display: inline-block;
      vertical-align: middle;
    }
  }
}

.kingdom-listed-item {
  label {
    width: 80px;
    display: inline-block;
    vertical-align: middle;
    text-align: left;
  }
  .kingdom-listed-item-model {
    display: inline-block;
    width: 65%;
    vertical-align: middle;
    margin-left: 10px;
    .kingdom-value-item-check {
      width: 70px;
    }
  }
  .kingdom-listed-item-model:last {
    display: inline-block;
  }
}

.text-require {
  color: #FF6C60;
  font-weight: 700;
  margin-left: 3px;
}

</style>
