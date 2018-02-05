<template>
  <div class="tag-kingdom-wrap">
    <div class="tag-kingdom-table-title">
      王国列表
      <div class="tag-button">
        <Button type="primary" icon="plus-round" @click="addAction" class="tag-button-item">添加</Button>
        <Button type="default" icon="arrow-return-left" @click="backToAction" class="tag-button-item">返回</Button>
      </div>
    </div>
    <Table refs="table" border :columns="columns" :data="tagKingdomList"></Table>
    <div style="margin: 20px 10px 10px;overflow: hidden">
      <div style="float: right;">
        <Page :total="totalCount" :current="pageIndex" @on-change="changePage"></Page>
      </div>
    </div>
    <Modal v-model="modalDelTagKingdom" width="360">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="information-circled"></Icon>
        <span>删除确认</span>
      </p>
      <div style="text-align:center">
        <p>是否确认将此王国从标签中移除？</p>
        <p>{{ selectedTagKingdom }}</p>
      </div>
      <div slot="footer">
        <Button type="error" size="large" long :loading="modal_loading" @click="handleDel">删除</Button>
      </div>
    </Modal>
    <Modal v-model="modalTagKingdom" width="800" :footer-hide="true" @on-visible-change="modalChange">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="information-circled"></Icon>
        <span>{{ tagKingdomTitle }}</span>
      </p>
      <div>
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
            <DatePicker v-model="createdEnd"  :editable="false" :clearable="false" type="datetime" placeholder="点击选择创建时间" style="width: 160px;"></DatePicker>
          </div>
          <div class="search-item">
            <label for="">更新时间</label>
            <DatePicker v-model="updatedBegin" :editable="false" :clearable="false" type="datetime" placeholder="点击选择更新时间" style="width: 160px;margin-left:5px;"></DatePicker> -
            <DatePicker v-model="updatedEnd" :editable="false" :clearable="false" type="datetime" placeholder="点击选择更新时间" style="width: 160px;"></DatePicker>
          </div>
          <div class="search-item">
            <label for="">阅读数量</label>
            <slider v-model="readCount" range @on-change="changeValue('read')" class="range"  :max="1000">
            </Slider>
          </div>
          <div class="search-item">
            <label for="">评论数量</label>
            <slider v-model="reviewCount" range @on-change="changeValue('review')" class="range">
            </Slider>
          </div>
          <div class="search-item">
            <label for="">点赞数量</label>
            <slider v-model="likeCount" range @on-change="changeValue('like')" class="range">
            </Slider>
          </div>
          <div class="search-item">
            <label for="">成员数量</label>
            <slider v-model="memberCount" range @on-change="changeValue('member')" class="range">
            </Slider>
          </div>
          <div class="search-item">
            <label for="">更新数量</label>
            <slider v-model="updateCount" range @on-change="changeValue('update')" class="range">
            </Slider>
          </div>
          <div class="search-item">
            <label for="">图片数量</label>
            <slider v-model="imageCount" range @on-change="changeValue('image')" class="range">
            </Slider>
          </div>
          <div class="search-item">
            <label for="">音频数量</label>
            <slider v-model="audioCount" range @on-change="changeValue('audio')" class="range">
            </Slider>
          </div>
          <div class="search-item">
            <label for="">视频数量</label>
            <slider v-model="videoCount" range @on-change="changeValue('video')" class="range">
            </Slider>
          </div>
          <div class="search-item">
            <label for="" style="width: 60px;">文字</label>
            <slider v-model="wordCount" range @on-change="changeValue('word')" class="range">
            </Slider>
          </div>
        </div>
        <div class="kingdom-action">
          <Button type="primary" icon="ios-search-strong" @click="searchKingdom" style="margin-bottom:10px;margin-left:20px">搜索</Button>
          <Button type="primary" icon="ios-search-strong" @click="refreshKingdomAction" style="margin-bottom:10px;margin-left:20px" :loading="modal_loading">立即刷新王国缓存</Button>
          <Button type="error" icon="ios-search-strong" @click="addTagTopicAction('','topicIds')" style="margin-bottom:10px;margin-left:20px">批量加入</Button>
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
    </Modal>
  </div>
</template>
<script>
export default {
  name: 'advertisementLinkTag',
  data() {
    return {
      columns: [{
        title: '王国名称',
        key: 'topicName',
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
          ],name);
        }
      }, {
        title: '创建时间',
        key: 'createdAt',
        align: 'center',
        width: 160
      }, {
        title: '最近更新时间',
        key: 'updatedAt',
        align: 'center',
        width: 160
      }, {
        title: '标签名称',
        key: 'tagName'
      }, {
        title: '操作',
        key: 'action',
        width: 100,
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
                  this.removeAction(params.index)
                }
              }
            }, '移除')
          ])
        }
      }],
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
          ],name);
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
          const typeName = row.type === 0 ? "否" : row.type === 1 ? "是" : '';
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
                  this.addTagTopicAction(params, "topicId")
                }
              }
            }, '加入')
          ])
        }
      }],
      kingdomList: [],
      tagKingdomList: [],
      modal_loading: false,
      modalDelTagKingdom: false,
      modalTagKingdom: false,
      selectedTagKingdom: '',
      selectedTagKingdomIndex: undefined,
      tagId: undefined,
      topicId: null,
      topicIds: [],
      tagName: '',
      modifyOrAddTagKingdom: '',
      tagKingdomTitle: '添加王国',
      topicName: '',
      userName: '',
      isV: -1,
      type: -1,
      createdBegin: null,
      createdEnd: null,
      updatedBegin: null,
      updatedEnd: null,
      readCount: [0, 0],
      reviewCount: [0, 0],
      likeCount: [0, 0],
      memberCount: [0, 0],
      updateCount: [0, 0],
      imageCount: [0, 0],
      audioCount: [0, 0],
      videoCount: [0, 0],
      wordCount: [0, 0],
      token: '',
      pageIndex: 1,
      pageIndex2: 1,
      pageSize: 10,
      totalCount: undefined,
      totalCount2: undefined,
      modalOpen: false,
      searchStatus: false,
      index: null
    }
  },
  methods: {
    getToken() {
      this.token = JSON.parse(localStorage.getItem('token'));
      this.index = this.$route.params.index;
    },
    getTagKingdomList(e) {
      this.tagId = this.$route.params.id;
      let temData = [];
      this.$http.get(`/api/tag/getAllTagKingdom?token=${this.token}&pageIndex=${e}&pageSize=${this.pageSize}&tagId=${this.tagId}`).then(
        res => {
          if (res.data.status == 2000) {
            this.totalCount = res.data.body.total;
            res.data.body.data.map(item => {
              item.createdAt = this.formateDate(item.createdAt);
              item.updatedAt = this.formateDate(item.updatedAt);
              temData.push(item);
            })
            this.tagKingdomList = temData;
            console.log("tagkingdom list:", this.tagKingdomList);
          } else {
            this.$Message.error(res.data.body.message);
          }
        }, err => {
          console.log(err.data);
        })
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
          reviewCountStart: this.reviewCount[0],
          reviewCountEnd: this.reviewCount[1],
          readCountStart: this.readCount[0],
          readCountEnd: this.readCount[1],
          likeCountStart: this.likeCount[0],
          likeCountEnd: this.likeCount[1],
          memberCountStart: this.memberCount[0],
          memberCountEnd: this.memberCount[1],
          updateCountStart: this.updateCount[0],
          updateCountEnd: this.updateCount[1],
          imageCountStart: this.imageCount[0],
          imageCountEnd: this.imageCount[1],
          audioCountStart: this.audioCount[0],
          audioCountEnd: this.audioCount[1],
          videoCountStart: this.videoCount[0],
          videoCountEnd: this.videoCount[1],
          wordCountStart: this.wordCount[0],
          wordCountEnd: this.wordCount[1]
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
    addAction() {
      this.modalTagKingdom = true;
      this.modifyOrAddTagKingdom = 'addTag';
      this.modalOpen = true;
      this.tagName = '';
      this.tagLocation = '';
    },
    backToAction() {
      // this.$router.go(-1);
      this.$router.push({ name: 'tag-control',params:{index: this.index}});
    },
    removeAction(index) {
      this.modalDelTagKingdom = true;
      this.tagId = this.tagKingdomList[index].tagId;
      this.topicId = this.tagKingdomList[index].topicId;
      this.selectedTagKingdomIndex = index;
      this.selectedTagKingdom = this.tagKingdomList[index].topicName;
    },
    handleDel() {
      this.modal_loading = true;
      setTimeout(() => {
        this.modal_loading = false;

        this.deleteTagKingdom();
      }, 1500);
    },
    deleteTagKingdom() {
      let data = { token: this.token, tagId: this.tagId, topicId: this.topicId };
      this.$http.post('/api/tag/removeTagTopic', data)
        .then(
          res => {
            if (res.data.status == 2000) {
              this.$Message.success('删除成功');
              this.getTagKingdomList(this.pageIndex);
              this.modalDelTagKingdom = false;
            } else {
              this.$Message.error(res.data.body);
              this.modalDelTagKingdom = true;
            }
          }, err => {
            console.log(err.data);
            this.$Message.success('删除失败');
          })
    },
    addTagTopic(tagTopicData) {
      console.log("add tagtopic item:", tagTopicData);
      this.$http.post('/api/tag/addTagTopic', tagTopicData)
        .then(
          res => {
            if (res.data.status == 2000) {
              this.$Message.success('添加成功');
              this.getTagKingdomList(this.pageIndex);
            } else {
              this.$Message.error(res.data.body);
            }
          }, err => {
            this.$Message.success('添加标签失败');
          })
    },
    changePage(e) {
      console.log("change page info:", e);
      if (this.modalOpen) {
        this.pageIndex2 = e;
        if (this.searchStatus) {
          this.getKingdomList(this.pageIndex2, 'search');
        } else {
          this.getKingdomList(this.pageIndex2, 'get');
        }
      } else {
        this.pageIndex = e;
        this.getTagKingdomList(this.pageIndex);
      }
    },
    searchKingdom() {
      this.searchStatus = true;
      this.pageIndex2 = 1;
      this.getKingdomList(this.pageIndex2, 'search');
    },
    changeValue(e) {
      // console.log("change value:",e);
    },
    refreshKingdomAction() {
      this.modal_loading = true;
      this.$Modal.confirm({
        title: '刷新王国缓存确认',
        content: '<p>确认刷新吗？</p>',
        onOk: () => {
          this.refreshKingdom();
        },
        onCancel: () => {
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
    addTagTopicAction(topicData, type) {
      console.log("topic data:", topicData, type);
      switch (type) {
        case 'topicId':
          let data = {
            token: this.token,
            tagId: this.tagId,
            topicId: [topicData.row.topicId]
          }
          this.addTagTopic(data);
          break;
        case 'topicIds':
          let data2 = {
            token: this.token,
            tagId: this.tagId,
            topicId: this.topicIds
          }
          if (this.topicIds.length>0) {
            this.addTagTopic(data2);
          } else {
            this.$Message.error('未选择王国，请重新选择');
            return false;
          }
          break;
      }

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
    modalChange(e) {
      console.log("modal change:", e);
      this.modalOpen = e;
      if (!this.modalOpen) {
        this.searchStatus = false;
      } else {
        this.pageIndex2 = 1;
        this.getKingdomList(this.pageIndex2, 'get');
      }

    }
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
    this.getTagKingdomList(1);
    this.getKingdomList(1, 'get');
  }
}

</script>
<style scoped lang="less">
.tag-kingdom-wrap {
  min-width: 780px;
  min-height:100%;
  border:10px solid #f0f0f0;
  border-bottom:none;
  padding-bottom: 15px;
  background: #ffffff;
  .tag-kingdom-table-title {
    background: #ffffff;
    border-bottom: 1px solid #f0f0f0;
    padding: 5px;
    margin-bottom: 10px;
    overflow: hidden;
    font-size: 16px;
    line-height: 24px;
    .tag-button {
      float: right;
      padding: 0;
      .tag-button-item {
        padding:0;
        width: 60px;
        line-height: 24px;
      }
    }
  }
}

.tag-item {
  label {
    width: 70px;
    display: inline-block;
    vertical-align: middle;
    text-align: left;
  }
  .tag-item-model {
    width: 65%;
    vertical-align: baseline;
    margin-left: 10px;
  }
}

.tag-item+.tag-item {
  margin-top: 10px;
}

.kingdom-search {
  .search-item {
    display: inline-block; // width: 240px;
    vertical-align: middle;
    margin-left: 20px;
    margin-bottom: 10px;
    label {
      display: inline-block;
      vertical-align: middle;
      font-size: 15px;
    }
    .kingdom-item-model {
      width: 180px;
      margin-left: 5px;
      text-align: left;
      vertical-align: middle;
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

</style>
