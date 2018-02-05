<template>
  <div class="list-detail-wrap">
    <div class="list-table-title">
      <span>榜单：<i>{{name}}</i></span>
      <span>模式：<i>{{modeName}}</i></span>
      <span>类型：<i>{{typeName}}</i></span>
      <div class="tag-button">
        <Button v-if="mode===0" type="primary" class="add-list-icon" icon="plus-round" @click="addAction">{{addName}}</Button>
        <Button type="default" class="add-list-icon add-list-default-icon" icon="arrow-return-left" @click="backToAction">返回</Button>
      </div>
    </div>
    <Table refs="table2" border :columns="columns" :data="listRankList" class="tableContent"></Table>
    <Modal v-model="modalDelListRank" width="360">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="information-circled"></Icon>
        <span>删除确认</span>
      </p>
      <div style="text-align:center">
        <p>是否确认删除此条榜单信息？</p>
        <p class="del-item">{{ selectedListRankName }}</p>
      </div>
      <div slot="footer">
        <Button type="error" size="large" long :loading="modal_loading" @click="handleDel">删除</Button>
      </div>
    </Modal>
    <Modal v-if="type===1" v-model="modalTagKingdom" width="800" :styles="{top: '20px',marginBottom: '20px'}" :footer-hide="true" @on-visible-change="modalChange">
      <p class="add-header" slot="header" style="color:#f60;text-align:center">
        <Icon type="information-circled"></Icon>
        <span>{{addName}}</span>
      </p>
      <addTopic :sourceId="sourceId" :sourceType="type" :sort="sortNum" @transferTopicData="getData"></addTopic>
    </Modal>
    <Modal v-else-if="type===2" v-model="modalAddUser" width="800" :styles="{top: '20px',marginBottom: '20px'}" :footer-hide="true" @on-visible-change="modalChange">
      <p class="add-header" slot="header" style="color:#f60;text-align:center">
        <Icon type="information-circled"></Icon>
        <span>{{addName}}</span>
      </p>
      <addUser :sourceId="sourceId" :sourceType="type" :sort="sortNum" @transferUserData="getData"></addUser>
    </Modal>
    <Modal v-else-if="type===3" v-model="modalAddRankSet" width="600" :styles="{top: '20px',marginBottom: '20px'}" :footer-hide="true" @on-visible-change="modalChange">
      <p class="add-header" slot="header" style="color:#f60;text-align:center">
        <Icon type="information-circled"></Icon>
        <span>{{addName}}</span>
      </p>
      <addRankSet :sourceId="sourceId" :sourceType="type" :sort="sortNum" @transferRankData="getData"></addRankSet>
    </Modal>
  </div>
</template>
<script>
import addTopic from '@/views/list_rank/listRankAddTopic.vue'
import addUser from '@/views/list_rank/listRankAddUser.vue'
import addRankSet from '@/views/list_rank/listRankAddRankSet.vue'

export default {
  name: 'listRankDetail',
  components: {
    addTopic,
    addUser,
    addRankSet
  },
  data() {
    return {
      columns: [],
      modalDelListRank: false,
      modalListRank: false,
      modal_loading: false,

      id: null,
      listRankName: '',
      listRankMode: 0,
      listRankType: 1,
      listRankSummary: '',
      listRankWidth: null,
      listRankHeight: null,
      modifyOrAddListRank: '',
      listRankList: [],
      listRankModes: [],
      selectedIndex: null,
      selectedListRankName: '',
      listRankColor: null,
      token: '',
      pageIndex: 1,
      pageSize: 10,
      totalCount: null,
      baseUrl: 'https://cdn.me-to-me.com/',
      previewImg: '',
      originImg: '',
      fileName: '',
      originFileName: '',
      imgType: 'image',

      sourceId: null,
      name: '',
      modeName: '',
      mode: null,
      typeName: '',
      type: null,
      index: null,
      addName: '',
      modalTagKingdom: false,
      modalAddUser: false,
      modalAddRankSet: false,
      modalOpen: false,
      searchStatus: false,
      sortNum: null,
    }
  },
  methods: {
    getToken() {
      this.token = JSON.parse(localStorage.getItem('token'));
      this.sourceId = this.$route.params.id;
      this.index = this.$route.params.index;
      if (this.$route.params.type) {
        // 路由传递参数
        this.name = this.$route.params.name;
        this.mode = this.$route.params.mode;
        this.type = this.$route.params.type;
        this.modeName = this.mode === 0 ? "手动" : "自动";
        this.typeName = this.type === 1 ? "王国榜单" : this.type === 2 ? "用户榜单" : this.type === 3 ? "榜单集合" : '';
        this.addName = this.type === 1 ? "添加王国" : this.type === 2 ? "添加用户" : this.type === 3 ? "添加榜单" : '';
        this.getTableColumns();
        this.getAllListRankList();
      } else {
        // 刷新页面时，路由参数不存在，需要先获取榜单信息
        this.getListRankDetail();
      }
    },
    getDefaultInfo() {
      console.log("params list info:", this.$route.params);
    },
    getAllListRankList() {
      this.sourceId = this.$route.params.id;
      let temData = [];
      let url;
      switch (this.type) {
        case 1:
          url = `/api/listRank/getAllListRankKingdoms?token=${this.token}&sourceId=${this.sourceId}`;
          break;
        case 2:
          url = `/api/listRank/getAllListRankUsers?token=${this.token}&sourceId=${this.sourceId}`;
          break;
        case 3:
          url = `/api/listRank/getAllListRankSets?token=${this.token}&sourceId=${this.sourceId}`;
          break;
      }
      this.$http.get(url).then(
        res => {
          if (res.data.status == 2000) {
            this.totalCount = res.data.body.total;
            res.data.body.data.map((item, index) => {
              temData.push(item);
            })
            this.listRankList = temData;
            if (this.listRankList.length > 0) {
              this.sortNum = this.listRankList[this.listRankList.length-1].sort + 1;
            } else {
              this.sortNum = 1;
            }
            console.log("list rank list:", this.listRankList);
          } else {
            this.$Message.error(res.data.body.message);
          }
        }, err => {
          console.log(err.data);
        })
    },
    getListRankDetail() {
      this.sourceId = this.$route.params.id;
      let temData = [];
      this.$http.get(`/api/listRank/getListRankById?token=${this.token}&id=${this.sourceId}`).then(
        res => {
          if (res.data.status == 2000) {
            this.name = res.data.body.name;
            this.mode = res.data.body.mode;
            this.type = res.data.body.type;
            this.modeName = this.mode === 0 ? "手动" : "自动";
            this.typeName = this.type === 1 ? "王国榜单" : this.type === 2 ? "用户榜单" : this.type === 3 ? "榜单集合" : '';
            this.addName = this.type === 1 ? "添加王国" : this.type === 2 ? "添加用户" : this.type === 3 ? "添加榜单" : '';
            console.log("listRankModes list:", this.name, this.mode, this.type, this.modeName, this.typeName, this.addName);
            this.getTableColumns();
            this.getAllListRankList();
          } else {
            this.$Message.error(res.data.body.message);
          }
        }, err => {
          console.log(err.data);
        })
    },
    getTable2Columns() {
      let temData = [];
      const table2ColumnList = {
        name: {
          title: this.type === 1 ? '王国名称' : this.type === 3 ? '榜单名' : '',
          key: 'name',
          // width: 50,
          align: 'center'
        },
        type: {
          title: '类型',
          key: 'type',
          // width: 100,
          align: 'center',
          render: (h, params) => {
            const row = params.row;
            let typeName;
            if (this.type === 1) {
              typeName = row.type === 0 ? "普通王国" : row.type === 1000 ? "聚合王国" : '';
            } else if (this.type === 3) {
              typeName = row.type === 1 ? "王国榜单" : row.type === 2 ? "用户榜单" : row.type === 3 ? "榜单集合" : '';
            }
            return h('span', typeName);
          }
        },
        userNick: {
          title: '昵称',
          key: 'userNick',
          // width: 50,
          align: 'center'
        },
        isV: {
          title: '大V',
          key: 'isV',
          // width: 100,
          align: 'center',
          render: (h, params) => {
            const row = params.row;
            let isVName = row.isV === 0 ? "否" : row.isV === 1 ? "是" : '';
            return h('span', isVName);
          }
        },
        action: {
          title: '操作',
          key: 'action',
          width: 200,
          align: 'center',
          render: (h, params) => {
            return h('div', [
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
        }
      }
      if (this.mode === 0) {
        if (this.type === 1) {
          let topicData = ['name', 'type', 'action'];
          topicData.forEach(col => temData.push(table2ColumnList[col]));
          console.log("temData info:", temData);
          return temData;
        } else if (this.type === 2) {
          let userListData = ['userNick', 'isV', 'action'];
          userListData.forEach(item => temData.push(table2ColumnList[item]));
          console.log("temData info 2:", temData);
          return temData;
        } else {
          let listRankSetData = ['name', 'type', 'action'];
          listRankSetData.forEach(res => temData.push(table2ColumnList[res]));
          console.log("temData info 3:", temData);
          return temData;
        }
      } else {
        if (this.type === 1) {
          let topicData = ['name', 'type'];
          topicData.forEach(col => temData.push(table2ColumnList[col]));
          console.log("temData info 4:", temData);
          return temData;
        } else if (this.type === 2) {
          let userListData = ['userNick', 'isV'];
          userListData.forEach(item => temData.push(table2ColumnList[item]));
          console.log("temData info 5:", temData);
          return temData;
        } else {
          let listRankSetData = ['name', 'type'];
          listRankSetData.forEach(res => temData.push(table2ColumnList[res]));
          console.log("temData info 6:", temData);
          return temData;
        }
      }
    },
    getTableColumns() {
      this.columns = this.getTable2Columns();
      console.log("column info:", this.columns);
    },
    removeAction(index) {
      this.modalDelListRank = true;
      this.selectedIndex = index;
      if (this.type === 2) {
        this.selectedListRankName = this.listRankList[index].userNick;
        this.id = this.listRankList[index].id;
      } else {
        this.selectedListRankName = this.listRankList[index].name;
        this.id = this.listRankList[index].id;
      }
    },
    backToAction() {
      this.$router.push({ name: 'list-rank', params: { index: this.index } });
    },
    addAction () {
      if (this.type == 1) {
        this.modalTagKingdom = true;
      } else if (this.type == 2) {
        this.modalAddUser = true;
      } else if (this.type == 3) {
        this.modalAddRankSet = true;
      }
    },
    handleDel() {
      this.modal_loading = true;
      setTimeout(() => {
        this.modal_loading = false;
        this.deleteListRank(this.id);
      }, 1500);
    },
    deleteListRank(id) {
      let data = { token: this.token, id: id };
      this.$http.post('/api/listRank/deleteEntry', data)
        .then(
          res => {
            if (res.data.status == 2000) {
              this.$Message.success('删除成功');
              this.modalDelListRank = false;
              this.getAllListRankList();
              // this.listRankList.splice(this.selectedIndex, 1);
            } else {
              this.$Message.error(res.data.body.message);
              this.modalDelListRank = true;
            }
          }, err => {
            console.log(err.data)
          })
    },
    toUpAction(index) {
      if (index === 0) {
        return;
      } else {
        let currentData = Object.assign({}, this.listRankList[index]);
        let firstData = Object.assign({}, this.listRankList[index - 1]);
        let sort = currentData.sort;
        currentData.sort = firstData.sort;
        firstData.sort = sort;
        this.listRankList.splice(index - 1, 2, currentData, firstData);
        let temData = [];
        let temObj;
        let temObjNext;
        if (this.type === 2) {
          temObj = Object.assign({}, { id: this.listRankList[index - 1].uid }, { sort: this.listRankList[index - 1].sort });
          temObjNext = Object.assign({}, { id: this.listRankList[index].uid }, { sort: this.listRankList[index].sort });
        } else {
          temObj = Object.assign({}, { id: this.listRankList[index - 1].id }, { sort: this.listRankList[index - 1].sort });
          temObjNext = Object.assign({}, { id: this.listRankList[index].id }, { sort: this.listRankList[index].sort });
        }
        temData.push(temObj, temObjNext);
        //下面是返回所有列表
        /*this.listRankList.map(tem => {
          let temObj;
          if (this.type === 2) {
            temObj = Object.assign({}, { id: tem.uid }, { sort: tem.sort });
          } else {
            temObj = Object.assign({}, { id: tem.id }, { sort: tem.sort });
          }
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
      let length = this.listRankList.length;
      if (index === length - 1) {
        return;
      } else {
        let currentData = Object.assign({}, this.listRankList[index]);
        let firstData = Object.assign({}, this.listRankList[index + 1]);
        let sort = currentData.sort;
        currentData.sort = firstData.sort;
        firstData.sort = sort;
        this.listRankList.splice(index, 2, firstData, currentData);
        let temData = [];
        let temObj;
        let temObjNext;
        if (this.type === 2) {
          temObj = Object.assign({}, { id: this.listRankList[index].uid }, { sort: this.listRankList[index].sort });
          temObjNext = Object.assign({}, { id: this.listRankList[index + 1].uid }, { sort: this.listRankList[index].sort });
        } else {
          temObj = Object.assign({}, { id: this.listRankList[index].id }, { sort: this.listRankList[index].sort });
          temObjNext = Object.assign({}, { id: this.listRankList[index + 1].id }, { sort: this.listRankList[index + 1].sort });
        }
        temData.push(temObj, temObjNext);
        //下面是返回所有列表
        /*this.listRankList.map(tem => {
          let temObj;
          if (this.type === 2) {
            temObj = Object.assign({}, { id: tem.uid }, { sort: tem.sort });
          } else {
            temObj = Object.assign({}, { id: tem.id }, { sort: tem.sort });
          }
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
      this.$http.post('/api/listRank/sortEntry', data)
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
    modalChange(e) {
      console.log("modal change:", e);
    },
    getData(msg) {
      console.log("transfer Data:", msg);
      if (msg) {
        this.getListRankDetail();
      }
    }
  },
  computed: {
    listRankTypes: function() {
      let data = [{ id: 1, type: '王国榜单' }, { id: 2, type: '用户榜单' }, { id: 3, type: '榜单集合' }];
      return data;
    }
  },
  created () {
    this.getToken();
    this.getDefaultInfo();
  }
}
</script>
<style scoped lang="less">
.list-detail-wrap {
  min-width: 680px;
  min-height:100%;
  border:10px solid #f0f0f0;
  border-bottom:none;
  padding-bottom: 15px;
  background: #ffffff;
  .list-table-title {
    background: #ffffff;
    border-bottom: 1px solid #f0f0f0;
    padding:10px 5px 5px;
    margin-bottom: 10px;
    overflow: hidden;
    font-size: 16px;
    line-height: 24px;
    span {
      margin-right: 20px;
      i {
        color: #ed3f14;
        font-style: normal;
        font-weight: 600;
      }
    }
    .tag-button {
      float: right;
      padding: 0;
      .add-list-icon {
        padding:0;
        width: 80px;
        line-height: 24px;
      }
      .add-list-default-icon{
        width: 60px;
      }
    }
  }
}

.list-rank-item {
  label {
    width: 100px;
    display: inline-block;
    vertical-align: middle;
    text-align: left;
  }
  .list-rank-item-model {
    width: 65%;
    vertical-align: baseline;
    margin-left: 10px;
  }
}

.list-rank-item+.list-rank-item {
  margin-top: 10px;
}

.list-rank-img {
  display: inline-block;
  text-align: left;
  .list-rank-img-pre {
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

.text-require {
  color: #FF6C60;
  font-weight: 700;
  margin-left: 3px;
}

.del-item {
  color: red;
  margin-top: 20px;
  font-size: 15px;
  font-weight: 600;
}

.list-rank-mark {
  text-align: left;
  margin-left: 140px;
  margin-top: 5px;
  color: red;
}

</style>
