<template>
  <div class="tag-wrap">
    <div class="tag-table-title">
      <span class="table-title">关联标签列表</span>
      <div class="tag-button">
        <Button type="primary" icon="plus-round" @click="addAction" class="tag-button-item">添加</Button>
        <Button type="default" icon="arrow-return-left" @click="backToAction" class="tag-button-item">返回</Button>
      </div>
    </div>
    <Table refs="table" border :columns="columns" :data="tagList"></Table>
    <Modal v-model="modalDelTag" width="360">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="information-circled"></Icon>
        <span>删除确认</span>
      </p>
      <div style="text-align:center">
        <p>是否确认删除此条标签？</p>
        <p>{{ selectedTag }}</p>
      </div>
      <div slot="footer">
        <Button type="error" size="large" long :loading="modal_loading" @click="handleDel">删除</Button>
      </div>
    </Modal>
    <Modal v-model="modalAddTag" width="400" class-name="vertical-center-modal">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="information-circled"></Icon>
        <span>{{ tagTitle }}</span>
      </p>
      <div style="text-align:center;">
        <div class="tag-item">
          <label for="tag-name">标签名称<b class="text-require">*</b></label>
          <Input v-model="tagName" placeholder="请输入标签名称" class="tag-item-model" id="tag-name"></Input>
        </div>
        <div class="tag-item">
          <label for="tag-location">位置<b class="text-require">*</b></label>
          <Input v-model="tagLocation" placeholder="请输入位置" class="tag-item-model" id="tag-location"></Input>
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
  name: 'advertisementLinkTag',
  data() {
    return {
      columns: [{
        title: '标签名',
        key: 'name'
      }, {
        title: '位置',
        key: 'position'
      }, {
        title: '操作',
        key: 'action',
        width: 200,
        align: 'center',
        render: (h, params) => {
          return h('div', [
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
          ])
        }
      }],
      tagList: [],
      modal_loading: false,
      modalDelTag: false,
      modalAddTag: false,
      selectedTag: '',
      selectedTagIndex: undefined,
      tagId: undefined,
      tagName: '',
      tagLocation: '',
      modifyOrAddTag: '',
      positionId: undefined,
      index: null
    }
  },
  methods: {
    getToken() {
      this.token = JSON.parse(localStorage.getItem('token'));
      this.index = this.$route.params.index;
    },
    getAllLinkTagList() {
      this.positionId = this.$route.params.id;
      let temData = [];
      this.$http.get(`/api/advertisement/getAllLinkTags?token=${this.token}&positionId=${this.positionId}`).then(
        res => {
          if (res.data.status == 2000) {
            res.data.body.map(item => {
              temData.push(item);
            })
            this.tagList = temData;
            console.log("adLinked tag list:", this.tagList);
          } else {
            this.$Message.error(res.data.body.message);
          }
        }, err => {
          console.log(err.data);
        })
    },
    addAction() {
      this.modalAddTag = true;
      this.modifyOrAddTag = 'addTag';
      this.tagName = '';
      this.tagLocation = '';
    },
    backToAction() {
      // this.$router.go(-1);
      this.$router.push({ name: 'advertisement-position-manage',params:{index: this.index}});
    },
    removeAction(index) {
      this.modalDelTag = true;
      this.tagId = this.tagList[index].id;
      this.selectedTagIndex = index;
      this.selectedTag = this.tagList[index].name;
    },
    handleDel() {
      this.modal_loading = true;
      setTimeout(() => {
        this.modal_loading = false;
        this.modalDelTag = false;
        this.deleteTag(this.tagId);
      }, 1500);
    },
    deleteTag(tagId) {
      let data = { token: this.token, id: tagId, positionId: this.positionId };
      this.$http.post('/api/advertisement/unlinkLinkTag', data)
        .then(
          res => {
            if (res.data.status == 2000) {
              console.log('delete tag info:', res.data);
              this.$Message.success('删除成功');
              this.getAllLinkTagList();
              // this.tagList.splice(this.selectedTagIndex, 1);
            } else {
              this.$Message.error(res.data.body.message);
            }

          }, err => {
            console.log(err.data);
            this.$Message.success('删除失败');
          })
    },
    addTag(tagData) {
      console.log("add tag item:", tagData);
      this.$http.post('/api/advertisement/addLinkTag', tagData)
        .then(
          res => {
            if (res.data.status == 2000) {
              console.log('add tag info:', res.data);
              this.$Message.success('添加标签成功');
              this.modalAddTag = false;
              this.getAllLinkTagList();
              // let temData = Object.assign({}, { id: '' }, tagData);
              // this.tagList.push(temData);
            } else {
              this.$Message.error(res.data.body.message);
              this.modalAddTag = true;

            }
          }, err => {
            this.$Message.success('添加标签失败');
          })
    },

    handleSubmit() {
      if (!this.tagName || !this.tagLocation) {
        this.$Message.error("请完善信息后提交");
      } else {
        let pattern = /^\d{1,}$/;
        if (this.tagLocation && !pattern.test(this.tagLocation)) {
          this.$Message.error("标签位置必须为数字，请重新输入");
          // this.tagLocation = null;
          return false;
        } else {
          this.modal_loading = true;
          setTimeout(() => {
            this.modal_loading = false;

            switch (this.modifyOrAddTag) {
              case 'modifyTag':
                // let modifyData = {
                //   token: this.token,
                //   id: this.tagId,
                //   name: this.tagName,
                //   position: this.tagLocation,
                //   positionId: this.positionId
                // }
                // this.modifyTag(modifyData);
                break;
              case 'addTag':
                let addData = {
                  token: this.token,
                  id: this.tagId ? this.tagId : 0,
                  name: this.tagName,
                  position: this.tagLocation,
                  positionId: this.positionId
                };
                this.addTag(addData);
                break;
            }
          }, 1500);
        }
      }
    },
    handleDismiss() {
      this.modal_loading = false;
      this.modalAddTag = false;
    },
  },
  computed: {
    tagTitle: function() {
      if (this.modifyOrAddTag === 'modifyTag') {
        return "修改标签";
      } else if (this.modifyOrAddTag === 'addTag') {
        return "添加标签";
      }
    }
  },
  created() {
    this.getToken();
    this.getAllLinkTagList();
  },
  watch: {
    // 如果路由有变化，会再次执行该方法
    '$route': function(route) {
      // console.log("route refresh:", route);
      this.getAllLinkTagList();
    }
  }
}

</script>
<style scoped lang="less">
.tag-wrap {
  min-width:768px;
  min-height:100%;
  border:10px solid #f0f0f0;
  border-bottom:none;
  padding-bottom: 15px;
  background: #ffffff;
  .tag-table-title {
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
    .tag-button {
      /*float: right;*/
      display: inline-block;
      vertical-align: middle;
      padding: 0;
      margin-left: 20px;
      .tag-button-item {
        padding: 0;
        width: 60px;
        line-height: 24px;
      }
    }
  }
}

.tag-item {
  label {
    width: 70px;
    display: inline-block;
    vertical-align: middle;
    text-align: left;
  }
  .tag-item-model {
    width: 65%;
    vertical-align: baseline;
    margin-left: 10px;
  }
}

.tag-item+.tag-item {
  margin-top: 10px;
}

.text-require {
  color: #FF6C60;
  font-weight: 700;
  margin-left: 3px;
}

</style>
