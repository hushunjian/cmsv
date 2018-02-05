<template>
  <div class="app-content-wrap">
    <div>
      <div class="app-content-table-title">
        王国列表
        <Button type="primary" icon="arrow-return-left" @click="backToAction" class="app-content-button-item">返回</Button>
      </div>
      <Table refs="table2" border :columns="kingdomColumns" :data="userKingdomList" class="tag-table"></Table>
      <div style="margin: 20px 10px 10px;overflow: hidden">
        <div style="float: right;">
          <Page :total="totalCount" :current="pageIndex" @on-change="changePage"></Page>
        </div>
      </div>
    </div>
    <div>
      <div class="app-content-table-title">
        王国发言/评论列表
        <Button type="primary" icon="arrow-return-left" @click="backToAction" class="app-content-button-item">返回</Button>
      </div>
      <Table refs="table2" border :columns="fragmentColumns" :data="userFragmentList" class="tag-table"></Table>
      <div style="margin: 20px 10px 10px;overflow: hidden">
        <div style="float: right;">
          <Page :total="totalCount2" :current="pageIndex2" @on-change="changePage2"></Page>
        </div>
      </div>
    </div>
    <Modal v-model="modalRemove" width="360">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="information-circled"></Icon>
        <span>删除确认</span>
      </p>
      <div style="text-align:center">
        <p v-if="delStatus === 'kingdom'">是否确认删除此王国？</p>
        <p v-if="delStatus === 'fragment'">是否确认删除此发言/评论？</p>
        <p class="del-item">{{ selectedTitle }}</p>
        <p style="color:red;font-weight:600;margin-top:20px;">谨慎操作，此操作会删除数据（物理删除），不可恢复！</p>
      </div>
      <div slot="footer">
        <Button type="error" size="large" long :loading="modal_loading" @click="handleDel">删除</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
export default {
  name: 'tagManage',
  data() {
    return {
      kingdomColumns: [{
        title: '标题',
        key: 'title',
        align: 'center'
      }, {
        title: '核心圈',
        key: 'coreCircle',
        /*width: 150*/
      }, {
        title: '创建时间',
        key: 'createdAt',
        width: 160,
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
              style: {
                marginRight: '5px'
              },
              on: {
                click: () => {
                  this.removeAction(params)
                }
              }
            }, '删除')
          ]);
        }
      }],
      fragmentColumns: [{
        title: '王国ID',
        key: 'topicId',
        align: 'center',
        width: 80
      }, {
        title: '内容类型',
        key: 'contentType',
        width: 80,
        render: (h, params) => {
          const row = params.row;
          let contentName;
          switch(row.contentType) {
            case 1:
              contentName = "图片";
              break;
            case 2:
              contentName = "文字";
              break;
            case 12:
              contentName = "视频";
              break;
            case 14:
              contentName = "红包";
              break;
            case 17:
            case 18:
            case 20:
              contentName = "表情";
              break;
            case 23:
              contentName = "图文";
              break;
            case 24:
              contentName = "礼物";
              break;
            case 70:
            case 71:
            case 72:
            case 73:
            case 74:
              contentName = "链接";
              break;
            default:
              contentName = "其他";
          }
          return h('span', contentName);
        }
      }, {
        title: '发言/评论',
        key: 'fragment',
        align: 'center'
      }, {
        title: '类型',
        key: 'type',
        /*width: 100,*/
        align: 'center',
        render: (h, params) => {
          const row = params.row;
          let typeName;
          switch (row.type) {
            case 0:
              typeName = "主播发言";
              break;
            case 1:
              typeName = "粉丝回复";
              break;
            case 3:
              typeName = "主播贴标";
              break;
            case 4:
              typeName = "粉丝贴标";
              break;
            case 5:
              typeName = "点赞";
              break;
            case 6:
              typeName = "订阅";
              break;
            case 7:
              typeName = "分享";
              break;
            case 8:
              typeName = "关注";
              break;
            case 9:
              typeName = "邀请";
              break;
            case 10:
              typeName = "有人@";
              break;
            case 11:
              typeName = "主播@";
              break;
            case 12:
              typeName = "视频";
              break;
            case 13:
              typeName = "语音";
              break;
            case 14:
              typeName = "国王收红包";
              break;
            case 15:
              typeName = "核心圈";
              break;
            case 52:
              typeName = "表情";
              break;
            case 51:
            case 57:
              typeName = "礼物";
              break;
            case 55:
            case 56:
            case 58:
              typeName = "链接";
              break;
            default:
              typeName = "其他";
              break;
          }
          return h('span', typeName);
        }
      }, {
        title: '创建时间',
        key: 'createdAt',
        width: 160,
        align: 'center'
      }, {
        title: '状态',
        key: 'status',
        width: 70,
        align: 'center',
        render: (h, params) => {
          const row = params.row;
          const statusName = row.status === 1 ? "正常" : row.status === 0 ? "删除" : '';
          return h('span', statusName);
        }
      }, {
        title: '操作',
        key: 'action',
        width: 70,
        align: 'center',
        render: (h, params) => {
          const row = params.row;
          const name = row.status === 1 ? "删除" : row.status === 0 ? "" : '';
          if (row.status === 1) {
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
                    if (row.status === 1) {
                      this.removeAction(params);
                    }
                  }
                }
              }, name)
            ]);
          } else {
            return h('div', [
              h('div', {
                props: {
                  type: 'error',
                  size: 'small',
                },
                style: {
                  marginRight: '5px',
                  cursor: 'pointer',
                },
                on: {
                  click: () => {
                    if (row.status === 1) {
                      this.removeAction(params);
                    }
                  }
                }
              }, name)
            ]);
          }

        }
      }],
      token: '',
      pageIndex: 1,
      pageIndex2: 1,
      pageSize: 10,
      totalCount: null,
      totalCount2: null,
      userKingdomList: [],
      userFragmentList: [],
      uid: null,
      modalRemove: false,
      delStatus: '',
      selectedTitle: '',
      id: null,
      topicId: null,
      selectedIndex: null,
      modal_loading: false,
      index: null
    }
  },
  methods: {
    getToken() {
      this.token = JSON.parse(localStorage.getItem('token'));
      this.index = this.$route.params.index;
    },
    getAlluserKingdomList() {
      this.uid = this.$route.params.id;
      let temData = [];
      this.$http.get(`/api/appuser/getUserKingdomContent?token=${this.token}&pageIndex=${this.pageIndex}&pageSize=${this.pageSize}&uid=${this.uid}`).then(
        res => {
          if (res.data.status == 2000) {
            this.totalCount = res.data.body.total;
            res.data.body.data.map(item => {
              item.createdAt = this.formateDate(item.createdAt);
              temData.push(item);
            })
            this.userKingdomList = temData;
            console.log("userKingdom list:", this.userKingdomList);
          } else {
            this.$Message.error(res.data.body.message);
          }
        }, err => {
          console.log(err.data);
        })
    },
    getAlluserFragmentList() {
      let temData = [];
      this.$http.get(`/api/appuser/getUserFragmentContent?token=${this.token}&pageIndex=${this.pageIndex2}&pageSize=${this.pageSize}&uid=${this.uid}`).then(
        res => {
          if (res.data.status == 2000) {
            this.totalCount2 = res.data.body.total;
            res.data.body.data.map(item => {
              item.createdAt = this.formateDate(item.createdAt);
              temData.push(item);
            })
            this.userFragmentList = temData;
            console.log("userFragment list:", this.userFragmentList);
          } else {
            this.$Message.error(res.data.body.message);
          }
        }, err => {
          console.log(err.data);
        })
    },
    backToAction() {
      // this.$router.go(-1);
      this.$router.push({ name: 'app-user-manager',params:{index: this.index}});
    },
    changePage(e) {
      console.log("page change1:", e);
      this.pageIndex = e;
      this.getAlluserKingdomList();
    },
    changePage2(e) {
      console.log("page change2:", e);
      this.pageIndex2 = e;
      this.getAlluserFragmentList();
    },
    removeAction(params) {
      this.modalRemove = true;
      this.selectedIndex = params.index;
      let row = params.row;
      if (row.hasOwnProperty('fragment')) {
        this.id = row.id;
        this.delStatus = "fragment";
        this.selectedTitle = row.fragment;
      } else {
        // this.topicId = row.topicId;
        this.id = row.id;
        this.delStatus = "kingdom";
        this.selectedTitle = row.title;
      }
    },

    handleDel() {
      this.modal_loading = true;
      setTimeout(() => {
        this.modal_loading = false;

        switch (this.delStatus) {
          case 'fragment':
            let data = {
              token: this.token,
              id: this.id,
              // uid: this.uid
            }
            this.delUserFragmentContent(data);
            break;
          case 'kingdom':
            let data2 = {
              token: this.token,
              // topicId: this.topicId,
              id: this.id,
              // uid: this.uid
            }
            this.delUserKingdomContent(data2);
            break;
        }
      })
    },
    delUserKingdomContent(kingdomData) {
      this.$http.post('/api/appuser/deleteUserKingdomContent', kingdomData)
        .then(
          res => {
            if (res.data.status == 2000) {
              this.$Message.success('删除成功');
              this.modalRemove = false;
              this.userKingdomList.splice(this.selectedIndex, 1);
            } else {
              this.$Message.error(res.data.body);
              this.modalRemove = true;
            }
          }, err => {
            console.log(err.data)
          })
    },
    delUserFragmentContent(fragmentData) {
      this.$http.post('/api/appuser/deleteUserFragmentContent', fragmentData)
        .then(
          res => {
            if (res.data.status == 2000) {
              this.$Message.success('删除成功');
              this.modalRemove = false;
              this.userFragmentList.map(item => {
                if (item.id === fragmentData.id) {
                  item.status = 0;
                }
              })
              // this.userFragmentList.splice(this.selectedIndex, 1);
            } else {
              this.$Message.error(res.data.body);
              this.modalRemove = true;
            }
          }, err => {
            console.log(err.data)
          })
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
  computed: {},
  created() {
    this.getToken();
    this.getAlluserKingdomList();
    this.getAlluserFragmentList();
  },
  watch: {
    // 如果路由有变化，会再次执行该方法
    '$route': function(route) {
      this.getAlluserKingdomList();
      this.getAlluserFragmentList();
    },
  }
}

</script>
<style scoped lang="less">
.app-content-wrap {
  min-width: 780px;
  min-height:100%;
  border:10px solid #f0f0f0;
  border-bottom:none;
  padding-bottom: 15px;
  background: #ffffff;
  .app-content-table-title {
    background: #ffffff;
    border-bottom: 1px solid #f0f0f0;
    padding: 5px;
    margin-bottom: 10px;
    overflow: hidden;
    font-size: 16px;
    line-height: 24px;
    .add-tag-icon {
      float: right;
      padding: 0;
      width: 60px;
      line-height: 24px;
    }
  }
}

.app-content-button-item {
  float: right;
  padding: 0;
  width: 60px;
  line-height: 24px;
}

.tag-item {
  label {
    width: 120px;
    display: inline-block;
    vertical-align: middle;
    text-align: left;
  }
  .tag-item-model {
    display: inline-block;
    width: 65%;
    vertical-align: middle;
    margin-left: 10px;
    .tag-item-check {
      width: 70px;
    }
  }
  .tag-item-model:last {
    display: inline-block;
  }
}

.tag-item+.tag-item {
  margin-top: 10px;
}

.tag-img {
  display: inline-block;
  text-align: left;
  .tag-img-pre {
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

</style>
