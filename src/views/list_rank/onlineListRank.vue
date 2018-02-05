<template>
  <div class="online-list-wrap">
    <div class="online-list-title">
      <span class="table-title">上线榜单管理</span>
    </div>
    <template>
    <!--<Tabs @on-click="changeTab" v-model="tabIndex">
      <tabPane v-for="(item,index) in onlineListRankType" :label="item.name" :key="item.id" :name="index.toString()">
        &lt;!&ndash; <Table refs="configTable" border :columns="columns" :data="item.items" v-if="index == tabIndex"></Table> &ndash;&gt;
        <div class="tab-detail">
          <div class="tab-left">
            <h3>待选榜单</h3>
            <div class="tab-left-content">
              <Table refs="tab1" border :columns="listColumns" :data="listRank"></Table>
            </div>
          </div>
          <div class="tab-right">
            <h3>已选榜单</h3>
            <div class="tab-right-content">
              <Table refs="tab2" border :columns="onlineListColumns" :data="onlineListRank"></Table>
            </div>
          </div>
        </div>
      </tabPane>
    </Tabs>-->
    <Tabs @on-click="changeTab" v-model="tabIndex" type="card">
      <tabPane v-for="(item,index) in onlineListRankType" :label="item.name" :key="item.id" :name="index.toString()">
        <!-- <Table refs="configTable" border :columns="columns" :data="item.items" v-if="index == tabIndex"></Table> -->
        <div class="tab-detail">
          <Tabs @on-click="changeTabTable" v-model="tabTableIndex" size="small">
            <tabPane v-for="(item,index) in onlineListRankTypeTable" :label="item.name" :key="item.id" :name="index.toString()">
              <div class="tab-left-content" v-if="tableType==1">
                <Table refs="tab1" border :columns="listColumns" :data="listRank"></Table>
              </div>
              <div class="tab-right-content" v-else="tableType==2">
                <Table refs="tab2" border :columns="onlineListColumns" :data="onlineListRank"></Table>
              </div>
            </tabPane>
          </Tabs>
        </div>
      </tabPane>
    </Tabs>
  </template>
    <Modal v-model="modalDelList" width="360">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="information-circled"></Icon>
        <span>删除确认</span>
      </p>
      <div style="text-align:center">
        <p>是否确认将该榜单从已选榜单中删除？</p>
        <p>{{ selectedListName }}</p>
      </div>
      <div slot="footer">
        <Button type="error" size="large" long :loading="modal_loading" @click="handleDel">删除</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
export default {
  name: 'onlineListRank',
  data() {
    return {
      listColumns: [{
        title: '序号',
        type: 'index',
        width: 50,
        align: 'center'
      }, {
        title: '类型',
        key: 'type',
        width: 80,
        align: 'center',
        render: (h, params) => {
          const row = params.row;
          let typeName;
          switch (row.type) {
            case 1:
              typeName = "王国榜单";
              break;
            case 2:
              typeName = "用户榜单";
              break;
            case 3:
              typeName = "榜单集合";
              break;
          }
          return h('span', typeName);
        }
      }, {
        title: '名称',
        key: 'name',
        // width: 200 onlineStatus    |int     |是否加入上线榜单(0:未加入; 1:已加入)
      }, {
        title: '操作',
        key: 'action',
        width: 80,
        align: 'center',
        render: (h, params) => {
          const row = params.row;
          const name = row.onlineStatus === 1 ? "已加入" : row.onlineStatus === 0 ? "加入" : '';
          if (row.onlineStatus === 1) {
            return h('div', [
              h('Button', {
                props: {
                  type: 'info',
                  size: 'small',
                  disabled: 'disabled'
                },
                on: {
                  click: () => {
                    this.addAction(params);
                  }
                }
              }, name)
            ])
          } else {
            return h('div', [
              h('Button', {
                props: {
                  type: 'info',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.addAction(params);
                  }
                }
              }, name)
            ])
          }
        }
      }],
      onlineListColumns: [{
        title: '序号',
        type: 'index',
        align: 'center',
        width: 50
      }, {
        title: '类型',
        key: 'type',
        width: 80,
        align: 'center',
        render: (h, params) => {
          const row = params.row;
          let listName;
          switch (row.listType) {
            case 1:
              listName = "王国榜单";
              break;
            case 2:
              listName = "用户榜单";
              break;
            case 3:
              listName = "榜单集合";
              break;
          }
          return h('span', listName);
        }
      }, {
        title: '名称',
        key: 'name',
        // width: 400
      }, {
        title: '状态',
        key: 'status',
        width: 70,
        align: 'center',
        render: (h, params) => {
          const row = params.row;
          const statusName = row.status === 0 ? "未上架" : row.status === 1 ? "已上架" : '';
          return h('span', statusName);
        }
      }, {
        title: '操作',
        key: 'action',
        width: 220,
        align: 'center',
        render: (h, params) => {
          const row = params.row;
          const status = row.status === 0 ? "上架" : row.status === 1 ? "下架" : '';
          return h('div', [
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
            }, '下移'),
            h('Button', {
              props: {
                type: 'error',
                size: 'small'
              },
              style: {
                marginRight: '5px',
              },
              on: {
                click: () => {
                  this.removeAction(params.index);
                }
              }
            }, '删除'),
            h('Button', {
              props: {
                type: 'primary',
                size: 'small'
              },
              style: {
                marginRight: '5px',
              },
              on: {
                click: () => {
                  this.offlineAction(params);
                }
              }
            }, status)
          ])
        }
      }],
      token: '',
      pageIndex: 1,
      pageSize: 500,
      totalCount: null,
      listRank: [],
      onlineListRank: [],
      modal_loading: false,
      tabIndex: 0,
      tabTableIndex: 0,
      selectedIndex: null,
      modalDelList: false,
      type: 1,
      tableType: 1,
      selectedListName: '',
      sort: null,
      status: null
    }
  },
  methods: {
    getToken() {
      this.token = JSON.parse(localStorage.getItem('token'));
    },
    getAllListRank() {
      let temData = [];
      this.$http.get(`/api/listRank/getAllListRanks?token=${this.token}&pageIndex=${this.pageIndex}&pageSize=${this.pageSize}&type=${this.type}`).then(
        res => {
          if (res.data.status == 2000) {
            this.totalCount = res.data.body.total;
            res.data.body.data.map(item => {
              temData.push(item);
            })
            this.listRank = temData;
            console.log("list rank list:", this.listRank);
          } else {
            this.$Message.error(res.data.message);
          }
        }, err => {
          console.log(err.data);
        })
    },
    getAllOnlineListRank() {
      let temData = [];
      this.$http.get(`/api/listRank/getAllOnlineListRanks?token=${this.token}&type=${this.type}`).then(
        res => {
          if (res.data.status == 2000) {
            res.data.body.data.map(item => {
              temData.push(item);
            })
            this.onlineListRank = temData;
            if (this.onlineListRank.length > 0) {
              this.sort = this.onlineListRank[this.onlineListRank.length - 1].sort + 1;
            } else {
              this.sort = 1;
            }
            console.log("onlineList rank list:", this.onlineListRank);
          } else {
            this.$Message.error(res.data.message);
          }
        }, err => {
          console.log(err.data);
        })
    },
    changeTab(e) {

      this.type = parseInt(e) + parseInt(1);
      console.log("change tab :", e, this.tabIndex, this.type);
      if (this.tableType == 1) {
        this.getAllListRank();
      } else if (this.tableType == 2) {
        this.getAllOnlineListRank();
      }
    },
    changeTabTable(e) {

      this.tableType = parseInt(e) + parseInt(1);
      console.log("change tabTable :", e, this.tabTableIndex, this.tableType);
      if (this.tableType == 1) {
        this.getAllListRank();
      } else if (this.tableType == 2) {
        this.getAllOnlineListRank();
      }
    },
    addAction(params) {
      this.id = params.row.id;
      this.selectedIndex = params.index;
      this.addOnlineListRank();
    },
    addOnlineListRank() {
      let temData = this.onlineListRank[this.selectedIndex];
      let data = { token: this.token, id: this.id, type: this.type, sort: this.sort };
      this.$http.post('/api/listRank/addOnlineListRank', data)
        .then(
          res => {
            if (res.data.status == 2000) {
              this.$Message.success('添加成功');
              this.getAllOnlineListRank();
              this.getAllListRank();
            } else {
              this.$Message.error(res.data.message);
            }
          }, err => {
            console.log(err.data)
          })
    },
    toUpAction(index) {
      if (index === 0) {
        return;
      } else {
        let currentData = Object.assign({}, this.onlineListRank[index]);
        let firstData = Object.assign({}, this.onlineListRank[index - 1]);
        let sort = currentData.sort;
        currentData.sort = firstData.sort;
        firstData.sort = sort;
        this.onlineListRank.splice(index - 1, 2, currentData, firstData);
        let temData = [];
        let temObj;
        let temObjNext;
        temObj = Object.assign({}, { id: this.onlineListRank[index - 1].id }, { sort: this.onlineListRank[index - 1].sort });
        temObjNext = Object.assign({}, { id: this.onlineListRank[index].id }, { sort: this.onlineListRank[index].sort });
        temData.push(temObj, temObjNext);
        //下面是返回所有列表
        /*this.onlineListRank.map(tem => {
          let temObj = Object.assign({}, { id: tem.id }, { sort: tem.sort });
          temData.push(temObj);
        })*/
        console.log("sort data1:", temData);
        let targetData = {
          token: this.token,
          targetData: temData
        }
        this.sortOnlineList(targetData);
        // this.sortOnlineList(temData);
      }

    },
    todownAction(index) {
      let length = this.onlineListRank.length;
      if (index === length - 1) {
        return;
      } else {
        let currentData = Object.assign({}, this.onlineListRank[index]);
        let firstData = Object.assign({}, this.onlineListRank[index + 1]);
        let sort = currentData.sort;
        currentData.sort = firstData.sort;
        firstData.sort = sort;
        this.onlineListRank.splice(index, 2, firstData, currentData);
        let temData = [];
        let temObj;
        let temObjNext;
        temObj = Object.assign({}, { id: this.onlineListRank[index].id }, { sort: this.onlineListRank[index].sort });
        temObjNext = Object.assign({}, { id: this.onlineListRank[index + 1].id }, { sort: this.onlineListRank[index + 1].sort });
        temData.push(temObj, temObjNext);
        //下面是返回所有列表
        /*this.onlineListRank.map(tem => {
          let temObj = Object.assign({}, { id: tem.id }, { sort: tem.sort });
          temData.push(temObj);
        })*/
        console.log("sort data12:", temData);
        let targetData = {
          token: this.token,
          targetData: temData
        }
        this.sortOnlineList(targetData);
      }
    },
    sortOnlineList(data) {
      this.$http.post('/api/listRank/sortOnlineListRank', data)
        .then(
          res => {
            if (res.data.status == 2000) {
              this.$Message.success('排序成功');
              // this.onlineListRank.map(item => {
              //   if (item.id === listId) {
              //     item.status = this.status
              //   }
              // })
            } else {
              this.$Message.error(res.data.body.message);
            }
          }, err => {
            console.log(err.data)
          })
    },
    removeAction(index) {
      this.modalDelList = true;
      this.id = this.onlineListRank[index].id;
      this.selectedIndex = index;
      this.selectedListName = this.onlineListRank[index].name;
    },
    offlineAction(params) {
      this.id = this.onlineListRank[params.index].id;
      this.selectedIndex = params.index;
      this.status = this.onlineListRank[params.index].status === 0 ? 1 : 0;
      this.offlineList(this.id);
    },
    offlineList(listId) {
      let data = { token: this.token, id: listId, status: this.status };
      this.$http.post('/api/listRank/setOnlineListRank', data)
        .then(
          res => {
            if (res.data.status == 2000) {
              this.$Message.success('操作成功');
              this.onlineListRank.map(item => {
                if (item.id === listId) {
                  item.status = this.status
                }
              })
            } else {
              this.$Message.error(res.data.message);
            }
          }, err => {
            console.log(err.data)
          })
    },
    handleDel() {
      this.modal_loading = true;
      setTimeout(() => {
        this.modal_loading = false;
        this.modalDelList = false;
        this.deleteOnlineList(this.id);
      }, 1500);
    },
    deleteOnlineList(listId) {
      let data = { token: this.token, id: listId };
      this.$http.post('/api/listRank/deleteOnlineListRank', data)
        .then(
          res => {
            if (res.data.status == 2000) {
              this.$Message.success('删除成功');
              this.onlineListRank.splice(this.selectedIndex, 1);
              this.getAllListRank();
            } else {
              this.$Message.error(res.data.message);
            }
          }, err => {
            console.log(err.data)
          })
    }
  },
  created() {
    this.getToken();
    this.getAllListRank();
  },
  computed: {
    onlineListRankType: function () {
      let data = [{ id: 1, name: '找谁' }, { id: 2, name: '找组织' }];
      return data;
    },
    onlineListRankTypeTable: function () {
      let data = [{ id: 1, name: '待选榜单' }, { id: 2, name: '已选榜单' }];
      return data;
    }
  }
}

</script>
<style scoped lang="less">
.online-list-wrap {
  min-width: 768px;
  min-height:100%;
  border:10px solid #f0f0f0;
  border-bottom:none;
  padding-bottom: 15px;
  background: #ffffff;
  .online-list-title {
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
    .app-cache {
      margin-left: 150px;
      padding: 0;
      width: 100px;
      line-height: 24px;
    }
  }
}

.tab-detail {
  display: flex;
  flex-flow: row nowrap;
  .tab-left {
    width: 40%;
    margin-right: 20px;
  }
  .tab-right {
    flex: 1;
    width: 50%;
  }
}

h3 {
  font-size: 18px;
  font-weight: 500;
}
</style>
