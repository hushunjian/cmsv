<template>
  <div class="access-wrap">
    <div class="access-title">
      <span class="table-title">权限分配</span>
    </div>
    <Tabs type="card" class="access-content">
      <TabPane label="角色权限">
        <div class="access-item">
          <div class="access-item-left">
            <p>角色列表
            </p>
            <ul>
              <li v-for="(item, index) in rolesList" v-bind:class="{active: index1 === index }" @click="chooseItem(item, index, 'role')">{{ item.name }}</li>
            </ul>
          </div>
          <div class="access-item-right">
            <div class="access-item-right-control">
              <p>角色权限</p>
              <Tree :data="formatedFeaturesList" show-checkbox multiple class="tree-format"></Tree>
            </div>
            <Button type="primary" @click="handleRoleFeature">保存角色权限</Button>
          </div>
        </div>
      </TabPane>
      <TabPane label="用户角色">
        <div class="access-item">
          <div class="access-item-left">
            <p>用户列表</p>
            <ul>
              <li v-for="(item, index) in usersList" v-bind:class="{active: index2 === index }" @click="chooseItem(item, index, 'userRole')">{{ item.name }}</li>
            </ul>
          </div>
          <div class="access-item-right">
            <div class="access-item-right-control">
              <p>用户角色</p>
              <CheckboxGroup v-model="userRoleData" class="role-checkbox">
                <Checkbox v-for="item in rolesList" :value="item.id" :key="item.id" :label="item.id">{{ item.name }}</Checkbox>
              </CheckboxGroup>
            </div>
            <Button type="primary" @click="handleUserRole" class="user-button">保存用户角色</Button>
          </div>
        </div>
      </TabPane>
      <TabPane label="用户权限">
        <div class="access-item">
          <div class="access-item-left">
            <p>用户列表</p>
            <ul>
              <li v-for="(item, index) in usersList" v-bind:class="{active: index3 === index }" @click="chooseItem(item, index, 'userFeature')">{{ item.name }}</li>
            </ul>
          </div>
          <div class="access-item-right">
            <div class="access-item-right-control">
              <p>用户权限</p>
              <Tree :data="formatedUserFeaturesList" show-checkbox multiple class="tree-format"></Tree>
            </div>
            <Button type="primary" @click="handleUserFeature">保存用户权限</Button>
          </div>
        </div>
      </TabPane>
    </Tabs>
  </div>
</template>
<script>
export default {
  name: 'accessControl',
  data() {
    return {
      featuresList: [],
      rolesList: [],
      usersList: [],
      index1: -1,
      index2: -1,
      index3: -1,
      userRoleData: [],
      selectedUserId: null,
      selectedFeatureId: null,
      formatedFeaturesList: [],
      formatedUserFeaturesList: [],
      originFeaturesList: [],
    }
  },
  methods: {
    getToken() {
      this.token = JSON.parse(localStorage.getItem('token'));
    },
    getDefaultData() {
      let user = JSON.parse(localStorage.getItem('userInfo'));
      this.selectedUserId = user.id;
      console.log("select user:", this.usersList,this.selectedUserId);
      this.usersList.map((item, index) => {
        if (item.id === this.selectedUserId) {
          this.index2 = index;
          this.index3 = index;
        }
      })
      console.log("this user detect:", this.usersList, this.index2,this.index3);
      this.getUserRole(this.selectedUserId);
      this.getUserFeature(this.selectedUserId);
    },
    getAllFeaturesList() {
      this.$http.get(`/api/feature/getAllFeatures?token=${this.token}`).then(
        res => {
          if (res.data.status == 2000) {
            console.log("all features:", res.data.body);
            let featureData = res.data.body;
            console.log("feature tem Data:", featureData);
            let temArr = [];
            if (featureData.length > 0) {
              let treeData = featureData.map(item => {
                item.title = item.groupName;
                item.expand = false;
                item.selected = false;
                item.checked = false;
                item.id = item.groupId;
                item.children = [];
                return item;
              })
              console.log("treeData info:", treeData);
              treeData.map(res => {
                if (res.hasOwnProperty('features') && res.features.length > 0) {
                  res.features.map(tem => {
                    let childData = Object.assign({}, { title: tem.name }, { disabled: false }, { checked: false }, tem);
                    res.children.push(childData);
                  })
                }
              })
              console.log("treeData par-chi:", treeData);
              this.formatedFeaturesList = treeData;
              this.formatedUserFeaturesList = treeData;
              // 对象数组深拷贝
              this.originFeaturesList = [].concat(JSON.parse(JSON.stringify(treeData)));
              console.log("haha:", this.originFeaturesList);
            }
          }
        })



    },
    getAllRolesList() {
      let token = JSON.parse(localStorage.getItem('token'));
      this.$http.get(`/api/role/getAllRoles?token=${token}`).then(
        res => {
          if (res.data.status == 2000) {
            console.log("all roles:", res.data.body);
            let roleData = res.data.body;
            if (roleData.length > 0) {
              this.rolesList = roleData;
            }
          }
        })

    },
    getAllUsersList() {
      let token = JSON.parse(localStorage.getItem('token'));
      this.$http.get(`/api/user/getAllUsers?token=${token}`).then(
        res => {
          if (res.data.status == 2000) {
            console.log("all users:", res.data.body);
            let userData = res.data.body;
            if (userData.length > 0) {
              this.usersList = userData;
            }
            console.log("users all:", this.usersList);
          }
        })

    },
    chooseItem(item, index, type) {
      console.log("check info:", type, item, index);
      switch (type) {
        case 'role':
          this.index1 = index;
          this.selectedFeatureId = item.id;
          this.getRoleFeatures(item.id);
          break;
        case 'userRole':
          this.index2 = index;
          this.selectedUserId = item.id;
          this.getUserRole(item.id);
          break;
        case 'userFeature':
          this.index3 = index;
          this.selectedUserId = item.id;
          this.getUserFeature(item.id);
          break;
      }
    },
    handleRoleFeature() {
      console.log("update roleFeatures:", this.formatedFeaturesList);
      let temData = [];
      this.formatedFeaturesList.map(item => {
        if (item.children.length > 0) {
          item.children.map(res => {
            if (res.checked == true) {
              temData.push(res.id);
            }
          })
        } else {
          if (item.checked == true) {
            temData.push(item.id);
          }
        }
      })
      this.updateRoleFeatures(temData);
    },
    handleUserRole() {
      console.log("update userRole:", this.userRoleData);
      this.updateUserRole();
    },
    handleUserFeature() {
      console.log("update roleFeatures:", this.formatedUserFeaturesList);
      let temData = [];
      this.formatedUserFeaturesList.map(item => {
        if (item.children.length > 0) {
          item.children.map(res => {
            let temObj = {
                id: res.id,
                status: res.checked
              }
            temData.push(temObj);
          })
        } else {
          if (item.checked == true) {
            temData.push(item.id);
            let temObj2 = {
              id: item.id,
              status: 1
            }
            temData.push(temObj2);
          }
        }
      })
      this.updateUserFeatures(temData);
    },
    getUserRole(userId) {
      this.$http.get(`/api/user/getUserRoles?token=${this.token}&userId=${userId}`).then(res => {
        let arr = [];
        console.log("user-role:", res.data, this.userRoleData);
        res.data.body.map(item => {
          arr.push(item.id);
        })
        this.userRoleData = arr;
        // 首次判断用户角色拥有的权限
        let id = JSON.parse(localStorage.getItem('userInfo')).id;
        let roleData = this.rolesList;
        // let roleData = JSON.parse(localStorage.getItem('roles'));
        console.log("user test data:", id, roleData, this.userRoleData);
        if (id === userId) {
          let temData = [];
          roleData.map((res, index) => {
            this.userRoleData.map(tem => {
              if (tem === res.id) {
                temData.push({ index: index, id: res.id });
              }
            })
          })
          console.log("user tem Data:", temData);
          this.index1 = temData[0].index;
          this.selectedFeatureId = temData[0].id;
          this.getRoleFeatures(this.selectedFeatureId);
        }
        console.log("user-role:", this.userRoleData);
      }, err => {
        console.log(err.data);
      })
    },
    updateUserRole() {
      let data = {
        token: this.token,
        userId: this.selectedUserId,
        roleIds: this.userRoleData
      }
      if (data.userId) {
        if (data.roleIds <= 0) {
          this.$Message.error('没有选择用户角色');
        } else {
          this.$http.post('/api/user/updateUserRoles', data).then(res => {
            console.log(res.data);
            if (res.data.status == 2000) {
              this.$Message.success('修改用户角色成功!');
            } else {
              this.$Message.error(res.data.body.message);
            }
          }, err => {
            console.log(err.data);
            this.$Message.success('修改用户角色失败!');
          })
        }
      } else {
        this.$Message.error('没有选择用户');
      }

    },
    getRoleFeatures(roleId) {
      console.log("origin role features:", this.formatedFeaturesList, this.originFeaturesList);
      let temData = [].concat(JSON.parse(JSON.stringify(this.originFeaturesList)));
      this.$http.get(`/api/role/getRoleFeatures?token=${this.token}&roleId=${roleId}`).then(res => {
        console.log("role features:", res.data, this.formatedFeaturesList);
        res.data.body.map(item => {
          temData.map(res => {
            if (res.children.length > 0) {
              res.children.map(params => {
                if (params.id == item.id) {
                  params.checked = true;
                }
              })
            } else {
              if (res.id == item.id) {
                res.checked = true;
              }
            }
          })
        })
        this.formatedFeaturesList = temData;
        console.log('changed role Features:', this.formatedFeaturesList);
      }, err => {
        console.log(err.data);
      })
    },
    updateRoleFeatures(temData) {
      let data = {
        token: this.token,
        roleId: this.selectedFeatureId,
        featureIds: temData
      }
      console.log("update role Features:", data);
      if (data.roleId) {
        if (data.featureIds.length <= 0) {
          this.$Message.error('没有选择角色权限');
        } else {
          this.$http.post('/api/role/updateRoleFeatures', data).then(res => {
            console.log(res.data);
            if (res.data.status == 2000) {
              this.$Message.success('修改角色权限成功!');
            } else {
              this.$Message.error(res.data.body.message);
            }
          }, err => {
            console.log(err.data);
            this.$Message.success('修改角色权限失败!');
          })
        }

      } else {
        this.$Message.error('没有选择角色');
      }


    },
    getUserFeature(userId) {
      let temData = [].concat(JSON.parse(JSON.stringify(this.originFeaturesList)));
      this.$http.get(`/api/user/getUserFeatures?token=${this.token}&userId=${userId}`).then(res => {
        console.log("user features:", temData,res.data, this.formatedUserFeaturesList);
        res.data.body.map(item => {
          temData.map(res => {
            if (res.children.length > 0) {
              if (item.groupId == res.groupId) {
                res.children.map(params => {
                  item.features.map(a => {
                    if (a.id == params.id) {
                      params.checked = true;
                    }
                  })
                })
              }
            } else {
              if (item.groupId == res.groupId) {
                res.checked = true;
              }
            }
          })
        })
        this.formatedUserFeaturesList = temData;
        console.log('changed role Features:', this.formatedUserFeaturesList);
      }, err => {
        console.log(err.data);
      })
    },
    updateUserFeatures(temData) {
      let data = {
        token: this.token,
        userId: this.selectedUserId,
        features: temData
      }
      console.log("update role Features:", data);
      if (data.userId) {
        if (data.features <= 0) {
          this.$Message.error('没有选择用户权限');
        } else {
          this.$http.post('/api/user/updateUserFeatures', data).then(res => {
            if (res.data.status == 2000) {
              this.$Message.success('修改用户权限成功!');
            } else {
              this.$Message.error(res.data.body.message);
            }
          }, err => {
            console.log(err.data);
            this.$Message.success('修改用户权限失败!');
          })
        }
      } else {
        this.$Message.error('没有选择用户');
      }

    },
  },
  // mounted() {
  //   this.getToken();
  //   this.getAllUsersList();
  //   this.getAllRolesList();

  //   this.getAllFeaturesList();
  //   this.getDefaultData();
  // },
  created() {
    this.getToken();
    this.getAllUsersList();
    this.getAllRolesList();

    this.getAllFeaturesList();

    setTimeout(() => {
      this.getDefaultData();
    },1500)
  }
}

</script>
<style scoped lang="less">
.access-wrap {
  min-width: 768px;
  min-height:100%;
  border:10px solid #f0f0f0;
  border-bottom:none;
  padding-bottom: 15px;
  background: #ffffff;
  .access-title {
    background: #ffffff;
    border-bottom: 1px solid #f0f0f0;
    padding:10px 5px 5px;
    margin-bottom: 10px;
    font-size: 16px;
    line-height: 24px;
    .table-title{
      display: inline-block;
      vertical-align: middle;
    }
  }
  .access-content {
    display: flex;
    flex-flow: column;
    .access-item {
      flex: 1;
      display: flex;
      flex-flow: row;
      height: 50%;
      .access-item-left {
        width: 200px;
        margin-right: 20px;
        margin-left: 5px;
      }
      .access-item-right {
        display: flex;
        flex-flow: row;
        align-items: start;
        .access-item-right-control {
          margin: 0 50px;
        }
        .tree-format {
          background: white;
          overflow-y: auto;
          width: 240px;
          padding: 0 15px;
          ul li {
            margin: 2px 0 !important;
          }
        }
      }
      .ivu-btn-primary{
        height:40px;
      }
    }
  }
  p {
    margin-bottom: 10px;
    font-size: 16px;
  }
  ul {
    max-height: 400px;
    min-height: 240px;
    overflow: hidden;
    background: #fff;
    border: 1px solid #aeb0b6;
    border-radius: 4px;
    overflow-y: auto;
    li {
      padding: 5px 10px;
      cursor: pointer;
    }
  }
  .role-checkbox {
    width: 240px;
    background: white;
    padding: 10px;
    label {
      width: 65%;
    }
  }
  .active {
    background: #f0f0f0;
  }
  .ivu-tree ul li {
    margin: 2px 0 !important;
  }
}

</style>
