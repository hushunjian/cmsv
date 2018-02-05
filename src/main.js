// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import { routers, appRouter } from './router'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import iView from 'iview'
import 'iview/dist/styles/iview.css'
import IScrollView from 'vue-iscroll-view'
import IScroll from 'iscroll'
Vue.use(iView)
Vue.use(VueResource)
Vue.use(VueRouter)
Vue.use(IScrollView, IScroll)

Vue.config.productionTip = false

// 路由配置
const RouterConfig = {
  mode: 'history',
  routes: routers
};

const router = new VueRouter(RouterConfig);

// 判断用户是否登录
router.beforeEach((to, from, next) => {
  let token = JSON.parse(localStorage.getItem('token'));
  let permission = JSON.parse(localStorage.getItem('userFeatures'));
  let permissionStatus;
  if (to.path == '/login') {
    localStorage.clear();
    next();
  } else if (!token && to.path != '/login') {
    console.log('未登录状态');
    next({
      path: '/login'
    })
  } else {
    if (to.name) {
      // permissionStatus = getPermission(to.name);
      // console.log("to route:", to, permission, permissionStatus);
      // if (to.name == 'home') {
      //   next()
      // } else {
      //   if (permissionStatus) {
      //     next()
      //   } else {
      //     router.replace({
      //       name: 'error_404'
      //     });
      //     next()
      //   }
      // }
      next()
    } else {
      router.replace({
        name: 'error_404'
      });
      next()
    }
  }

});

function getPermission(to) {
  let permission = JSON.parse(localStorage.getItem('userFeatures'));
  let permissionStatus;
  if (permission && permission.length > 0) {
    permission.map(item => {
      if (item.permission) {
        if (item.hasOwnProperty('children')) {
          item.children.map(tem => {
            if (tem.name == name) {
              if (tem.permission) {
                permissionStatus = true;
              } else {
                permissionStatus = false;
              }
            }

          })
        }
      } else {
        permissionStatus = false;
      }
    })
  }

  return permissionStatus
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})

const menuList = appRouter;
