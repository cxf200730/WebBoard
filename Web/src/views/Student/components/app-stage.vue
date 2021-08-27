<template>
<div style="display:flex">
  <div>
    <div class="info">
      <div>
        <span>第五讲 扫雷</span>
          <el-divider direction="vertical"></el-divider>
        <span>第一题</span>
          <el-divider direction="vertical"></el-divider>
        <span>共12题</span>
      </div>
      <div>
        <span>上一题</span>
          <el-divider direction="vertical"></el-divider>
        <span>上一题</span>
          <el-divider direction="vertical"></el-divider>
        <span @click = "remove">提交</span>
      </div>
    </div>
  
    <el-card ref="wrapper" :body-style="{ padding: 0 }" id="card">
    <v-stage
      id="stage"
      :config="stageConfig"
      @touchstart="touchstartHandler"
      @touchmove="touchmoveHandler"
      @touchend="touchendHandler"
    >
      <v-layer>
          <v-text  :config="textConfig"/>
        <v-line
          v-for="(line, index) in lines"
          :key="index"
          :config="line"
        />
        
      </v-layer>
      <v-layer>
        <v-line
          v-for="(line, index) in teacherLines[id-1]"
          :key="index"
          :config="line"
        />
      </v-layer>
    </v-stage>
  </el-card>
  </div>

  <div style="margin:0 auto;margin-top:50px;">
    <el-scrollbar  max-height="400px">
      <el-button  @click="chooseItem(item)" style="margin-left:10px" size="small" class="item" v-for="item in 15" :key="item">
        {{ item }}
      </el-button>
    </el-scrollbar>
  </div>
</div>

</template>

<script>
import { mapGetters, mapState } from 'vuex'
export default {
  created(){
   
  },
  mounted(){
    this.id = localStorage.getItem('teacherphone').slice(6,localStorage.getItem('teacherphone').length)
    // this.stageConfig.width = this.$refs.wrapper.$el.offsetWidth
    window.addEventListener('touchmove', function(){}, { passive: false })
    this.getXb =  document.getElementById('card').clientWidth
    this.getYb =  document.getElementById('card').clientHeight
    this.stageConfig.width = this.$refs.wrapper.$el.offsetWidth
    this.stageConfig.height = this.$refs.wrapper.$el.offsetHeight
    // console.log(this.$refs.wrapper.getNode());
    this.$store.commit('initXb', this.getXb)
    this.$store.commit('initYb', this.getYb)

    },
  data() {
    return {
      getXb:1,
      getYb:1,
        // 画布配置
        stageConfig: {
            width: 560,
            height: 450
        },
        imgConfig:{
          image:"",
          width: 560
        },
        text:'我是 text',
        textConfig:{
          // x:12,
          // y:12,
          text: "1、一个两位数，十位数字与个位数字之和是5，把这个数的个位数字与十位数字对调后，所得的新两位数与原两位数的乘积为736，求原来的两位数。", 
          fontSize: 17,
          fontFamily: 'Calibri',
          fill:"#FFF111",
          padding: 20,
          width: 590,
          align:"left",
          lineHeight:"1.3"
        },
        textConfig2:{
          // x:12,
          // y:12,
          text: "222222222", 
          fontSize: 30,
          fontFamily: 'Calibri',
          fill:"#FFF111",
          padding: 40,
          width: 590,
          align:"left",
          lineHeight:"1.3"
        },
        // 绘画状态
        painting: false,
        stroke: '#000000',
        strokeWidth: 2,
        pictureIndex:0,
        id:0
       
    }

  },
  computed: {
    ...mapState(['lines','teacherLines']),
    ...mapGetters(['isGameStarted', 'isGameHolder'])
  },

 
  methods: {
    chooseItem(index){
      this.linesIndex = index - 1
      
      const that = this
      // this.stageConfig.width = this.$refs.wrapper.$el.offsetWidth
      // this.stageConfig.height = this.$refs.wrapper.$el.offsetHeight
      // this.getXb =  document.getElementById('card').clientWidth
      // this.getYb =  document.getElementById('card').clientHeight
    // document.getElementById('card').translate(0.5,0.5)
      // this.stageConfig.width = document.getElementById('card').clientWidth
      // this.stageConfig.height = document.getElementById('card').clientHeight
      // this.$store.commit('initXb', this.getXb)
      // this.$store.commit('initYb', this.getYb)
      // console.log(this.$refs.wrapper.$el.offsetWidth);
     

    },
    remove(){
      localStorage.removeItem('studentcode');
      localStorage.removeItem('classcode');
      localStorage.removeItem('teacherphone')
      this.$router.push('login')
    },
    
    // 笔按下
    touchstartHandler(e) {
      // alert(2)
      // if (!this.isGameHolder || !this.isGameHolder) return
      this.painting = true
      let newX = e.evt.changedTouches[0].clientX-$('#card').offset().left
      let newY = e.evt.changedTouches[0].clientY-$('#card').offset().top+ $(document).scrollTop()
      // 创建一个新线条
      const newLine = {
        points: [newX / this.getXb , newY / this.getYb,(newX + 0.5) / this.getXb,(newY + 0.5) / this.getYb],
        stroke: "#FFFFFF",
        strokeWidth: 1,
        lineCap: 'round',
        //341458
        lineJoin: 'round',
        preventDefault: false,
        // tension:0.1,
        // bezier:true,
        // draggable:true
        // fill:"#FFF111",
        rotation:0.1,
        // shadowBlur:0.2
      }
      // 请求服务器
      const id = localStorage.getItem('teacherphone').slice(6,localStorage.getItem('teacherphone').length)
      this.$store.dispatch('sendDrawNewLine', {newLine:newLine,id:id})
      // 本地画线, 存到vuex中
      this.$store.commit('drawNewLine', newLine)
     },

    // 笔拖动
    touchmoveHandler(e) {
      if (!this.painting) return
      this.nowX = document.getElementById('card').clientWidth
      const lastLine = this.lines[this.lines.length - 1]
      let newX = e.evt.changedTouches[0].clientX-$('#card').offset().left
      let newY = e.evt.changedTouches[0].clientY-$('#card').offset().top+ $(document).scrollTop()
      lastLine.points = lastLine.points.concat([newX / this.getXb , newY / this.getYb])
      const id = localStorage.getItem('teacherphone').slice(6,localStorage.getItem('teacherphone').length)
      if(lastLine.points.length > 6){
        lastLine.bezier = true
      }
      // 请求服务器
      this.$store.dispatch('stuUpdateNewLine', {lastLine:lastLine,id:id})
      this.$store.commit('updateNewLine1', lastLine)
    },

    // 笔释放
    touchendHandler() {
      this.painting = false
    },
    
    
  }
}
</script>
<style lang="less" scoped>
.el-card{
  touch-action: none;
  height: 640px;
  width: 590px;
  overflow: hidden;
  background-color: rgb(33, 33, 33);
}

.info{
       height: 20px;
       width: 575px;
       padding: 10px;
       line-height: 30px;
      //  border:#000000 solid 1px;
       display: flex;
       justify-content: space-between;
      // background-color: chartreuse;
     }
     .item{
       margin-bottom: 10px;
     }
    .el-scrollbar {
    position: relative;
    max-height: 620px;
    width: 70px;
    // overflow: auto;
    // overflow-x: scroll;
}
</style>
