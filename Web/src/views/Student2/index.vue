<template>
  <el-container>
    <!-- 布局：头部 -->
    <el-header height=60px>
      
    </el-header>

    <!-- 布局：主体 -->
      <!-- 右边 -->
      <el-main>
        <app-stage />
      </el-main>
      <el-footer height = "110px"></el-footer>
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
  mounted(){
    // document.body.addEventListener("touchmove", this.defferScroll, {passive: false});
    // document.body.addEventListener("wheel", this.defferScroll, {passive: false});
    // 禁用双击放大
    var lastTouchEnd = 0;
    document.documentElement.addEventListener('touchend', function (event) {
      var now = Date.now();
      if (now - lastTouchEnd <= 300) {
          event.preventDefault();
      }
      lastTouchEnd = now;
    },{
      passive: false
    });

    // 禁用双指放大
    // document.documentElement.addEventListener('touchstart', function (event) {
    //   if (event.touches.length > 1) {
    //       event.preventDefault();
    //   }
    // },{
    //   passive: false
    // });

 },
  computed: {
    ...mapState(['teacherphone', 'messages', 'holder']),
    ...mapGetters(['isGameStarted'])
  },
  data(){
    return{
      message:"",
       defferScroll: function (event) {
            event.preventDefault()
        }
      // mymessages:[]
    }
  },
  methods: {
    sendMessage(){
     if(this.message === "" || this.message.length == 0){
       return
     }
     const message = {
       teacherphone:localStorage.getItem('teacherphone'),
       msg:this.message
     }
      this.$store.dispatch('sendMessage', message).then((result) => {
        console.log(result)
        // this.messages.push(result)
        // this.message = ""
      }).catch((err) => {
        
      });
    }
  }
}
</script>

<style lang="less" scoped>
.el-header{
  background-color: #000000;
  margin: 0;
  padding: 0;
}
.el-main{
  padding: 0;
  margin: 0;
  max-height: 700px;
}
.el-container{
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  // min-height: 94%;
  // max-height: 94%;
  // background-color: aqua;
}

.el-footer{
  background-color: #000000;
}
</style>
