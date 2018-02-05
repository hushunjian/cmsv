<template>
  <div class="feature-wrap">
    <div class="feature-table-title">
      <span class="table-title">权限列表</span>
      <Button type="success" class="add-feature-icon" icon="plus-round" @click="addAction">添加</Button>
    </div>
    <Table refs="table2" border :columns="columns" :data="featuresList"></Table>
    <Modal v-model="modalDelfeature" width="360" class-name="vertical-center-modal">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="information-circled"></Icon>
        <span>删除确认</span>
      </p>
      <div style="text-align:center">
        <p>是否确认删除此权限？</p>
        <p>{{ deletefeatureName }}</p>
      </div>
      <div slot="footer">
        <Button type="error" size="large" long :loading="modal_loading" @click="handleDel">删除</Button>
      </div>
    </Modal>
    <Modal v-model="modalAddfeature" width="400" class-name="vertical-center-modal">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="information-circled"></Icon>
        <span>{{ featureTitle }}</span>
      </p>
      <div style="text-align:center;margin:0 10px;">
        <div class="feature-item">
          <label for="feature-name">权限名</label>
          <Input v-model="featureName" placeholder="请输入权限名" class="feature-item-model" id="feature-name"></Input>
        </div>
        <div class="feature-item">
          <label for="">父权限</label>
          <Select v-model="featureGroupId" style="width:80%;text-align:left;vertical-align:middle;" class="feature-item-model">
            <Option v-for="item in parentFeatureList" :value="item.groupId" :key="item.groupId">{{ item.groupName }}</Option>
          </Select>
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
  name: 'featureControl',
  data() {
    return {
      columns: [{
        title: '父权限',
        key: 'groupName',
      }, {
        title: '父级Id',
        key: 'groupId',
        width: 100,
        align: 'center'
      }, {
        title: '子权限名',
        key: 'name'
      }, {
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
      }],
      modalDelfeature: false,
      modalAddfeature: false,
      modal_loading: false,
      featureId: undefined,
      selectedFeatureIndex: undefined,
      deletefeatureName: '',
      featureName: '',
      featureGroupId: undefined,
      modifyOrAddfeature: '',
      featureOrderNumber: '',
      featuresList: [],
      parentFeatureList: [],
      groupName: '',
      selectedGroupId: undefined
    }
  },
  methods: {
    getToken() {
      this.token = JSON.parse(localStorage.getItem('token'));
    },
    getAllFeaturesList() {
      let temArr = [], objArr = [];
      this.$http.get(`/api/feature/getAllFeatures?token=${this.token}`).then(
        res => {
          if (res.data.status == 2000) {
            console.log("all features:", res.data.body);
            res.data.body.map(item => {
              if (item.hasOwnProperty('features')) {
                item.features.map(tem => {
                  let data = Object.assign({}, { groupId: item.groupId }, { groupName: item.groupName }, tem);
                  temArr.push(data);
                })
              }
              objArr.push(item);
            })
            this.featuresList = temArr;
            this.parentFeatureList = objArr;
          } else {
            this.$Message.error(res.data.body.message);
          }
        }, err => {
          console.log(err.data);
        })
    },
    modifyAction(index) {
      this.modalAddfeature = true;
      this.featureId = this.featuresList[index].id;
      this.featureName = this.featuresList[index].name;
      this.featureGroupId = this.featuresList[index].groupId;
      this.selectedGroupId = this.featuresList[index].groupId;
      this.groupName = this.featuresList[index].groupName;
      this.selectedFeatureIndex = index;
      this.modifyOrAddfeature = 'modifyfeature';
    },
    removeAction(index) {
      this.modalDelfeature = true;
      this.featureId = this.featuresList[index].id;
      this.selectedFeatureIndex = index;
      this.deletefeatureName = this.featuresList[index].name;
    },
    addAction() {
      this.modalAddfeature = true;
      this.modifyOrAddfeature = 'addfeature';
      this.featureName = '';
      this.featureGroupId = null;
    },
    handleDel() {
      this.modal_loading = true;
      setTimeout(() => {
        this.modal_loading = false;
        this.modalDelfeature = false;
        this.deletefeature(this.featureId);
      }, 1500);
    },
    deletefeature(featureId) {
      let data = { token: this.token, id: featureId };
      this.$http.post('/api/feature/deleteFeature', data)
        .then(
          res => {
            if (res.data.status == 2000) {
              this.$Message.success('删除成功');
              this.getAllFeaturesList();
              // this.featuresList.splice(this.selectedFeatureIndex, 1);
            } else {
              this.$Message.error(res.data.body.message);
            }
          }, err => {
            console.log(err.data)
          })
    },
    addFeature(featureData) {
      console.log('add feature item:', featureData)
      let groupName = this.getGroupName(featureData.featureGroupId);
      this.$http.post('/api/feature/addFeature', featureData)
        .then(
          res => {
            if (res.data.status == 2000) {
              this.$Message.success('添加成功');
              this.getAllFeaturesList();
              this.modalAddfeature = false;
            } else {
              this.$Message.error(res.data.body.message);
              this.modalAddfeature = true;
            }
          }, err => {
            console.log(err.data);
            this.$Message.success('添加权限失败!');
          })
    },
    getGroupName(dataId) {
      let temData;
      console.log("feature list:", this.featuresList);
      this.featuresList.some(item => {
        if (item.groupId == dataId) {
          console.log("group name:", dataId, item)
          temData = item.groupName;
          return true;
        }
      })
      return temData;
    },
    modifyFeature(featureData) {
      let groupName = this.getGroupName(featureData.featureGroupId);
      this.$http.post('/api/feature/updateFeature', featureData)
        .then(
          res => {
            if (res.data.status == 2000) {
              this.$Message.success('修改成功');
              this.getAllFeaturesList();
              this.modalAddfeature = false;
            } else {
              this.$Message.error(res.data.body.message);
              this.modalAddfeature = true;
            }
          }, err => {
            console.log(err.data);
            this.$Message.success('修改权限失败!');
          })
    },
    handleSubmit() {
      if (!this.featureName || !this.featureGroupId) {
        this.$Message.error('请输入权限名及选取父权限!');
      } else {
        this.modal_loading = true;
        setTimeout(() => {
          this.modal_loading = false;

          switch (this.modifyOrAddfeature) {
            case 'modifyfeature':
              let data = {
                token: this.token,
                id: this.featureId,
                name: this.featureName,
                featureGroupId: this.featureGroupId
              }
              this.modifyFeature(data);
              break;
            case 'addfeature':
              let data2 = {
                token: this.token,
                name: this.featureName,
                featureGroupId: this.featureGroupId
              }
              this.addFeature(data2);
              break;
          }
        }, 1500)
      }
    },
    handleDismiss() {
      this.modal_loading = false;
      this.modalAddfeature = false;
    },
    changePage(e) {
      console.log("change page info:", e);
    }
  },
  computed: {
    featureTitle: function() {
      console.log("feature Title:", this.modifyOrAddfeature);
      if (this.modifyOrAddfeature === 'modifyfeature') {
        return "修改权限";
      } else if (this.modifyOrAddfeature === 'addfeature') {
        return "添加权限";
      }
    }
  },
  created() {
    this.getToken();
    this.getAllFeaturesList();

  }
}

</script>
<style scoped lang="less">
.feature-wrap {
  min-width: 600px;
  min-height:100%;
  border:10px solid #f0f0f0;
  border-bottom:none;
  padding-bottom: 15px;
  background: #ffffff;
  .feature-table-title {
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
    .add-feature-icon {
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

.feature-item {
  label {
    width: 50px;
    display: inline-block;
    text-align: right;
    verticle-align: middle;
  }
  .feature-item-model {
    width: 80%;
    vertical-align: baseline;
    margin-left: 10px;
  }
}

.feature-item+.feature-item {
  margin-top: 10px;
}

</style>
