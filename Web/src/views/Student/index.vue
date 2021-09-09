<template>
  <el-container class="bg">
    <!-- 布局：头部 -->
    <el-header height="30">
      <app-header />
    </el-header>

    <!-- 布局：主体 -->
    <el-container>
      <!-- 左边 -->
      <el-aside width="400px" class="left-panel">
        <app-side-panel />
        <div class = "left-buttom" >
          <div class="video">
            <span>视频播放区</span>
          </div>
          <div class="chat">
            <div v-for = "(item,index) in messages" :key = "index">
              {{item}}
            </div>
           
          </div>
          <div class="input">
            <el-input v-model = "message" @keyup.enter.native = "sendMessage" style="margin-right:10px"></el-input>
            <el-button @click = "sendMessage">发送</el-button>
          </div>
          
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
  mounted(){
    // document.body.addEventListener("touchmove", ()=>{}, {passive: false});
    // document.body.addEventListener("wheel", ()=>{}, {passive: false});
    // window.onload = function() { // 阻止双击放大 
    //   var lastTouchEnd = 0;
    //   document.addEventListener('touchstart', function(event) {
    //   if (event.touches.length > 1) { 
    //   event.preventDefault(); 
    //   } });
    //   document.addEventListener('touchend', function(event) { 
    //   var now = (new Date()).getTime(); if (now - lastTouchEnd <= 300) {
    //   event.preventDefault(); 
    //   } lastTouchEnd = now;
    //   }, false); 
    //   // 阻止双指放大 
    //   document.addEventListener('gesturestart', function(event) { event.preventDefault(); }); }

    //   document.body.addEventListener('touchmove', function (e) {
    //   e.preventDefault(); //阻止默认的处理方式(阻止下拉滑动的效果)
    //   }, {passive: false});
    
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
    document.documentElement.addEventListener('touchstart', function (event) {
      if (event.touches.length > 1) {
          event.preventDefault();
      }
    },{
      passive: false
    });

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
.bg{
  margin: 0;
  padding: 0;
  width: 100%;
  // min-height: 97%;
  max-height: 97%;
  // background-color: aqua;
  // overflow: hidden;
  // max-height: 95%;
  // background-color: aqua;
}
.left-panel {
  padding: 10px;
}
.left-buttom{
  // background-color: aqua;
  height: 65%;
  width: 100%;
  padding-top: 10px;
  .video{
    width: 90%;
    height: 40%;
    background-color: black;
    margin: 0 auto;
    color: #FFFFFF;
    text-align: center;
    span{
      font-size: 30px;
      line-height: 160px;
      letter-spacing: 3px;
    }
  }

  .chat{
    width: 90%;
    height: 48%;
    background-color: #FFFFFF;
    margin: 0 auto;
    margin-top: 10px;
    margin-bottom: 10px;
    border: #000000 solid 1px;
  }

  .input{
    width: 90%;
    display: flex;
    margin: 0 auto;
  }
}

.el-main{
  // background-color: aqua;
  // padding: 10px;
  margin: 0;
  padding-top: 0;
  // overflow: auto;
}
</style>
