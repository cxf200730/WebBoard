<template>
  <div>
    <el-card
      class="login-card"
      :body-style="{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '60px'}"
    >
      <el-form ref="loginForm"  :model="formData" :rules="rules">
        <el-form-item prop="classcode" label = "教室号">
          <el-input v-model="formData.classcode" placeholder="请输入教室号" />
        </el-form-item>
        
       
          <el-form-item>
            <el-button type="primary" @click="login">加入房间</el-button>
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
        classcode: '18172642994',
      },

      // 校验规则
      rules: {
        classcode: [{ required: true, message: '请输入您的房间号' }],
      }
    }
  },

  methods: {
    login() {
      this.$refs.loginForm.validate(async flag => {
        if (!flag) return
        that.axios.post('',null,{
            params:{
                // params就是query参
                phone:that.formData.classcode,
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
