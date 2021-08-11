<template>
  <div>
    <el-card
      class="login-card"
      :body-style="{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '60px'}"
    >
      <el-form ref="loginForm" inline :model="formData" :rules="rules">
        <el-form-item prop="nickname">
          <el-input v-model="formData.nickname" placeholder="请输入您的昵称" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="enterGame">进入游戏</el-button>
        </el-form-item>
        <div>
          <el-form-item prop="nickname">
            <el-input v-model="formData.test" placeholder="测试" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="test">测试</el-button>
          </el-form-item>
        </div>
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
        nickname: '',
        test:''
      },

      // 校验规则
      rules: {
        nickname: [{ required: true, message: '请输入您的昵称' }]
      }
    }
  },

  methods: {
    enterGame() {
      this.$refs.loginForm.validate(async flag => {
        if (!flag) return
        const nickname = this.formData.nickname
        const isExist = await this.$store.dispatch('checkUserExist', nickname)

        if (isExist) {
          MessageBox.alert('该昵称已被人使用啦!')
        } else {
          // 将昵称存入本地, 跳转到主页
          localStorage.setItem('nickname', nickname)
          this.$router.push('/home')
        }
      })
    },

    test() {
      // alert(123)
      this.$refs.loginForm.validate(async flag => {
        if (!flag) return
        const test = this.formData.test
        const isExist = await this.$store.dispatch('test', test)
        console.log(isExist);

      })
    }
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
