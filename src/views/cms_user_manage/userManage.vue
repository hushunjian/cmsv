<template>
  <div class="user-wrap">
    <div class="user-table-title">
      <span class="table-title">用户列表</span>
      <Button type="success" class="add-user-icon" icon="plus-round" @click="addAction">添加</Button>
    </div>
    <Table refs="table1" border :columns="columns" :data="list"></Table>
    <Modal v-model="modalDelUser" width="360" class-name="vertical-center-modal">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="information-circled"></Icon>
        <span>删除确认</span>
      </p>
      <div style="text-align:center">
        <p>是否确认删除此用户的信息？</p>
        <p>{{ selectedUserName }}</p>
      </div>
      <div slot="footer">
        <Button type="error" size="large" long :loading="modal_loading" @click="handleDel">删除</Button>
      </div>
    </Modal>
    <Modal v-model="modalAddUser" width="420" class="modal-user" class-name="vertical-center-modal">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="information-circled"></Icon>
        <span>{{ userTitle }}</span>
      </p>
      <div style="text-align:center;">
        <div class="user-item">
          <label for="user-name">用户名<b class="text-require">*</b></label>
          <Input v-model="userName" placeholder="请输入用户名" class="user-item-model" id="user-name"></Input>
        </div>
        <!--<div class="user-item">
          <label for="user-password">密码<b class="text-require">*</b></label>
          <Input v-if="modifyOrAddUser == 'addUser'" type="password" v-model="userPassword" placeholder="请输入密码" class="user-item-model" id="user-password"></Input>
          <Input v-else type="password" v-model="userPassword" placeholder="不填或输入新密码(原密码失效，谨慎操作)" class="user-item-model" id="user-password"></Input>
          <label for="user-password"></label>
          <p class="user-item-tips">*8~20个字符，同时包含数字，大小写字母，特殊字符</p>
        </div>-->
        <div class="user-item">
          <label for="user-mobile">手机<b class="text-require">*</b></label>
          <Input v-model="userMobile" placeholder="请输入手机号码" class="user-item-model" id="user-mobile"></Input>
          <!--<label for="user-mobile"></label>
          <p class="user-item-tips">*忘记密码时，可以通过该手机号码快速找回密码</p>-->
        </div>
      </div>
      <div slot="footer">
        <Button type="primary" :loading="modal_loading" @click="handleSubmit">确定</Button>
        <Button type="default" @click="handleDismiss">取消</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
export default {
  name: 'userList',
  data() {
    return {
      columns: [{
          title: '序号',
          type: 'index',
          width: 50,
          align: 'center'
        },
        {
          title: '姓名',
          key: 'name'
        },
        {
          title: '手机号',
          key: 'mobile'
        },
        {
          title: '操作',
          key: 'action',
          width: 180,
          align: 'center',
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
              }, '修改'),
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.resetPassword(params.index)
                  }
                }
              }, '重置密码'),
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
        }
      ],
      list: [],
      modalDelUser: false,
      modal_loading: false,
      userId: undefined,
      modalAddUser: false,
      modifyOrAddUser: '',
      userName: '',
      userPassword: undefined,
      userMobile: undefined,
      selectedIndex: undefined,
      selectedUserName: '',
      token: ''
    }
  },
  methods: {
    getToken() {
      this.token = JSON.parse(localStorage.getItem('token'));
    },
    getUserList() {
      let userList = [];
      // let userData = JSON.parse(localStorage.getItem('users'));
      // if (userData.length > 0) {
      //   this.list = userData;
      // }
      this.$http.get(`/api/user/getAllUsers?token=${this.token}`).then(
        res => {
          if (res.data.status == 2000) {
            res.data.body.map(item => {
              userList.push(item);
            })
            this.list = userList;
            // console.log("all users:", res.data.body);
            // localStorage.setItem('users', JSON.stringify(res.data.body));
          } else {
            this.$Message.error(res.data.body.message);
          }
        }, err => {
          console.log(err.data);
        })
      // console.log("user data1:", this.list, userData);
    },
    // formateDate(data) {
    //   let date = new Date(data);
    //   let year = date.getFullYear();
    //   let month = date.getMonth() < 9 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
    //   let day = date.getDate() < 9 ? '0' + (date.getDate() + 1) : date.getDate() + 1;
    //   return `${year}-${month}-${day}`
    // },
    modifyAction(index) {
      this.userId = this.list[index].id;
      this.modalAddUser = true;
      this.selectedIndex = index;
      this.userName = this.list[index].name;
      this.userPassword = this.list[index].password;
      this.userMobile = parseInt(this.list[index].mobile);
      this.modifyOrAddUser = 'modifyUser';
    },
    removeAction(index) {
      this.modalDelUser = true;
      this.userId = this.list[index].id;
      this.selectedIndex = index;
      this.selectedUserName = this.list[index].name;
    },
    addAction() {
      this.modalAddUser = true;
      this.modifyOrAddUser = 'addUser';
      this.userName = '';
      this.userPassword = null;
      this.userMobile = null;
    },
    handleDel() {
      this.modal_loading = true;
      setTimeout(() => {
        this.modal_loading = false;
        this.modalDelUser = false;
        this.deleteUser(this.userId);
      }, 1500);
    },
    deleteUser(userId) {
      let data = { token: this.token, id: userId };
      this.$http.post('/api/user/deleteUser', data)
        .then(
          res => {
            if (res.data.status == 2000) {
              this.$Message.success('删除成功');
              this.getUserList();
              // this.list.splice(this.selectedIndex, 1);
            } else {
              this.$Message.error(res.data.body.message);
            }
          }, err => {
            console.log(err.data)
          })
    },
    handleSubmit() {
      if (this.modifyOrAddUser === 'modifyUser') {
        if (!this.userName || !this.userMobile) {
          this.$Message.error('请完善信息后提交');
        } else {
          let pattern = /^1\d{10}$/;
          if (this.userMobile && !pattern.test(this.userMobile)) {
            this.$Message.error("手机号码有误，必须为11位数字，请重新输入");
            return false;
          } else {
            this.modal_loading = true;
            setTimeout(() => {
              this.modal_loading = false;
              let data = {
                token: this.token,
                id: this.userId,
                name: this.userName,
                mobile: this.userMobile
                /* password: this.userPassword */
              }
              this.modifyUser(data);
            }, 1500)
          }
        }
      } else {
        if (!this.userName || !this.userMobile) {
          this.$Message.error('请完善信息后提交');
        } else {
          let pattern = /^1\d{10}$/;
          /* let regex = /^(?=.*[A-Za-z])(?=.*[0-9])(?=.*[`\-=\[\]\\;',./~!@#$%^&*()_+{}|:"<>?])[A-Za-z0-9`\-=\[\]\\;',./~!@#$%^&*()_+{}|:"<>?]{8,}$/;
          if (this.userPassword && !regex.test(this.userPassword)) {
            this.$Message.error("用户密码不匹配，请重新输入");
            return false;
          }  */
          if (this.userMobile && !pattern.test(this.userMobile)) {
            this.$Message.error("手机号码有误，必须为11位数字，请重新输入");
            return false;
          } else {
            this.modal_loading = true;
            setTimeout(() => {
              this.modal_loading = false;
              let data2 = {
                token: this.token,
                name: this.userName,
                mobile: this.userMobile
                /* : this.userPassword */
              }
              this.addUser(data2);
            }, 1500)
          }
        }
      }
    },
    handleDismiss() {
      this.modal_loading = false;
      this.modalAddUser = false;
    },
    addUser(userData) {
      this.$http.post('/api/user/addUser', userData).then(res => {
        console.log(res.data);
        if (res.data.status == 2000) {
          /*this.$Message.success('添加用户成功!');*/
          this.$Notice.success({
            title: '添加用户成功!',
            desc: '账户和密码已经发送到您的公司邮箱，请注意查收！',
            duration: 3
          });
          this.getUserList();
          this.modalAddUser = false;
        } else {
          this.$Message.error(res.data.body.message);
          this.modalAddUser = true;
        }
      }, err => {
        console.log(err.data);
        this.$Message.success('添加用户失败!');
      })
    },
    modifyUser(userData) {
      this.$http.post('/api/user/updateUser', userData).then(res => {
        console.log(res.data);
        if (res.data.status == 2000) {
          this.$Message.success('修改用户成功!');
          this.getUserList();
          this.modalAddUser = false;
        } else {
          this.$Message.error(res.data.body.message);
          this.modalAddUser = true;
        }
      }, err => {
        console.log(err.data);
        this.$Message.success('修改用户失败!');
      })
    },
    resetPassword(index){
      let data = {
        token: this.token,
        id: this.list[index].id
      }
      this.$http.post('/api/user/resetPassword', data).then(res => {
        console.log(res.data);
        if (res.data.status == 2000) {
          this.$Message.success('重置密码成功!');
          this.getUserList();
        } else {
          this.$Message.error(res.data.body.message);
        }
      }, err => {
        console.log(err.data);
        this.$Message.success('重置密码失败!');
      })
    }
  },
  computed: {
    userTitle: function() {
      if (this.modifyOrAddUser === 'modifyUser') {
        return "修改用户";
      } else if (this.modifyOrAddUser === 'addUser') {
        return "添加用户";
      }
    }
  },
  created() {
    this.getToken();
    this.getUserList();
  }
}
</script>
<style scoped lang="less">
.user-wrap {
  min-width: 768px;
  min-height:100%;
  border:10px solid #f0f0f0;
  border-bottom:none;
  padding-bottom: 15px;
  background: #ffffff;
  .user-table-title {
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
    .add-user-icon {
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

.modal-user {
  .ivu-modal {
    height: 80vh;
    overflow: hidden;
    overflow-y: auto;
  }
}

.user-item {
  label {
    width: 50px;
    display: inline-block;
    vertical-align: middle;
    text-align: right;
  }
  .user-item-model {
    width: 75%;
    vertical-align: baseline;
    margin-left: 10px;
  }
  .user-item-tips{
    display: inline-block;
    width: 75%;
    margin-left: 10px;
    text-align: left;
    font-size: 12px;
    margin-top: 5px;
    color: #FF6C60;
  }
}

.user-item+.user-item {
  margin-top: 10px;
}

.text-require {
  color: #FF6C60;
  font-weight: 700;
  margin-left: 3px;
}

</style>
