<template>
  <div class="add-topic">
    <div class="kingdom-search">
      <div class="search-item">
        <label for="topic-name">王国标题</label>
        <Input v-model="topicName" placeholder="请输入王国名" class="kingdom-item-model" id="topic-name"></Input>
      </div>
      <div class="search-item">
        <label for="user-name">用户名</label>
        <Input v-model="userName" placeholder="请输入用户名" class="kingdom-item-model" id="user-name"></Input>
      </div>
      <div class="search-item">
        <label for="">大V</label>
        <Select v-model="isV" style="width:100px;text-align:left;vertical-align:middle;margin-left:5px;" class="kingdom-item-model">
          <Option :value="-1">全部</Option>
          <Option v-for="item in isVData" :value="item.id" :key="item.id">{{ item.type }}</Option>
        </Select>
      </div>
      <div class="search-item">
        <label for="">聚合</label>
        <Select v-model="type" style="width:100px;text-align:left;vertical-align:middle;margin-left:5px;" class="kingdom-item-model">
          <Option :value="-1">全部</Option>
          <Option v-for="item in typeData" :value="item.id" :key="item.id">{{ item.type }}</Option>
        </Select>
      </div>
      <div class="search-item">
        <label for="">创建时间</label>
        <DatePicker v-model="createdBegin" :editable="false" :clearable="false" type="datetime" placeholder="点击选择创建时间" style="width: 160px;margin-left:5px;"></DatePicker> -
        <DatePicker v-model="createdEnd" :editable="false" :clearable="false" type="datetime" placeholder="点击选择创建时间" style="width: 160px;"></DatePicker>
      </div>
      <div class="search-item">
        <label for="">更新时间</label>
        <DatePicker v-model="updatedBegin" :editable="false" :clearable="false" type="datetime" placeholder="点击选择更新时间" style="width: 160px;margin-left:5px;"></DatePicker> -
        <DatePicker v-model="updatedEnd" :editable="false" :clearable="false" type="datetime" placeholder="点击选择更新时间" style="width: 160px;"></DatePicker>
      </div>
      <div class="search-item">
        <label for="">阅读数量</label>
        <Input v-model="readCountStart" placeholder="开始值" class="kingdom-item-model kingdom-item-model-half"></Input> -
        <Input v-model="readCountEnd" placeholder="结束值" class="kingdom-item-model kingdom-item-model-half"></Input>
      </div>
      <div class="search-item">
        <label for="">评论数量</label>
        <Input v-model="reviewCountStart" placeholder="开始值" class="kingdom-item-model kingdom-item-model-half"></Input> -
        <Input v-model="reviewCountEnd" placeholder="结束值" class="kingdom-item-model kingdom-item-model-half"></Input>
      </div>
      <div class="search-item">
        <label for="">点赞数量</label>
        <Input v-model="likeCountStart" placeholder="开始值" class="kingdom-item-model kingdom-item-model-half"></Input> -
        <Input v-model="likeCountEnd" placeholder="结束值" class="kingdom-item-model kingdom-item-model-half"></Input>
      </div>
      <div class="search-item">
        <label for="">成员数量</label>
        <Input v-model="memberCountStart" placeholder="开始值" class="kingdom-item-model kingdom-item-model-half"></Input> -
        <Input v-model="memberCountEnd" placeholder="结束值" class="kingdom-item-model kingdom-item-model-half"></Input>
      </div>
      <div class="search-item">
        <label for="">更新数量</label>
        <Input v-model="updateCountStart" placeholder="开始值" class="kingdom-item-model kingdom-item-model-half"></Input> -
        <Input v-model="updateCountEnd" placeholder="结束值" class="kingdom-item-model kingdom-item-model-half"></Input>
      </div>
      <div class="search-item">
        <label for="">图片数量</label>
        <Input v-model="imageCountStart" placeholder="开始值" class="kingdom-item-model kingdom-item-model-half"></Input> -
        <Input v-model="imageCountEnd" placeholder="结束值" class="kingdom-item-model kingdom-item-model-half"></Input>
      </div>
      <div class="search-item">
        <label for="">音频数量</label>
        <Input v-model="audioCountStart" placeholder="开始值" class="kingdom-item-model kingdom-item-model-half"></Input> -
        <Input v-model="audioCountEnd" placeholder="结束值" class="kingdom-item-model kingdom-item-model-half"></Input>
      </div>
      <div class="search-item">
        <label for="">视频数量</label>
        <Input v-model="videoCountStart" placeholder="开始值" class="kingdom-item-model kingdom-item-model-half"></Input> -
        <Input v-model="videoCountEnd" placeholder="结束值" class="kingdom-item-model kingdom-item-model-half"></Input>
      </div>
      <div class="search-item">
        <label for="" style="width: 60px;">文字数量</label>
        <Input v-model="wordCountStart" placeholder="开始值" class="kingdom-item-model kingdom-item-model-half"></Input> -
        <Input v-model="wordCountEnd" placeholder="结束值" class="kingdom-item-model kingdom-item-model-half"></Input>
      </div>
    </div>
    <div class="kingdom-action">
      <Button type="primary" icon="ios-search-strong" @click="searchKingdom" style="margin-bottom:10px;margin-left:20px">搜索</Button>
      <Button type="primary" icon="ios-search-strong" @click="refreshKingdomAction" style="margin-bottom:10px;margin-left:20px" :loading="modal_loading">立即刷新王国缓存</Button>
      <Button type="error" icon="ios-search-strong" @click="addListRankTopicAction('','topicIds')" style="margin-bottom:10px;margin-left:20px">批量加入</Button>
    </div>
    <div class="kingdom-list">
      <Table refs="table3" border :columns="kingdomColumns" :data="kingdomList" class="tag-table" @on-selection-change="selectChange"></Table>
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
  name: 'addTopic',
  props: ['sourceType', 'sourceId', 'sort'],
  data() {
    return {
      kingdomColumns: [{
        type: 'selection',
        width: 60,
        align: 'center',
        fixed: 'left'
      }, {
        title: '王国名称',
        key: 'topicName',
        width: 150,
        align: 'center',
        fixed: 'left',
        render: (h, params) => {
          const row = params.row;
          const name = row.topicName;
          const link = row.link;
          return h('div', [
            h('a', {
              attrs: {
                href: link,
                target: "_blank"
              },
              style: {

              }
            }, name)
          ], name);
        }
      }, {
        title: '更新时间',
        key: 'updatedAt',
        align: 'center',
        width: 150
      }, {
        title: '用户名',
        key: 'userName',
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
        title: '是否聚合',
        key: 'type',
        align: 'center',
        width: 90,
        render: (h, params) => {
          const row = params.row;
          const typeName = row.type === 0 ? "否" : row.type === 1000 ? "是" : '';
          return h('span', typeName);
        }
      }, {
        title: '评论数',
        key: 'reviewCount',
        align: 'center',
        width: 80
      }, {
        title: '阅读数',
        key: 'readCount',
        align: 'center',
        width: 80
      }, {
        title: '点赞数',
        key: 'likeCount',
        align: 'center',
        width: 80
      }, {
        title: '成员数',
        key: 'memberCount',
        align: 'center',
        width: 80
      }, {
        title: '更新数量',
        key: 'updateCount',
        align: 'center',
        width: 90
      }, {
        title: '图片数量',
        key: 'imageCount',
        align: 'center',
        width: 90
      }, {
        title: '音频数量',
        key: 'audioCount',
        align: 'center',
        width: 90
      }, {
        title: '视频数量',
        key: 'videoCount',
        align: 'center',
        width: 90
      }, {
        title: '文字数量',
        key: 'wordCount',
        align: 'center',
        width: 90
      }, {
        title: '王国ID',
        key: 'topicId',
        align: 'center',
        width: 80
      }, {
        title: '操作',
        key: 'action',
        width: 70,
        fixed: 'right',
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
                  this.addListRankTopicAction(params, "topicId")
                }
              }
            }, '加入')
          ])
        }
      }],
      modal_loading: false,
      tagKingdomTitle: '添加王国',
      topicName: '',
      userName: '',
      isV: -1,
      type: -1,
      reviewCount: null,
      readCount: null,
      likeCount: null,
      memberCount: null,
      updateCount: null,
      imageCount: null,
      audioCount: null,
      videoCount: null,
      wordCount: null,
      createdBegin: null,
      createdEnd: null,
      updatedBegin: null,
      updatedEnd: null,
      reviewCountStart: null,
      reviewCountEnd: null,
      readCountStart: null,
      readCountEnd: null,
      likeCountStart: null,
      likeCountEnd: null,
      memberCountStart: null,
      memberCountEnd: null,
      updateCountStart: null,
      updateCountEnd: null,
      imageCountStart: null,
      imageCountEnd: null,
      audioCountStart: null,
      audioCountEnd: null,
      videoCountStart: null,
      videoCountEnd: null,
      wordCountStart: null,
      wordCountEnd: null,
      token: '',
      pageIndex: 1,
      pageIndex2: 1,
      pageSize: 10,
      totalCount: undefined,
      totalCount2: undefined,
      modalOpen: false,
      searchStatus: false,
      kingdomList: [],
      topicIds: []
      // sourceId: this.sourceId,
      // sourceType: this.sourceType,
      // sort: this.sort
    }
  },
  methods: {
    getToken() {
      this.token = JSON.parse(localStorage.getItem('token'));
    },
    getKingdomList(e, type) {
      let temData = [];
      let url;
      let httpData;
      if (type === 'get') {
        url = `/api/kingdom/getAllKingdoms?token=${this.token}&pageIndex=${e}&pageSize=${this.pageSize}`;
        httpData = this.$http.get(url);
      } else if (type === 'search') {
        url = `/api/kingdom/getKingdomSearch`;
        let data = {
          token: this.token,
          pageIndex: e,
          pageSize: this.pageSize,
          topicName: this.topicName,
          userName: this.userName,
          isV: this.isV,
          type: this.type,
          createdBegin: new Date(this.createdBegin).getTime(),
          createdEnd: new Date(this.createdEnd).getTime(),
          updatedBegin: new Date(this.updatedBegin).getTime(),
          updatedEnd: new Date(this.updatedEnd).getTime(),
          reviewCountStart: this.reviewCountStart,
          reviewCountEnd: this.reviewCountEnd,
          readCountStart: this.readCountStart,
          readCountEnd: this.readCountEnd,
          likeCountStart: this.likeCountStart,
          likeCountEnd: this.likeCountEnd,
          memberCountStart: this.memberCountStart,
          memberCountEnd: this.memberCountEnd,
          updateCountStart: this.updateCountStart,
          updateCountEnd: this.updateCountEnd,
          imageCountStart: this.imageCountStart,
          imageCountEnd: this.imageCountEnd,
          audioCountStart: this.audioCountStart,
          audioCountEnd: this.audioCountEnd,
          videoCountStart: this.videoCountStart,
          videoCountEnd: this.videoCountEnd,
          wordCountStart: this.wordCountStart,
          wordCountEnd: this.wordCountEnd
        }
        if (data.createdEnd && data.createdEnd < data.createdBegin) {
          this.$Message.error("创建时间结束时间应大于开始时间，请重新输入");
          return false;
        } else if (data.updatedEnd && data.updatedEnd < data.updatedBegin) {
          this.$Message.error("更新时间结束时间应大于开始时间，请重新输入");
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
              item.updatedAt = this.formateDate(item.updatedAt);
              temData.push(item);
            })
            this.kingdomList = temData;
            console.log("tagkingdom list:", this.kingdomList);
          } else {
            this.$Message.error(res.data.body.message);
          }
        }, err => {
          console.log(err.data);
        })
    },
    searchKingdom() {
      let pattern = /^\d{1,}$/;
      if (
        this.reviewCountStart && !pattern.test(this.reviewCountStart) ||
        this.reviewCountEnd && !pattern.test(this.reviewCountEnd) ||
        this.readCountStart && !pattern.test(this.readCountStart) ||
        this.readCountEnd && !pattern.test(this.readCountEnd) ||
        this.likeCountStart && !pattern.test(this.likeCountStart) ||
        this.likeCountEnd && !pattern.test(this.likeCountEnd) ||
        this.memberCountStart && !pattern.test(this.memberCountStart) ||
        this.memberCountEnd && !pattern.test(this.memberCountEnd) ||
        this.updateCountStart && !pattern.test(this.updateCountStart) ||
        this.updateCountEnd && !pattern.test(this.updateCountEnd) ||
        this.imageCountStart && !pattern.test(this.imageCountStart) ||
        this.imageCountEnd && !pattern.test(this.imageCountEnd) ||
        this.audioCountStart && !pattern.test(this.audioCountStart) ||
        this.audioCountEnd && !pattern.test(this.audioCountEnd) ||
        this.videoCountStart && !pattern.test(this.videoCountStart) ||
        this.videoCountEnd && !pattern.test(this.videoCountEnd) ||
        this.wordCountStart && !pattern.test(this.wordCountEnd) ||
        this.wordCountEnd && !pattern.test(this.wordCountEnd) ) {
        this.$Message.error("输入必须为数字，请重新输入");
        // this.mobile = null;
        return false;
      } else {
        this.searchStatus = true;
        this.pageIndex2 = 1;
        this.getKingdomList(this.pageIndex2, 'search');
      }
    },
    changeValue(e) {
      // console.log("change value:",e);
    },
    refreshKingdomAction() {
      this.$Modal.confirm({
        title: '刷新王国缓存确认',
        content: '<p>确认刷新吗？</p>',
        onOk: () => {
          this.modal_loading = true;
          this.refreshKingdom();
        },
        onCancel: () => {
          this.modal_loading = false;
          this.$Message.info('取消');
        }
      });
    },
    refreshKingdom() {
      this.$http.get(`/api/kingdom/refreshCache?token=${this.token}`)
        .then(
          res => {
            if (res.data.status == 2000) {
              this.$Message.success('操作成功');
              this.modal_loading = false;
              this.pageIndex2 = 1;
              this.getKingdomList(this.pageIndex2, 'get');
            } else {
              this.$Message.error(res.data.body);
            }
          }, err => {
            this.$Message.error('操作失败');
          })
    },
    changePage(e) {
      console.log("change page info:", e);
      this.pageIndex2 = e;
      if (this.searchStatus) {
        this.getKingdomList(this.pageIndex2, 'search');
      } else {
        this.getKingdomList(this.pageIndex2, 'get');
      }
    },
    addListRankTopicAction(topicData, type) {
      console.log("topic data:", topicData, type);
      switch (type) {
        case 'topicId':
          let data = {
            token: this.token,
            sourceId: this.sourceId,
            type: this.sourceType,
            targetData: [{
              "targetId": topicData.row.topicId,
              "sort": this.sort
            }]
          }
          this.addListRankTopic(data);
          break;
        case 'topicIds':
          if (this.topicIds.length > 0) {
            let temData = [];
            this.topicIds.map((item, index) => {
              let temObj = { targetId: item, sort: this.sort + index};
              temData.push(temObj);
            })
            let data2 = {
              token: this.token,
              sourceId: this.sourceId,
              type: this.sourceType,
              targetData: temData
            }
            this.addListRankTopic(data2);
          } else {
            this.$Message.error('未选择王国，请重新选择');
            return false;
          }
          break;
      }

    },
    addListRankTopic(tagTopicData) {
      console.log("add tagtopic item:", tagTopicData);
      this.$http.post('/api/listRank/addEntry', tagTopicData)
        .then(
          res => {
            if (res.data.status == 2000) {
              this.$Message.success('添加成功');
              // this.getTagKingdomList(this.pageIndex);
              let actionStatus = true;
              this.$emit("transferTopicData", actionStatus);
            } else {
              this.$Message.error(res.data.body);
            }
          }, err => {
            this.$Message.success('添加王国失败');
          })
    },
    selectChange(e) {
      console.log("select change kingdom:", e);
      let temData = [];
      e.map(item => {
        temData.push(item.topicId);
      })
      this.topicIds = temData;
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
    this.getKingdomList(1, 'get');
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
