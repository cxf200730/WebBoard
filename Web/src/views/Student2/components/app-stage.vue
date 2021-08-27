<template>
   <el-card ref="wrapper" :body-style="{ padding: 0 }" id="card">
    <v-stage
      id="stage"
      :config="stageConfig"
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
</template>

<script>
import { mapGetters, mapState } from 'vuex'
export default {
  created(){
    const image = new window.Image();
        image.src = "";
        image.onload = () => {
            // set image only when it is loaded
            this.imgConfig.image = image;
        };
  },
  mounted(){
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
        // 绘画状态
        painting: false,
        stroke: '#FFFFFF',
        strokeWidth: 1,
        pictureIndex:0,
        imgList:[
          "",
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
      this.stageConfig.height = this.$refs.wrapper.$el.offsetHeight
      // console.log(this.$refs.wrapper.$el.offsetWidth);
      const image = new window.Image();
        image.src = this.imgList[index-1];
        image.onload = () => {
            // set image only when it is loaded
            that.imgConfig.image = image;
        };

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
        stroke: this.stroke,
        strokeWidth: this.strokeWidth,
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
      // console.log(newLine);
      // 请求服务器
      // this.$store.dispatch('sendDrawNewLine', newLine)
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
      if(lastLine.points.length > 6){
        lastLine.bezier = true
      }
      // 请求服务器
      // this.$store.dispatch('sendUpdateNewLine', lastLine)
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
  height: 100%;
  width: 100%;
  overflow: hidden;
  background-color: rgb(33, 33, 33);
  border: 0;
  border-radius: 0;
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
