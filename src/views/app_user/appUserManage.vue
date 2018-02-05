<template>
  <div class="app-user-wrap">
    <div class="app-user-table-title">
      <span class="table-title">搜索操作</span>
    </div>
    <div class="app-user-search">
      <!--<Button type="default" icon="ios-search-strong" @click="searchAction">查询</Button>-->
      <div class="app-user-search-detail">
        <div class="app-user-search-item">
          <label for="user-phone">手机号</label>
          <!-- <InputNumber v-model="mobile" placeholder="请输入手机号" class="app-user-item-model" id="user-phone"></InputNumber> -->
          <Input v-model="mobile" placeholder="请输入手机号" class="app-user-item-model" id="user-phone"></Input>
          <!-- <input type="number" v-model="mobile" placeholder="请输入手机号" class="app-user-item-number" id="user-phone"> -->
        </div>
        <div class="app-user-search-item">
          <label for="user-nick">昵称</label>
          <Input v-model="nickName" placeholder="请输入昵称" class="app-user-item-model" id="user-nick"></Input>
        </div>
        <div class="app-user-search-item">
          <label for="user-meNumber">Me号</label>
          <!-- <InputNumber v-model="meNumber" placeholder="请输入Me号" class="app-user-item-model" id="user-meNumber"></InputNumber> -->
          <!-- <input type="number" v-model="meNumber" placeholder="请输入Me号" id="user-meNumber" class="app-user-item-number"> -->
          <Input v-model="meNumber" placeholder="请输入Me号" class="app-user-item-model" id="user-meNumber"></Input>
        </div>
        <div class="app-user-search-item">
          <label for="">是否大V</label>
          <Select v-model="isV" style="width:100px;text-align:left;vertical-align:middle;margin-left:5px;" class="app-user-search-model">
            <Option :value="-1">全部</Option>
            <Option v-for="item in isVData" :value="item.id" :key="item.id">{{ item.type }}</Option>
          </Select>
        </div>
        <div class="app-user-search-item">
          <label for="">创建时间</label>
          <DatePicker v-model="createdBegin" :editable="false" :clearable="false" type="datetime" placeholder="点击选择时间" style="width: 160px;margin-left:5px;"></DatePicker> -
          <DatePicker v-model="createdEnd"  :editable="false" :clearable="false" type="datetime" placeholder="点击选择时间" style="width: 160px;"></DatePicker>
        </div>
        <div class="app-user-search-item">
          <label for="">状态</label>
          <Select v-model="status" style="width:100px;text-align:left;vertical-align:middle;margin-left:5px;" class="app-user-search-model">
            <Option :value="-1">全部</Option>
            <Option v-for="item in statusData" :value="item.id" :key="item.id">{{ item.type }}</Option>
          </Select>
        </div>
        <div class="app-user-search-item">
          <label for="">是否运营邀请</label>
          <Select v-model="isInvited" style="width:100px;text-align:left;vertical-align:middle;margin-left:5px;" class="app-user-search-model">
            <Option :value="-1">全部</Option>
            <Option v-for="item in isInviteData" :value="item.id" :key="item.id">{{ item.type }}</Option>
          </Select>
        </div>
        <div class="app-user-search-item">
          <label for="">注册渠道</label>
          <Select v-model="registerChannelSearch" style="width:100px;text-align:left;vertical-align:middle;margin-left:5px;" class="app-user-search-model">
            <Option :value="-1">全部</Option>
            <Option v-for="item in registerChannelData" :value="item.code" :key="item.id">{{ item.channelName }}</Option>
          </Select>
        </div>
        <Button type="primary" icon="ios-search-strong" @click="searchAppUser" style="margin-bottom:10px;margin-left:20px">搜索</Button>
      </div>
    </div>
    <div class="app-user-table-title">
      <span class="table-title">用户列表</span>
      <Button type="success" class="add-user-icon" icon="plus-round" @click="addAction" title="添加马甲号">添加</Button>
    </div>
    <Table refs="userTable" border :columns="columns" :data="appUserList" class="user-table" :loading="loading"></Table>
    <div style="margin: 20px 10px 10px;overflow: hidden">
      <div style="float: right;">
        <Page :total="totalCount" :current="pageIndex" @on-change="changePage"></Page>
      </div>
    </div>
    <Modal v-model="modalLevel" width="480" class-name="vertical-center-modal">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="information-circled"></Icon>
        <span>修改用户等级</span>
      </p>
      <div style="text-align:center;">
        <div class="app-user-item">
          <label for="user-name">用户昵称</label>
          <Input v-model="userNick" placeholder="用户昵称" class="app-user-item-model" id="user-name" disabled></Input>
        </div>
        <div class="app-user-item">
          <label for="user-level">当前等级</label>
          <Input v-model="originLevel" placeholder="当前等级" class="app-user-item-model" id="user-level" disabled></Input>
        </div>
        <div class="app-user-item">
          <label for="user-newLevel">新等级</label>
          <Input v-model="newLevel" placeholder="请输入新等级" class="app-user-item-model" id="user-newLevel"></Input>
        </div>
      </div>
      <div slot="footer">
        <Button type="primary" :loading="modal_loading" @click="handleSubmit">确定</Button>
        <Button type="default" @click="handleDismiss('level')">取消</Button>
      </div>
    </Modal>
    <Modal v-model="modalRobot" width="480" id="appUser" class-name="vertical-center-modal">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="information-circled"></Icon>
        <span>添加马甲号</span>
      </p>
      <div style="text-align:center">
        <div class="app-user-item">
          <label for="robot-phone">手机号初始段<b class="text-require">*</b></label>
          <Input v-model="phoneBegin" placeholder="请输入手机号码初始段" class="app-user-item-model" id="robot-phone"></Input>
          <!-- <input type="number" v-model="phoneBegin" placeholder="请输入手机号码初始段" class="app-user-item-model app-user-item-number" id="robot-phone"> -->
        </div>
        <div class="app-user-item">
          <label for="robot-count">生成个数<b class="text-require">*</b></label>
          <Input v-model="creatCount" placeholder="请输入生成个数" class="app-user-item-model" id="robot-count"></Input>
          <!-- <input type="number" v-model="creatCount" placeholder="请输入生成个数" class="app-user-item-model app-user-item-number" id="robot-count"> -->
        </div>
        <div class="app-user-item">
          <label for="robot-password">初始密码<b class="text-require">*</b></label>
          <Input v-model="originPassword" placeholder="请输入初始密码" class="app-user-item-model" id="robot-password"></Input>
        </div>
      </div>
      <div slot="footer">
        <Button type="primary" :loading="modal_loading" @click="handleSubmit">确定</Button>
        <Button type="default" @click="handleDismiss('robot')">取消</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import uploadImg from '@/components/uploadImg.vue'

export default {
  name: 'appUserManage',
  components: {
    uploadImg
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
        title: 'UID',
        key: 'uid',
        align: 'center',
        width: 70,
        /*fixed: 'left'*/
      }, {
        title: 'Me号',
        key: 'meNumber',
        align: 'center',
        width: 90
      }, {
        title: '手机',
        key: 'mobile',
        width: 100,
        align: 'center'
      }, {
        title: '昵称',
        key: 'nickName',
        /*width: 130,*/
        align: 'center'
      }, {
        title: '是否运营邀请',
        key: 'isInvited',
        align: 'center',
        width: 100,
        render: (h, params) => {
          const row = params.row;
          const inviteName = row.isInvited === 0 ? "否" : row.isInvited === 1 ? "是" : '';
          return h('span', inviteName);
        }
      }, {
        title: '是否大V',
        key: 'isV',
        align: 'center',
        width: 70,
        render: (h, params) => {
          const row = params.row;
          const isVName = row.isV === 0 ? "否" : row.isV === 1 ? "是" : '';
          return h('span', isVName);
        }
      }, {
        title: '等级',
        key: 'level',
        align: 'center',
        width: 50
      }, {
        title: '状态',
        key: 'status',
        align: 'center',
        width: 65,
        render: (h, params) => {
          const row = params.row;
          const statusName = row.status === 0 ? "正常" : row.status === 1 ? "封号" : '';
          return h('span', statusName);
        }
      }, {
        title: '是否禁言',
        key: 'silentStatus',
        align: 'center',
        width: 70,
        render: (h, params) => {
          const row = params.row;
          const silentName = row.silentStatus === 0 ? "否" : row.silentStatus === 1 ? "禁言" : '';
          return h('span', silentName);
        }
      }, {
        title: '注册渠道',
        key: 'registerChannel',
        align: 'center',
        width: 85,
        render: (h, params) => {
          const row = params.row;
          if (row.registerChannel) {
            return h('span', row.registerChannel);
          } else {
            return h('span', '暂无数据');
          }
        }
      }, {
        title: '注册版本',
        key: 'registerVersion',
        align: 'center',
        width: 100,
        render: (h, params) => {
          const row = params.row;
          if (row.registerVersion) {
            return h('span', row.registerVersion);
          } else {
            return h('span', '暂无数据');
          }
        }
      }, {
        title: '注册时间',
        key: 'registerTime',
        align: 'center',
        width: 140
      }, {
        title: '最近操作时间',
        key: 'lastOptAt',
        align: 'center',
        width: 120
      }, {
        title: '操作',
        key: 'action',
        width: 250,
        // align: 'center',
        /*fixed: 'right',*/
        render: (h, params) => {
          const row = params.row;
          const isVName = row.isV === 0 ? "上大V" : row.isV === 1 ? "取消大V" : '';
          const silentName = row.silentStatus === 0 ? "禁言" : row.silentStatus === 1 ? "不禁言" : '';
          const statusName = row.status === 0 ? "封号" : row.status === 1 ? "恢复" : '';
          const inviteName = row.isInvited === 0 ? "设置邀请" : row.isInvited === 1 ? "取消邀请" : '';
          return h('div', [
            h('Button', {
              props: {
                type: 'info',
                size: 'small'
              },
              style: {
                marginRight: '5px',
                // marginBottom: '5px',
                marginTop: '5px'
              },
              on: {
                click: () => {
                  this.setVAction(params)
                }
              }
            }, isVName),
            h('Button', {
              props: {
                type: 'error',
                size: 'small'
              },
              style: {
                marginRight: '5px',
                // marginBottom: '5px',
                marginTop: '5px'
              },
              on: {
                click: () => {
                  this.setSilentAction(params)
                }
              }
            }, silentName),
            h('Button', {
              props: {
                type: 'error',
                size: 'small'
              },
              style: {
                marginRight: '5px',
                // marginBottom: '5px',
                marginTop: '5px'
              },
              on: {
                click: () => {
                  this.setStatusAction(params)
                }
              }
            }, statusName),
            h('Button', {
              props: {
                type: 'primary',
                size: 'small'
              },
              style: {
                marginRight: '5px',
                // marginBottom: '5px',
                marginTop: '5px'
              },
              on: {
                click: () => {
                  this.openContentAction(params.index)
                }
              }
            }, '查看内容'),
            h('Button', {
              props: {
                type: 'info',
                size: 'small'
              },
              style: {
                marginRight: '5px',
                marginBottom: '5px',
                marginTop: '5px'
              },
              on: {
                click: () => {
                  this.setLevelAction(params.index)
                }
              }
            }, '修改等级'),
            h('Button', {
              props: {
                type: 'primary',
                size: 'small'
              },
              style: {
                marginRight: '5px',
                marginBottom: '5px',
                marginTop: '5px'
              },
              on: {
                click: () => {
                  this.setInviteAction(params)
                }
              }
            }, inviteName)
          ]);
        }
      }],
      mobile: null,
      nickName: null,
      meNumber: null,
      createdBegin: null,
      createdEnd: null,
      status: -1,
      isInvited: -1,
      isV: -1,
      loading: true,
      modalLevel: false,
      modal_loading: false,
      searchStatus: false,
      userNick: null,
      originLevel: null,
      registerChannelData: [],
      registerChannelSearch: -1,
      newLevel: null,
      uid: null,
      selectedIndex: null,
      appUserList: [],
      totalCount: null,
      pageIndex: 1,
      pageSize: 10,
      modalRobot: false,
      phoneBegin: null,
      creatCount: null,
      originPassword: null
    }
  },
  methods: {
    getToken () {
      this.token = JSON.parse(localStorage.getItem('token'));
      if (this.$route.params.index) {
        this.pageIndex = this.$route.params.index;
      }
    },
    // 列表接口
    getAllAppUserList (type) {
      let temData = [];
      let url;
      let httpData;
      if (type === 'get') {
        url = `/api/appuser/getAllAppUsers?token=${this.token}&pageIndex=${this.pageIndex}&pageSize=${this.pageSize}`;
        httpData = this.$http.get(url);
      } else if (type === 'search') {
        url = `/api/appuser/getAppUserSearch`;
        let data = {
          token: this.token,
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
          meNumber: this.meNumber,
          mobile: this.mobile,
          nickName: this.nickName,
          isInvited: this.isInvited,
          isV: this.isV,
          status: this.status,
          createdBegin: new Date(this.createdBegin).getTime(),
          createdEnd: new Date(this.createdEnd).getTime(),
          registerChannelCode: this.registerChannelSearch
        }
        if (data.createdEnd && data.createdEnd < data.createdBegin) {
          this.$Message.error("创建时间结束时间应大于开始时间，请重新输入");
          this.loading = false;
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
              item.registerTime = this.formateDate(item.registerTime);
              if(item.lastOptAt == null){
                item.lastOptAt = '暂无数据';
              }else{
                item.lastOptAt = this.formateDate(item.lastOptAt);
              }
              temData.push(item);
            })
            this.appUserList = temData;
            this.loading = false;
            console.log("tag list:", this.appUserList);
          } else {
            this.$Message.error(res.data.body.message);
          }
        }, err => {
          console.log(err.data);
        })
    },
    getUsersRegisterChannel() {
      this.$http.post(`/api/appuser/getUsersRegisterChannel?token=${this.token}`)
        .then(
          res => {
            if (res.data.status == 2000) {
              this.registerChannelData = res.data.body;
              console.log("usersRegisterChannel list:", this.registerChannelData);
            } else {
              this.$Message.error(res.data.body.message);
            }
          }, err => {
            console.log(err.data)
          })
    },
    // 添加用户
    addAction () {
      this.modalRobot = true;
      this.phoneBegin = null;
      this.creatCount = null;
      this.originPassword = null;
    },
    // 设置大V
    setVAction (params) {
      let index = params.index;
      this.uid = this.appUserList[index].uid;
      this.selectedIndex = index;
      let isV = params.row.isV === 0 ? 1 : params.row.isV === 1 ? 0 : null;
      let data = {
        token: this.token,
        uid: this.uid,
        isV: isV
      }
      this.$http.post('/api/appuser/setUserV', data)
        .then(
          res => {
            if (res.data.status == 2000) {
              this.$Message.success('更改成功');
              this.appUserList.map(item => {
                if (item.uid === data.uid) {
                  item.isV = data.isV;
                }
              })
            } else {
              this.$Message.error(res.data.body.message);
            }
          }, err => {
            console.log(err.data)
          })
    },
    // 设置封号状态
    setSilentAction (params) {
      let index = params.index;
      this.uid = this.appUserList[index].uid;
      this.selectedIndex = index;
      let silentStatus = params.row.silentStatus === 0 ? 1 : params.row.silentStatus === 1 ? 0 : null;
      let data = {
        token: this.token,
        uid: this.uid,
        silentStatus: silentStatus
      }
      this.$http.post('/api/appuser/setUserSilentStatus', data)
        .then(
          res => {
            if (res.data.status == 2000) {
              this.$Message.success('更改成功');
              this.appUserList.map(item => {
                if (item.uid === data.uid) {
                  item.silentStatus = data.silentStatus;
                }
              })
            } else {
              this.$Message.error(res.data.body.message);
            }
          }, err => {
            console.log(err.data)
          })
    },
    // 设置禁言状态
    setStatusAction (params) {
      let index = params.index;
      this.uid = this.appUserList[index].uid;
      this.selectedIndex = index;
      let status = params.row.status === 0 ? 1 : params.row.status === 1 ? 0 : null;
      let data = {
        token: this.token,
        uid: this.uid,
        status: status
      }
      this.$http.post('/api/appuser/setUserStatus', data)
        .then(
          res => {
            if (res.data.status == 2000) {
              this.$Message.success('更改成功');
              this.appUserList.map(item => {
                if (item.uid === data.uid) {
                  item.status = data.status;
                }
              })
            } else {
              this.$Message.error(res.data.body.message);
            }
          }, err => {
            console.log(err.data)
          })
    },
    // 设置邀请
    setInviteAction (params) {
      let index = params.index;
      this.uid = this.appUserList[index].uid;
      this.selectedIndex = index;
      let isInvited = params.row.isInvited === 0 ? 1 : params.row.isInvited === 1 ? 0 : null;
      let data = {
        token: this.token,
        uid: this.uid,
        isInvited: isInvited
      }
      this.$http.post('/api/appuser/setUserInviteStatus', data)
        .then(
          res => {
            if (res.data.status == 2000) {
              this.$Message.success('更改成功');
              this.appUserList.map(item => {
                if (item.uid === data.uid) {
                  item.isInvited = data.isInvited;
                }
              })
            } else {
              this.$Message.error(res.data.body.message);
            }
          }, err => {
            console.log(err.data)
          })
    },
    // 修改等级
    setLevelAction (index) {
      this.modalLevel = true;
      this.uid = this.appUserList[index].uid;
      this.selectedIndex = index;
      this.userNick = this.appUserList[index].nickName;
      this.originLevel = this.appUserList[index].level;
    },
    // 查看内容
    openContentAction (index) {
      console.log("tag index:", index);
      let uid = this.appUserList[index].uid;
      this.$router.push({ name: 'app-user-content', params: { id: uid, index: this.pageIndex} });
    },
    // 分页
    changePage (e) {
      console.log("change page info:", e);
      this.pageIndex = e;
      this.loading = true;
      if (this.searchStatus) {
        this.getAllAppUserList('search');
      } else {
        this.getAllAppUserList('get');
      }
    },
    // 查询按钮打开查询面板 已弃用
    searchAction () {
      this.searchStatus = !this.searchStatus;
      if (!this.searchStatus) {
        this.loading = true;
        this.getAllAppUserList('get');
      }
    },
    // 搜索
    searchAppUser (e) {
      let pattern2 = /^\d{0,20}$/;
      let pattern3 = /^\d{1,}$/;
      if (this.mobile && !pattern3.test(this.mobile)) {
        this.$Message.error("手机号码必须为数字，请重新输入");
        // this.mobile = null;
        return false;
      } else if (this.meNumber && !pattern2.test(this.meNumber)) {
        this.$Message.error("米汤号码必须为数字，且小于20位数字，请重新输入");
        // this.meNumber = null;
        return false;
      } else {
        this.searchStatus = true;
        console.log("search tag:", e);
        this.pageIndex = 1;
        this.loading = true;
        this.getAllAppUserList('search');
      }
    },

    updateUserLevel (userData) {
      this.$http.post('/api/appuser/updateUserLevel', userData)
        .then(
          res => {
            if (res.data.status == 2000) {
              this.$Message.success('更改成功');
              this.modalLevel = false;
              this.appUserList.map(item => {
                if (item.uid === userData.uid) {
                  item.level = userData.newLevel;
                }
              })
            } else {
              this.$Message.error(res.data.body.message);
              this.modalLevel = true;
            }
          }, err => {
            console.log(err.data)
          })
    },
    addRobots (robotData) {
      this.$http.post('/api/appuser/addRobot', robotData)
        .then(
          res => {
            if (res.data.status == 2000) {
              this.$Message.success('更改成功');
              if (this.searchStatus) {
                this.getAllAppUserList('search');
              } else {
                this.getAllAppUserList('get');
              }
              this.modalRobot = false;
            } else {
              this.$Message.error(res.data.body.message);
              this.modalRobot = true;
            }
          }, err => {
            console.log(err.data)
          })
    },
    handleSubmit () {
      if (this.modalLevel) {
        if (!this.newLevel) {
          this.$Message.error('请完善信息后提交');
        } else {
          let pattern3 = /^\d{1,}$/;
          if (!pattern3.test(this.newLevel)) {
            this.$Message.error("等级必须为数字，请重新输入");
            this.newLevel = null;
            return false;
          } else {
            this.modal_loading = true;
            setTimeout(() => {
              this.modal_loading = false;

              let data = {
                token: this.token,
                uid: this.uid,
                newLevel: this.newLevel
              }
              this.updateUserLevel(data);
            }, 1500)
          }
        }
      } else if (this.modalRobot) {
        if (!this.phoneBegin || !this.creatCount || !this.originPassword) {
          this.$Message.error('请完善信息后提交');
        } else {
          let pattern3 = /^\d{1,}$/;
          let pattern = /^\d{1,11}$/;
          if (this.phoneBegin && !pattern3.test(this.phoneBegin)) {
            this.$Message.error("手机号初始段必须为数字，请重新输入");
            return false;
          } else if (this.creatCount && !pattern3.test(this.creatCount)) {
            this.$Message.error("生成个数必须为数字，请重新输入");
            return false;
          } else if (this.creatCount && this.creatCount < 1) {
            this.$Message.error("生成个数必须大于1，请重新输入");
            return false;
          } else {
            this.modal_loading = true;
            setTimeout(() => {
              this.modal_loading = false;

              let data2 = {
                token: this.token,
                phoneBegin: this.phoneBegin,
                creatCount: this.creatCount,
                originPassword: this.originPassword
              }
              this.addRobots(data2);
            }, 1500)
          }
        }
      }
    },
    handleDismiss (type) {
      this.modal_loading = false;
      if (type === 'robot') {
        this.modalRobot = false;
      } else if (type === 'level') {
        this.modalLevel = false;
      }

    },
    // 日期格式化
    formateDate (data) {
      let date = new Date(data);
      let year = date.getFullYear();
      let month = date.getMonth() < 9 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
      let day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
      let hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
      let minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
      let seconds = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
      return `${year}-${month}-${day} ${hour}:${minutes}:${seconds}`
    }

  },
  computed: {
    isVData: function () {
      let data = [{ id: 0, type: '否' }, { id: 1, type: '是' }];
      return data;
    },
    isInviteData: function () {
      let data = [{ id: 0, type: '否' }, { id: 1, type: '是' }];
      return data;
    },
    statusData: function () {
      let data = [{ id: 0, type: '正常' }, { id: 1, type: '禁用' }];
      return data;
    }
  },
  created () {
    this.getToken();
    this.getAllAppUserList('get');
    this.getUsersRegisterChannel();
  },
  watch: {
    // 如果路由有变化，会再次执行该方法
    '$route': function (route) {
      this.getAllAppUserList('get');
      this.getUsersRegisterChannel();
      this.searchStatus = false;
    }
  }
}
</script>
<style scoped lang="less">
.app-user-wrap {
  min-width: 1560px;
  min-height:100%;
  border:10px solid #f0f0f0;
  border-bottom:none;
  padding-bottom: 15px;
  background: #ffffff;
  .app-user-search {
    background: #ffffff;
    font-size: 16px;
    line-height: 24px;
    border-bottom:10px solid #f0f0f0;
    padding:0 5px 5px;
    .app-user-search-detail {
      margin-top: 10px;
      .app-user-search-item {
        display: inline-block; // width: 240px;
        vertical-align: middle;
        margin-left: 15px;
        margin-bottom: 10px;
        label {
          display: inline-block;
          vertical-align: middle;
          font-size: 12px;
        }
        .app-user-item-model {
          width: 180px;
          margin-left: 5px;
          text-align: left;
          vertical-align: middle;
        }
      }
      .app-user-search-item+.app-user-search-item {
        // margin-left: 0;
      }
    }
  }
  .app-user-table-title {
    background: #ffffff;
    border-bottom: 1px solid #f0f0f0;
    padding:10px 5px 5px;
    margin-bottom: 10px;
    overflow: hidden;
    font-size: 16px;
    .table-title{
      display: inline-block;
      vertical-align: middle;
    }
    .add-user-icon {
      /*float: right;*/
      display: inline-block;
      vertical-align: middle;
      padding: 0;
      width: 60px;
      line-height: 26px;
      margin-left: 20px;
    }
  }
}

.app-user-item {
  label {
    width: 120px;
    display: inline-block;
    vertical-align: middle;
    text-align: left;
  }
  .app-user-item-model {
    display: inline-block;
    width: 65%;
    vertical-align: middle;
    margin-left: 10px;
    .app-user-item-check {
      width: 70px;
    }
  }
  .app-user-item-model:last {
    display: inline-block;
  }
}

.app-user-item+.app-user-item {
  margin-top: 10px;
}

.text-require {
  color: #FF6C60;
  font-weight: 700;
  margin-left: 3px;
}

.user-table {
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

.text-require {
  color: #FF6C60;
  font-weight: 700;
  margin-left: 3px;
}

.app-user-item-number {
  display: inline-block;
  width: 180px;
  height: 32px;
  line-height: 1.5;
  padding: 4px 7px;
  font-size: 12px;
  border: 1px solid #dddee1;
  border-radius: 4px;
  color: #495060;
  background-color: #fff;
  background-image: none;
  position: relative;
  cursor: text;
  transition: border .2s ease-in-out, background .2s ease-in-out, box-shadow .2s ease-in-out, -webkit-box-shadow .2s ease-in-out;
  &:hover {
    border-color: #57a3f3;
  }
  &:focus {
    border-color: #57a3f3;
    outline: 0;
    -webkit-box-shadow: 0 0 0 2px rgba(45, 140, 240, .2);
    box-shadow: 0 0 0 2px rgba(45, 140, 240, .2);
  }
}
</style>
