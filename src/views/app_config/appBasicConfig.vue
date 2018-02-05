<template>
  <div class="app-config-wrap">
    <div class="app-config-title">
      <span class="table-title">基础配置列表</span>
      <Button type="success" class="app-cache" icon="plus-round" @click="cacheAction">全量刷新缓存</Button>
    </div>
    <template>
      <Tabs @on-click="changeTab" v-model="tabIndex">
        <tabPane v-for="(item,index) in basicConfigList" :label="item.name" :key="item.groupId" :name="index.toString()">
          <Table refs="configTable" border :columns="columns" :data="item.items" v-if="index == tabIndex"></Table>
        </tabPane>
     </Tabs>
    </template>
    <Modal v-model="modalModifyConfig" width="600" class-name="vertical-center-modal">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="information-circled"></Icon>
        <span>基础配置更新</span>
      </p>
      <div style="text-align:center;">
        <div class="app-item">
          <label for="app-des">配置项</label>
          <Input v-model="appConfigDes" disabled placeholder="请输入配置项描述" class="app-item-model" id="app-des"></Input>
        </div>
        <div class="app-item">
          <label for="app-key">Key</label>
          <Input v-model="appConfigKey" disabled placeholder="请输入Key" class="app-item-model" id="app-key"></Input>
        </div>
        <div class="app-item">
          <label for="app-value" style="vertical-align: top">Value</label>
          <Input v-model="appConfigValue" type="textarea" :rows="10" placeholder="请输入配置项值" class="app-item-model" id="app-value" style="vertical-align: top"></Input>
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
  name: 'appBasicConfig',
  data() {
    return {
      columns: [{
        title: '描述',
        key: 'des',
        width: 200
      }, {
        title: 'key',
        key: 'key',
        width: 200
      }, {
        title: 'value',
        key: 'value'
      }, {
        title: '操作',
        key: 'action',
        width: 70,
        align: 'center',
        render: (h, params) => {
          return h('div', [
            h('Button', {
              props: {
                type: 'info',
                size: 'small'
              },
              style: {

              },
              on: {
                click: () => {
                  this.modifyAction(params);
                }
              }
            }, '编辑')
          ])
        }
      }],
      token: '',
      tabData: [],
      basicConfigList: [],
      modalModifyConfig: false,
      modal_loading: false,
      appConfigDes: '',
      appConfigValue: undefined,
      appConfigKey: '',
      selectedIndex: undefined,
      groupId: undefined,
      tabIndex: 0,
      itemGroupId: null
    }
  },
  methods: {
    getToken() {
      this.token = JSON.parse(localStorage.getItem('token'));
    },
    getAppBasicConfig () {
      let temData = [];
      this.$http.post(`/api/appconfig/getAppBasicConfig`,{token:this.token},{emulateJSON: true}).then(
        res => {
          if (res.data.status == 2000) {
            res.data.body.map(item => {
              let object = Object.assign({}, { name: item.name }, { groupId: item.groupId }, {items: item.items});
              temData.push(object);
            })
            this.basicConfigList = temData;
          } else {
            this.$Message.error(res.data.body.message);
          }
        }, err => {
          console.log(err.data);
        })
    },
    cacheAction () {
      this.$http.post(`/api/appconfig/refreshCache`,{token:this.token},{emulateJSON: true}).then( res => {
        if (res.data.status == 2000) {
          this.$Message.success('刷新缓存成功');
        } else {
          this.$Message.error(res.data.body.message);
        }
      }, err => console.log(err.data));
    },
    modifyAppConfig (appData) {
      // console.log("modify appConfig Data:", appData);
      this.$http.post('/api/appconfig/updateAppBasicConfig', appData).then( res => {
          if (res.data.status === 2000) {
            this.$Message.success('修改成功');
            this.modalModifyConfig = false;
            this.basicConfigList.map(item => {
              if (item.groupId === this.groupId) {
                item.items.map((res,index) => {
                  if (index === this.selectedIndex) {
                    res.value = appData.value;
                  }
                })
              }
            })
          } else {
            this.$Message.error(res.data.message);
            this.modalModifyConfig = true;
          }
      }, err => {
        console.log(err.data);
      })
    },
    modifyAction (params) {
      console.log("item params:", params);
      this.modalModifyConfig = true;
      this.appConfigDes = params.row.des;
      this.appConfigKey = params.row.key;
      this.appConfigValue = params.row.value;
      // this.appConfigValue = JSON.stringify(params.row.value);
      this.selectedIndex = params.index;
      this.basicConfigList.map(item => {
        let tem = item.items.find(res => res.key === this.appConfigKey);
        if (tem) {
          this.groupId = item.groupId;
        }
      })
      // console.log("item groupId:", this.groupId, this.appConfigValue);
    },
    handleSubmit () {
      if (!this.appConfigValue) {
        this.appConfigValue = '';
        /*this.$Message.error('请完善信息后提交');*/
      }
      this.modal_loading = true;
      setTimeout(() => {
        this.modal_loading = false;

        let data = {
          token: this.token,
          itemGroupId: this.groupId,
          des: this.appConfigDes,
          key: this.appConfigKey,
          value: this.appConfigValue
        }
        this.modifyAppConfig(data);
      }, 1500)
    },
    handleDismiss () {
      this.modal_loading = false;
      this.modalModifyConfig = false;
    },
    changeTab (e) {
      console.log("change tab:",e, this.tabIndex);
    }
  },
  created () {
    this.getToken();
    this.getAppBasicConfig();
  },
  watch: {
    // 如果路由有变化，会再次执行该方法
    '$route': function (route) {
      this.getAppBasicConfig();
    }
  }
}
</script>
<style scoped lang="less">
.app-config-wrap {
  min-width:1000px;
  min-height:100%;
  border:10px solid #f0f0f0;
  border-bottom:none;
  padding-bottom: 15px;
  background: #ffffff;
  .app-config-title {
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
    .app-cache {
      /*float: right;*/
      display: inline-block;
      vertical-align: middle;
      padding: 0;
      width: 100px;
      line-height: 24px;
      margin-left: 20px;
    }
  }
}
.app-item {
  label {
    width: 60px;
    display: inline-block;
    vertical-align: middle;
    text-align: left;
  }
  .app-item-model {
    width: 75%;
    vertical-align: middle;
    margin-left: 10px;
    textarea.ivu-input {
      font-size: 12px;
    }
  }
}

.app-item + .app-item {
  margin-top: 10px;
}
</style>
