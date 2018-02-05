<template>
  <div class="anchor-wrap">
    <div class="anchor-table-title">
      <span class="table-title">搜索操作</span>
    </div>
    <div class="anchor-search">
      <!--<Button type="default" icon="ios-search-strong" @click="searchAction">查询</Button>-->
      <div class="anchor-search-detail">
        <div class="anchor-search-item">
          <label for="uid">主播UID</label>
          <Input v-model="uidSearch" placeholder="请输入主播UID" class="anchor-item-model" id="uid"></Input>
        </div>
        <div class="anchor-search-item">
          <label for="realName">主播名称</label>
          <Input v-model="realNameSearch" placeholder="请输入主播名称" class="anchor-item-model" id="realName"></Input>
        </div>
        <div class="anchor-search-item">
          <label for="comment">备注</label>
          <Input v-model="commentSearch" placeholder="请输入备注信息" class="anchor-item-model" id="comment"></Input>
        </div>
        <Button type="primary" icon="ios-search-strong" @click="searchAnchor" style="margin-bottom:10px;margin-left:20px">搜索</Button>
      </div>
    </div>
    <div class="anchor-table-title">
      <span class="table-title">主播列表</span>
      <Button type="success" class="add-anchor-icon" icon="plus-round" @click="addAction">添加</Button>
    </div>
    <Table ref="table2" border :columns="columns" :data="anchorList" class="anchor-table"></Table>
    <div style="margin: 20px 10px 10px;overflow: hidden">
      <div style="float: right;">
        <Page :total="totalCount" :current="pageIndex" @on-change="changePage"></Page>
      </div>
    </div>
    <Modal v-model="modalAnchor" width="360" class-name="vertical-center-modal">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="information-circled"></Icon>
        <span>{{ tagTitle }}</span>
      </p>
      <div class="anchor-list-con">
        <div class="anchor-item">
          <label for="">主播UID<b class="text-require">*</b></label>
          <Input v-model="uid" placeholder="请输入主播UID" class="anchor-item-model" id=""></Input>
        </div>
        <div class="anchor-item">
          <label for="">主播名称<b class="text-require">*</b></label>
          <Input v-model="realName" placeholder="请输入主播名称" class="anchor-item-model" id=""></Input>
        </div>
        <div class="anchor-item">
          <label for="">备注</label>
          <Input v-model="comment" type="textarea" :rows="4" placeholder="请输入备注" class="anchor-item-model" id=""></Input>
        </div>
      </div>
      <div slot="footer">
        <Button type="primary" :loading="modal_loading" @click="handleSubmit">确定</Button>
        <Button type="default" @click="handleDismiss">取消</Button>
      </div>
    </Modal>
    <Modal v-model="modalDelAnchor" width="360" class-name="vertical-center-modal">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="information-circled"></Icon>
        <span>删除确认</span>
      </p>
      <div style="text-align:center">
        <p>是否确认删除此条标签信息？</p>
        <p class="del-item">{{ realName }}</p>
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
    name: 'anchorManage',
    data() {
      return {
        columns: [{
          title: '序号',
          key: 'index',
          width: 50,
          align: 'center',
          /*fixed: 'left'*/
        }, {
          title: '主播UID',
          key: 'uid',
          align: 'center',
          width: 100
        }, {
          title: '主播昵称',
          key: 'nickName',
          /*width: 160*/
        }, {
          title: '米汤号',
          key: 'meNumber',
          align: 'center',
          width: 120
        }, {
          title: '真实姓名',
          key: 'realName',
          align: 'center'
        }, {
          title: '备注',
          key: 'comment',
          align: 'center'
        }, {
          title: '操作',
          key: 'action',
          width: 120,
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
              }, '删除')
            ]);
          }
        }],
        uidSearch: undefined,
        realNameSearch: '',
        commentSearch: '',
        anchorList: [],
        id: null,
        uid: null,
        realName: '',
        comment: '',
        token: '',
        pageIndex: 1,
        pageSize: 10,
        totalCount: undefined,
        searchStatus: false,
        modalAnchor: false,
        modalDelAnchor: false,
        modal_loading: false,
        modifyOrAddAnchor: ''
      }
    },
    methods: {
      getToken () {
        this.token = JSON.parse(localStorage.getItem('token'));
        if (this.$route.params.index) {
          this.pageIndex = this.$route.params.index;
        }
      },
      getAnchorList (type) {
        let temData = [];
        let url;
        let httpData;
        if (type === 'get') {
          url = `/api/anchor/getAnchors?token=${this.token}&pageIndex=${this.pageIndex}&pageSize=${this.pageSize}`;
          httpData = this.$http.get(url);
        } else if (type === 'search') {
          url = `/api/anchor/getAnchorSearch`;
          let data = {
            token: this.token,
            pageIndex: this.pageIndex,
            pageSize: this.pageSize,
            uid: this.uidSearch,
            realName: this.realNameSearch,
            comment: this.commentSearch
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
                temData.push(item);
              })
              this.anchorList = temData;
              console.log("anchor list:", this.anchorList);
            } else {
              this.$Message.error(res.data.body.message);
            }
          }, err => {
            console.log(err.data);
          })
      },
      addAction () {
        this.modalAnchor = true;
        this.modifyOrAddAnchor = 'addAnchor';
        this.uid = null;
        this.realName = '';
        this.comment = '';
      },
      modifyAction (index) {
        this.modalAnchor = true;
        this.modifyOrAddAnchor = 'modifyAnchor';
        this.id = this.anchorList[index].id;
        this.uid = this.anchorList[index].uid;
        this.realName = this.anchorList[index].realName;
        this.comment = this.anchorList[index].comment;
      },
      removeAction (index) {
        this.modalDelAnchor = true;
        this.id = this.anchorList[index].id;
        console.log('del anchorId:', this.id);
      },
      handleDel () {
        this.modal_loading = true;
        setTimeout(() => {
          this.modal_loading = false;
          this.modalDelAnchor = false;
          this.deleteAnchor(this.id);
        }, 1500);
      },
      changePage(e) {
        console.log("change page info:", e);
        this.pageIndex = e;
        if (this.searchStatus) {
          this.getAnchorList('search');
        } else {
          this.getAnchorList('get');
        }

      },
      searchAction() {
        this.searchStatus = !this.searchStatus;
        if (!this.searchStatus) {
          this.getAnchorList('get');
        }
        // if (this.searchStatus) {
        //   this.parentTagList.splice(0,1,{parentTagId:-1,parentTagName:'全部'});
        // } else {
        //   this.parentTagList.splice(0,1,{parentTagId:0,parentTagName:'无'});
        // }
      },
      searchAnchor(e) {
        let pattern = /^\d{1,}$/;
        if (this.uidSearch && !pattern.test(this.uidSearch)) {
          this.$Message.error("uid必须为数字，请重新输入");
          return false;
        } else {
          this.searchStatus = true
          console.log("search anchor:", e);
          this.pageIndex = 1;
          this.getAnchorList('search');
        }
      },
      addAnchor(anchorData) {
        this.$http.post('/api/anchor/addAnchor', anchorData)
          .then(
            res => {
              if (res.data.status == 2000) {
                this.$Message.success('添加成功');
                if (this.searchStatus) {
                  this.getAnchorList('search');
                } else {
                  this.getAnchorList('get');
                }
                this.modalAnchor = false;
              } else {
                this.$Message.error(res.data.body.message);
                this.modalAnchor = true;
              }
            }, err => {
              console.log(err.data)
            })
      },
      modifyAnchor(anchorData) {
        this.$http.post('/api/anchor/updateAnchor', anchorData).then(
          res => {
            if (res.data.status == 2000) {
              console.log('add Anchor info:', res.data);
              this.$Message.success('修改成功');
              if (this.searchStatus) {
                this.getAnchorList('search');
              } else {
                this.getAnchorList('get');
              }
              this.modalAnchor = false;
              console.log("modified Anchor list:", this.tagList);
            } else {
              this.$Message.error(res.data.body.message);
              this.modalAnchor = true;
            }
          }, err => {
            console.log(err.data);
          })
      },
      deleteAnchor(id) {
        let data = { token: this.token, id: id };
        this.$http.post('/api/anchor/deleteAnchor', data)
          .then(
            res => {
              if (res.data.status == 2000) {
                this.$Message.success('删除成功');
                if (this.searchStatus) {
                  this.getAnchorList('search');
                } else {
                  this.getAnchorList('get');
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
        if (!this.uid || !this.realName) {
          this.$Message.error('请完善信息后提交');
          return false;
        } else {
          let pattern = /^\d{1,}$/;
          if (this.uid && !pattern.test(this.uid)) {
            this.$Message.error("uid必须为数字，请重新输入");
            return false;
          } else {
            this.modal_loading = true;
            setTimeout(() => {
              this.modal_loading = false;
              switch (this.modifyOrAddAnchor) {
                case 'modifyAnchor':
                  let data = {
                    token: this.token,
                    id: this.id,
                    uid: this.uid,
                    realName: this.realName,
                    comment: this.comment
                  }
                  console.log("modify Anchor:", data);
                  this.modifyAnchor(data);
                  break;
                case 'addAnchor':
                  let data2 = {
                    token: this.token,
                    uid: this.uid,
                    realName: this.realName,
                    comment: this.comment
                  }
                  console.log("add Anchor:", data2);
                  this.addAnchor(data2);
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
        this.modalAnchor = false;
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
      tagTitle: function() {
        if (this.modifyOrAddAnchor === 'modifyAnchor') {
          return "修改主播";
        } else if (this.modifyOrAddAnchor === 'addAnchor') {
          return "添加主播";
        }
      }
    },
    created() {
      this.getToken();
      this.getAnchorList('get');
    },
    watch: {
      // 如果路由有变化，会再次执行该方法
      '$route': function(route) {
        this.getAnchorList('get');
        this.searchStatus = false;
      }
    }
  }
</script>
<style scoped lang="less">
  .anchor-wrap {
    min-width:1050px;
    min-height:100%;
    border:10px solid #f0f0f0;
    border-bottom:none;
    padding-bottom: 15px;
    background: #ffffff;
    .anchor-search {
      background: #ffffff;
      padding:0 5px 5px;
      border-bottom:10px solid #f0f0f0;
      font-size: 16px;
      line-height: 24px;
      .anchor-search-detail {
        .anchor-search-item {
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
          .anchor-item-model {
            width: 180px;
            margin-left: 5px;
            text-align: left;
            vertical-align: middle;
          }
          .anchor-item-model-Count{
            width:100px ;
          }
        }
        .anchor-search-item+.anchor-search-item {
          // margin-left: 0;
        }
      }
    }
    .anchor-table-title {
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
      .add-anchor-icon {
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
  .anchor-list-con{
    text-align: left;
    margin-left:12px;
    .anchor-item {
      label {
        width: 80px;
        display: inline-block;
        vertical-align: middle;
        text-align: left;
      }
      .anchor-item-model {
        display: inline-block;
        width: 60%;
        vertical-align: middle;
        margin-left: 10px;
        .tag-item-check {
          width: 70px;
        }
      }
      .anchor-item-model-check{
        width: 400px;
      }
      .anchor-item-model:last {
        display: inline-block;
      }
    }
  }
  .anchor-item+.anchor-item {
    margin-top: 10px;
  }

  .anchor-img {
    display: inline-block;
    text-align: left;
    .anchor-img-pre {
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

  .anchor-search-detail{
    margin-top: 10px;
  }

</style>
