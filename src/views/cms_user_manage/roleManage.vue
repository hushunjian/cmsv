<template>
  <div class="role-wrap">
    <div class="role-table-title">
      <span class="table-title">角色列表</span>
      <Button type="success" class="add-role-icon" icon="plus-round" @click="addAction">添加</Button>
    </div>
    <Table refs="table1" border :columns="columns" :data="rolesList"></Table>
    <Modal v-model="modalDelRole" width="360">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="information-circled"></Icon>
        <span>删除确认</span>
      </p>
      <div style="text-align:center">
        <p>是否确认删除此角色？</p>
        <p>{{ selectedRoleName }}</p>
      </div>
      <div slot="footer">
        <Button type="error" size="large" long :loading="modal_loading" @click="handleDel">删除</Button>
      </div>
    </Modal>
    <Modal v-model="modalAddRole" width="360" class-name="vertical-center-modal">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="information-circled"></Icon>
        <span>{{ roleTitle }}</span>
      </p>
      <div style="text-align:center">
        <div class="role-item">
          <label for="role-name">角色名</label>
          <Input v-model="roleName" type="text" placeholder="请输入角色名" class="role-item-model" id="role-name"></Input>
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
  name: 'roleControl',
  data() {
    return {
      columns: [{
          title: '角色',
          key: 'name',
          align: 'center'
        },
        {
          title: '操作',
          key: 'action',
          width: 140,
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
                  type: 'error',
                  size: 'small'
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
      modalDelRole: false,
      modalAddRole: false,
      modal_loading: false,
      roleId: undefined,
      selectedIndex: undefined,
      selectedRoleName: '',
      roleName: '',
      modifyOrAddRole: '',
      rolesList: [],
      token: ''
    }
  },
  methods: {
    getToken() {
      this.token = JSON.parse(localStorage.getItem('token'));
    },
    getAllRolesList() {
      // let roleData = JSON.parse(localStorage.getItem('roles'));
      // if (roleData.length > 0) {
      //   this.rolesList = roleData;
      // }
      let temData = [];
      this.$http.get(`/api/role/getAllRoles?token=${this.token}`).then(
        res => {
          if (res.data.status == 2000) {
            res.data.body.map(item => {
              temData.push(item);
            })
            this.rolesList = temData;
            // console.log("all roles:", res.data.body);
            // localStorage.setItem('roles', JSON.stringify(res.data.body));
          } else {
            this.$Message.error(res.data.body.message);
          }
        }, err => {
          console.log(err.data);
        })
      // console.log("user rolesList:", this.rolesList);
    },
    modifyAction(index) {
      this.modalAddRole = true;
      this.roleId = this.rolesList[index].id;
      this.roleName = this.rolesList[index].name;
      this.selectedIndex = index;
      this.modifyOrAddRole = 'modifyRole';
    },
    removeAction(index) {
      this.modalDelRole = true;
      this.roleId = this.rolesList[index].id;
      this.selectedIndex = index;
      this.selectedRoleName = this.rolesList[index].name;
    },
    addAction() {
      this.modalAddRole = true;
      this.modifyOrAddRole = 'addRole';
      this.roleName = '';
    },
    handleDel() {
      this.modal_loading = true;
      setTimeout(() => {
        this.modal_loading = false;
        this.modalDelRole = false;
        this.deleteRole(this.roleId);
      }, 1500);
    },
    deleteRole(roleId) {
      let data = { token: this.token, id: roleId };
      this.$http.post('/api/role/deleteRole', data)
        .then(
          res => {
            if (res.data.status == 2000) {
              this.$Message.success('删除成功');
              // this.rolesList.splice(this.selectedIndex, 1);
              this.getAllRolesList();
            } else {
              this.$Message.error(res.data.body.message);
            }
          }, err => {
            console.log(err.data)
          })
    },
    addRole(roleData) {
      this.$http.post('/api/role/addRole', roleData)
        .then(
          res => {
            if (res.data.status == 2000) {
              this.$Message.success('添加成功');
              this.getAllRolesList();
              this.modalAddRole = false;
            } else {
              this.$Message.error(res.data.body.message);
              this.modalAddRole = true;
            }
          }, err => {
            console.log(err.data);
            this.$Message.success('添加角色失败!');
          })
    },
    modifyRole(roleData) {
      console.log("modify role item:", roleData);
      this.$http.post('/api/role/updateRole', roleData)
        .then(
          res => {
            console.log('add role info:', res.data);
            if (res.data.status == 2000) {
              this.$Message.success('修改成功');
              this.getAllRolesList();
              this.modalAddRole = false;
            } else {
              this.$Message.error(res.data.body.message);
              this.modalAddRole = true;
            }
          }, err => {
            console.log(err.data);
            this.$Message.success('修改角色失败!');
          })
    },
    handleSubmit() {
      if (!this.roleName) {
        this.$Message.error('请输入角色名!');
      } else {
        this.modal_loading = true;
        setTimeout(() => {
          this.modal_loading = false;

          switch (this.modifyOrAddRole) {
            case 'modifyRole':
              let data = {
                token: this.token,
                id: this.roleId,
                name: this.roleName
              }
              this.modifyRole(data);
              break;
            case 'addRole':
            let data2 = {
              token: this.token,
                name: this.roleName
            }
              this.addRole(data2);
              break;
          }
        }, 1500)

      }
    },
    handleDismiss() {
      this.modal_loading = false;
          this.modalAddRole = false;
    }
  },
  created() {
    this.getToken();
    this.getAllRolesList();

  },
  computed: {
    roleTitle: function() {
      console.log("role Title:", this.modifyOrAddRole);
      if (this.modifyOrAddRole === 'modifyRole') {
        return "修改角色";
      } else if (this.modifyOrAddRole === 'addRole') {
        return "添加角色";
      }
    }
  }
}
</script>
<style scoped lang="less">
.role-wrap {
  min-height:100%;
  border:10px solid #f0f0f0;
  border-bottom:none;
  padding-bottom: 15px;
  background: #ffffff;
  .role-table-title {
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
    .add-role-icon {
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
.role-item {
  label {
    width: 50px;
    display: inline-block;
    text-align: right;
    verticle-align: middle;
  }
  .role-item-model {
    width: 80%;
    vertical-align: baseline;
    margin-left: 10px;
  }
}
</style>

