<template>
<el-container>
    <el-header>
        <el-tag>房间号：{{classCode}}</el-tag> 
    </el-header>
    <el-main>
            <el-row :gutter="20">
                <el-col :span="6">
                    <div class="grid-content bg-purple">
                        <div class="userinfo">张三</div>
                            <el-card ref="wrapper" :body-style="{ padding: 0 }" id="card1">
                                <v-stage
                                id="stage"
                                :config="stageConfig"
                                @mousedown="mousedownHandler"
                                @mouseup="mouseupHandler"
                                @mousemove="mousemoveHandler"
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
                </el-col>
                <el-col :span="6">
                    <div class="grid-content bg-purple">
                        <div class="userinfo">李四 </div>
                            <el-card ref="wrapper" :body-style="{ padding: 0 }" id="card2">
                                <v-stage
                                id="stage2"
                                :config="stageConfig"
                                @mousedown="mousedownHandler"
                                @mouseup="mouseupHandler"
                                @mousemove="mousemoveHandler"
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
                </el-col>
                <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
                <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
                <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
                <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
                <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
            </el-row>
    </el-main>
</el-container>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
export default {
     created() {
    this.$store.dispatch('sendUserEnter')
  },
computed: {
    ...mapState(['teacherLines','lines2']),
    ...mapGetters(['isGameStarted', 'isGameHolder']),
},
mounted(){
    this.getXb =  document.getElementById('card1').clientWidth
    this.getYb =  document.getElementById('card1').clientHeight
    this.stageConfig.width = this.$refs.wrapper.$el.offsetWidth
    this.stageConfig.height = this.$refs.wrapper.$el.offsetHeight
    this.$store.commit('initXb', this.getXb)
    this.$store.commit('initYb', this.getYb)
    // console.log(this.getXb + " " + this.getYb);
},
data(){
    return{
        classCode:1101,
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
      getYb:1,
    }
},
methods: {
    // 鼠标按下
    mousedownHandler(e) {
      this.painting = true
      if(e.currentTarget.attrs.id === "stage"){
        const newLine = {
        stroke: this.stroke,
        strokeWidth: this.strokeWidth,
        points: [e.evt.layerX / this.getXb, e.evt.layerY / this.getYb]
      }
        // 请求服务器
        this.$store.dispatch('teachersendDrawNewLine', newLine)
        // 本地画线, 存到vuex中
        this.$store.commit('teacherdrawNewLine', newLine)
      }else{
        const newLine = {
        stroke: this.stroke,
        strokeWidth: this.strokeWidth,
        points: [e.evt.layerX / this.getXb, e.evt.layerY / this.getYb]
      }
        // 请求服务器
        this.$store.dispatch('teachersendDrawNewLine2', newLine)
        // 本地画线, 存到vuex中
        this.$store.commit('teacherdrawNewLine2', newLine)
      }
    },

    // 鼠标拖动
    mousemoveHandler(e) {
      if (!this.painting) return
      if(e.currentTarget.attrs.id === "stage"){
        const lastLine = this.lines1[this.lines1.length - 1]
        lastLine.points = lastLine.points.concat([e.evt.layerX / this.getXb, e.evt.layerY / this.getYb]) 
        // 请求服务器
        this.$store.dispatch('teachersendUpdateNewLine', lastLine)
        this.$store.commit('teacherupdateNewLine1', lastLine)
      }else{
        const lastLine = this.lines2[this.lines2.length - 1]
        lastLine.points = lastLine.points.concat([e.evt.layerX / this.getXb, e.evt.layerY / this.getYb]) 
         // 请求服务器
        this.$store.dispatch('teachersendUpdateNewLine2', lastLine)
        this.$store.commit('teacherupdateNewLine2', lastLine)
      }
    },

    // 鼠标释放
    mouseupHandler() {
      this.painting = false
    },
}

}
</script>
<style lang = "less" scoped>
.el-container{
    width: 100%;
    height: 100%;
    background-color: aqua;

    .el-header{
        line-height: 60px;
    }

    .el-main{
        background-color: aquamarine;
        overflow: hidden;
        .el-row {
            margin-bottom: 20px;
            height: 50%;
        } 
        .el-col {
            border-radius: 4px;
            height: 90%;

            .bg-purple {
                background: #d3dce6;
            }
            .grid-content {
                border-radius: 4px;
                height: 100%;
                display: flex;
                flex-flow: column;

                .userinfo{
                    background-color: black;
                    color: #FFFFFF;
                    font-weight: bold;
                    height: 40px;
                    line-height: 40px;
                    padding-left: 10px;
                    letter-spacing: 3px;
                }
            }
        }
    }
}
.el-card{
    width: 100%;
    height: 100%;
}
</style>