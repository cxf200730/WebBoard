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
        classcode: '1101',
      },

      // 校验规则
      rules: {
        classcode: [{ required: true, message: '请输入您的房间号' }],
      }
    }
  },

  methods: {
    login() {
      const that= this
      this.$refs.loginForm.validate(async flag => {
        if (!flag) return
        that.axios.post('http://192.168.51.109:3000/student/join',null,{
            params:{
                // params就是query参
                classcode:that.formData.classcode,
                studentcode:localStorage.getItem('teacherphone')
            }
        }).then( (res) => {
            console.log(res.data.message)
            if(res.data.message.length != 0){
              alert("加入教室成功")
                localStorage.setItem('classcode', that.formData.classcode)
                that.$router.push('studentclassroom')
            }else{
              alert("教室号错误！")
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
