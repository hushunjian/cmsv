<template>
  <div class="gift-wrap">
    <div class="gift-table-title">
      <span class="table-title">礼物列表</span>
      <div class="gift-button">
        <Button type="success" icon="plus-round" @click="addAction" class="gift-button-item">添加</Button>
      </div>
    </div>
    <Checkbox-group v-model="tableColumnsChecked" @on-change="changeTableColumns">
      <Checkbox label="name">礼物名</Checkbox>
      <Checkbox label="sortNumber">排序序号</Checkbox>
      <Checkbox label="image">图片</Checkbox>
      <Checkbox label="price">价格</Checkbox>
      <Checkbox label="addPrice">估值增加</Checkbox>
      <Checkbox label="gifImage">Gif动画</Checkbox>
      <Checkbox label="duration">播放时长</Checkbox>
      <Checkbox label="action">操作</Checkbox>
    </Checkbox-group>
    <Table refs="table" border :columns="columns" :data="giftList"></Table>
    <div style="margin: 20px 10px 10px;overflow: hidden">
      <div style="float: right;">
        <Page :total="totalCount" :current="pageIndex" @on-change="changePage"></Page>
      </div>
    </div>
    <Modal v-model="modalDelGift" width="360">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="information-circled"></Icon>
        <span>删除确认</span>
      </p>
      <div style="text-align:center">
        <p>是否确认删除此条礼物吗？</p>
        <p>{{ selectedGiftName }}</p>
      </div>
      <div slot="footer">
        <Button type="error" size="large" long :loading="modal_loading" @click="handleDel">删除</Button>
      </div>
    </Modal>
    <Modal v-model="modalGift" width="480" :styles="{top: '20px',marginBottom: '20px'}">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="information-circled"></Icon>
        <span>{{ giftTitle }}</span>
      </p>
      <div style="text-align:center;">
        <div class="gift-item">
          <label for="gift-name">礼物名称<b class="text-require">*</b></label>
          <Input v-model="giftName" placeholder="请输入礼物名称" class="gift-item-model" id="gift-name"></Input>
        </div>
        <div class="gift-item">
          <label for="" style="vertical-align: top">礼物图片<b class="text-require">*</b></label>
          <!-- <div class="gift-img gift-item-model">
            <uploadImg :preview="previewImg" :type="imgType='image'" @transferData="getData"></uploadImg>
          </div> -->
          <div class="gift-img gift-item-model">
            <div class="gift-img-pre">
              <img :src="previewImg" alt="">
            </div>
             <imgUpload :type="imgType='image'" @transferData="getData"></imgUpload>
          </div>
          <!-- <div class="gift-img gift-item-model">
            <div class="gift-img-pre">
              <img :src="previewImg" alt="" id="gift-pic">
            </div>
            <Button type="primary" @click="openPic">选择上传图片</Button>
            <imageUpload v-if="picCom" :preview="previewImg" :type="imgType='image'" @transferData="getData"></imageUpload>
          </div> -->
        </div>
        <div class="gift-item">
          <label for="gift-width">礼物图片宽度<b class="text-require">*</b></label>
          <Input v-model="giftWidth" placeholder="请输入礼物图片宽度" class="gift-item-model" id="gift-width"></Input>
        </div>
        <div class="gift-item">
          <label for="gift-height">礼物图片高度<b class="text-require">*</b></label>
          <Input v-model="giftHeight" placeholder="请输入礼物图片高度" class="gift-item-model" id="gift-height"></Input>
        </div>
        <div class="gift-item">
          <label for="gift-price">礼物价值<b class="text-require">*</b></label>
          <Input v-model="giftPrice" placeholder="请输入礼物价值" class="gift-item-model" id="gift-price"></Input>
        </div>
        <div class="gift-item">
          <label for="gift-price">王国估值增加价值<b class="text-require">*</b></label>
          <Input v-model="giftAddPrice" placeholder="请输入王国估值增加价值" class="gift-item-model" id="gift-price"></Input>
        </div>
        <div class="gift-item">
          <label for="" style="vertical-align: top">动画图片</label>
          <div class="gift-img gift-item-model">
            <div class="gift-img-pre">
              <img :src="previewGifImg" alt="">
            </div>
             <imgUpload :type="imgType='gifImage'" @transferData="getData"></imgUpload>
          </div>
          <!-- <div class="gift-img gift-item-model">
            <div class="gift-img-pre">
              <img :src="previewGifImg" alt="" id="gift-pic">
            </div>
            <Button type="primary" @click="openPic">选择上传图片</Button>
            <imageUpload v-if="picCom" :preview="previewGifImg" :type="imgType='gifImage'" @transferData="getData"></imageUpload>
          </div> -->
        </div>
        <div class="gift-item">
          <label for="gift-duration">播放时长<b class="text-require">*</b></label>
          <Input v-model="giftDuration" placeholder="请输入播放时长" class="gift-item-model" id="gift-duration"></Input>
        </div>
        <div class="gift-item">
          <label for="gift-sortNumber">排序序号<b class="text-require">*</b></label>
          <Input v-model="giftSortNumber" placeholder="请输入排序序号" class="gift-item-model" id="gift-sortNumber"></Input>
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
import uploadImg from '@/components/uploadImg.vue'
import imageUpload from '@/components/imageUpload.vue'
import imgUpload from '@/components/imgUpload.vue'
export default {
  name: 'giftManage',
  components: {
    uploadImg,
    imageUpload,
    imgUpload
  },
  data() {
    return {
      columns: [],
      giftList: [],
      modal_loading: false,
      modalDelGift: false,
      modalGift: false,
      selectedGiftName: '',
      selectedgiftIndex: undefined,
      giftId: undefined,
      giftName: '',
      giftOrder: null,
      giftWidth: null,
      giftHeight: null,
      giftPrice: null,
      giftAddPrice: null,
      giftDuration: null,
      giftSortNumber: null,
      modifyOrAddGift: '',
      token: '',
      pageIndex: 1,
      pageSize: 10,
      totalCount: undefined,
      baseUrl: 'https://cdn.me-to-me.com/',
      previewImg: '',
      previewGifImg: '',
      originImg: '',
      originGifImg: '',
      fileName: '',
      originFileName: '',
      gifFileName: '',
      originGifFileName: '',
      imgDataType: 1,
      picCom: false,
      tableColumnsChecked: ['name', 'sortNumber', 'image', 'price', 'addPrice', 'gifImage', 'duration', 'action']
    }
  },
  methods: {
    getToken() {
      this.token = JSON.parse(localStorage.getItem('token'));
    },
    getTable2Columns() {
      const table2ColumnList = {
        index: {
          title: '序号',
          key: 'index',
          width: 50,
          /*fixed: 'left',*/
          align: 'center'
        },
        name: {
          title: '礼物名',
          key: 'name',
          align: 'center',
          /*width: 100*/
        },
        sortNumber: {
          title: '排序序号',
          key: 'sortNumber',
          align: 'center',
          width: 80
        },
        image: {
          title: '图片',
          key: 'image',
          align: 'center',
          render: (h, params) => {
            let row = params.row;
            let imgStatus = row.image.match(/https\:\/\/cdn.me-to-me.com\/(.*)/)[1];
            if (imgStatus) {
              return h('img', {
                attrs: {
                  src: params.row.image,
                },
                style: {
                  display: 'inline-block',
                  width: '100%',
                  marginTop: '5px',
                  width: '120px'
                }
              })
            } else {
              return h('span', '暂无图片');
            }
          }
        },
        price: {
          title: '价格',
          key: 'price',
          align: 'center',
          /*width: 60*/
        },
        addPrice: {
          title: '估值增加',
          key: 'addPrice',
          align: 'center',
          width: 80
        },
        gifImage: {
          title: 'Gif动画',
          key: 'gifImage',
          align: 'center',
          render: (h, params) => {
            let row = params.row;
            let imgStatus = row.gifImage.match(/https\:\/\/cdn.me-to-me.com\/(.*)/)[1];
            if (imgStatus) {
              return h('img', {
                attrs: {
                  src: params.row.gifImage,
                },
                style: {
                  display: 'inline-block',
                  width: '100%',
                  marginTop: '5px',
                  width: '120px'
                }
              })
            } else {
              return h('span', '暂无图片');
            }
          }
        },
        duration: {
          title: '播放时长',
          key: 'duration',
          align: 'center',
          /*width: 80*/
        },
        action: {
          title: '操作',
          key: 'action',
          width: 125,
          align: 'center',
          /*fixed: 'right',*/
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
              }, '编辑'),
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
        }
      }
      let data = [table2ColumnList.index];
      this.tableColumnsChecked.forEach(col => data.push(table2ColumnList[col]));
      return data;
    },
    changeTableColumns() {
      this.columns = this.getTable2Columns();
    },
    getAllgiftList() {
      let temData = [];
      this.$http.get(`/api/gift/getAllGifts?token=${this.token}&pageIndex=${this.pageIndex}&pageSize=${this.pageSize}`).then(
        res => {
          if (res.data.status == 2000) {
            this.totalCount = res.data.body.total;
            res.data.body.data.map((item,index) => {
              let indexNumber;
              if (this.pageIndex == 1) {
                indexNumber = index+1;
              } else {
                if (index === 9) {
                  indexNumber = this.pageIndex+ (0).toString();
                } else {
                  indexNumber = this.pageIndex-1+ (index+1).toString();
                }
              }
              item.index = indexNumber;
              item.image = this.baseUrl + item.image;
              item.gifImage = this.baseUrl + item.gifImage;
              temData.push(item);
            })
            this.giftList = temData;
            console.log("adLinked gift list:", this.giftList);
          } else {
            this.$Message.error(res.data.body.message);
          }
        }, err => {
          console.log(err.data);
        })
    },
    addAction() {
      this.modalGift = true;
      this.modifyOrAddGift = 'addGift';
      this.giftName = '';
      this.previewImg = '';
      this.previewGifImg = '';
      this.giftWidth = null;
      this.giftHeight = null;
      this.giftPrice = '';
      this.giftAddPrice = null;
      this.giftSortNumber = null;
      this.giftDuration = null;
      this.fileName = null;
      this.gifFileName = null;
    },
    modifyAction(index) {
      let imgStatus = this.giftList[index].image.match(/https\:\/\/cdn.me-to-me.com\/(.*)/)[1];
      let gifImgStatus = this.giftList[index].gifImage.match(/https\:\/\/cdn.me-to-me.com\/(.*)/)[1];

      this.modalGift = true;
      this.modifyOrAddGift = 'modifyGift';
      this.giftId = this.giftList[index].giftId;
      this.giftName = this.giftList[index].name;
      this.previewImg = imgStatus ? this.giftList[index].image : '';
      this.originImg = imgStatus ? this.giftList[index].image : '';
      this.previewGifImg = gifImgStatus ? this.giftList[index].gifImage : '';
      this.originGifImg = gifImgStatus ? this.giftList[index].gifImage : '';
      /* this.previewImg = this.giftList[index].image;
      this.originImg = this.giftList[index].image;
      this.previewGifImg = this.giftList[index].gifImage;
      this.originGifImg = this.giftList[index].gifImage; */
      this.giftWidth = this.giftList[index].imageWidth;
      this.giftHeight = this.giftList[index].imageHeight;
      this.giftPrice = this.giftList[index].price;
      this.giftAddPrice = this.giftList[index].addPrice;
      this.giftDuration = this.giftList[index].duration;
      this.giftSortNumber = this.giftList[index].sortNumber;
      this.selectedgiftIndex = index;
      /* this.fileName = this.previewImg.match(/https\:\/\/cdn.me-to-me.com\/(.*)/)[1]; */
      this.fileName = imgStatus ? imgStatus : '';
      this.originFileName = this.fileName;
      /* this.gifFileName = this.previewGifImg.match(/https\:\/\/cdn.me-to-me.com\/(.*)/)[1]; */
      this.gifFileName = gifImgStatus ? gifImgStatus : '';
      this.originGifFileName = this.gifFileName;
    },
    removeAction(index) {
      this.modalDelGift = true;
      this.giftId = this.giftList[index].giftId;
      this.selectedgiftIndex = index;
      this.selectedGiftName = this.giftList[index].name;
    },
    handleDel() {
      this.modal_loading = true;
      setTimeout(() => {
        this.modal_loading = false;
        this.modalDelGift = false;
        this.deletegift(this.giftId);
      }, 1500);
    },
    deletegift(giftId) {
      let data = { token: this.token, giftId: giftId };
      this.$http.post('/api/gift/deleteGift', data)
        .then(
          res => {
            if (res.data.status == 2000) {
              console.log('delete gift info:', res.data);
              this.$Message.success('删除成功');
              this.getAllgiftList();
              // this.giftList.splice(this.selectedgiftIndex, 1);
            } else {
              this.$Message.error(res.data.body.message);
            }
          }, err => {
            console.log(err.data);
            this.$Message.success('删除失败');
          })
    },
    addGift(giftData) {
      console.log("add gift item:", giftData);
      this.$http.post('/api/gift/addGift', giftData)
        .then(
          res => {
            if (res.data.status == 2000) {
              console.log('add gift info:', res.data);
              this.$Message.success('添加礼物成功');
              this.getAllgiftList();
              this.modalGift = false;
              this.fileName = '';
              this.gifFileName = '';
            } else {
              this.$Message.error(res.data.body.message);
              this.modalGift = true;
            }
          }, err => {
            this.$Message.success('添加礼物失败');
          })
    },
    modifyGift(giftData) {
      console.log("modify giftData item:", giftData);
      this.$http.post('/api/gift/updateGift', giftData).then(
        res => {
          if (res.data.status == 2000) {
            console.log('add feature info:', res.data);
            this.$Message.success('修改成功');
            this.getAllgiftList();
            this.modalGift = false;
            this.fileName = '';
            this.gifFileName = '';
            console.log("modified feature list:", this.giftList);
          } else {
            this.$Message.error(res.data.body.message);
            this.modalGift = true;
          }
        }, err => {
          console.log("err data 2:", err.data);
        })
    },
    handleSubmit() {
      if (!this.giftName || !this.giftWidth || !this.giftHeight || !this.giftPrice || !this.giftAddPrice || !this.giftSortNumber || !this.giftDuration || !this.fileName ) {
        this.$Message.error("请完善信息后提交！");
      } else {
        let pattern = /^\d{1,}$/;
        if (!pattern.test(this.giftWidth)) {
          this.$Message.error("图片宽度必须为数字，请重新输入");
          return false;
        } else if (!pattern.test(this.giftHeight)) {
          this.$Message.error("图片高度必须为数字，请重新输入");
          return false;
        } else if (!pattern.test(this.giftPrice)) {
          this.$Message.error("礼物价值必须为数字，请重新输入");
          return false;
        } else if (!pattern.test(this.giftAddPrice)) {
          this.$Message.error("王国估值增加值必须为数字，请重新输入");
          return false;
        } else if (!pattern.test(this.giftDuration)) {
          this.$Message.error("播放时长必须为数字，请重新输入");
          return false;
        } else if (!pattern.test(this.giftSortNumber)) {
          this.$Message.error("排序序号必须为数字，请重新输入");
          return false;
        } else {
          this.modal_loading = true;
          setTimeout(() => {
            this.modal_loading = false;

            switch (this.modifyOrAddGift) {
              case 'modifyGift':
                let modifyData = {
                  token: this.token,
                  giftId: this.giftId,
                  name: this.giftName,
                  image: this.fileName,
                  imageWidth: this.giftWidth,
                  imageHeight: this.giftHeight,
                  gifImage: this.gifFileName,
                  price: this.giftPrice,
                  addPrice: this.giftAddPrice,
                  duration: this.giftDuration,
                  sortNumber: this.giftSortNumber
                }
                this.modifyGift(modifyData);
                break;
              case 'addGift':
                let addData = {
                  token: this.token,
                  name: this.giftName,
                  image: this.fileName,
                  imageWidth: this.giftWidth,
                  imageHeight: this.giftHeight,
                  gifImage: this.gifFileName,
                  price: this.giftPrice,
                  addPrice: this.giftAddPrice,
                  duration: this.giftDuration,
                  sortNumber: this.giftSortNumber
                };
                this.addGift(addData);
                break;
            }
          }, 1500);
        }
      }
    },
    handleDismiss() {
      this.modal_loading = false;
      this.modalGift = false;
    },
    openPic() {
      this.picCom = true;
    },
    changePage(e) {
      console.log("change page info:", e);
      this.pageIndex = e;
      this.getAllgiftList();
    },
    getData(msg) {
      // 外层调用组件方注册变更方法，将组件内的数据变更，同步到组件外的数据状态中
      console.log("transfer Data:", msg);
      this.picCom = false;
      if (msg.type === 'image') {
        this.previewImg = msg.img;
        this.fileName = msg.fileName;
        // if (msg.img) {
        //   this.previewImg = msg.img;
        //   this.fileName = msg.fileName;
        // } else {
        //   this.previewImg = this.previewImg;
        //   this.fileName = this.fileName;
        // }
      } else if (msg.type === 'gifImage') {
        this.previewGifImg = msg.img;
        this.gifFileName = msg.fileName;
        // if (msg.img) {
        //   this.previewGifImg = msg.img;
        //   this.gifFileName = msg.fileName;
        // } else {
        //   this.previewGifImg = this.originImg;
        //   this.gifFileName = this.originGifFileName;
        // }
      }
    },
  },
  computed: {
    giftTitle: function() {
      if (this.modifyOrAddGift === 'modifyGift') {
        return "修改礼物";
      } else if (this.modifyOrAddGift === 'addGift') {
        return "添加礼物"
      }
    }
  },
  created() {
    this.getToken();
    this.getAllgiftList();
    this.changeTableColumns();
  },
  mounted() {
    this.changeTableColumns();
  }
}

</script>
<style scoped lang="less">
.gift-wrap {
  min-width:1080px;
  min-height:100%;
  border:10px solid #f0f0f0;
  border-bottom:none;
  padding-bottom: 15px;
  background: #ffffff;
  .gift-table-title {
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
    .gift-button {
      display: inline-block;
      vertical-align: middle;
      margin-left: 20px;
      /*float: right;*/
      padding: 0;
      .gift-button-item {
        padding: 0;
        width: 60px;
        line-height: 24px;
      }
    }
  }
}

.gift-item {
  label {
    width: 110px;
    display: inline-block;
    vertical-align: middle;
    text-align: left;
  }
  .gift-item-model {
    width: 60%;
    vertical-align: baseline;
    margin-left: 10px;
  }
}

.gift-item+.gift-item {
  margin-top: 10px;
}

.gift-img {
  display: inline-block;
  text-align: left;
  .gift-img-pre {
    width: 120px;
    min-height: 90px;
    max-height: 120px;
    overflow: hidden;
    border: 1px solid #dddee1;
    border-radius: 4px;
    padding: 5px;
    margin-bottom: 10px;
    img {
      width: 100%;
    }
  }
}

.text-require {
  color: #FF6C60;
  font-weight: 700;
  margin-left: 3px;
}

.ivu-checkbox-group {
  padding:10px;
}

</style>
