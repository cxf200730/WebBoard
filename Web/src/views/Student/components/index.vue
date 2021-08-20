<template>
  <el-container>
    <!-- 布局：头部 -->
    <el-header height="30">
      <app-header />
    </el-header>

    <!-- 布局：主体 -->
    <el-container>
      <!-- 左边 -->
      <el-aside width="230px" class="left-panel">
        <app-side-panel />
        <div>
          <div v-for = "(item,index) in messages" :key = "index">
            {{item}}
          </div>
          <el-input v-model = "message" @keyup.enter.native = "sendMessage"></el-input>
          <el-button @click = "sendMessage">发送</el-button>
        </div>
        
      </el-aside>

      <!-- 右边 -->
      <el-main>
        <app-stage />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import AppHeader from './components/app-header'
import AppStage from './components/app-stage'
import AppSidePanel from './components/app-side-panel'
import { mapGetters, mapState } from 'vuex'
export default {
  components: {
    AppHeader,
    AppStage,
    AppSidePanel
  },
  created() {
    this.$store.dispatch('sendUserEnter')
  },
  computed: {
    ...mapState(['teacherphone', 'messages', 'holder']),
    ...mapGetters(['isGameStarted'])
  },
  data(){
    return{
      message:"",
      // mymessages:[]
    }
  },
  methods: {
    sendMessage(){
     
      this.$store.dispatch('sendMessage', this.teacherphone  + " : "+ this.message).then((result) => {
        console.log(result)
        this.messages.push(result)
        this.message = ""
      }).catch((err) => {
        
      });
    }
  }
}
</script>

<style lang="scss" scoped>

.left-panel {
  padding: 20px;
}
// .el-main{
//   box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
//   border: #EBEEF5 solid 1px;
// }
</style>
