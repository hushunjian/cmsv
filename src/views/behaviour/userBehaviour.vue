<template>
  <div class="userBehaviour-wrap">
    <div class="userBehaviour-table-title">
      <span class="table-title">搜索操作</span>
    </div>
    <div class="userBehaviour-search">
      <div class="userBehaviour-search-detail">
        <div class="userBehaviour-search-item">
          <label for="">访问日期</label>
          <DatePicker v-model="createdBegin" :editable="false" :clearable="false" type="date" placeholder="点击选择时间" style="width: 160px;margin-left:5px;"></DatePicker> -
          <DatePicker v-model="createdEnd" :editable="false" :clearable="false" type="date" placeholder="点击选择时间" style="width: 160px;"></DatePicker>
        </div>
        <div class="userBehaviour-search-item">
          <label for="">访问时间段</label>
          <Select v-model="isTimeQuantum" style="width:160px;text-align:left;vertical-align:middle;margin-left:5px;" class="userBehaviour-search-model">
            <Option :value="-1">00:00:00 - 00:00:00</Option>
            <Option v-for="item in timeQuantumData" :value="item.id" :key="item.id">{{ item.type }}</Option>
          </Select>
        </div>
        <div class="userBehaviour-search-item">
          <label for="">访问页面</label>
          <Select v-model="isAppPages" style="width:100px;text-align:left;vertical-align:middle;margin-left:5px;" class="userBehaviour-search-model">
            <Option :value="-1">全部</Option>
            <Option v-for="item in appPages" :value="item.id" :key="item.id">{{ item.pageName }}</Option>
          </Select>
        </div>
        <div class="userBehaviour-search-item">
          <label for="">访问时长</label>
          <TimePicker v-model="durationSearch"  type="time" :editable="false" :clearable="false" placeholder="Select time" style="width: 120px;margin-left:5px;""></TimePicker>
        </div>
        <Button type="primary" icon="ios-search-strong" @click="searchUserBehaviors" style="margin-bottom:10px;margin-left:20px">搜索</Button>
      </div>
    </div>
    <div class="behaviourTotal">
      <span>访问总人数:<p class="totalVisitTimes">{{ userBehaviorsTotal.totalVisits }}</p></span>
      <span>访问总次数:<p class="totalVisits">{{ userBehaviorsTotal.totalVisitTimes}}</p></span>
    </div>
    <div class="userBehaviour-table-title">
      <span class="table-title">日活统计表</span>
    </div>
    <Table refs="table2" border :columns="columns" :data="userBehaviorsList" class="userBehaviour-table"></Table>
    <div style="margin: 20px 10px 10px;overflow: hidden">
      <div style="float: right;">
        <Page :total="totalCount" :current="pageIndex" @on-change="changePage"></Page>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'userBehaviour',
    data() {
      return {
        columns: [{
          title: '序号',
          key: 'index',
          width: 50,
          align: 'center',
          /*fixed: 'left'*/
        }, {
          title: 'UID',
          key: 'uid',
          width: 60,
          align: 'center'
        }, {
          title: '昵称',
          key: 'nickName'
        }, {
          title: '注册时间',
          key: 'createdAt',
          align: 'center'
        },{
          title: '访问页面',
          key: 'interview',
          align: 'center'
        }, {
          title: '访问时间段',
          key: 'visitTimeQuantum',
          align: 'center',
          render: (h, params) => {
            const row = params.row;
            const visitTimeQuantum = row.visitTimeQuantum < 10 ? '0' + row.visitTimeQuantum : row.visitTimeQuantum;
            const TimeQuantum =  visitTimeQuantum + ':00:00 - ' + visitTimeQuantum + ':59:59';
            return h('span', TimeQuantum);
          }
        }, {
          title: '访问时长',
          key: 'duration',
          align: 'center'
        }, {
          title: '访问次数',
          key: 'visitTimes',
          width: 90,
          align: 'center'
        }],
        uid: null,
        nickName: '',
        interview: '',
        duration: null,
        createdAt: null,
        visitTimeQuantum: null,
        durationSearch: '00:00:00',
        visitTimes: null,
        createdBegin: null,
        createdEnd: null,
        userBehaviorsList: [],
        userBehaviorsTotal: {},
        isAppPages: -1,
        appPages: [],
        isTimeQuantum: -1,
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
      },
      getUserBehaviors (type) {
        let temData = [];
        let url;
        let httpData;
        if (type === 'get') {
          url = `/api/behaviour/getUserBehaviors?token=${this.token}&pageIndex=${this.pageIndex}&pageSize=${this.pageSize}`;
          httpData = this.$http.get(url);
        } else if (type === 'search') {
          url = `/api/behaviour/getUserBehaviorsSearch`;
          let data = {
            token: this.token,
            pageIndex: this.pageIndex,
            pageSize: this.pageSize,
            createdBegin: new Date(this.createdBegin).getTime(),
            createdEnd: new Date(this.createdEnd).getTime(),
            timeQuantum: this.isTimeQuantum < 0 ? null : this.timeQuantumData[this.isTimeQuantum].value,
            interviewId: this.isAppPages,
            duration: this.formateDuration(this.durationSearch)
          }
          if (data.createdEnd && data.createdEnd < data.createdBegin) {
            this.$Message.error("创建时间结束时间应大于开始时间，请重新输入");
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
                item.duration = this.formateDurationReturn(item.duration);
                item.createdAt = this.formateDate(item.createdAt);
                temData.push(item);
              })
              this.userBehaviorsList = temData;
              console.log("userBehaviors list:", this.userBehaviorsList);
            } else {
              this.$Message.error(res.data.body.message);
            }
          }, err => {
            console.log(err.data);
          })
      },
      getAppAllPages() {
        this.$http.post(`/api/behaviour/getAppAllPages?token=${this.token}`)
          .then(
            res => {
              if (res.data.status == 2000) {
                this.appPages = res.data.body;
                console.log("appPages list:", this.appPages);
              } else {
                this.$Message.error(res.data.body.message);
              }
            }, err => {
              console.log(err.data)
            })
      },
      getUserBehaviorsTotal (type) {
        let url;
        let httpData;
        if (type === 'get') {
          url = `/api/behaviour/getUserBehaviorsTotal?token=${this.token}&pageIndex=${this.pageIndex}&pageSize=${this.pageSize}`;
          httpData = this.$http.get(url);
        } else if (type === 'search') {
          url = `/api/behaviour/getUserBehaviorsTotalSearch`;
          let data = {
            token: this.token,
            pageIndex: this.pageIndex,
            pageSize: this.pageSize,
            createdBegin: new Date(this.createdBegin).getTime(),
            createdEnd: new Date(this.createdEnd).getTime(),
            timeQuantum: this.isTimeQuantum < 0 ? null : this.timeQuantumData[this.isTimeQuantum].value,
            interviewId: this.isAppPages,
            duration: this.formateDuration(this.durationSearch)
          }
          if (data.createdEnd && data.createdEnd < data.createdBegin) {
            this.$Message.error("创建时间结束时间应大于开始时间，请重新输入");
            return false;
          } else {
            httpData = this.$http.post(url, data);
          }
        }
        httpData.then(
          res => {
            if (res.data.status == 2000) {
              this.userBehaviorsTotal = res.data.body;
              console.log("userBehaviorsTotalList:", this.userBehaviorsTotal);
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
          this.getUserBehaviors('search');
        } else {
          this.getUserBehaviors('get');
        }

      },
      searchUserBehaviors(e) {
        this.searchStatus = true
        console.log("search tag:", e);
        this.pageIndex = 1;
        this.getUserBehaviors('search');
        this.getUserBehaviorsTotal('search');
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
      formateDuration(data) {
        let date = new Date(data);
        let hour = date.getHours() ;
        let minutes = date.getMinutes();
        let seconds = date.getSeconds() ;
        return hour * 60 * 60 + minutes * 60 + seconds;
      },
      formateDurationReturn(data) {
        var secondTime = data;// 秒
        var minuteTime = 0;// 分
        var hourTime = 0;// 小时
        // 如果秒数大于60，将秒数转换成整数
        if (secondTime >= 60) {
          // 获取分钟，除以60取整数，得到整数分钟
          minuteTime = parseInt(secondTime / 60);
          // 获取秒数，秒数取佘，得到整数秒数
          secondTime = parseInt(secondTime % 60);
          // 如果分钟大于60，将分钟转换成小时
          if (minuteTime >= 60) {
            // 获取小时，获取分钟除以60，得到整数小时
            hourTime = parseInt(minuteTime / 60);
            // 获取小时后取佘的分，获取分钟除以60取佘的分
            minuteTime = parseInt(minuteTime % 60);
          }
        }
        var result = "" + parseInt(secondTime) + "秒";

        if (minuteTime >= 0) {
          result = "" + parseInt(minuteTime) + "分" + result;
        }
        if (hourTime > 0) {
          result = "" + parseInt(hourTime) + "小时" + result;
        }
        if (hourTime==0 && minuteTime==0 && secondTime==0) {
          result = "少于1秒";
        }
        return result;
      }
    },
    computed: {
      timeQuantumData: function() {
        let data = [
          { id: 0, value: [0, 2], type: '00:00:00 - 02:00:00' },
          { id: 1, value: [2, 4], type: '02:00:00 - 04:00:00' },
          { id: 2, value: [4, 6], type: '04:00:00 - 06:00:00' },
          { id: 3, value: [6, 8], type: '06:00:00 - 08:00:00' },
          { id: 4, value: [8, 10], type: '08:00:00 - 10:00:00' },
          { id: 5, value: [10, 12], type: '10:00:00 - 12:00:00' },
          { id: 6, value: [12, 14], type: '12:00:00 - 14:00:00' },
          { id: 7, value: [14, 16], type: '14:00:00 - 16:00:00' },
          { id: 8, value: [16, 18], type: '16:00:00 - 18:00:00' },
          { id: 9, value: [18, 20], type: '18:00:00 - 20:00:00' },
          { id: 10, value: [20, 22], type: '20:00:00 - 22:00:00' },
          { id: 11, value: [22, 24], type: '22:00:00 - 24:00:00' }
        ];
        return data;
      }
    },
    created() {
      this.getToken();
      this.getUserBehaviors('get');
      this.getUserBehaviorsTotal('get');
      this.getAppAllPages();
    },
    watch: {
      // 如果路由有变化，会再次执行该方法
      '$route': function(route) {
        this.getUserBehaviors('get');
        this.getUserBehaviorsTotal('get');
        this.getAppAllPages();
        this.searchStatus = false;
      }
    }
  }

</script>
<style scoped lang="less">
.userBehaviour-wrap {
  min-width:980px;
  min-height:100%;
  border:10px solid #f0f0f0;
  border-bottom:none;
  padding-bottom: 15px;
  background: #ffffff;
  .userBehaviour-search {
    background: #ffffff;
    padding:0 5px 5px;
    border-bottom:10px solid #f0f0f0;
    font-size: 16px;
    line-height: 24px;
    .userBehaviour-search-detail {
      .userBehaviour-search-item {
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
      }
    }
  }
  .behaviourTotal{
    padding:20px 5px 5px;
    span{
      display: inline-block;
      margin-right: 30px;
      font-size: 16px;
    }
    p{
      display: inline-block;
      color: red;
    }
  }
  .userBehaviour-table-title {
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
  }
}
.userBehaviour-search-detail{
  margin-top: 10px;
}

</style>
