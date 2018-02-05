import home from '@/components/main'
import login from '@/components/login'

export const loginRouter = {
  path: '/login',
  name: 'login',
  meta: {
    title: 'Login - 登录'
  },
  component: login
};

export const page404 = {
    path: '/*',
    name: 'error_404',
    meta: {
        title: '404-页面不存在'
    },
    component: resolve => { require(['@/views/error_page/404.vue'], resolve); }
};

export const page401 = {
    path: '/401',
    name: 'error_401',
    meta: {
        title: '401-权限不足'
    },
    component: resolve => { require(['@/views/error_page/401.vue'], resolve); }
};

export const homeRouter = {
  path: '/',
  name: 'home',
  component: home,
  // meta: {
  //   requireAuth: true
  // },
};

export const appRouter = [
  // {
  //   path: '/article',
  //   icon: 'ios-list-outline',
  //   component: home,
  //   name: 'article',
  //   title: 'APP文章管理',
  //   groupId: 1,
  //   children: [
  //     { path: 'pgc-article', icon: 'ios-glasses-outline', name: 'pgc-article', title: 'PGC文章管理', component: resolve => { require(['@/components/test1.vue'], resolve);}, id: 1 },
  //     { path: 'activity', icon: 'ios-speedometer-outline', name: 'activity', title: '活动信息管理', component: resolve => { require(['@/components/test1.vue'], resolve);}, id: 2},
  //     { path: 'ugc-article', icon: 'waterdrop', name: 'ugc-article', title: 'UGC文章管理', component: resolve => { require(['@/components/test1.vue'], resolve);}, id: 3}
  //   ]
  // },
  // {
  //   path: '/summary',
  //   icon: 'ios-speedometer-outline',
  //   component: home,
  //   name: 'summary',
  //   title: '运营统计管理',
  //   groupId: 2,
  //   children: [
  //     { path: 'appchannel', icon: 'waterdrop', name: 'appchannel', title: '渠道管理', component: resolve => { require(['@/components/test1.vue'], resolve);}, id: 4},
  //     { path: 'king', icon: 'waterdrop', name: 'king', title: '国王统计管理', component: resolve => { require(['@/components/test1.vue'], resolve);}, id: 5},
  //     { path: 'promoter', icon: 'ios-glasses-outline', name: 'promoter', title: '推广统计管理', component: resolve => { require(['@/components/test1.vue'], resolve);}, id: 6 },
  //     { path: 'channel-register', icon: 'waterdrop', name: 'channel-register', title: '渠道注册统计', component: resolve => { require(['@/components/test1.vue'], resolve);}, id: 7},
  //     { path: 'king-perday', icon: 'waterdrop', name: 'king-perday', title: '王国[按天]统计', component: resolve => { require(['@/components/test1.vue'], resolve);}, id: 8},
  //     { path: 'user-register-detail', icon: 'waterdrop', name: 'user-register-detail', title: '注册用户明细统计', component: resolve => { require(['@/components/test1.vue'], resolve);}, id: 9},
  //     { path: 'new-kingdom', icon: 'waterdrop', name: 'new-kingdom', title: '新建王国明细统计', component: resolve => { require(['@/components/test1.vue'], resolve);}, id: 10},
  //     { path: 'user-register', icon: 'waterdrop', name: 'user-register', title: '用户注册统计', component: resolve => { require(['@/components/test1.vue'], resolve);}, id: 11},
  //     { path: 'ios-active', icon: 'waterdrop', name: 'ios-active', title: 'IOS推广激活统计', component: resolve => { require(['@/components/test1.vue'], resolve);}, id: 12},
  //     { path: 'dailyActive', icon: 'ios-speedometer-outline', name: 'dailyActive', title: '日活统计管理', component: resolve => { require(['@/components/test1.vue'], resolve);}, id: 13},
  //   ]
  // },
  {
    path: '/appuser',
    icon: 'person-stalker',
    component: home,
    name: 'appUser',
    title: 'APP用户管理',
    groupId: 2,
    children: [
      { path: 'app-user-manager', icon: 'ios-person', name: 'app-user-manager', title: '用户管理', component: resolve => { require(['@/views/app_user/appUserManage.vue'], resolve);}, id: 5},
      { path: 'app-user-content/:id', icon: 'ios-speedometer-outline', name: 'app-user-content', title: '用户内容管理', component: resolve => { require(['@/views/app_user/appUserContent.vue'], resolve);}, id: ""},
      // { path: 'user-silent-manager', icon: 'ios-glasses-outline', name: 'user-silent-manager', title: '禁言用户管理', component: resolve => { require(['@/components/test1.vue'], resolve);}, id: 15 },
      // { path: 'user-sms', icon: 'waterdrop', name: 'user-sms', title: '用户短信发送', component: resolve => { require(['@/components/test1.vue'], resolve);}, id: 16},
      // { path: 'user-invitation', icon: 'waterdrop', name: 'user-invitation', title: '用户邀请查询', component: resolve => { require(['@/components/test1.vue'], resolve);}, id: 17}
    ]
  },
  // {
  //   path: '/system',
  //   icon: 'gear-b',
  //   component: home,
  //   name: 'system',
  //   title: '系统管理',
  //   groupId: 4,
  //   children: [
  //     { path: 'system-log', icon: 'ios-speedometer-outline', name: 'system-log', title: '系统日志查询', component: resolve => { require(['@/components/test1.vue'], resolve);}, id: 18},
  //     { path: 'system-user', icon: 'ios-glasses-outline', name: 'system-user', title: '系统用户查询', component: resolve => { require(['@/components/test1.vue'], resolve);}, id: 19 },
  //     { path: 'global-task', icon: 'waterdrop', name: 'global-task', title: '全局任务', component: resolve => { require(['@/components/test1.vue'], resolve);}, id: 20},
  //     { path: 'rong-cloud', icon: 'waterdrop', name: 'rong-cloud', title: '融云用户信息同步', component: resolve => { require(['@/components/test1.vue'], resolve);}, id: 21},
  //     { path: 'permission-access', icon: 'waterdrop', name: 'permission-access', title: '权限分配', component: resolve => { require(['@/components/test1.vue'], resolve);}, id: 22}
  //   ]
  // },
  {
    path: '/appconfig',
    icon: 'ios-flower-outline',
    component: home,
    name: 'appconfig',
    title: 'APP配置管理',
    groupId: 3,
    children: [
      // { path: 'app-version', icon: 'ios-speedometer-outline', name: 'app-version', title: 'APP版本管理', component: resolve => { require(['@/components/test1.vue'], resolve);}, id: 23},
      // { path: 'app-channel', icon: 'ios-glasses-outline', name: 'app-channel', title: 'APP版本渠道下载管理', component: resolve => { require(['@/components/test1.vue'], resolve);}, id: 24 },
      // { path: 'app-cache', icon: 'waterdrop', name: 'app-cache', title: '缓存配置管理', component: resolve => { require(['@/components/test1.vue'], resolve);}, id: 25},
      // { path: 'app-ui', icon: 'waterdrop', name: 'app-ui', title: 'APP主题管理', component: resolve => { require(['@/components/test1.vue'], resolve);}, id: 26},
      // { path: 'app-fragment-template', icon: 'waterdrop', name: 'app-fragment-template', title: '足迹语言模板管理', component: resolve => { require(['@/components/test1.vue'], resolve);}, id: 28},
      // { path: 'droparound-king-manager', icon: 'waterdrop', name: 'droparound-king-manager', title: '可串门王国管理', component: resolve => { require(['@/components/test1.vue'], resolve);}, id: 29},
      { path: 'app-basic-config', icon: 'android-settings', name: 'app-basic-config', title: '新APP系统配置管理', component: resolve => { require(['@/views/app_config/appBasicConfig.vue'], resolve);}, id: 6},
      { path: 'app-lightbox', icon: 'android-apps', name: 'app-lightbox', title: 'APP灯箱页管理', component: resolve => { require(['@/views/app_config/appLightBox.vue'], resolve);}, id: 7},
      // { path: 'app-db-config', icon: 'waterdrop', name: 'app-db-config', title: '数据库配置管理', component: resolve => { require(['@/components/test1.vue'], resolve);}, id: 31},
    ]
  },
  {
    path: '/list',
    icon: 'social-instagram',
    component: home,
    name: 'list',
    title: '榜单管理',
    groupId: 4,
    children: [
      { path: 'list-rank', icon: 'ios-list', name: 'list-rank', title: '榜单列表', component: resolve => { require(['@/views/list_rank/listRank.vue'], resolve);}, id: 8},
      { path: 'list-rank-manage/:id', icon: 'ios-speedometer-outline', name: 'list-rank-manage', title: '榜单管理', component: resolve => { require(['@/views/list_rank/listRankManage.vue'], resolve);}, id: ""},
      { path: 'list-online', icon: 'ios-list', name: 'list-online', title: '上线榜单管理', component: resolve => { require(['@/views/list_rank/onlineListRank.vue'], resolve);}, id: 9 },

    ]
  },
  {
    path: '/behaviour',
    icon: 'stats-bars',
    component: home,
    name: 'behaviour',
    title: '用户行为分析',
    groupId: 9,
    children: [
      { path: 'registered-user', icon: 'person-stalker', name: 'registered-user', title: '新注册用户', component: resolve => { require(['@/views/behaviour/registeredUser.vue'], resolve);}, id: 19},
      { path: 'user-behaviour', icon: 'ios-speedometer-outline', name: 'user-behaviour', title: '日活统计', component: resolve => { require(['@/views/behaviour/userBehaviour.vue'], resolve);}, id: 20}

    ]
  },
  // {
  //   path: '/search',
  //   icon: 'search',
  //   component: home,
  //   name: 'search',
  //   title: '搜索管理',
  //   groupId: 7,
  //   children: [
  //     { path: 'search-hot-keyword', icon: 'ios-glasses-outline', name: 'search-hot-keyword', title: '热词管理', component: resolve => { require(['@/components/test1.vue'], resolve);}, id: 34 },
  //     { path: 'search-console', icon: 'ios-speedometer-outline', name: 'search-console', title: '控制台', component: resolve => { require(['@/components/test1.vue'], resolve);}, id: 35}

  //   ]
  // },
  {
    path: '/material',
    icon: 'ios-star',
    component: home,
    name: 'material',
    title: '素材管理',
    groupId: 5,
    children: [

      // { path: 'robot-control', icon: 'waterdrop', name: 'robot-control', title: '机器人管理', component: resolve => { require(['@/components/test1.vue'], resolve);}, id: 36},
      // { path: 'emotion-mbti', icon: 'waterdrop', name: 'emotion-mbti', title: 'MBTI王国映射管理', component: resolve => { require(['@/components/test1.vue'], resolve);}, id: 37},
      // { path: 'emotion-tease', icon: 'waterdrop', name: 'emotion-tease', title: '逗一逗管理', component: resolve => { require(['@/components/test1.vue'], resolve);}, id: 38},
      { path: 'tag-control', icon: 'pricetags', name: 'tag-control', title: '标签管理', component: resolve => { require(['@/views/tag/tagManage.vue'], resolve);}, id: 10},
      { path: 'tag-kingdom/:id', icon: 'ios-speedometer-outline', name: 'tag-kingdom', title: '标签王国管理', component: resolve => { require(['@/views/tag/tagKingdomManage.vue'], resolve);}, id: ""},
      { path: 'emotion-pack-control', icon: 'android-happy', name: 'emotion-pack-control', title: '表情包管理', component: resolve => { require(['@/views/emotion/emotionPackManage.vue'], resolve);}, id: 11 },
      { path: 'emotion-control/:id', icon: 'ios-glasses-outline', name: 'emotion-control', title: '表情管理', component: resolve => { require(['@/views/emotion/emotionManage.vue'], resolve);}, id: "" },
      // { path: 'emotion-control', icon: 'waterdrop', name: 'emotion-control', title: '情绪管理', component: resolve => { require(['@/components/test1.vue'], resolve);}, id: 41},
      // { path: 'king-cover', icon: 'waterdrop', name: 'king-cover', title: '王国默认封面管理', component: resolve => { require(['@/components/test1.vue'], resolve);}, id: 42},
      // { path: 'records-control', icon: 'waterdrop', name: 'records-control', title: '语录管理', component: resolve => { require(['@/components/test1.vue'], resolve);}, id: 43},
      // { path: 'avatar-control', icon: 'waterdrop', name: 'avatar-control', title: '头像框管理', component: resolve => { require(['@/components/test1.vue'], resolve);}, id: 44},
      { path: 'gift-control', icon: 'ios-box', name: 'gift-control', title: '礼物管理', component: resolve => { require(['@/views/gift/giftManage.vue'], resolve);}, id: 12},
      // { path: 'king-category', icon: 'waterdrop', name: 'king-category', title: '王国分类维护', component: resolve => { require(['@/components/test1.vue'], resolve);}, id: 46},
      { path: 'king-lottery', icon: 'aperture', name: 'king-lottery', title: '王国抽奖列表', component: resolve => { require(['@/views/kingdom/lotteryManage.vue'], resolve);}, id: 13},
      { path: 'lottery-user/:id', icon: 'waterdrop', name: 'lottery-user', title: '抽奖参与用户', component: resolve => { require(['@/views/kingdom/lotteryUser.vue'], resolve);}, id: ''},
      { path: 'industrial-manage', icon: 'social-buffer', name: 'industrial-manage', title: '行业管理', component: resolve => { require(['@/views/industrial/industrialManage.vue'], resolve);}, id: 21},
      // { path: 'tag-sample', icon: 'waterdrop', name: 'tag-sample', title: '标签样本管理', component: resolve => { require(['@/components/test1.vue'], resolve);}, id: 48}
    ]
  },
  {
    path: '/kingprice',
    icon: 'easel',
    component: home,
    name: 'kingprice',
    title: '王国价值管理',
    groupId: 6,
    children: [
      { path: 'king-price-property', icon: 'social-usd', name: 'king-price-property', title: '王国价值属性查询', component: resolve => { require(['@/views/kingdom/kingdomValue.vue'], resolve);}, id: 14},
      { path: 'kingdom-user/:id', icon: 'ios-speedometer-outline', name: 'kingdom-user', title: '王国发言用户列表', component: resolve => { require(['@/views/kingdom/kingdomValueUser.vue'], resolve);}, id: ""},
      // { path: 'king-task-control', icon: 'ios-glasses-outline', name: 'king-task-control', title: '任务控制台', component: resolve => { require(['@/components/test1.vue'], resolve);}, id: 50 },
      // { path: 'king-price-subsidy', icon: 'waterdrop', name: 'king-price-subsidy', title: '补贴配置', component: resolve => { require(['@/components/test1.vue'], resolve);}, id: 51},
    ]
  },
  {
    path: '/listking',
    icon: 'trophy',
    component: home,
    name: 'listking',
    title: '上市王国管理',
    groupId: 7,
    children: [
      { path: 'king-listed', icon: 'ios-speedometer-outline', name: 'kingdom-listed', title: '已上市', component: resolve => { require(['@/views/kingdom/kingdomListed.vue'], resolve);}, id: 15},
      { path: 'king-pending', icon: 'ios-glasses-outline', name: 'king-pending', title: '待成交', component: resolve => { require(['@/views/kingdom/kingPending.vue'], resolve);}, id: 16 },
    ]
  },
  {
    path: '/advertisement',
    icon: 'radio-waves',
    component: home,
    name: 'advertisement',
    title: '广告管理',
    groupId: 8,
    children: [
      { path: 'advertisement-position-manage', icon: 'ios-speedometer-outline', name: 'advertisement-position-manage', title: '广告位管理', component: resolve => { require(['@/views/advertisement/advertisementPositionManage.vue'], resolve);}, id: 17},
      { path: 'advertisement-manage', icon: 'ios-glasses-outline', name: 'advertisement-manage', title: '广告信息管理', component: resolve => { require(['@/views/advertisement/advertisementManage.vue'], resolve);}, id: 18 },
      { path: 'advertisement-tag/:id', icon: 'ios-speedometer-outline', name: 'advertisement-tag', title: 'Tag管理', component: resolve => { require(['@/views/advertisement/advertisementLinkTag.vue'], resolve);}, id: ""},
    ]
  },
  {
    path: '/anchor',
    icon: 'ios-mic',
    component: home,
    name: 'anchor',
    title: '主播管理',
    groupId: 10,
    children: [
      { path: 'anchor-manage', icon: 'person-stalker', name: 'anchor-manage', title: '主播列表', component: resolve => { require(['@/views/anchor/anchorManage.vue'], resolve);}, id: 22},
      { path: 'anchor-invite', icon: 'ios-list-outline', name: 'anchor-invite', title: '邀请统计', component: resolve => { require(['@/views/anchor/anchorInvite.vue'], resolve);}, id: 23},
      { path: 'anchor-invite-detail', icon: 'levels', name: 'anchor-invite-detail', title: '邀请明细', component: resolve => { require(['@/views/anchor/anchorInviteDetail.vue'], resolve);}, id: 24}

    ]
  },
  // {
  //   path: '/zmjx',
  //   icon: 'social-windows-outline',
  //   component: home,
  //   name: 'zmjx',
  //   title: '最美家乡活动',
  //   groupId: 12,
  //   children: [
  //     { path: 'zmjx-config', icon: 'ios-glasses-outline', name: 'zmjx-config', title: '配置管理', component: resolve => { require(['@/components/test1.vue'], resolve);}, id: 57 },
  //     { path: 'zmjx-activity-kingdom', icon: 'ios-speedometer-outline', name: 'zmjx-activity-kingdom', title: '活动王国管理', component: resolve => { require(['@/components/test1.vue'], resolve);}, id: 58},
  //   ]
  // },
  {
    path: '/user',
    icon: 'ios-people',
    name: 'user',
    title: 'CMS用户管理',
    component: home,
    groupId: 1,
    children: [
      { path: 'user-manage', icon: 'person', name: 'user-manage', title: '用户管理', component: resolve => { require(['@/views/cms_user_manage/userManage.vue'], resolve);}, id: 1 },
      // { path: '/add-user', icon: 'waterdrop', name: 'add-user', title: '添加用户', component: addUser },
      // { path: '/modify-user', icon: 'waterdrop', name: 'modify-user', title: '修改用户', component: modifyUser},
      { path: 'role-manage', icon: 'ios-compose', name: 'role-manage', title: '角色管理', component: resolve => { require(['@/views/cms_user_manage/roleManage.vue'], resolve);}, id: 2},
      { path: 'feature-manage', icon: 'waterdrop', name: 'feature-manage', title: '权限管理', component: resolve => { require(['@/views/cms_user_manage/featureManage.vue'], resolve);}, id: 3},
      { path: 'authority-manage', icon: 'ios-locked', name: 'authority-manage', title: '权限分配', component: resolve => { require(['@/views/cms_user_manage/authorityManage.vue'], resolve);}, id: 4 },
    ]
  },
  // {
  //   path: '/test',
  //   icon: 'ios-list-outline',
  //   name: 'test',
  //   title: '测试权限',
  //   component: home,
  //   groupId: "TEST_ACCESS",
  //   children: []
  // }
];

export const routers = [
  loginRouter,
  homeRouter,
  ...appRouter,
  page404,
  page401
];
