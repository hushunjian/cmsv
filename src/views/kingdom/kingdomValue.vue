<template>
  <div class="kingdom-value-wrap">
    <div class="kingdom-value-table-title">
      <span class="table-title">搜索操作</span>
    </div>
    <div class="kingdom-value-search">
      <!--<Button type="default" icon="ios-search-strong" @click="searchAction">查询</Button>-->
      <div class="kingdom-value-search-detail">
        <div class="kingdom-value-search-item">
          <label for="topic-name">王国标题:</label>
          <Input v-model="topicName" placeholder="请输入王国标题" class="kingdom-value-item-model" id="topic-name"></Input>
        </div>
        <div class="kingdom-value-search-item" style="width: 160px;">
          <label for="">排序属性:</label>
          <Select v-model="orderParam" style="width:65%;text-align:left;vertical-align:middle;" class="ad-search-model">
            <Option v-for="item in orderParamList" :value="item.key" :key="item.key">{{ item.value }}</Option>
          </Select>
        </div>
        <div class="kingdom-value-search-item" style="width: 140px;">
          <label for="">排序:</label>
          <Select v-model="order" style="width:75%;text-align:left;vertical-align:middle;" class="ad-search-model">
            <Option v-for="item in orderList" :value="item.key" :key="item.key">{{ item.value }}</Option>
          </Select>
        </div>
        <Button type="primary" icon="ios-search-strong" @click="searchKingdomValue" style="display: inline-block;vertical-align: middle;">搜索</Button>
      </div>
    </div>
    <div class="kingdom-value-table-title">
      <span class="table-title">王国列表</span>
    </div>
    <Table refs="table2" border :columns="columns" :data="kingdomValue"></Table>
    <div style="margin: 20px 10px 10px;overflow: hidden">
      <div style="float: right;">
        <Page :total="totalCount" :current="pageIndex" @on-change="changePage"></Page>
      </div>
    </div>
    <Modal v-model="modalChangeKingdomUser" width="400" class-name="vertical-center-modal">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="information-circled"></Icon>
        <span>更换国王</span>
      </p>
      <div style="text-align:center;">
        <div class="kingdom-value-item">
          <label for="kingdom-name">新国王UID<b class="text-require">*</b></label>
          <Input v-model="targetUid" placeholder="请输入新国王UID" class="kingdom-value-item-model" id="kingdom-name"></Input>
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
  name: 'kingdomValue',
  data() {
    return {
      columns: [{
        title: '王国ID',
        key: 'topicId',
        width: 75,
        align: 'center',
        /*fixed: 'left'*/
      }, {
        title: '王国标题',
        key: 'topicName',
        /*width: 200*/
      }, {
        title: '国王UID',
        key: 'uid',
        align: 'center',
        width: 90
      }, {
        title: '国王昵称',
        key: 'userName',
        /*width: 130,*/
      }, {
        title: '创建时间',
        key: 'createdAt',
        width: 160,
        align: 'center'
      }, {
        title: '更新时间',
        key: 'updatedAt',
        align: 'center',
        width: 160
      }, {
        title: '王国类型',
        key: 'type',
        width: 100,
        align: 'center',
        render: (h, params) => {
          const row = params.row;
          const typeName = row.type === 0 ? "聚合王国" : row.type === 1 ? "个人王国" : '';
          return h('span', typeName);
        }
      }, {
        title: '价值',
        key: 'value',
        align: 'center',
        width: 90
      }, {
        title: '昨日增长值',
        key: 'lastAddValue',
        align: 'center',
        width: 90
      }, {
        title: '可被偷',
        key: 'stealValue',
        align: 'center',
        width: 90
      }, {
        title: '用心度x',
        key: 'careDegree',
        width: 90,
        align: 'center',
        render: (h, params) => {
          const row = params.row;
          let careDegree;
          if (parseInt(row.careDegree) == row.careDegree) {
            careDegree = row.careDegree.toFixed(1);
          } else {
            careDegree = row.careDegree;
          }
          return h('span', careDegree);
        }
      }, {
        title: '认可度y',
        key: 'approvalDegree',
        width: 150,
        align: 'center',
        render: (h, params) => {
          const row = params.row;
          let approvalDegree;
          if (parseInt(row.approvalDegree) == row.approvalDegree) {
            approvalDegree = row.approvalDegree.toFixed(1);
          } else {
            approvalDegree = row.approvalDegree;
          }
          return h('span', approvalDegree);
        }
      }, {
        title: '操作',
        key: 'action',
        width: 180,
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
                  this.openKingdomUserAction(params.index)
                }
              }
            }, '成员列表'),
            h('Button', {
              props: {
                type: 'info',
                size: 'small'
              },
              on: {
                click: () => {
                  this.changeKingdomUserAction(params.index)
                }
              }
            }, '更换国王')
          ]);
        }
      }],
      lotteryId: undefined,
      topicName: '',
      topicId: null,
      lotteryName: '',
      kingdomValue: [],
      selectedIndex: undefined,
      token: '',
      pageIndex: 1,
      pageSize: 10,
      totalCount: undefined,
      searchStatus: false,
      orderParam: 'createdAt',
      order: 'desc',
      modalChangeKingdomUser: false,
      modal_loading: false,
      sourceUid: null,
      targetUid: null,
      optUid: null,
    }
  },
  methods: {
    getToken() {
      this.token = JSON.parse(localStorage.getItem('token'));
      if (this.$route.params.index) {
        this.pageIndex = this.$route.params.index;
      }
    },
    getAllkingdomValue(type) {
      let temData = [];
      let url;
      let httpData;
      if (type === 'get') {
        url = `/api/kingdom/getKingdomValues?token=${this.token}&pageIndex=${this.pageIndex}&pageSize=${this.pageSize}`;
        httpData = this.$http.get(url);
      } else if (type === 'search') {
        url = `/api/kingdom/getKingdomValueSearch`;
        let data = {
          token: this.token,
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
          topicName: this.topicName,
          orderParam: this.orderParam,
          order: this.order
        }
        httpData = this.$http.post(url, data);
      }
      httpData.then(
        res => {
          if (res.data.status == 2000) {
            this.totalCount = res.data.body.total;
            res.data.body.data.map(item => {
              item.createdAt = this.formateDate(item.createdAt);
              item.updatedAt = this.formateDate(item.updatedAt);
              temData.push(item);
            })
            this.kingdomValue = temData;
            console.log("kingdom list:", this.kingdomValue);
          } else {
            this.$Message.error(res.data.body.message);
          }
        }, err => {
          console.log(err.data);
        })
    },
    openKingdomUserAction(index) {
      console.log("kingdom index:", index);
      let topicId = this.kingdomValue[index].topicId;
      this.$router.push({ name: 'kingdom-user', params: { id: topicId, index: this.pageIndex } });
    },
    changeKingdomUserAction(index) {
      this.modalChangeKingdomUser = true;
      this.topicId = this.kingdomValue[index].topicId;
      this.sourceUid = this.kingdomValue[index].uid;
      let userId = JSON.parse(localStorage.getItem('userInfo'));
      this.optUid = userId.id;
    },
    changeKingdomUser(kingdomData) {
      this.$http.post('/api/kingdom/updateKing', kingdomData)
        .then(
          res => {
            if (res.data.status == 2000) {
              this.$Message.success('更换国王成功');

              this.modalChangeKingdomUser = false;
              if (this.searchStatus) {
                this.getAllkingdomValue('search');
              } else {
                this.getAllkingdomValue('get');
              }
            } else {
              this.$Message.error(res.data.body.message);

              this.modalChangeKingdomUser = true;
              this.targetUid = null;
              return false;
            }
          }, err => {
            console.log(err.data)
          })
    },
    changePage(e) {
      console.log("change page info:", e);
      this.pageIndex = e;
      if (this.searchStatus) {
        this.getAllkingdomValue('search');
      } else {
        this.getAllkingdomValue('get');
      }

    },
    searchAction() {
      this.searchStatus = !this.searchStatus;
      if (!this.searchStatus) {
        this.getAllkingdomValue('get');
      }
    },
    searchKingdomValue(e) {
      this.searchStatus = true;
      console.log("search ad:", e);
      this.pageIndex = 1;
      this.getAllkingdomValue('search');
    },
    handleSubmit() {
      if (!this.targetUid) {
        this.$Message.error("请重新输入");
      } else {
        let pattern = /^\d{1,}$/;
        if (!pattern.test(this.targetUid)) {
          this.$Message.error("国王UID必须为数字，请重新输入");
          return false;
        } else {
          this.modal_loading = true;
          setTimeout(() => {
            this.modal_loading = false;
            let data = {
              token: this.token,
              topicId: this.topicId,
              sourceUid: this.sourceUid,
              targetUid: this.targetUid,
              optUid: this.optUid
            }
            this.changeKingdomUser(data);
          }, 1500);
        }
      }
    },
    handleDismiss() {
      this.modal_loading = false;
      this.modalChangeKingdomUser = false;
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
    orderParamList: function() {
      let data = [{ key: 'createdAt', value: '创建时间' }, { key: 'updatedAt', value: '更新时间' }, { key: 'value', value: '价值' }, { key: 'lastAddValue', value: '昨日增长值' }];
      return data;
    },
    orderList: function() {
      let data = [{ key: 'asc', value: '升序' }, { key: 'desc', value: '倒序' }];
      return data;
    }
  },
  created() {
    this.getToken();
    this.getAllkingdomValue('get');

    // location.reload();
  },
  watch: {
    // 如果路由有变化，会再次执行该方法
    '$route': function(route) {
      console.log("route refresh:", route);
      this.getAllkingdomValue('get');
      this.searchStatus = false;
    }
  }
}
</script>
<style scoped lang="less">
.kingdom-value-wrap {
  min-width: 1660px;
  min-height:100%;
  border:10px solid #f0f0f0;
  border-bottom:none;
  padding-bottom: 15px;
  background: #ffffff;
  .kingdom-value-search {
    background: #ffffff;
    padding:0 5px 15px;
    border-bottom: 10px solid #f0f0f0;
    font-size: 16px;
    line-height: 24px;
    .kingdom-value-search-detail {
      display: inline-block;
      .kingdom-value-search-item {
        display: inline-block;
        width: 180px;
        vertical-align: middle;
        margin-left: 15px;
        label {
          display: inline-block;
          vertical-align: middle;
          font-size: 12px;
        }
        .kingdom-value-item-model {
          width: 65%;
          margin-left: 5px;
          text-align: left;
          vertical-align: middle;
        }
      }
    }
  }
  .kingdom-value-table-title {
    background: #ffffff;
    border-bottom: 1px solid #f0f0f0;
    padding:10px 5px 5px;
    margin-bottom: 10px;
    font-size: 16px;
    line-height: 24px;
  }
}

.kingdom-value-item {
  label {
    width: 80px;
    display: inline-block;
    vertical-align: middle;
    text-align: left;
  }
  .kingdom-value-item-model {
    display: inline-block;
    width: 65%;
    vertical-align: middle;
    margin-left: 10px;
    .kingdom-value-item-check {
      width: 70px;
    }
  }
  .kingdom-value-item-model:last {
    display: inline-block;
  }
}

.text-require {
  color: #FF6C60;
  font-weight: 700;
  margin-left: 3px;
}

</style>
