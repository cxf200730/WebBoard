<template>
  <div class="app-header">
     <el-tag>房间号：{{classCode}}</el-tag> 
     <el-tag>学号{{studentCode}}</el-tag> 
     <el-tag>开始时间：{{nowDate}}</el-tag>
     <el-tag v-if="this.minute <= 0">开始时长：{{startTime}}秒</el-tag>
     <el-tag v-else>开始时长：{{minute}}分{{startTime}}秒</el-tag>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
export default {
  created(){
      this.classCode = localStorage.getItem('classcode'),
      this.studentCode = localStorage.getItem('studentcode'),
      this.nowDate = new Date().toLocaleString(),
      this.startTime = 0
      this.minute = 0
  },
  mounted(){
    const that = this
    this.nowDate = setInterval(()=>{
      this.nowDate = new Date().toLocaleString()
      this.startTime++
      if(this.startTime === 60){
        that.minute++
        that.startTime = 0
      }
    },1000)
  },
  beforeDestroy(){
    clearInterval(this.nowDate)
  },
  computed: {
    ...mapState(['connected']),
    ...mapGetters(['isGameStarted'])
  },
  data(){
    return{
      classCode:"",
      studentCode:"",
      nowDate:"",
      startTime:"",
      minute:""
    }
  },
 
}
</script>

<style lang = "less" scoped>
.app-header{
  /* background-color: aqua; */
  padding-top: 10px;
  height: 30px;

  .el-tag {
  margin-right: 10px;
}
}
</style>
