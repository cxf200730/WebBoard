<template>
<div style="display:flex">
  <el-card ref="wrapper" :body-style="{ padding: 0 }" id="card1">
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
        <v-line
          v-for="(line, index) in lines1"
          :key="index"
          :config="line"
        />
      </v-layer>
    </v-stage>
  </el-card>
  <el-card ref="wrapper" :body-style="{ padding: 0 }" id="card2">
    <v-stage
      id="stage2"
      :config="stageConfig"
      @mousedown="mousedownHandler"
      @mouseup="mouseupHandler"
      @mousemove="mousemoveHandler"
      @touchstart="touchstartHandler"
      @touchmove="touchmoveHandler"
      @touchend="touchendHandler"
    >
      <v-layer>
        <v-line
          v-for="(line, index) in lines2"
          :key="index"
          :config="line"
        />
      </v-layer>
    </v-stage>
  </el-card>
</div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
export default {
  created(){
  },

  mounted(){
    this.getXb =  document.getElementById('card1').clientWidth
    this.stageConfig.width = this.$refs.wrapper.$el.offsetWidth
    this.$store.commit('initXb', this.getXb)
    const that = this
    window.addEventListener('touchmove', function(){}, { passive: false })
  },

  data() {
    return {
      linesIndex:0,
      lineIndex:0,
      // 画布配置
      stageConfig: {
        width: 1300,
        height: 450
      },
      // 绘画状态
      painting: false,
      stroke: '#d42d1f',
      strokeWidth: 2.1,
      getXb:1,
    }
  },

  computed: {
    ...mapState(['lines1','lines2']),
    ...mapGetters(['isGameStarted', 'isGameHolder']),
  },

  methods: {
    // 鼠标按下
    mousedownHandler(e) {
      // console.log(e.currentTarget.attrs.id);
      // if (!this.isGameHolder || !this.isGameHolder) return
      this.painting = true
      // 创建一个新线条
      
      if(e.currentTarget.attrs.id === "stage"){
        const newLine = {
        stroke: this.stroke,
        strokeWidth: this.strokeWidth,
        points: [e.evt.layerX / this.getXb, e.evt.layerY]
      }
        // 请求服务器
        this.$store.dispatch('teachersendDrawNewLine', newLine)
        // 本地画线, 存到vuex中
        this.$store.commit('teacherdrawNewLine', newLine)
      }else{
        const newLine = {
        stroke: this.stroke,
        strokeWidth: this.strokeWidth,
        points: [e.evt.layerX / this.getXb, e.evt.layerY]
      }
        // 请求服务器
        this.$store.dispatch('teachersendDrawNewLine2', newLine)
        // 本地画线, 存到vuex中
        this.$store.commit('teacherdrawNewLine2', newLine)
      }
      // // 请求服务器
      // this.$store.dispatch('teachersendDrawNewLine', newLine)
      // // 本地画线, 存到vuex中
      // this.$store.commit('teacherdrawNewLine', newLine)
    },

    // 鼠标拖动
    mousemoveHandler(e) {
      if (!this.painting) return
      // console.log("11"+lastLine.points[lastLine.points.length-2])
      if(e.currentTarget.attrs.id === "stage"){
        const lastLine = this.lines1[this.lines1.length - 1]
        lastLine.points = lastLine.points.concat([e.evt.layerX / this.getXb, e.evt.layerY]) 
        // 请求服务器
        this.$store.dispatch('teachersendUpdateNewLine', lastLine)
        this.$store.commit('teacherupdateNewLine1', lastLine)
      }else{
        // alert(1)
        const lastLine = this.lines2[this.lines2.length - 1]
        lastLine.points = lastLine.points.concat([e.evt.layerX / this.getXb, e.evt.layerY]) 
      
         // 请求服务器
        this.$store.dispatch('teachersendUpdateNewLine2', lastLine)
        this.$store.commit('teacherupdateNewLine2', lastLine)
      }
    },

    // 鼠标释放
    mouseupHandler() {
      this.painting = false
    },

    // 笔按下
    touchstartHandler(e) {
      // if (!this.isGameHolder || !this.isGameHolder) return
      this.painting = true
      let newX = e.evt.changedTouches[0].clientX-$('#card1').offset().left
      let newY = e.evt.changedTouches[0].clientY-$('#card1').offset().top+ $(document).scrollTop()
      // 创建一个新线条
      const newLine = {
        stroke: this.stroke,
        strokeWidth: this.strokeWidth,
        points: [newX / this.getXb , newY]
      }
      // 请求服务器
      this.$store.dispatch('sendDrawNewLine', newLine)
      // 本地画线, 存到vuex中
      this.$store.commit('drawNewLine', newLine)
     },

    // 笔拖动
    touchmoveHandler(e) {
      if (!this.painting) return
      this.nowX = document.getElementById('card1').clientWidth
      const lastLine = this.lines[this.lines.length - 1]
      let newX = e.evt.changedTouches[0].clientX-$('#card1').offset().left
      let newY = e.evt.changedTouches[0].clientY-$('#card1').offset().top+ $(document).scrollTop()
      lastLine.points = lastLine.points.concat([newX / this.getXb , newY])

      // 请求服务器
      this.$store.dispatch('sendUpdateNewLine', lastLine)
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
  height: 450;
  overflow: hidden;
}
</style>

