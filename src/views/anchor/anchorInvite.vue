<template>
  <div class="anchor-wrap">
    <div class="anchor-table-title">
      <span class="table-title">搜索操作</span>
    </div>
    <div class="anchor-search">
      <!--<Button type="default" icon="ios-search-strong" @click="searchAction">查询</Button>-->
      <div class="anchor-search-detail">
        <div class="anchor-search-item">
          <label for="uid">主播UID</label>
          <Input v-model="uidSearch" placeholder="请输入主播UID" class="anchor-item-model" id="uid"></Input>
        </div>
        <div class="anchor-search-item">
          <label for="">查询注册时间</label>
          <DatePicker v-model="createdBegin" :editable="false" :clearable="false" type="datetime" placeholder="点击选择时间" style="width: 160px;margin-left:5px;"></DatePicker> -
          <DatePicker v-model="createdEnd" :editable="false" :clearable="false" type="datetime" placeholder="点击选择时间" style="width: 160px;"></DatePicker>
        </div>
        <Button type="primary" icon="ios-search-strong" @click="searchAnchor" style="margin-bottom:10px;margin-left:20px">搜索</Button>
      </div>
    </div>
    <div class="anchor-table-title">
      <span class="table-title">邀请统计</span>
    </div>
    <Table ref="table2" border :columns="columns" :data="anchorList" class="anchor-table"></Table>
    <div style="margin: 20px 10px 10px;overflow: hidden">
      <div style="float: right;">
        <Page :total="totalCount" :current="pageIndex" @on-change="changePage"></Page>
      </div>
    </div>
  </div>
</template>
<script>
  import uploadImg from '@/components/uploadImg.vue'
  import imgUpload from '@/components/imgUpload.vue'
  export default {
    name: 'anchorInvite',
    data() {
      return {
        columns: [{
          title: '序号',
          key: 'index',
          width: 50,
          align: 'center',
          /*fixed: 'left'*/
        }, {
          title: '主播UID',
          key: 'uid',
          align: 'center'
        }, {
          title: '主播昵称',
          key: 'nickName',
          /*width: 160*/
        }, {
          title: '真实姓名',
          key: 'realName',
          align: 'center'
        }, {
          title: '邀请人数',
          key: 'inviteCounts',
          align: 'center'
        }],
        uidSearch: undefined,
        createdBegin: null,
        createdEnd: null,
        anchorList: [],
        token: '',
        pageIndex: 1,
        pageSize: 10,
        totalCount: undefined,
        searchStatus: false
      }
    },
    methods: {
      getToken () {
        this.token = JSON.parse(localStorage.getItem('token'));
        if (this.$route.params.index) {
          this.pageIndex = this.$route.params.index;
        }
      },
      getAnchorList (type) {
        let temData = [];
        let url;
        let httpData;
        if (type === 'get') {
          url = `/api/anchor/getAnchorInvite?token=${this.token}&pageIndex=${this.pageIndex}&pageSize=${this.pageSize}`;
          httpData = this.$http.get(url);
        } else if (type === 'search') {
          url = `/api/anchor/getAnchorInviteSearch`;
          let data = {
            token: this.token,
            pageIndex: this.pageIndex,
            pageSize: this.pageSize,
            uid: this.uidSearch,
            createdBegin: new Date(this.createdBegin).getTime(),
            createdEnd: new Date(this.createdEnd).getTime()
          }
          if (data.createdEnd && data.createdEnd < data.createdBegin) {
            this.$Message.error("注册时间结束时间应大于开始时间，请重新输入");
            return false;
          } else {
            httpData = this.$http.post(url, data);
          }
        }
        httpData.then(
          res => {
            if (res.data.status == 2000) {
              this.totalCount = res.data.body.total;
              res.data.body.data.map((item, index) => {
                let indexNumber;
                if (this.pageIndex == 1) {
                  indexNumber = index + 1;
                } else {
                  if (index === 9) {
                    indexNumber = this.pageIndex + (0).toString();
                  } else {
                    indexNumber = this.pageIndex - 1 + (index + 1).toString();
                  }
                }
                item.index = indexNumber;
                temData.push(item);
              })
              this.anchorList = temData;
              console.log("anchor list:", this.anchorList);
            } else {
              this.$Message.error(res.data.body.message);
            }
          }, err => {
            console.log(err.data);
          })
      },
      changePage(e) {
        console.log("change page info:", e);
        this.pageIndex = e;
        if (this.searchStatus) {
          this.getAnchorList('search');
        } else {
          this.getAnchorList('get');
        }

      },
      searchAction() {
        this.searchStatus = !this.searchStatus;
        if (!this.searchStatus) {
          this.getAnchorList('get');
        }
        // if (this.searchStatus) {
        //   this.parentTagList.splice(0,1,{parentTagId:-1,parentTagName:'全部'});
        // } else {
        //   this.parentTagList.splice(0,1,{parentTagId:0,parentTagName:'无'});
        // }
      },
      searchAnchor(e) {
        let pattern = /^\d{1,}$/;
        if (this.uidSearch && !pattern.test(this.uidSearch)) {
          this.$Message.error("uid必须为数字，请重新输入");
          return false;
        } else {
          this.searchStatus = true
          console.log("search anchor:", e);
          this.pageIndex = 1;
          this.getAnchorList('search');
        }
      },
      formateDate(data) {
        let date = new Date(data);
        let year = date.getFullYear();
        let month = date.getMonth() < 9 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
        let day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
        let hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
        let minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
        let seconds = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
        return `${year}-${month}-${day} ${hour}:${minutes}:${seconds}`
      },
    },
    created() {
      this.getToken();
      this.getAnchorList('get');
    },
    watch: {
      // 如果路由有变化，会再次执行该方法
      '$route': function(route) {
        this.getAnchorList('get');
        this.searchStatus = false;
      }
    }
  }
</script>
<style scoped lang="less">
  .anchor-wrap {
    min-width:800px;
    min-height:100%;
    border:10px solid #f0f0f0;
    border-bottom:none;
    padding-bottom: 15px;
    background: #ffffff;
    .anchor-search {
      background: #ffffff;
      padding:0 5px 5px;
      border-bottom:10px solid #f0f0f0;
      font-size: 16px;
      line-height: 24px;
      .anchor-search-detail {
        .anchor-search-item {
          display: inline-block;
          /*width: 240px;*/
          vertical-align: middle;
          margin-left: 15px;
          margin-bottom: 10px;
          label {
            display: inline-block;
            vertical-align: middle;
            font-size: 12px;
          }
          .anchor-item-model {
            width: 180px;
            margin-left: 5px;
            text-align: left;
            vertical-align: middle;
          }
          .anchor-item-model-Count{
            width:100px ;
          }
        }
        .anchor-search-item+.anchor-search-item {
          // margin-left: 0;
        }
      }
    }
    .anchor-table-title {
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
      .add-anchor-icon {
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
  .anchor-list-con{
    text-align: left;
    margin-left:12px;
    .anchor-item {
      label {
        width: 80px;
        display: inline-block;
        vertical-align: middle;
        text-align: left;
      }
      .anchor-item-model {
        display: inline-block;
        width: 60%;
        vertical-align: middle;
        margin-left: 10px;
        .tag-item-check {
          width: 70px;
        }
      }
      .anchor-item-model-check{
        width: 400px;
      }
      .anchor-item-model:last {
        display: inline-block;
      }
    }
  }
  .anchor-item+.anchor-item {
    margin-top: 10px;
  }

  .anchor-img {
    display: inline-block;
    text-align: left;
    .anchor-img-pre {
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

  .tag-table {
    .ivu-table {
      .ivu-table-body {
        .ivu-table-tbody {
          .ivu-table-row {
            td {
              .ivu-table-cell {
                padding-left: 5px;
                padding-right: 5px;
              }
            }
          }
        }
      }
    }
  }


  .anchor-search-detail{
    margin-top: 10px;
  }

</style>
