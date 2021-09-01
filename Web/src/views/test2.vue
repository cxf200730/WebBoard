<template>
<el-container>
    <el-header>
        <el-tag>房间号：{{classCode}}</el-tag> 
        <!-- <el-button @click = "test">test</el-button>
        <el-button @click = "clear">clear</el-button> -->
    </el-header>
    <el-main>
        <el-row :gutter="20" v-for="i in 4" :key="i">
            <el-col :span="4" v-for="j in 6" :key="j">
                <div class="grid-content bg-purple">
                    <div class="userinfo">
                      <i>{{(i-1)*6 + j}}</i>
                      <el-button size="mini">连接</el-button></div>
                        <el-card ref="wrapper" :body-style="{ padding: 0 }" id="card1">
                            <!-- {{(i-1)*6 + j}} -->
                            <!-- {{6 * i - 6 + j}} -->
                            <v-stage
                            :id="'stage' + ((i-1)*6 + j)"
                            :config="stageConfig"
                            @mousedown="mousedownHandler"
                            @mouseup="mouseupHandler"
                            @mousemove="mousemoveHandler"
                            >
                            <v-layer>
                                <v-line
                                v-for="(line, index) in initexam[indexTopic[6 * i - 7 + j]]"
                                :key="index"
                                :config="{
                                    stroke: '#FFF111',
                                    strokeWidth:1.5,
                                    points:line.points,
                                    lineCap: line.lineCap,
                                    lineJoin: line.lineJoin,
                                    bezier:line.bezier,
                                    rotation:line.rotation,}"
                                />
                            </v-layer>
                            <v-layer>
                                <v-line
                                v-for="(line, index) in stuTopic[6 * i - 7 + j][indexTopic[6 * i - 7 + j]]"
                                :key="index"
                                :config="{
                                    stroke: '#FFFFFF',
                                    strokeWidth:1.5,
                                    points:line.points,
                                    lineCap: line.lineCap,
                                    lineJoin: line.lineJoin,
                                    bezier:line.bezier,
                                    rotation:line.rotation,}"
                                />
                            </v-layer>
                            <v-layer>
                                <v-line
                                v-for="(line, index) in teacherLines[(i-1)*6 + j - 1]"
                                :key="index"
                                :config="line"
                                />
                            </v-layer>
                            <v-layer>
                                <v-line
                                v-for="(line, index) in teacherLines2[(i-1)*6 + j - 1]"
                                :key="index"
                                :config="line"
                                />
                            </v-layer>
                        </v-stage>
                    </el-card>
                </div>
            </el-col>
        </el-row>     
    </el-main>
</el-container>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
export default {
    created() {
    this.$store.dispatch('sendUserEnter')
    const that = this
    let exam = []
      this.axios.get('http://192.168.51.109:3000/exam',{
      }).then((res)=>{
        for (let k = 0; k < res.data.message.length; k++) {
          const count = JSON.parse(res.data.message[k].topic_content)
          for (let i = 0; i < count.length; i++) {
            for (let j = 0; j < count[i].points.length; j++) {
              if(j % 2 == 0){
                count[i].points[j] *= that.getXb
              }else{
                count[i].points[j] *= that.getYb
              }
            }
          }
          exam[k] = count
        }
        this.$store.commit('initexam', exam)
      })


      this.axios.get('http://192.168.51.109:3000/teacher/gettopic').then((res)=>{
      let topic = Array.apply(null,Array(20)).map(() => [])
      for (let i = 0; i < res.data.message.length; i++) {
       let code = parseInt(res.data.message[i].stucode.slice(6,res.data.message[i].stucode.length))
       topic[code - 1].push(res.data.message[i])
      }

      for (let i = 0; i < topic.length; i++) {
        for (let j = 0; j < topic[i].length; j++) {
          let count2 = JSON.parse(topic[i][j].stuanswer)
          for (let k = 0; k < count2.length; k++) {
            for (let m = 0; m < count2[k].points.length; m++) {
              if(m % 2 == 0){
                count2[k].points[m] *= that.getXb
              }else{
                count2[k].points[m] *= that.getYb
              }
            }
            topic[i][j] = count2
          }
        }
      }
      this.$store.commit('initstuTopic', topic)
    })
  },
computed: {
    ...mapState(["teacherLines","teacherLines2","initexam"]),
    ...mapGetters(['isGameStarted', 'isGameHolder']),
    ...mapState(['teacherphone', 'messages', 'holder']),
    indexTopic(){
      // console.log(1);
      const that = this
      this.axios.get('http://192.168.51.109:3000/teacher/gettopic').then((res)=>{
      let topic = Array.apply(null,Array(20)).map(() => [])
      // console.log(res.data.message);
      for (let i = 0; i < res.data.message.length; i++) {
       let code = parseInt(res.data.message[i].stucode.slice(6,res.data.message[i].stucode.length))
       topic[code - 1][parseInt(res.data.message[i].topic_index) - 1] = res.data.message[i]
      }
      for (let i = 0; i < topic.length; i++) {
        for (let j = 0; j < topic[i].length; j++) {
          if(topic[i][j] == undefined){
            // console.log(1);
          }else{
            let count2 = JSON.parse(topic[i][j].stuanswer)
          for (let k = 0; k < count2.length; k++) {
            for (let m = 0; m < count2[k].points.length; m++) {
              if(m % 2 == 0){
                count2[k].points[m] *= that.getXb
              }else{
                count2[k].points[m] *= that.getYb
              }
            }
            topic[i][j] = count2
          }
          }
        }
      }
      this.$store.commit('initstuTopic', topic)
    })
      return this.$store.state.indexTopic
    },
    stuTopic(){
      if(this.$store.state.stuTopic[0] === undefined){
        const arr = Array.apply(null,Array(20)).map(() => [[]])
        return arr;
      }else{
        // console.log(1);
        return this.$store.state.stuTopic
      }
      
    }
},
mounted(){
//    document.getElementById('card1').style.height = document.getElementById('card1').clientWidth * 1.1 + "px"
    this.getXb =  document.getElementById('card1').clientWidth
    this.getYb =  document.getElementById('card1').clientHeight
    // document.getElementById('card1').translate(0.5,0.5)
    this.stageConfig.width = document.getElementById('card1').clientWidth
    this.stageConfig.height = document.getElementById('card1').clientHeight
    this.$store.commit('initXb', this.getXb)
    this.$store.commit('initYb', this.getYb)
 
    
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
      exam:[],
    }
},
methods: {
  test(){
this.$store.commit('test')
  },
  clear(){
this.$store.commit('clear')
  },
    // 鼠标按下
    mousedownHandler(e) {
      this.painting = true
        const newLine = {
        stroke: this.stroke,
        strokeWidth: this.strokeWidth,
        points: [e.evt.layerX / this.getXb, e.evt.layerY / this.getYb]
      }
      const id = e.currentTarget.attrs.id.slice(5,e.currentTarget.attrs.id.length)
      // 请求服务器
      this.$store.dispatch('teachersendDrawNewLine', {newLine:newLine,id:id})
      // 本地画线, 存到vuex中
        this.$store.commit('teacherdrawNewLine', {newLine:newLine,a:e.currentTarget.attrs.id})
    },

    // 鼠标拖动
    mousemoveHandler(e) {
      if (!this.painting) return
      let lastLine;
      let a = e.currentTarget.attrs.id.slice(5,e.currentTarget.attrs.id.length)
      const id = e.currentTarget.attrs.id.slice(5,e.currentTarget.attrs.id.length)
      lastLine = this.teacherLines2[a - 1][this.teacherLines2[a - 1].length - 1]
      lastLine.points = lastLine.points.concat([e.evt.layerX / this.getXb, e.evt.layerY / this.getYb]) 
      // 请求服务器
      this.$store.dispatch('teachersendUpdateNewLine', {lastLine:lastLine,id:id})
      this.$store.commit('teacherupdateNewLine1', {lastLine:lastLine,a:e.currentTarget.attrs.id})
      
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
    /* overflow: auto; */
    .el-header{
        line-height: 60px;
    }

    .el-main{
        background-color: aquamarine;
        overflow: auto;
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
                    justify-content: space-between;
                    display: flex;
                }
            }
        }
    }
}
.el-card{
    width: 100%;
    height: 300px;
    background-color: rgb(33, 33, 33);
    color: #FFFFFF;
}
</style>