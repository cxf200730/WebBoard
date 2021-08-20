<template>
  <div>
    <el-card
      class="login-card"
      :body-style="{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '60px'}"
    >
      <el-form ref="loginForm"  :model="formData" :rules="rules">
        <el-form-item prop="phone" label = "手机号/学号">
          <el-input v-model="formData.phone" placeholder="请输入您的昵称" />
        </el-form-item>
        
          <el-form-item prop="password" label = "密码">
            <el-input v-model="formData.password" placeholder="测试" />
          </el-form-item>
       
          <el-form-item>
            <el-button type="primary" @click="login('teacher')">老师登录</el-button>
            <el-button @click="login('student')">学生登陆</el-button>
          </el-form-item>
      
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { MessageBox } from 'element-ui'
export default {
  data() {
    return {
      // 表单信息
      formData: {
        phone: '18172642994',
        password:'123456'
      },

      // 校验规则
      rules: {
        phone: [{ required: true, message: '请输入您的手机号' }],
        password: [{ required: true, message: '请输入您的密码' }]
      }
    }
  },

  methods: {
    login(str) {
      const that = this
      let url = ""
      let type = ""
      if(str === "teacher") {
        url = 'http://192.168.51.104:3000/teacher/login'
        type = "teacher"
      }else{
        url = 'http://192.168.51.104:3000/student/login'
        type = "student"
      }
      this.$refs.loginForm.validate(async flag => {
        if (!flag) return

        that.axios.post(url,null,{
            params:{
                // params就是query参
                phone:that.formData.phone,
                password:that.formData.password
            }
        }).then( (res) => {
            console.log(res.data.message)
            if(res.data.message.length != 0){
              alert("登陆成功")
              if(type === "teacher"){
                localStorage.setItem('teacherphone', that.formData.phone)
                that.$router.push('teacher')
              }else{
                localStorage.setItem('studentcode', that.formData.phone)
                that.$router.push('student')
              }
            }else{
              alert("密码错误！")
            }
          })
      })
    },
  }
}
</script>

<style scoped>
.login-card {
  width: 50%;
  margin: 0 auto;
  margin-top: 200px;
}
</style>
