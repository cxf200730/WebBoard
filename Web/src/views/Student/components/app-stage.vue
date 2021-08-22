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
    <!-- <img src="../../../../public/1.png" /> -->
      <v-stage
        id="stage"
        :config="stageConfig"
        @mousedown="mousedownHandler"
        @mouseup="mouseupHandler"
        @mousemove="mousemoveHandler"
        @touchstart="touchstartHandler"
        @touchmove="touchmoveHandler"
        @touchend="touchendHandler"
      >
        <v-layer>
          <v-image
            :config="imgConfig">
          </v-image>
          <v-line
            v-for="(line, index) in lines"
            :key="index"
            :config="line"
          />
        </v-layer>
      </v-stage>
    </el-card>
  </div>

  <div style="margin:0 auto;margin-top:50px">
    <el-scrollbar max-height="140px" >
      <el-button @click="chooseItem(item)" style="margin-left:10px" size="small" class="item" v-for="item in 20" :key="item">{{ item }}</el-button>
    </el-scrollbar>
  </div>
</div>

</template>

<script>
import { mapGetters, mapState } from 'vuex'
export default {
  created(){
    const image = new window.Image();
        image.src = "http://qxg2acp58.hn-bkt.clouddn.com/makeexam1629100825425.png";
        image.onload = () => {
            // set image only when it is loaded
            this.imgConfig.image = image;
        };
  },
  mounted(){
    // this.stageConfig.width = this.$refs.wrapper.$el.offsetWidth
    window.addEventListener('touchmove', function(){}, { passive: false })
   
    

    },
  data() {
    return {
        // 画布配置
        stageConfig: {
            width: 580,
            height: 575
        },
        imgConfig:{
          image:"",
          width:580
        },
        // 绘画状态
        painting: false,
        stroke: '#000000',
        strokeWidth: 1.7,
        pictureIndex:0,
        imgList:[
          "http://qxg2acp58.hn-bkt.clouddn.com/makeexam1629100825425.png",
          "http://qxg2acp58.hn-bkt.clouddn.com/makeexam1629100889920.png",
          "http://qxg2acp58.hn-bkt.clouddn.com/makeexam93.png"
       ]
    }
  },
  computed: {
    ...mapState(['lines','allpicture']),
    ...mapGetters(['isGameStarted', 'isGameHolder'])
  },

 
  methods: {
    chooseItem(index){
      this.linesIndex = index - 1
      
      const that = this
      this.stageConfig.width = this.$refs.wrapper.$el.offsetWidth
      const image = new window.Image();
        image.src = this.imgList[index-1];
        image.onload = () => {
            // set image only when it is loaded
            that.imgConfig.image = image;
        };

    },
    remove(){
      localStorage.removeItem('studentcode');
      localStorage.removeItem('teacherphone')
      this.$router.push('login')
    },
    // 鼠标按下
    mousedownHandler(e) {
      // if (!this.isGameHolder || !this.isGameHolder) return

      this.painting = true
      // 创建一个新线条
      const newLine = {
        stroke: this.stroke,
        strokeWidth: this.strokeWidth,
        points: [e.evt.layerX, e.evt.layerY]
      }
      // 本地画线, 存到vuex中
      this.$store.commit('drawNewLine', newLine)
      // 请求服务器
      this.$store.dispatch('sendDrawNewLine', newLine)
      
    },

    // 鼠标拖动
    mousemoveHandler(e) {
      if (!this.painting) return
      const lastLine = this.lines[this.lines.length - 1]
      lastLine.points = lastLine.points.concat([e.evt.layerX, e.evt.layerY])
      console.log(lastLine)
      this.$store.commit('updateNewLine', lastLine)
      // 请求服务器
      this.$store.dispatch('sendUpdateNewLine', lastLine)
    },
    // 鼠标释放
    mouseupHandler() {
      this.painting = false
    },
    // 笔按下
    touchstartHandler(e) {
      // if (!this.isGameHolder || !this.isGameHolder) return
      this.painting = true
      // 创建一个新线条
      const newLine = {
        stroke: this.stroke,
        strokeWidth: this.strokeWidth,
        points: [e.evt.changedTouches[0].clientX-$('#card').offset().left, e.evt.changedTouches[0].clientY-$('#card').offset().top+ $(document).scrollTop()]
      }
      // 本地画线, 存到vuex中
      this.$store.commit('drawNewLine', newLine)
      // this.$store.commit('addNewLines', newLine,this.pictureIndex)
      
      // 请求服务器
      // this.$store.dispatch('sendDrawNewLine', newLine)
     },
  
    // 笔拖动
    touchmoveHandler(e) {
      // e = window.event || e;
      // console.log(e.screenX + " " + e.screenY);
    
      if (!this.painting) return
      const lastLine = this.lines[this.lines.length - 1]
    //   console.log($('#card').offset());

      lastLine.points = lastLine.points.concat([e.evt.changedTouches[0].clientX-$('#card').offset().left, e.evt.changedTouches[0].clientY-$('#card').offset().top + $(document).scrollTop()])
      console.log(lastLine)
      this.$store.commit('updateNewLine', lastLine)
      // this.$store.commit('updateNewLines', lastLine,this.pictureIndex)
      // 请求服务器
      // this.$store.dispatch('sendUpdateNewLine', lastLine)
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
  width: 580px;
  height:575px;
  overflow: auto; 
}

.info{
       height: 30px;
       width: 560px;
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
    overflow: auto;
    position: relative;
    max-height: 570px;
    width: 70px;
    // overflow-x: scroll;
}
</style>
