<template>
  <div class="kingdom-listed-wrap">
    <div class="kingdom-listed-table-title">
      <span class="table-title">执行操作</span>
    </div>
    <div class="kingdom-listed-dateSet">
      <div class="kingdom-listed-dateSet-item">
        <label for="">休市时间设置：</label>
        <DatePicker v-model="createdBegin" :editable="false" :clearable="false" type="datetime" placeholder="Select date and time" style="width: 160px;margin-left:5px;"></DatePicker> -
        <DatePicker v-model="createdEnd" :editable="false" :clearable="false" type="datetime" placeholder="Select date and time" style="width: 160px;"></DatePicker>
        <Button type="warning" icon="ios-gear" @click="setKingdomRestTime">设置</Button>
      </div>
    </div>
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
        <div class="kingdom-listed-search-item">
          <label for="">状态:</label>
          <Select v-model="status" style="width:65%;text-align:left;vertical-align:middle;" class="ad-search-model">
            <Option :value="-1">全部</Option>
            <Option v-for="item in statusTransaction" :value="item.key" :key="item.key">{{ item.value }}</Option>
          </Select>
        </div>
        <Button type="primary" icon="ios-search-strong" @click="searchListedKingdoms" style="margin-left:20px;">搜索</Button>
      </div>
    </div>
    <div class="kingdom-listed-table-title">
      上市王国列表
    </div>
    <Table refs="table2" border :columns="columns" :data="kingdomListed"></Table>
    <div style="margin: 20px 10px 10px;overflow: hidden">
      <div style="float: right;">
        <Page :total="totalCount" :current="pageIndex" @on-change="changePage"></Page>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'kingdomListed',
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
        title: '王国价值',
        key: 'topicValue',
        align: 'center',
        width: 90
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
        title: '状态',
        key: 'status',
        width: 90,
        align: 'center',
        render: (h, params) => {
          const row = params.row;
          const status = row.status === 0 ? "正常交易" : row.status === 1 ? "已锁定" : '';
          return h('span', status);
        }
      }, {
        title: '操作',
        key: 'action',
        width: 130,
        // align: 'center',
        /*fixed: 'right',*/
        render: (h, params) => {
          const row = params.row;
          let statusName, typeCell;
          if (row.status === 0) {
            statusName = "待成交";
            typeCell = "primary";
            return h('div', [
              h('Button', {
                props: {
                  type: typeCell,
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.setStatusAction(params,'pending')
                  }
                }
              }, statusName)
            ]);
          } else if (row.status === 1) {
            statusName = "解锁";
            typeCell = "error";
            return h('div', [
              h('Button', {
                props: {
                  type: typeCell,
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.setStatusAction(params, 'lock')
                  }
                }
              }, statusName),
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
                    this.setStatusAction(params, 'pending')
                  }
                }
              }, "待成交")
            ]);
          }
        }
      }],
      id: null,
      topicName: '',
      topicId: null,
      topicValue: '',
      topicOwnerName: '',
      listedAt: '',
      buyerName: '',
      purchaseAt: '',
      status: -1,
      kingdomListed: [],
      selectedIndex: undefined,
      token: '',
      pageIndex: 1,
      pageSize: 10,
      totalCount: undefined,
      searchStatus: false,
      createdBegin: null,
      createdEnd: null
    }
  },
  methods: {
    getToken() {
      this.token = JSON.parse(localStorage.getItem('token'));
    },
    getListedKingdoms(type) {
      let temData = [];
      let url;
      let httpData;
      if (type === 'get') {
        url = `/api/kingdom/getListedKingdoms?token=${this.token}&pageIndex=${this.pageIndex}&pageSize=${this.pageSize}`;
        httpData = this.$http.get(url);
      } else if (type === 'search') {
        url = `/api/kingdom/getListedKingdomSearch`;
        let data = {
          token: this.token,
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
          topicName: this.topicName,
          status: this.status
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
              item.listedAt = this.formateDate(item.listedAt);
              item.purchaseAt = this.formateDate(item.purchaseAt);
              temData.push(item);
            })
            this.kingdomListed = temData;
            console.log("kingdom list:", this.kingdomListed);
          } else {
            this.$Message.error(res.data.body.message);
          }
        }, err => {
          console.log(err.data);
        })
    },
    getKingdomRestTime() {
      this.$http.get(`/api/kingdom/getKingdomRestTime?token=${this.token}`).then(
        res => {
          if (res.data.status == 2000) {
            console.log("rest time:", res.data.body);
            this.createdBegin = res.data.body.startAt;
            this.createdEnd = res.data.body.endAt;
          } else {
            this.$Message.error(res.data.body.message);
          }
        }, err => {
          console.log(err.data)
        })
    },
    setKingdomRestTime() {
      let data = {
        token: this.token,
        startAt: new Date(this.createdBegin).getTime(),
        endAt: new Date(this.createdEnd).getTime()
      }
      if (data.endAt && data.endAt < data.startAt) {
        this.$Message.error("休市时间结束时间应大于开始时间，请重新输入");
        return false;
      } else {
        this.$http.post('/api/kingdom/setKingdomRestTime', data).then(
        res => {
          if (res.data.status == 2000) {
            this.$Message.success('操作成功');
          } else {
            this.$Message.error(res.data.body.message);
          }
        }, err => {
          console.log(err.data)
        })
      }
    },
    setStatusAction(params, type) {
      let index = params.index;
      this.id = this.kingdomListed[index].id;
      this.selectedIndex = index;
      let status;
      if (type === 'pending') {
        status = 2;
      } else if (type === 'lock') {
        status = 0;
      }
      let data = {
        token: this.token,
        id: this.id,
        status: status
      }
      this.$http.post('/api/kingdom/setListedKingdomStatus', data)
        .then(
          res => {
            if (res.data.status == 2000) {
              this.$Message.success('操作成功');
              this.kingdomListed.map(item => {
                if (item.id === data.id) {
                  item.status = data.status;
                }
              })
              if (this.searchStatus) {
                this.getListedKingdoms('search');
              } else {
                this.getListedKingdoms('get');
              }
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
        this.getListedKingdoms('search');
      } else {
        this.getListedKingdoms('get');
      }

    },
    searchAction() {
      this.searchStatus = !this.searchStatus;
      if (!this.searchStatus) {
        this.getListedKingdoms('get');
      }
    },
    searchListedKingdoms(e) {
      this.searchStatus = true;
      console.log("search ad:", e);
      this.pageIndex = 1;
      this.loading = true;
      this.getListedKingdoms('search');
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
      if (this.targetUid && !pattern.test(this.targetUid)) {
        this.$Message.error("国王UID必须为数字，请重新输入");
        return;
      }
    },
  },
  computed: {
    statusTransaction: function() {
      let data = [{ key: 0, value: '正常交易' }, { key: 1, value: '已锁定' }];
      return data;
    }
  },
  created() {
    this.getToken();
    this.getListedKingdoms('get');
    this.getKingdomRestTime();
  },
  watch: {
    // 如果路由有变化，会再次执行该方法
    '$route': function(route) {
      this.getListedKingdoms('get');
      this.getKingdomRestTime();
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
  .kingdom-listed-dateSet {
    background: #ffffff;
    border-bottom: 10px solid #f0f0f0;
    font-size: 16px;
    line-height: 24px;
    .dateSet-header {
      padding: 5px;
      border-bottom: 1px solid #f0f0f0;
      margin-bottom: 10px;
      font-size: 16px;
      font-weight: normal;
    }
    .kingdom-listed-dateSet-item {
      padding:0 20px;
      margin-bottom: 15px;
      label {
        font-size: 12px;
      }
    }
  }
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
