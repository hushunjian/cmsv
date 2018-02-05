<template>
  <div class="main" :class="{'main-hide-text': hideMenuText}">
    <div :span="spanLeft" class="main-menu-left scroll-wrap" :style="{width: hideMenuText?'60px':'220px', overflow: hideMenuText ? 'visible' : 'auto'}">
      <div class="main-logo-left" @click='backToHome'>
        <span v-show="!hideMenuText">拙心网络CMS</span>
        <span class="logoImg"><img v-show="hideMenuText" src="../assets/images/logo.png" key="min-logo" /></span>
      </div>
      <sidebar-menu v-if="!hideMenuText" :menuList="menuList" :iconSize="14" />
      <sidebar-menu-shrink :icon-color="menuIconColor" v-else :menuList="menuList"></sidebar-menu-shrink>
    </div>
    <div :span="spanRight" class="main-body">
      <div class="main-header" :style="{left: hideMenuText?'60px':'220px'}">
        <div class="main-header-icon">
          <Button type="text" @click="toggleClick">
            <Icon type="navicon" size="32"></Icon>
          </Button>
        </div>
        <div class="main-header-middle">
          <div class="main-breadcrumb">
            <!-- <Breadcrumb>
              <BreadcrumbItem href="#">首页</BreadcrumbItem>
              <BreadcrumbItem href="#">应用中心</BreadcrumbItem>
              <BreadcrumbItem :currentPath="currentPath">权限管理</BreadcrumbItem>
              <BreadcrumbItem :currentPath="currentPath"></BreadcrumbItem>
            </Breadcrumb> -->
          </div>
        </div>
        <div class="main-header-user">
          <Dropdown style="margin-left: 20px; height: 40px; vertical-align: middle;" @on-click="handleUserDrop">
            <a href="javascript:void(0)">
            {{ userName }}
            <Icon type="arrow-down-b"></Icon>
            </a>
            <DropdownMenu slot="list">
              <!-- <DropdownItem name="userCenter">个人中心</DropdownItem> -->
              <DropdownItem name="userPassword">修改密码</DropdownItem>
              <DropdownItem name="loginOut">退出</DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <img class="user-avatar" src="../assets/images/default_avatar.jpg" />
        </div>
      </div>
      <Modal v-model="modalUserPassword" width="400" class='modal-user-password'>
        <p slot="header" style="color:#f60;text-align:center">
          <Icon type="information-circled"></Icon>
          <span>修改密码</span>
        </p>
        <div style="text-align:center;">
          <div class="user-item">
            <label for="user-password">旧密码</label>
            <Input type="password" v-model="userPassword" placeholder="请输入原密码" class="user-item-model" id="user-password"></Input>
            <span v-if="userPassword" style="display:block;color: #ed3f14;text-align:left;margin-left:100px;">密码提示:{{userPassword}}</span>
          </div>
          <div class="user-item">
            <label for="user-new-password">新密码</label>
            <Input type="password" v-model="userNewPassword" placeholder="请输入新密码" class="user-item-model" id="user-new-password"></Input>
            <span v-if="userNewPassword" style="display:block;color: #ed3f14;text-align:left;margin-left:100px;">密码提示:{{userNewPassword}}</span>
          </div>
        </div>
        <div slot="footer">
          <Button type="primary" :loading="modal_loading" @click="handleSubmit">确定</Button>
          <Button type="default" @click="handleDismiss">取消</Button>
        </div>
      </Modal>
     <!-- <div class="main-content" :style="{left: hideMenuText?'60px':'220px'}" >
        <iscroll-view class="main-content-main  tableCell" >&lt;!&ndash;:options="{preventDefault: false}"&ndash;&gt;
          &lt;!&ndash; 内容区域 &ndash;&gt;
          <router-view></router-view>
        </iscroll-view>
      </div>-->
      <div class="main-content scroll-wrap" :style="{left: hideMenuText?'60px':'220px'}">
        <div class="main-content-main  tableCell">
          <!-- 内容区域 -->
          <router-view></router-view>
        </div>
      </div>
      <div class="main-copy" :style="{paddingLeft: hideMenuText?'60px':'220px'}">
        Copyright © 2016 拙心（上海）网络科技有限公司
      </div>
    </div>
  </div>
</template>
<script>
import sidebarMenu from './sidebarMenu.vue';
import sidebarMenuShrink from './sidebarMenuShrink.vue';
import appRouter from '../router';
import IScrollView from 'vue-iscroll-view';
import IScroll from 'iscroll';

export default {
  name: 'home',
  components: {
    sidebarMenu,
    sidebarMenuShrink
  },
  data() {
    return {
      spanLeft: 5,
      spanRight: 19,
      hideMenuText: false,
      theme2: 'dark',
      modalOpen: false,
      menuList: [],
      userPassword: '',
      userNewPassword: '',
      modalUserPassword: false,
      modal_loading: false
    }
  },
  computed: {
    currentPath() {
      console.log("currentRouter name:", this.$router, this.$router.currentRoute);
      return this.$router.currentRoute.name;
    },
    userName() {
      let user = JSON.parse(localStorage.getItem('userInfo'));
      return user.name;
    },
    menuIconColor() {
      return 'white';
    },
  },
  methods: {
    getToken() {
      this.token = JSON.parse(localStorage.getItem('token'));
    },
    toggleClick() {
      this.hideMenuText = !this.hideMenuText;
    },
    backToHome() {
      this.$router.push({ name: 'home' })
    },
    handleUserDrop(name) {
      console.log("user logout");
      if (name === "loginOut") {
        this.loginOut();
      } else if (name === "userPassword") {
        this.modalUserPassword = true;
      }
    },
    loginOut() {
      let token = JSON.parse(localStorage.getItem('token'));
      this.$http.get(`/api/user/logout?token=${token}`).then(
        res => {
          if (res.data.status == 2000) {
            localStorage.clear();
            this.$router.push({ name: 'login' });
          }
        })
    },
    getUserFeature() {
      let token = JSON.parse(localStorage.getItem('token'));
      this.$http.get(`/api/user/getMyFeatures?token=${token}`).then(
        res => {
          if (res.data.status == 2000) {
            console.log("user features:", res.data.body);
            console.log("test data:", this.$router.options.routes);
            let temRoute = this.$router.options.routes.filter(item => item.hasOwnProperty('groupId'));
            console.log('menulist detect:', temRoute);
            let temMenuList = [].concat(JSON.parse(JSON.stringify(temRoute)));
            let permissions = res.data.body;
            temMenuList.map(item => {
              permissions.map(res => {
                if (res.groupId == item.groupId) {
                  item.permission = true;
                  // 暂时隐藏未完成菜单
                  if (item.groupId == 1 || item.groupId == 2 || item.groupId == 3 || item.groupId == 5 || item.groupId == 8 || item.groupId == 4 || item.groupId == 6 || item.groupId == 7 || item.groupId == 9 || item.groupId == 10) {
                    item.done = true;
                  }
                  if (item.hasOwnProperty('children') && res.hasOwnProperty('features')) {
                    item.children.map(tem => {
                      res.features.map(des => {
                        if (tem.id == des.id) {
                          tem.permission = true;
                        }
                      })
                    })
                  }
                }
              })
            })
            console.log("user permissions:", permissions, temMenuList);
            localStorage.setItem('userFeatures', JSON.stringify(temMenuList));
            this.menuList = temMenuList;
            // 根据用户是否有用户管理权限来缓存用户/角色信息
            // temMenuList.map(item => {
            //   if (item.groupId ===1 ) {
            //     this.getAllUsers();
            //     this.getAllRole();
            //   }
            // })
          }
        })
    },
    getAllFeature() {
      let token = JSON.parse(localStorage.getItem('token'));
      this.$http.get(`/api/feature/getAllFeatures?token=${token}`).then(
        res => {
          if (res.data.status == 2000) {
            console.log("all features:", res.data.body);
            localStorage.setItem('features', JSON.stringify(res.data.body));
          }
        })
    },
    getAllRole() {
      let token = JSON.parse(localStorage.getItem('token'));
      this.$http.get(`/api/role/getAllRoles?token=${token}`).then(
        res => {
          if (res.data.status == 2000) {
            console.log("all roles:", res.data.body);
            localStorage.setItem('roles', JSON.stringify(res.data.body));
          }
        })
    },
    getAllUsers() {
      let token = JSON.parse(localStorage.getItem('token'));
      this.$http.get(`/api/user/getAllUsers?token=${token}`).then(
        res => {
          if (res.data.status == 2000) {
            console.log("all users:", res.data.body);
            localStorage.setItem('users', JSON.stringify(res.data.body));
          }
        })
    },
    modifyUserPassword(data) {
      this.$http.post('/api/user/updatePassword', data).then(
        res => {
          console.log(res.data);
          if (res.data.status == 2000) {
            this.$Message.success('修改密码成功!');
          } else {
            this.$Message.error(res.data.body.message);
          }
        }, err => {
          console.log(err.data);
          this.$Message.success('修改密码失败!');
        })
    },
    handleSubmit() {
      if (!this.userPassword || !this.userNewPassword) {
        this.$Message.error('请完善信息后提交');
      } else {
        this.modal_loading = true;
        setTimeout(() => {
          this.modal_loading = false;
          this.modalUserPassword = false;
          let data = {
            token: this.token,
            password: this.userPassword,
            newPassword: this.userNewPassword
          }
          this.modifyUserPassword(data);
        }, 1500)

      }
    },
    handleDismiss() {
      this.modal_loading = false;
      this.modalUserPassword = false;
    },
  },
  created() {
    this.getUserFeature();
    this.getAllFeature();
    // this.getAllRole();
    // this.getAllUsers();
    this.getToken();
  },
  mounted() {
    /*new IScroll('.tableCell', { scrollX:false, scrollY:true});*/
  },
}

</script>

<style scoped lang="less">
@import "../main.less";
.main {
  position: absolute;
  width: 100%;
  height: 100%;
  background: #f0f0f0;
}
.logoImg{
  display:block;
  width: 30px;
  height:30px;
  margin:0 auto;
}
.main-breadcrumb {
  padding: 10px 15px 0;
  height: 40px;
  /*background: #ddd;
  background: #f0f0f0;*/
}



.main-content-main {
  /*padding: 10px 10px 0 10px;
  background: #f0f0f0;*/
  flex: 1;
}



.main-menu-left {
  background: #1c2438;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 21;
  .main-logo-left {
    height: 60px;
    background: #2b85e4;
    padding: 15px 0;
    cursor: pointer;
    &:hover {
      background: #2d8cf0;
      .span {
        color: #fff;
      }
    }
    span {
      display: block;
      font-size: 20px;
      font-weight: 600;
      letter-spacing: 8px;
      text-align: center;
      color: #f7f7f7;
      border-radius: 4px;
    }
    img {
      width: 100%;
      vertical-align: middle;
    }
  }
}

.main-body {
  position: fixed;
  top:0;
  left:0;
  right:0;
  bottom: 0;
  z-index:1;
  width: 100%;
  height:100%;
}

.main-header {
  position: fixed;
  display: flex;
  align-items: center;
  right: 0;
  z-index:10;
  height: 60px;
  background: #fff;
  box-shadow: 0 1px 1px rgba(0, 0, 0, .1);
  border-bottom: 1px solid #e9eaec;
  .main-header-icon {
    display: inline-block;
    margin: 6px;
    .ivu-btn-text{
      color: #2b85e4;
      &:hover {
         color: #ff9900;
      }
    }
  }
  .main-header-middle {
    /* position: absolute;
    left: 60px;
    top: 0;
    right: 340px;
    bottom: 0; */
    padding: 10px;
    overflow: hidden;
  }
  .main-header-user {
    position: absolute;
    right: 10px;
    top: 0;
    height: 100%;
    // width: 300px;
    padding: 10px;
    font-size: 14px;
    vertical-align: middle;
    line-height: 40px;
    .user-avatar {
      display: inline-block;
    width: 40px;
    height: 40px;
    vertical-align: middle;
    border-radius: 50%;
    }
  }
}

.main-content {
  display: flex;
  flex-flow: column;
  position: absolute;
  top: 60px;
  right: 0;
  bottom:50px;
  overflow: auto;
  z-index: 1;
  /*transition: left .3s;*/
  .main-content-main {
    height:100%;
  }
}
.main-copy {
  position: fixed;
  bottom: 0;
  right: 0;
  left: 0;
  width: 100%;
  text-align: center;
  height:50px;
  line-height:50px;
  color: #333;
  background: #fff;
  -webkit-box-shadow: 0 -1px 1px rgba(0, 0, 0, 0.1);
  box-shadow: 0 -1px 1px rgba(0, 0, 0, 0.1);
  border-top: 1px solid #e9eaec;
}


.main-ceiling-main a {
  color: #9ba7b5;
}

.main-hide-text .main-text {
  display: none;
}

.ivu-col {
  transition: width .2s ease-in-out;
}


.user-item {
  label {
    width: 50px;
    display: inline-block;
    vertical-align: middle;
    text-align: left;
  }
  .user-item-model {
    width: 65%;
    vertical-align: baseline;
    margin-left: 10px;
  }
}

.user-item+.user-item {
  margin-top: 10px;
}

</style>
<style lang="less">

.main-content{
  .tableCell{
    /*width:100%;*/
    .ivu-table-body{
      overflow: hidden;
    }
    .ivu-table-cell{
      padding:0 10px;
    }
    .ivu-tabs-nav-scrollable{
      padding:0 30px;
      .ivu-tabs-nav-prev{
        display: block;
        width: 30px;
        margin-top:3px;
        text-align: center;
      }
      .ivu-tabs-nav-next{
        display: block;
        width: 30px;
        margin-top:3px;
        text-align: center;
      }
    }
    .ivu-page-item:hover {
      border-color: #dddee1;
      a {
        color: #495060;
      }
    }
    .ivu-page-item-active {
      border-color: #dddee1;
    }
  }

}

/*.ivu-modal{
  top:50%;
  transform: translateY(-50%);
  transition: all .5s linear;
}*/

.vertical-center-modal{
  display: flex;
  align-items: center;
  justify-content: center;

  .ivu-modal{
    top: 0;
  }
}
@media screen and (max-width:1200px){

}
</style>
