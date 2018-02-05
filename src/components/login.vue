<template>
  <div class="login-container">
    <Form ref="formCustom" :model="formCustom" :rules="ruleCustom" :label-width="60" class="login-wrap">
      <h3 class="title">拙心网络</h3>
      <FormItem label="账号" prop="userName">
        <Input type="text" v-model="formCustom.userName" size="large"></Input>
      </FormItem>
      <FormItem label="密码" prop="password">
        <Input type="password" v-model="formCustom.password" long @on-enter="loginIn"></Input>
      </FormItem>
      <Button type="primary" @click="handleSubmit" :loading="modal_loading" style="width:100%">登录</Button>
      <!-- <FormItem>
        <Button type="primary" @click="handleSubmit('formCustom')" style="width:100%">登录</Button>
        <Button type="ghost" @click="handleReset('formCustom')" style="margin-left: 8px">重置</Button>
      </FormItem> -->
    </Form>
  </div>
</template>
<script>
export default {
  name: 'login',
  data() {
    return {
      formCustom: {
        userName: '',
        password: '',
      },
      ruleCustom: {
        userName: [
          { required: true, message: '账号不能为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ]
      },
      modal_loading: false
    }
  },
  methods: {
    loginIn(event) {
      console.log("enter event:", event);
      this.handleSubmit();
    },
    handleSubmit() {
      this.$refs.formCustom.validate((valid) => {
        if (valid) {
          let userInfo = {
            name: this.formCustom.userName,
            password: this.formCustom.password
          }
          this.modal_loading = true;
          setTimeout(() => {
            this.$http.post('/api/user/login', userInfo).then(
              res => {
                console.log("login info:", res.data);
                if (res.data.status == 2000) {
                  let user = {id: res.data.body.id,name:res.data.body.name,mobile: res.data.body.mobile};
                  localStorage.setItem('token', JSON.stringify(res.data.body.token));
                  localStorage.setItem('userInfo', JSON.stringify(user));
                  this.$Message.success('登录成功!');
                  this.modal_loading = false;
                  this.$router.push({ path: '/' });
                } else {
                  this.$Message.error(res.data.body.message);
                  this.modal_loading = false;
                }
              }, err => {
                console.log("login err", err.data);
                this.$Message.error('登录失败!');
                this.modal_loading = false;
              });
          }, 1000)
        } else {
          this.$Message.error('请重新输入!');
        }
      })
    },
    handleReset(name) {
      this.$refs[name].resetFields()
    },
  }
}

</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
.login-container{
  width: 100%;
  height: 100%;
  background-image: url(../assets/images/login_bg.jpg);
  background-size: cover;
  background-position: 50%;
  position: relative;
}
@media screen and (max-width:1200px){
  .login-container{
    background-position: 30% 50%;
  }
}
.login-wrap {
  position: absolute;
  right: 160px;
  top: 50%;
  -webkit-transform: translateY(-60%);
  transform: translateY(-60%);
  border-radius: 5px;
  -moz-border-radius: 5px;
  background-clip: padding-box;
  width: 320px;
  padding: 35px 20px;
  background: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px rgba(0,0,0,.3);
  .title {
    margin: 0px auto 30px auto;
    font-size: 20px;
    font-weight: 600;
    text-align: center;
    color: #505458;
  }
  label {
    text-align: left !important;
    font-size: 16px !important;
  }
  .ivu-form .ivu-form-item-label {
    text-align: left;
    font-size: 16px;
  }
}

</style>
