<template>
  <div class="add-topic">
    <div class="kingdom-search">
      <div class="search-item">
        <label for="user-name">用户名</label>
        <Input v-model="nickName" placeholder="请输入用户名" class="kingdom-item-model" id="user-name"></Input>
      </div>
      <div class="search-item">
        <label for="">大V</label>
        <Select v-model="isV" style="width:100px;text-align:left;vertical-align:middle;margin-left:5px;" class="kingdom-item-model">
          <Option :value="-1">全部</Option>
          <Option v-for="item in isVData" :value="item.id" :key="item.id">{{ item.type }}</Option>
        </Select>
      </div>
      <div class="search-item">
        <label for="">注册时间</label>
        <DatePicker v-model="createdBegin" :editable="false" :clearable="false" type="datetime" placeholder="点击选择创建时间" style="width: 160px;margin-left:5px;"></DatePicker> -
        <DatePicker v-model="createdEnd" :editable="false" :clearable="false" type="datetime" placeholder="点击选择创建时间" style="width: 160px;"></DatePicker>
      </div>
      <div class="search-item">
        <label for="">发布王国数量</label>
        <Input v-model="topicCountStart" placeholder="开始值" class="kingdom-item-model kingdom-item-model-half"></Input> -
        <Input v-model="topicCountEnd" placeholder="结束值" class="kingdom-item-model kingdom-item-model-half"></Input>
      </div>
      <div class="search-item">
        <label for="">关注别人数量</label>
        <Input v-model="followCountStart" placeholder="开始值" class="kingdom-item-model kingdom-item-model-half"></Input> -
        <Input v-model="followCountEnd" placeholder="结束值" class="kingdom-item-model kingdom-item-model-half"></Input>
      </div>
      <div class="search-item">
        <label for="">粉丝数量</label>
        <Input v-model="fansCountStart" placeholder="开始值" class="kingdom-item-model kingdom-item-model-half"></Input> -
        <Input v-model="fansCountEnd" placeholder="结束值" class="kingdom-item-model kingdom-item-model-half"></Input>
      </div>
    </div>
    <div class="kingdom-action">
      <Button type="primary" icon="ios-search-strong" @click="searchUser" style="margin-bottom:10px;margin-left:20px">搜索</Button>
      <Button type="error" icon="ios-search-strong" @click="addListRankUserAction('','userIds')" style="margin-bottom:10px;margin-left:20px">批量加入</Button>
    </div>
    <div class="kingdom-list">
      <Table refs="table3" border :columns="kingdomColumns" :data="userList" class="tag-table" @on-selection-change="selectChange"></Table>
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
  name: 'addUser',
  props: ['sourceType', 'sourceId', 'sort'],
  data() {
    return {
      kingdomColumns: [{
        type: 'selection',
        width: 60,
        align: 'center',
        fixed: 'left'
      }, {
        title: '用户ID',
        key: 'uid',
        width: 80,
        align: 'center',
        fixed: 'left'
      }, {
        title: '用户名',
        key: 'nickName',
        width: 150,
        align: 'center'
      }, {
        title: '更新时间',
        key: 'createdAt',
        align: 'center',
        width: 150
      }, {
        title: '大V',
        key: 'isV',
        align: 'center',
        width: 60,
        render: (h, params) => {
          const row = params.row;
          const isVName = row.isV === 0 ? "否" : row.isV === 1 ? "是" : '';
          return h('span', isVName);
        }
      }, {
        title: '发布王国数量',
        key: 'topicCount',
        align: 'center',
        width: 120
      }, {
        title: '关注数量',
        key: 'followCount',
        align: 'center',
        width: 90
      }, {
        title: '粉丝数量',
        key: 'fansCount',
        align: 'center',
        width: 90
      }, {
        title: '操作',
        key: 'action',
        width: 70,
        align: 'center',
        fixed: 'right',
        render: (h, params) => {
          return h('div', [
            h('Button', {
              props: {
                type: 'error',
                size: 'small'
              },
              on: {
                click: () => {
                  this.addListRankUserAction(params, "userId")
                }
              }
            }, '加入')
          ])
        }
      }],
      modal_loading: false,
      nickName: '',
      isV: -1,
      createdAt: null,
      topicCount: null,
      followCount: null,
      fansCount: null,
      createdBegin: null,
      createdEnd: null,
      topicCountStart: null,
      topicCountEnd: null,
      fansCountStart: null,
      fansCountEnd: null,
      followCountStart: null,
      followCountEnd: null,
      token: '',
      pageIndex: 1,
      pageIndex2: 1,
      pageSize: 10,
      totalCount: undefined,
      totalCount2: undefined,
      modalOpen: false,
      searchStatus: false,
      userList: [],
      userIds: []
      // sourceId: this.sourceId,
      // sourceType: this.sourceType,
      // sort: this.sort
    }
  },
  methods: {
    getToken() {
      this.token = JSON.parse(localStorage.getItem('token'));
    },
    getAppUsersList(e, type) {
      let temData = [];
      let url;
      let httpData;
      if (type === 'get') {
        url = `/api/listRank/getAppUsers?token=${this.token}&pageIndex=${e}&pageSize=${this.pageSize}`;
        httpData = this.$http.get(url);
      } else if (type === 'search') {
        url = `/api/listRank/getAppUserSearch`;
        let data = {
          token: this.token,
          pageIndex: e,
          pageSize: this.pageSize,
          nickName: this.nickName,
          isV: this.isV,
          createdBegin: new Date(this.createdBegin).getTime(),
          createdEnd: new Date(this.createdEnd).getTime(),
          topicCountStart: this.topicCountStart,
          topicCountEnd: this.topicCountEnd,
          followCountStart: this.followCountStart,
          followCountEnd: this.followCountEnd,
          fansCountStart: this.fansCountStart,
          fansCountEnd: this.fansCountEnd
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
            this.totalCount2 = res.data.body.total;
            res.data.body.data.map(item => {
              item.createdAt = this.formateDate(item.createdAt);
              temData.push(item);
            })
            this.userList = temData;
            console.log("user list:", this.userList);
          } else {
            this.$Message.error(res.data.body.message);
          }
        }, err => {
          console.log(err.data);
        })
    },
    searchUser() {
      this.searchStatus = true;
      this.pageIndex2 = 1;
      this.getAppUsersList(this.pageIndex2, 'search');
    },
    changeValue(e) {
      // console.log("change value:",e);
    },
    changePage(e) {
      console.log("change page info:", e);
      this.pageIndex2 = e;
      if (this.searchStatus) {
        this.getAppUsersList(this.pageIndex2, 'search');
      } else {
        this.getAppUsersList(this.pageIndex2, 'get');
      }
    },
    addListRankUserAction(userData, type) {
      console.log("user data:", userData, type);
      switch (type) {
        case 'userId':
          let data = {
            token: this.token,
            sourceId: this.sourceId,
            type: this.sourceType,
            targetData: [{
              "targetId": userData.row.uid,
              "sort": this.sort
            }]
          }
          this.addListRankUser(data);
          break;
        case 'userIds':
          if (this.userIds.length > 0) {
            let temData = [];
            this.userIds.map((item, index) => {
              let temObj = { targetId: item, sort: this.sort + index};
              temData.push(temObj);
            })
            let data2 = {
              token: this.token,
              sourceId: this.sourceId,
              type: this.sourceType,
              targetData: temData
            }
            this.addListRankUser(data2);
          } else {
            this.$Message.error('未选择用户，请重新选择');
            return false;
          }
          break;
      }

    },
    addListRankUser(addUserData) {
      console.log("add user item:", addUserData);
      this.$http.post('/api/listRank/addEntry', addUserData)
        .then(
          res => {
            if (res.data.status == 2000) {
              this.$Message.success('添加成功');
              let actionStatus = true;
              this.$emit("transferUserData", actionStatus);
            } else {
              this.$Message.error(res.data.body);
            }
          }, err => {
            this.$Message.success('添加用户失败');
          })
    },
    selectChange(e) {
      console.log("select change user:", e);
      let temData = [];
      e.map(item => {
        temData.push(item.uid);
      })
      this.userIds = temData;
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
    isVData: function() {
      let data = [{ id: 0, type: '否' }, { id: 1, type: '是' }];
      return data;
    },
    typeData: function() {
      let data = [{ id: 0, type: '否' }, { id: 1, type: '是' }];
      return data;
    }
  },
  created() {
    this.getToken();
    this.getAppUsersList(1, 'get');
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
