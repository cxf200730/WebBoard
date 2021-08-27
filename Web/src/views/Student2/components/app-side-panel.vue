<template>
  
</template>

<script>
import { mapGetters, mapState } from 'vuex'

export default {
  data() {
    return {
     
    }
  },

  computed: {
    
  },

  methods: {
    startGameHandler() {
      // 开始游戏
      // 1. 显示弹框
      this.resultDialogVisible = true
      // 2. 清空输入框内容
      this.expectImageName = ''
    },

    stopGameHandler() {
      this.$confirm('确定要终止游戏吗?', '温馨提示').then(() => {
        // 发送游戏终止申请
        this.$store.dispatch('sendStopGame')
      }).catch(e => {
        console.log(e)
      })
    },

    answerGameHandler() {
      this.answerDialogVisible = true
      this.inputImageName = ''
    },

    saveDialogHandler() {
      // 1. 校验答案是否为空
      if (!this.expectImageName) {
        this.$message.error('答案不能为空哦!')
        return
      }
      // 2. 发送开始上课的申请
      this.$store.dispatch('sendStartGame', this.expectImageName)

      // 3. 关闭弹框
      this.resultDialogVisible = false
    },

    saveAnswerDialogHandler() {
      // 1. 检查答案是否为空
      if (!this.inputImageName) {
        this.$message.error('答案不能为空')
        return
      }
      // 2. 将答案发送到服务器
      this.$store.dispatch('sendAnswerGame', this.inputImageName)
      // 3. 关闭弹出框
      this.answerDialogVisible = false
    },

    exitHandler() {
      this.$confirm('是否退出游戏', '温馨提示').then(() => {
        this.$store.dispatch('sendUserLeave')
        this.$router.replace('/login')
      }).catch(e => {
        console.log(e)
      })
    }
  }
}
</script>

<style lang="less" scoped>

.panel-area {
  margin: 10px 0;
}
/deep/ .el-table{
  .el-table_body-wrapper{
    height: 10px
  }
}

</style>
