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
      <!-- <el-button @click = "test">save</el-button> -->
      <!--  <el-button @click = "test2">get</el-button> -->
      <div>
        <!-- <span @touchstart="clear">清空</span> -->
          <el-divider direction="vertical"></el-divider>
        <span @touchstart="beforeTopic">上一题</span>
          <el-divider direction="vertical"></el-divider>
        <span @touchstart="nextTopic">下一题</span>
          <el-divider direction="vertical"></el-divider>
        <!-- <span @click = "remove">提交</span> -->
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
      <v-layer>
        <v-line
          v-for="(line, index) in topic[index]"
          :key="index"
          :config="line"
        />
      </v-layer>
      <v-layer>
        <v-line
          v-for="(line, index) in initexam[index]"
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
    </v-stage>
  </el-card>
  </div>

  <div style="margin:0 auto;margin-top:50px;">
    <el-scrollbar  max-height="400px">
      <el-button  @click="chooseItem(item)" style="margin-left:10px" size="small" class="item" v-for="item in 5" :key="item">
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
    const that = this
    let exam = []
      this.axios.get('http://192.168.51.109:3000/exam',{
      }).then((res)=>{
        for (let k = 0; k < res.data.message.length; k++) {
          const count = JSON.parse(res.data.message[k].topic_content)
          // console.log(JSON.parse(res.data.message[k].topic_content));
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
    const that = this
    

      this.axios.post('http://192.168.51.109:3000/student/gettopic',{
        stucode:localStorage.getItem('teacherphone'),
      }).then((res)=>{
        console.log(res.data.message);
        for (let k = 0; k < res.data.message.length; k++) {
          const count = JSON.parse(res.data.message[k].stuanswer)
          for (let i = 0; i < count.length; i++) {
            for (let j = 0; j < count[i].points.length; j++) {
              if(j % 2 == 0){
                count[i].points[j] *= that.getXb
              }else{
                count[i].points[j] *= that.getYb
              }
            }
          }
          // console.log(parseInt(res.data.message[k].topic_index - 1));
          that.topic[parseInt(res.data.message[k].topic_index - 1)] = count
        }
        // console.log(this.topic);
      })
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
        stroke: '#000000',
        strokeWidth: 2,
        pictureIndex:0,
        id:0,
        getlines:[],
        topic:[[],[],[],[],[]],
        index:0
    }

  },
  computed: {
    ...mapState(['lines','teacherLines','savelines','initexam']),
    ...mapGetters(['isGameStarted', 'isGameHolder'])
  },

 
  methods: {
    test(){
      const id = localStorage.getItem('teacherphone')
      console.log(id);
      this.axios.post('http://192.168.51.109:3000/exam/addtopic',{
        topic_index:"5",
        topic_content:this.savelines
      }).then((res)=>{
        if(res.data.err_code === 0){
          alert("保存成功")
        }
      })
    },
    test2(){
      const that = this
      this.axios.get('http://192.168.51.109:3000/exam',{
      }).then((res)=>{
        console.log(res.data.message)
        for (let i = 0; i < res.data.message.length; i++) {
          that.exam[i] = JSON.parse(res.data.message[i].topic_content)
        }
        console.log(that.exam);
      })
    },
    chooseItem(index){
      this.$store.commit('clearLine')
      let temp = this.index + 1
      // console.log();
      // console.log(this.topic[this.index].length);
      this.index = index - 1
     
      const that = this
      that.$store.dispatch('changeTopic', {id:localStorage.getItem('teacherphone'),indexTopic:that.index + 1})
    
      // console.log(this.savelines);
      if(this.savelines.length != 0){
        
        if(this.topic[temp - 1].length === 0){
          console.log("new");
          this.axios.post('http://192.168.51.109:3000/student/savetopic',{
            stucode:localStorage.getItem('teacherphone'),
            room:"1001",
            exam_code:"1001",
            topic_index:(temp).toString(),
            stuanswer:this.savelines,
            // update_answer:"",
            fintime:"0"
          }).then((res)=>{
            if(res.data.err_code === 0){
              // alert("保存成功")
              that.$store.commit('clearsaveLine')

              that.axios.post('http://192.168.51.109:3000/student/gettopic',{
                stucode:localStorage.getItem('teacherphone'),
              }).then((res)=>{
                // console.log(JSON.parse(res.data.message[that.index].stuanswer))
                for (let k = 0; k < res.data.message.length; k++) {
                  const count = JSON.parse(res.data.message[k].stuanswer)
                  for (let i = 0; i < count.length; i++) {
                    // console.log(count[i]);
                    for (let j = 0; j < count[i].points.length; j++) {
                      if(j % 2 == 0){
                        // console.log(j);
                        count[i].points[j] *= that.getXb
                      }else{
                        count[i].points[j] *= that.getYb
                      }
                    }
                  }
                  that.topic[parseInt(res.data.message[k].topic_index - 1)] = count
                  // that.topic[parseInt(res.data.message[k].topic_index - 1)] = count
                }
                // console.log(that.topic);
              })

            }
          })
        }else{
          console.log("update");
          that.axios.post('http://192.168.51.109:3000/student/updatetopic',{
                stucode:localStorage.getItem('teacherphone'),
                room:"1001",
                exam_code:"1001",
                topic_index:(temp).toString(),
                stuanswer:that.savelines,
                // update_answer:"",
                fintime:"0"
              }).then((res)=>{
                for (let i = 0; i < JSON.parse(res.data.message[0].stuanswer).length; i++) {
                  that.savelines.push(JSON.parse(res.data.message[0].stuanswer)[i])
                }
                // console.log(that.savelines);
                that.axios.post('http://192.168.51.109:3000/student/updatetopic2',{
                stucode:localStorage.getItem('teacherphone'),
                room:"1001",
                exam_code:"1001",
                topic_index:(temp).toString(),
                stuanswer:that.savelines,
                // update_answer:"",
                fintime:"0"
              }).then(res => {
                // console.log(res.data);
                that.$store.commit('clearsaveLine')

                that.axios.post('http://192.168.51.109:3000/student/gettopic',{
                stucode:localStorage.getItem('teacherphone'),
              }).then((res)=>{
                // console.log(JSON.parse(res.data.message[that.index].stuanswer))
                for (let k = 0; k < res.data.message.length; k++) {
                  const count = JSON.parse(res.data.message[k].stuanswer)
                  for (let i = 0; i < count.length; i++) {
                    // console.log(count[i]);
                    for (let j = 0; j < count[i].points.length; j++) {
                      if(j % 2 == 0){
                        // console.log(j);
                        count[i].points[j] *= that.getXb
                      }else{
                        count[i].points[j] *= that.getYb
                      }
                    }
                  }
                  that.topic[parseInt(res.data.message[k].topic_index - 1)] = count
                  // that.topic[parseInt(res.data.message[k].topic_index - 1)] = count
                }
                // console.log(that.topic);
              })
              })
              })
        }
    
      }

    },
    nextTopic(){
      const that = this
      // console.log(this.index);
      if(this.index == 4){
        this.index = 4
      }else{
        this.index++
        this.$store.commit('clearLine')
        that.$store.dispatch('changeTopic', {id:localStorage.getItem('teacherphone'),indexTopic:that.index + 1})
        if(this.savelines.length != 0){

          if(this.topic[this.index - 1].length === 0){
            // console.log("new" + (this.index - 1));
          this.axios.post('http://192.168.51.109:3000/student/savetopic',{
              stucode:localStorage.getItem('teacherphone'),
              room:"1001",
              exam_code:"1001",
              topic_index:(this.index).toString(),
              stuanswer:this.savelines,
              // update_answer:"",
              fintime:"0"
            }).then((res)=>{
              if(res.data.err_code === 0){
                // alert("保存成功")
                that.$store.commit('clearsaveLine')

                that.axios.post('http://192.168.51.109:3000/student/gettopic',{
                  stucode:localStorage.getItem('teacherphone'),
                }).then((res)=>{
                  // console.log(JSON.parse(res.data.message[that.index].stuanswer))
                  for (let k = 0; k < res.data.message.length; k++) {
                    const count = JSON.parse(res.data.message[k].stuanswer)
                    for (let i = 0; i < count.length; i++) {
                      // console.log(count[i]);
                      for (let j = 0; j < count[i].points.length; j++) {
                        if(j % 2 == 0){
                          // console.log(j);
                          count[i].points[j] *= that.getXb
                        }else{
                          count[i].points[j] *= that.getYb
                        }
                      }
                    }
                    that.topic[parseInt(res.data.message[k].topic_index - 1)] = count
                  }
                  // console.log(that.topic);
                })

              }
            })
          }else{
            console.log("update");
          that.axios.post('http://192.168.51.109:3000/student/updatetopic',{
                stucode:localStorage.getItem('teacherphone'),
                room:"1001",
                exam_code:"1001",
                topic_index:(this.index).toString(),
                stuanswer:that.savelines,
                // update_answer:"",
                fintime:"0"
              }).then((res)=>{
                for (let i = 0; i < JSON.parse(res.data.message[0].stuanswer).length; i++) {
                  that.savelines.push(JSON.parse(res.data.message[0].stuanswer)[i])
                }
                // console.log(that.savelines);
                that.axios.post('http://192.168.51.109:3000/student/updatetopic2',{
                stucode:localStorage.getItem('teacherphone'),
                room:"1001",
                exam_code:"1001",
                topic_index:(this.index).toString(),
                stuanswer:that.savelines,
                // update_answer:"",
                fintime:"0"
              }).then(res => {
                // console.log(res.data);
                that.$store.commit('clearsaveLine')

                that.axios.post('http://192.168.51.109:3000/student/gettopic',{
                stucode:localStorage.getItem('teacherphone'),
              }).then((res)=>{
                // console.log(JSON.parse(res.data.message[that.index].stuanswer))
                for (let k = 0; k < res.data.message.length; k++) {
                  const count = JSON.parse(res.data.message[k].stuanswer)
                  for (let i = 0; i < count.length; i++) {
                    // console.log(count[i]);
                    for (let j = 0; j < count[i].points.length; j++) {
                      if(j % 2 == 0){
                        // console.log(j);
                        count[i].points[j] *= that.getXb
                      }else{
                        count[i].points[j] *= that.getYb
                      }
                    }
                  }
                  that.topic[parseInt(res.data.message[k].topic_index - 1)] = count
                  // that.topic[parseInt(res.data.message[k].topic_index - 1)] = count
                }
                // console.log(that.topic);
              })
              })
              })
          }
        }
      }
    },
    clear(){
      console.log(1);
      this.$store.commit('clearLine')
    },
    beforeTopic(){
      const that = this
      // alert(this.index);
      if(this.index == 0){
        this.index = 0
      }else{
        this.index--
        this.$store.commit('clearLine')
        that.$store.dispatch('changeTopic', {id:localStorage.getItem('teacherphone'),indexTopic:that.index + 1})
        if(this.savelines.length != 0){
          if(this.topic[this.index + 1].length === 0){
          // if(this.index + 1 === 0){
        this.axios.post('http://192.168.51.109:3000/student/savetopic',{
            stucode:localStorage.getItem('teacherphone'),
            room:"1001",
            exam_code:"1001",
            topic_index:(this.index + 2).toString(),
            stuanswer:this.savelines,
            // update_answer:"",
            fintime:"0"
          }).then((res)=>{
            // console.log(res);
            if(res.data.err_code === 0){
              // alert("保存成功")
            
              that.$store.commit('clearsaveLine')

              that.axios.post('http://192.168.51.109:3000/student/gettopic',{
                stucode:localStorage.getItem('teacherphone'),
              }).then((res)=>{
                // console.log(JSON.parse(res.data.message[that.index].stuanswer))
                for (let k = 0; k < res.data.message.length; k++) {
                  const count = JSON.parse(res.data.message[k].stuanswer)
                  for (let i = 0; i < count.length; i++) {
                    // console.log(count[i]);
                    for (let j = 0; j < count[i].points.length; j++) {
                      if(j % 2 == 0){
                        // console.log(j);
                        count[i].points[j] *= that.getXb
                      }else{
                        count[i].points[j] *= that.getYb
                      }
                    }
                  }
                  that.topic[parseInt(res.data.message[k].topic_index - 1)] = count
                }
                // console.log(that.topic);
              })

            }
          })}else{
            console.log("update");
          that.axios.post('http://192.168.51.109:3000/student/updatetopic',{
                stucode:localStorage.getItem('teacherphone'),
                room:"1001",
                exam_code:"1001",
                topic_index:(this.index + 2).toString(),
                stuanswer:that.savelines,
                // update_answer:"",
                fintime:"0"
              }).then((res)=>{
                for (let i = 0; i < JSON.parse(res.data.message[0].stuanswer).length; i++) {
                  that.savelines.push(JSON.parse(res.data.message[0].stuanswer)[i])
                }
                // console.log(that.savelines);
                that.axios.post('http://192.168.51.109:3000/student/updatetopic2',{
                stucode:localStorage.getItem('teacherphone'),
                room:"1001",
                exam_code:"1001",
                topic_index:(this.index + 2).toString(),
                stuanswer:that.savelines,
                // update_answer:"",
                fintime:"0"
              }).then(res => {
                // console.log(res.data);
                that.$store.commit('clearsaveLine')

                that.axios.post('http://192.168.51.109:3000/student/gettopic',{
                stucode:localStorage.getItem('teacherphone'),
              }).then((res)=>{
                // console.log(JSON.parse(res.data.message[that.index].stuanswer))
                for (let k = 0; k < res.data.message.length; k++) {
                  const count = JSON.parse(res.data.message[k].stuanswer)
                  for (let i = 0; i < count.length; i++) {
                    // console.log(count[i]);
                    for (let j = 0; j < count[i].points.length; j++) {
                      if(j % 2 == 0){
                        // console.log(j);
                        count[i].points[j] *= that.getXb
                      }else{
                        count[i].points[j] *= that.getYb
                      }
                    }
                  }
                  that.topic[parseInt(res.data.message[k].topic_index - 1)] = count
                  // that.topic[parseInt(res.data.message[k].topic_index - 1)] = count
                }
                // console.log(that.topic);
              })
              })
              })
          }
        }
      }
    },
    remove(){
      this.axios.post('http://192.168.51.109:3000/student/savetopic',{
        stucode:localStorage.getItem('teacherphone'),
        room:"1001",
        exam_code:"1001",
        topic_index:(this.index + 1).toString(),
        stuanswer:this.savelines,
        // update_answer:"",
        fintime:"0"
      }).then((res)=>{
        if(res.data.err_code === 0){
          alert("保存成功")
        }
      })
      // localStorage.removeItem('studentcode');
      // localStorage.removeItem('classcode');
      // localStorage.removeItem('teacherphone')
      // this.$router.push('login')
    },
    
    // 笔按下
    touchstartHandler(e) {
      // alert(2)
      // if (!this.isGameHolder || !this.isGameHolder) return
      this.painting = true
      let newX = Math.ceil(e.evt.changedTouches[0].clientX-$('#card').offset().left)
      let newY = Math.ceil(e.evt.changedTouches[0].clientY-$('#card').offset().top+ $(document).scrollTop())
      // console.log(newX);
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
      const newLine2 = {
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
      this.$store.commit('saveNewLine', newLine)
      this.$store.commit('drawNewLine', newLine2)
      
     },

    // 笔拖动
    touchmoveHandler(e) {
      if (!this.painting) return
      this.nowX = document.getElementById('card').clientWidth
      const lastLine = this.lines[this.lines.length - 1]
      const savelastLine = this.savelines[this.savelines.length - 1]
      let newX = Math.ceil(e.evt.changedTouches[0].clientX-$('#card').offset().left)
      let newY = Math.ceil(e.evt.changedTouches[0].clientY-$('#card').offset().top+ $(document).scrollTop())
      lastLine.points = lastLine.points.concat([newX / this.getXb , newY / this.getYb])
      savelastLine.points = savelastLine.points.concat([newX / this.getXb , newY / this.getYb])
      const id = localStorage.getItem('teacherphone').slice(6,localStorage.getItem('teacherphone').length)
      if(lastLine.points.length > 6){
        lastLine.bezier = true
      }
      if(savelastLine.points.length > 6){
        lastLine.bezier = true
      }
     
      // 请求服务器
      this.$store.dispatch('stuUpdateNewLine', {lastLine:lastLine,id:id})
      this.$store.commit('saveupdateNewLine1', savelastLine)
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
       line-height: 25px;
      //  font-size: 20px;
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
