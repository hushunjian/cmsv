<template>
  <div class="add-topic">
    <Button type="error" icon="ios-search-strong" @click="addListRankAction('','rankIds')">批量加入</Button>
    <div class="kingdom-list">
      <Table refs="table3" border :columns="kingdomColumns" :data="listRankList" class="tag-table" @on-selection-change="selectChange"></Table>
      <div style="margin: 20px 10px 10px;overflow: hidden">
        <div style="float: right;">
          <Page :total="totalCount2" :current="pageIndex2" @on-change="changePage"></Page>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'addRankSet',
  props: ['sourceType', 'sourceId', 'sort'],
  data () {
    return {
      kingdomColumns: [{
        type: 'selection',
        width: 60,
        align: 'center'
      }, {
        title: '序号',
        key: 'index',
        width: 70,
        align: 'center'
      }, {
        title: '类型',
        key: 'type',
        width: 160,
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
        title: '榜单名',
        key: 'name',
        align: 'center'
      }, {
        title: '操作',
        key: 'action',
        width: 70,
        align: 'center',
        render: (h, params) => {
          return h('div', [
            h('Button', {
              props: {
                type: 'error',
                size: 'small'
              },
              on: {
                click: () => {
                  this.addListRankAction(params, "rankId")
                }
              }
            }, '加入')
          ])
        }
      }],
      modal_loading: false,
      name: '',
      type: -1,
      token: '',
      pageIndex: 1,
      pageIndex2: 1,
      pageSize: 10,
      totalCount: undefined,
      totalCount2: undefined,
      modalOpen: false,
      searchStatus: false,
      listRankList: [],
      rankIds: []
    }
  },
  methods: {
    getToken() {
      this.token = JSON.parse(localStorage.getItem('token'));
    },
    getAllListRanks(e) {
      let temData = [];
      this.$http.get(`/api/listRank/getAllListRanks?token=${this.token}&pageIndex=${e}&pageSize=${this.pageSize}&type=-1`).then(
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
              item.img = this.baseUrl + item.img;
              temData.push(item);
            })
            this.listRankList = temData;
            console.log("list rank list:", this.listRankList);
          } else {
            this.$Message.error(res.data.body.message);
          }
        }, err => {
          console.log(err.data);
        })
    },
    changePage(e) {
      console.log("change page info:", e);
      this.pageIndex2 = e;
      this.getAllListRanks(this.pageIndex2);
    },
    addListRankAction(addrankData, type) {
      console.log("addrank data:", addrankData, type);
      switch (type) {
        case 'rankId':
          let data = {
            token: this.token,
            sourceId: this.sourceId,
            type: this.sourceType,
            targetData: [{
              "targetId": addrankData.row.id,
              "sort": this.sort
            }]
          }
          this.addListRank(data);
          break;
        case 'rankIds':
          if (this.rankIds.length > 0) {
            let temData = [];
            this.rankIds.map((item, index) => {
              let temObj = { targetId: item, sort: this.sort + index};
              temData.push(temObj);
            })
            let data2 = {
              token: this.token,
              sourceId: this.sourceId,
              type: this.sourceType,
              targetData: temData
            }
            this.addListRank(data2);
          } else {
            this.$Message.error('未选择榜单，请重新选择');
            return false;
          }
          break;
      }

    },
    addListRank(rankData) {
      console.log("add rankData item:", rankData);
      this.$http.post('/api/listRank/addEntry', rankData)
        .then(
          res => {
            if (res.data.status == 2000) {
              this.$Message.success('添加成功');
              let actionStatus = true;
              this.$emit("transferRankData", actionStatus);
            } else {
              this.$Message.error(res.data.body);
            }
          }, err => {
            this.$Message.success('添加榜单失败');
          })
    },
    selectChange(e) {
      console.log("select change kingdom:", e);
      let temData = [];
      e.map(item => {
        temData.push(item.id);
      })
      this.rankIds = temData;
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
  created() {
    this.getToken();
    this.getAllListRanks(1);
  }
}
</script>
<style scoped lang="less">
.add-topic {
  .add-header{
    display: inline-block;
    width: 100%;
    height: 20px;
    line-height: 20px;
    font-size: 14px;
    font-weight: 700;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .kingdom-search {
    .search-item {
      display: inline-block;
      /*width: 240px;*/
      vertical-align: middle;
      margin-left: 20px;
      margin-bottom: 10px;
      label {
        display: inline-block;
        vertical-align: middle;
        font-size: 12px;
      }
      .kingdom-item-model {
        width: 180px;
        margin-left: 5px;
        text-align: left;
        vertical-align: middle;
      }
      .kingdom-item-model-half {
        width: 90px;
      }
    }
  }

  .kingdom-action {}


  .kingdom-list {
    margin-top: 20px;
  }

  .range {
    width: 150px;
    display: inline-block;
    vertical-align: middle;
    margin-left: 10px;
    line-height: 10px;
  }
}

</style>
