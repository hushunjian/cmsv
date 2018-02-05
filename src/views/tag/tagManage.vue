<template>
  <div class="tag-wrap">
    <div class="tag-table-title">
      <span class="table-title">搜索操作</span>
    </div>
    <div class="tag-search">
      <!--<Button type="default" icon="ios-search-strong" @click="searchAction">查询</Button>-->
      <div class="tag-search-detail">
        <div class="tag-search-item">
          <label for="topic-name">标签名</label>
          <Input v-model="tagNameSearch" placeholder="请输入标签名" class="tag-item-model" id="topic-name"></Input>
        </div>
        <div class="tag-search-item">
          <label for="">创建时间</label>
          <DatePicker v-model="startTime" :editable="false" :clearable="false" type="datetime" placeholder="点击选择时间" style="width: 160px;margin-left:5px;"></DatePicker> -
          <DatePicker v-model="endTime" :editable="false" :clearable="false" type="datetime" placeholder="点击选择时间" style="width: 160px;"></DatePicker>
        </div>
        <div class="tag-search-item">
          <label for="">是否体系</label>
          <Select v-model="isSystemSearch" style="width:100px;text-align:left;vertical-align:middle;margin-left:5px;" class="tag-search-model">
            <Option :value="-1">所有</Option>
            <Option v-for="item in isSystemData" :value="item.id" :key="item.id">{{ item.type }}</Option>
          </Select>
        </div>
        <div class="tag-search-item">
          <label for="">王国数</label>
          <Input v-model="topicCountStart" placeholder="请输入王国数" class="tag-item-model tag-item-model-Count"></Input> -
          <Input v-model="topicCountEnd" placeholder="请输入王国数" class="tag-item-model tag-item-model-Count"></Input>
        </div>
        <div class="tag-search-item">
          <label for="">是否推荐</label>
          <Select v-model="isRecommendSearch" style="width:100px;text-align:left;vertical-align:middle;margin-left:5px;" class="tag-search-model">
            <Option :value="-1">所有</Option>
            <Option v-for="item in isRecommendData" :value="item.id" :key="item.id">{{ item.type }}</Option>
          </Select>
        </div>
        <div class="tag-search-item">
          <label for="">父标签</label>
          <Select v-model="parentTagIdSearch" style="width:150px;text-align:left;vertical-align:middle;margin-left:5px;" class="tag-search-model">
            <Option :value="-1">全部</Option>
            <Option v-for="item in parentTagList" :value="item.parentTagId" :key="item.parentTagId">{{ item.parentTagName }}</Option>
          </Select>
          <Checkbox v-model="noParentTagStatus" style="margin-left:20px;">无大类标签</Checkbox>
        </div>
        <Button type="primary" icon="ios-search-strong" @click="searchTag" style="margin-bottom:10px;margin-left:20px">搜索</Button>
      </div>
    </div>
    <div class="tag-table-title">
      <span class="table-title">标签列表</span>
      <Button type="success" class="add-tag-icon" icon="plus-round" @click="addAction">添加</Button>
    </div>
    <Table refs="table2" border :columns="columns" :data="tagList" class="tag-table"></Table>
    <div style="margin: 20px 10px 10px;overflow: hidden">
      <div style="float: right;">
        <Page :total="totalCount" :current="pageIndex" @on-change="changePage"></Page>
      </div>
    </div>
    <Modal v-model="modalTag" width="580" class-name="vertical-center-modal">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="information-circled"></Icon>
        <span>{{ tagTitle }}</span>
      </p>
      <div class="tag-list-con">
        <div class="tag-item">
          <label for="tag-name">标签名<b class="text-require">*</b></label>
          <Input v-model="tagName" placeholder="请输入标签名" class="tag-item-model" id="tag-name"></Input>
        </div>
        <div class="tag-item">
          <label for="">背景图</label>
          <div class="tag-img tag-item-model">
            <div class="tag-img-pre">
              <img :src="coverImage" alt="">
              <span v-if="!coverImage">暂无图片</span>
            </div>
             <imgUpload :type="imgType" @transferData="getData"></imgUpload>
          </div>
        </div>
        <div class="tag-item">
          <label for="tag-sortNumber">排序号(小数排前面，升序排序)</label>
          <Input v-model="sortNumber" type="text" placeholder="请输入排序号(数字)" class="tag-item-model" id="tag-sortNumber"></Input>
        </div>
        <div class="tag-item">
          <label for="">父标签</label>
          <Select v-model="parentTagId" class="tag-item-model">
            <Option :value="0">无</Option>
            <Option v-for="item in parentTagList" :value="item.parentTagId" :key="item.parentTagId">{{ item.parentTagName }}</Option>
          </Select>
        </div>
        <div class="tag-item">
          <label for="">是否体系</label>
          <Select v-model="isSystem" class="tag-item-model">
            <Option v-for="item in isSystemData" :value="item.id" :key="item.id">{{ item.type }}</Option>
          </Select>
        </div>
        <div class="tag-item">
          <label for="">是否推荐</label>
          <Select v-model="isRecommend" class="tag-item-model">
            <Option v-for="item in isRecommendData" :value="item.id" :key="item.id">{{ item.type }}</Option>
          </Select>
        </div>
        <div class="tag-item">
          <label for="">标签状态</label>
          <Select v-model="status" class="tag-item-model">
            <Option v-for="item in statusData" :value="item.id" :key="item.id">{{ item.type }}</Option>
          </Select>
        </div>
        <div class="tag-item">
          <label for="">对应用户喜好</label>
          <CheckboxGroup v-model="userHobbyIds" class="tag-item-model tag-item-model-check">
            <Checkbox v-for="item in userHobbyList" :value="item.userHobbyId" :key="item.userHobbyId" :label="item.userHobbyId" class="tag-item-check">{{ item.userHobbyName }}</Checkbox>
          </CheckboxGroup>
        </div>
      </div>
      <div slot="footer">
        <Button type="primary" :loading="modal_loading" @click="handleSubmit">确定</Button>
        <Button type="default" @click="handleDismiss">取消</Button>
      </div>
    </Modal>
    <Modal v-model="modalDelTag" width="360" class-name="vertical-center-modal">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="information-circled"></Icon>
        <span>删除确认</span>
      </p>
      <div style="text-align:center">
        <p>是否确认删除此条标签信息？</p>
        <p class="del-item">{{ selectedTagName }}</p>
        <p style="color:red;font-weight:600;margin-top:20px;">谨慎操作，此操作会删除数据（物理删除），不可恢复！</p>
      </div>
      <div slot="footer">
        <Button type="error" size="large" long :loading="modal_loading" @click="handleDel">删除</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import uploadImg from '@/components/uploadImg.vue'
import imgUpload from '@/components/imgUpload.vue'
export default {
  name: 'tagManage',
  components: {
    uploadImg,
    imgUpload
  },
  data() {
    return {
      columns: [{
        title: '序号',
        key: 'index',
        width: 50,
        align: 'center',
        /*fixed: 'left'*/
      }, {
        title: '标签名',
        key: 'tagName',
        align: 'center'/*,
        width: 120,
        fixed: 'left'*/
      }, {
        title: '大类标签',
        key: 'parentTagName',
        /*width: 160*/
      }, {
        title: '创建时间',
        key: 'createdAt',
        align: 'center',
        width: 160
      }, {
        title: '是否体系',
        key: 'isSystem',
        align: 'center',
        width: 90,
        render: (h, params) => {
          const row = params.row;
          const systemName = row.isSystem === 0 ? "否" : row.isSystem === 1 ? "是" : '';
          return h('span', systemName);
        }
      }, {
        title: '是否推荐',
        key: 'isRecommend',
        align: 'center',
        width: 90,
        render: (h, params) => {
          const row = params.row;
          const recommendName = row.isRecommend === 0 ? "否" : row.isRecommend === 1 ? "是" : '';
          return h('span', recommendName);
        }
      }, {
        title: '状态',
        key: 'status',
        align: 'center',
        width: 70,
        render: (h, params) => {
          const row = params.row;
          const statusName = row.status === 0 ? "正常" : row.status === 1 ? "禁用" : '';
          return h('span', statusName);
        }
      }, {
        title: '王国数',
        key: 'topicCount',
        align: 'center',
        width: 75
      }, {
        title: '操作',
        key: 'action',
        width: 200,
        align: 'center',
        /*fixed: 'right',*/
        render: (h, params) => {
          return h('div', [
            h('Button', {
              props: {
                type: 'info',
                size: 'small'
              },
              style: {
                marginRight: '5px'
              },
              on: {
                click: () => {
                  this.modifyAction(params.index)
                }
              }
            }, '编辑'),
            h('Button', {
              props: {
                type: 'error',
                size: 'small'
              },
              style: {
                marginRight: '5px'
              },
              on: {
                click: () => {
                  this.removeAction(params.index)
                }
              }
            }, '删除'),
            h('Button', {
              props: {
                type: 'primary',
                size: 'small'
              },
              on: {
                click: () => {
                  this.openTagKingdomAction(params.index)
                }
              }
            }, '查看王国列表')
          ]);
        }
      }],
      tagId: undefined,
      tagName: '',
      tagNameSearch: '',
      startTime: null,
      endTime: null,
      isSystem: -1,
      isSystemSearch: -1,
      isRecommend: -1,
      isRecommendSearch: -1,
      topicCountStart: null,
      topicCountEnd: null,
      parentTagId: -1,
      parentTagIdSearch: -1,
      noParentTag: 0,
      noParentTagStatus: false,
      tagList: [],
      parentTagList: [],
      selectedIndex: undefined,
      selectedTagName: '',
      token: '',
      pageIndex: 1,
      pageSize: 10,
      totalCount: undefined,
      searchStatus: false,
      modalTag: false,
      modalDelTag: false,
      modal_loading: false,
      modifyOrAddTag: '',
      status: null,
      sortNumber: null,
      coverImage: '',
      userHobbyIds: [],
      userHobbyList: [],
      fileName: '',
      baseUrl: 'https://cdn.me-to-me.com/',
      originFileName: '',
      originImg: '',
      imgType: 'image'
    }
  },
  methods: {
    getToken () {
      this.token = JSON.parse(localStorage.getItem('token'));
      if (this.$route.params.index) {
        this.pageIndex = this.$route.params.index;
      }
    },
    getParentTagList () {
      let temData = [];
      this.$http.get(`/api/tag/getAllParentTags?token=${this.token}`).then(
        res => {
          if (res.data.status == 2000) {
            res.data.body.map(item => {
              temData.push(item);
            })
            // temData.unshift({parentTagId:0,parentTagName:'无'});
            this.parentTagList = temData;
            console.log("parent taglist:", this.parentTagList);
          } else {
            this.$Message.error(res.data.body.message);
          }
        }, err => {
          console.log(err.data);
        })
    },
    getUserHobbies () {
      let temData = [];
      this.$http.get(`/api/tag/getAllUserHobbies?token=${this.token}`).then(
        res => {
          if (res.data.status == 2000) {
            res.data.body.map(item => {
              temData.push(item);
            })
            // temData.unshift({parentTagId:'-1',parentTagName:'全部'});
            this.userHobbyList = temData;
            console.log("parent taglist:", this.userHobbyList);
          } else {
            this.$Message.error(res.data.body.message);
          }
        }, err => {
          console.log(err.data);
        })
    },
    getAlltagList (type) {
      let temData = [];
      let url;
      let httpData;
      if (type === 'get') {
        url = `/api/tag/getAllTags?token=${this.token}&pageIndex=${this.pageIndex}&pageSize=${this.pageSize}`;
        httpData = this.$http.get(url);
      } else if (type === 'search') {
        url = `/api/tag/getTagSearch`;
        if (this.noParentTagStatus === true) {
          this.noParentTag = 1;
        } else {
          this.noParentTag = 0;
        }
        let data = {
          token: this.token,
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
          tagName: this.tagNameSearch,
          startTime: new Date(this.startTime).getTime(),
          endTime: new Date(this.endTime).getTime(),
          isSystem: this.isSystemSearch,
          isRecommend: this.isRecommendSearch,
          topicCountStart: this.topicCountStart,
          topicCountEnd: this.topicCountEnd,
          parentTagId: this.parentTagIdSearch,
          noParentTag: this.noParentTag
        }
        if (data.endTime && data.endTime < data.startTime) {
          this.$Message.error("创建时间结束时间应大于开始时间，请重新输入");
          return false;
        } else {
          httpData = this.$http.post(url, data);
        }
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
              item.createdAt = this.formateDate(item.createdAt);
              item.coverImage = this.baseUrl + item.coverImage;
              temData.push(item);
            })
            this.tagList = temData;
            console.log("tag list:", this.tagList);
          } else {
            this.$Message.error(res.data.body.message);
          }
        }, err => {
          console.log(err.data);
        })
    },
    addAction () {
      this.modalTag = true;
      this.modifyOrAddTag = 'addTag';
      this.tagName = '';
      this.parentTagId = null;
      this.sortNumber = null;
      this.isSystem = 0;
      this.isRecommend = 0;
      this.status = 0;
      this.coverImage = '';
      this.userHobbyIds = [];
    },
    modifyAction (index) {
      let imgStatus = this.tagList[index].coverImage.match(/https\:\/\/cdn.me-to-me.com\/(.*)/)[1];

      this.modalTag = true;
      this.modifyOrAddTag = 'modifyTag';
      this.tagId = this.tagList[index].tagId;
      this.tagName = this.tagList[index].tagName;
      // this.coverImage = this.tagList[index].coverImage;
      this.coverImage = imgStatus ? this.tagList[index].coverImage : '';
      this.parentTagId = this.tagList[index].parentTagId;
      this.sortNumber = this.tagList[index].sortNumber;
      this.isSystem = this.tagList[index].isSystem;
      this.isRecommend = this.tagList[index].isRecommend;
      this.status = this.tagList[index].status;
      this.userHobbyIds = this.tagList[index].userHobbyIds;
      this.selectedIndex = index;
      // this.fileName = this.coverImage.match(/https\:\/\/cdn.me-to-me.com\/(.*)/)[1];
      this.fileName = imgStatus ? imgStatus : '';
      this.originFileName = this.fileName;
    },
    removeAction (index) {
      this.modalDelTag = true;
      this.tagId = this.tagList[index].tagId;
      console.log('del tagId:', this.tagId);
      this.selectedIndex = index;
      this.selectedTagName = this.tagList[index].tagName;
    },
    handleDel () {
      this.modal_loading = true;
      setTimeout(() => {
        this.modal_loading = false;
        this.modalDelTag = false;
        this.deleteTag(this.tagId);
      }, 1500);
    },
    openTagKingdomAction (index) {
      console.log("tag index:", index);
      let tagId = this.tagList[index].tagId;
      this.$router.push({ name: 'tag-kingdom', params: { id: tagId, index: this.pageIndex } });
    },
    changePage(e) {
      console.log("change page info:", e);
      this.pageIndex = e;
      if (this.searchStatus) {
        this.getAlltagList('search');
      } else {
        this.getAlltagList('get');
      }

    },
    searchAction() {
      this.searchStatus = !this.searchStatus;
      if (!this.searchStatus) {
        this.getAlltagList('get');
      }
      // if (this.searchStatus) {
      //   this.parentTagList.splice(0,1,{parentTagId:-1,parentTagName:'全部'});
      // } else {
      //   this.parentTagList.splice(0,1,{parentTagId:0,parentTagName:'无'});
      // }
    },
    searchTag(e) {
      let pattern = /^\d{1,}$/;
      if (this.topicCountStart && !pattern.test(this.topicCountStart) ||
        this.topicCountEnd && !pattern.test(this.topicCountEnd)) {
        this.$Message.error("王国数必须为数字，请重新输入");
        return false;
      } else {
        this.searchStatus = true
        console.log("search tag:", e);
        this.pageIndex = 1;
        this.getAlltagList('search');
      }
    },
    // 已弃用
    changeValue(e) {
      this.rangeValue = e;
      console.log("topicNumber:", e, this.rangeValue);
      this.topicCountStart = this.rangeValue[0];
      this.topicCountEnd = this.rangeValue[1];
    },
    addTag(tagData) {
      this.$http.post('/api/tag/addTag', tagData)
        .then(
          res => {
            if (res.data.status == 2000) {
              this.$Message.success('添加成功');
              if (this.searchStatus) {
                this.getAlltagList('search');
              } else {
                this.getAlltagList('get');
              }
              this.modalTag = false;
              this.fileName = '';
            } else {
              this.$Message.error(res.data.body.message);
              this.modalTag = true;
            }
          }, err => {
            console.log(err.data)
          })
    },
    modifyTag(tagData) {
      this.$http.post('/api/tag/updateTag', tagData).then(
        res => {
          if (res.data.status == 2000) {
            console.log('add tag info:', res.data);
            this.$Message.success('修改成功');
            if (this.searchStatus) {
              this.getAlltagList('search');
            } else {
              this.getAlltagList('get');
            }
            this.modalTag = false;
            this.fileName = '';
            console.log("modified tag list:", this.tagList);
          } else {
            this.$Message.error(res.data.body.message);
            this.modalTag = true;
          }
        }, err => {
          console.log(err.data);
        })
    },
    deleteTag(tagId) {
      let data = { token: this.token, tagId: tagId };
      this.$http.post('/api/tag/deleteTag', data)
        .then(
          res => {
            if (res.data.status == 2000) {
              this.$Message.success('删除成功');
              if (this.searchStatus) {
                this.getAlltagList('search');
              } else {
                this.getAlltagList('get');
              }
              // this.tagList.splice(this.selectedIndex, 1);
            } else {
              this.$Message.error(res.data.body.message);
            }
          }, err => {
            console.log(err.data)
          })
    },
    handleSubmit() {
      if (!this.tagName) {
        this.$Message.error('请完善信息后提交');
        return false;
      } else {
        let pattern = /^\d{1,}$/;
        if (this.sortNumber && !pattern.test(this.sortNumber)) {
          this.$Message.error("排序号必须为数字，请重新输入");
          return false;
        } else {
          this.modal_loading = true;
          setTimeout(() => {
            this.modal_loading = false;
            switch (this.modifyOrAddTag) {
              case 'modifyTag':
                let data = {
                  token: this.token,
                  tagId: this.tagId,
                  tagName: this.tagName,
                  parentTagId: this.parentTagId === 0 ? null : this.parentTagId,
                  sortNumber: this.sortNumber,
                  isSystem: this.isSystem,
                  isRecommend: this.isRecommend,
                  status: this.status,
                  coverImage: this.fileName,
                  userHobbyIds: this.userHobbyIds
                }
                console.log("modify tag:", data);
                this.modifyTag(data);
                break;
              case 'addTag':
                let data2 = {
                  token: this.token,
                  tagName: this.tagName,
                  parentTagId: this.parentTagId === 0 ? null : this.parentTagId,
                  sortNumber: this.sortNumber,
                  isSystem: this.isSystem,
                  isRecommend: this.isRecommend,
                  status: this.status,
                  coverImage: this.fileName,
                  userHobbyIds: this.userHobbyIds
                }
                console.log("add tag:", data2);
                this.addTag(data2);
                break;
            }
          }, 1500)
          return false;
        }
        return false;
      }
    },
    handleDismiss() {
      this.modal_loading = false;
      this.modalTag = false;
    },
    getData(msg) {
      console.log("transfer Data:", msg);
      if (msg.type === 'image') {
        this.coverImage = msg.img;
        this.fileName = msg.fileName;
        // if (msg.img) {
        //   this.coverImage = msg.img;
        //   this.fileName = msg.fileName;
        // } else {
        //   this.coverImage = this.originImg;
        //   this.fileName = this.originFileName;
        // }
      }
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
    isSystemData: function() {
      let data = [{ id: 0, type: '否' }, { id: 1, type: '是' }];
      return data;
    },
    isRecommendData: function() {
      let data = [{ id: 0, type: '否' }, { id: 1, type: '是' }];
      return data;
    },
    statusData: function() {
      let data = [{ id: 0, type: '正常' }, { id: 1, type: '禁用' }];
      return data;
    },
    tagTitle: function() {
      if (this.modifyOrAddTag === 'modifyTag') {
        return "修改标签";
      } else if (this.modifyOrAddTag === 'addTag') {
        return "添加标签";
      }
    }
  },
  created() {
    this.getToken();
    this.getParentTagList();
    this.getUserHobbies();
    this.getAlltagList('get');
  },
  watch: {
    // 如果路由有变化，会再次执行该方法
    '$route': function(route) {
      this.getParentTagList();
      this.getUserHobbies();
      this.getAlltagList('get');
      this.searchStatus = false;
    }
  }
}
</script>
<style scoped lang="less">
.tag-wrap {
  min-width:1050px;
  min-height:100%;
  border:10px solid #f0f0f0;
  border-bottom:none;
  padding-bottom: 15px;
  background: #ffffff;
  .tag-search {
    background: #ffffff;
    padding:0 5px 5px;
    border-bottom:10px solid #f0f0f0;
    font-size: 16px;
    line-height: 24px;
    .tag-search-detail {
      .tag-search-item {
        display: inline-block;
        /*width: 240px;*/
        vertical-align: middle;
        margin-left: 15px;
        margin-bottom: 10px;
        label {
          display: inline-block;
          vertical-align: middle;
          font-size: 12px;
        }
        .tag-item-model {
          width: 180px;
          margin-left: 5px;
          text-align: left;
          vertical-align: middle;
        }
        .tag-item-model-Count{
          width:100px ;
        }
      }
      .tag-search-item+.tag-search-item {
        // margin-left: 0;
      }
    }
  }
  .tag-table-title {
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
    .add-tag-icon {
      /*float: right;*/
      display: inline-block;
      vertical-align: middle;
      padding: 0;
      width: 60px;
      line-height: 24px;
      margin-left: 20px;
    }
  }
}
.tag-list-con{
  text-align: left;
  margin-left:12px;
  .tag-item {
    label {
      width: 120px;
      display: inline-block;
      vertical-align: middle;
      text-align: left;
    }
    .tag-item-model {
      display: inline-block;
      width: 45%;
      vertical-align: middle;
      margin-left: 10px;
      .tag-item-check {
        width: 70px;
      }
    }
    .tag-item-model-check{
      width: 400px;
    }
    .tag-item-model:last {
      display: inline-block;
    }
  }
}
.tag-item+.tag-item {
  margin-top: 10px;
}

.tag-img {
  display: inline-block;
  text-align: left;
  .tag-img-pre {
    width: 120px;
    min-height: 90px;
    max-height: 120px;
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

.range {
  width: 150px;
  display: inline-block;
  vertical-align: middle;
  margin-left: 10px;
  line-height: 10px;
}

.text-require {
  color: #FF6C60;
  font-weight: 700;
  margin-left: 3px;
}

.tag-table {
  .ivu-table {
    .ivu-table-body {
      .ivu-table-tbody {
        .ivu-table-row {
          td {
            .ivu-table-cell {
              padding-left: 5px;
              padding-right: 5px;
            }
          }
        }
      }
    }
  }
}

.del-item {
  color: red;
  margin-top: 20px;
  font-size: 15px;
  font-weight: 600;
}

.tag-search-detail{
  margin-top: 10px;
}

</style>
