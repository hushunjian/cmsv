# CMS

> 拙心网络CMS后台管理系统 project

## 常用命令
详细命令查看package.json scripts

``` bash
# install dependencies 依赖包安装
npm install

# serve with hot reload at localhost:8080 运行本地服务
npm run dev

# build for production with minification 打包
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests 单元测试
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```

## 简介及功能
拙心网络CMS后台管理系统，包括以下功能模块
- 登录/登出
- CMS用户管理
    - 用户管理
    - 角色管理
    - 权限管理
    - 权限分配
- 广告管理
    - 广告位管理
    - 广告信息管理
- APP配置管理
    - 新APP系统配置管理
    - APP灯箱页管理
- 素材管理
    - 标签管理
    - 表情包管理
    - 礼物管理
    - 王国抽奖列表
- App用户管理
    - 用户管理
- 榜单管理
    - 榜单列表
    - 上线榜单管理
- 王国价值
    - 王国价值属性查询
- 上市王国
    - 已上市
    - 待成交


## 文件结构
```shell
.
├── build        Webpack配置、构建
├── config       项目配置（正式、测试环境、代理设置）
├── dist         打包后生成文件夹
│   ├── static        静态文件（css、fonts、img、js）
│   └── index.html    主页
├── node_modules 依赖包文件 
├── src          主文件目录
│   ├── assets        静态文件包(放置图片、第三方js库等)
│   ├── components    组件（功能单一组件、通用组件）
│   ├── router        路由组件
│   └── views         视图组件
│       ├── error_page             错误页面
│       ├── cms_user_manage        CMS用户管理
│       │   ├── authorityManage               权限分配
│       │   ├── userManage                    用户管理
│       │   ├── roleManage                    角色管理
│       │   ├── featureManage                 权限管理
│       ├── advertisement          广告管理
│       │   ├── advertisementManage            广告信息管理
│       │   ├── advertisementPositionManage    广告位管理
│       │   └── advertisementLinkTag           广告位关联标签管理
│       └── app_config             APP配置管理
│           ├── appSystemConfigManage          新APP系统配置管理
│ 
├── test         单元测试
├── index.html   index入口
├── package.json 安装包记录
└── .gitignore   git忽略文件
```

## 项目规范

### 代码风格
详细见 [standard 文档](https://standardjs.com/rules.html)
- 缩进为两个空格
- `,`之后要跟随一个空格
- `:`之后跟随一个空格

### 代码规范
详细见 [airbnb 文档](https://github.com/airbnb/javascript#types)

- 用 let 或者 const，不允许使用 var（常量使用const,变量统一使用let）。
```
const a = 1
const b = 2
let count = 1
```

- 对象或者数组的声明用字面量，而不是构造函数
```
const item = {}
const arr = []
```

- 字符串拼接使用字符串模板，而不是` +` 拼接
```
let a = hello
const template = `${a} world`
```

- 命名规范：变量、函数名、文件名，统一使用驼峰式书写，命名时尽量使用全称（避免简写）
```
let featureList = []
getRoleFeatures(){}

```

- 少用`==`和`!=`，建议使用`===`和`!==`替代
```
if (var === 'howdy') {
    ...
}
```

### CSS样式规范
- CSS样式统一使用less预处理格式；
- 全局样式写在src->main.less文件里;
- 局部(组件)样式写在组件style标签里，避免样式污染。


## 技术栈相关文档推荐
核心技术栈(包括但不限于以下)：
- [Vue 2.0](https://cn.vuejs.org/v2/guide/)
- [iView](https://www.iviewui.com) UI组件库
- [Vue-router路由](https://router.vuejs.org/zh-cn/)
- [Vue-Resource服务](https://www.gitbook.com/book/cw1997/vue-resource/details) 
- [vue-loader](https://vue-loader.vuejs.org/zh-cn/)
- [vuex状态管理](https://vuex.vuejs.org/zh-cn/)
- [less](http://less.bootcss.com/)
- [ES6](http://es6.ruanyifeng.com/)
- [Vue-cli配置](https://seminelee.github.io/2017/07/09/webpack-2/)

Copyright (c) 2016-present, 拙心网络