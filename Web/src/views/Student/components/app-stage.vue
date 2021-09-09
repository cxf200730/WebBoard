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
          <el-divider direction="vertical"></el-divider>
        <i @touchstart="beforeTopic">上一题</i>
          <el-divider direction="vertical"></el-divider>
        <i @touchstart="nextTopic">下一题</i>
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
      <!-- 学生实时画的线 -->
        <v-line
          v-for="(line, index) in lines"
          :key="index"
          :config="line"
        />
      </v-layer>
      <v-layer>
        <!-- 老师实时画的线 -->
        <v-line
          v-for="(line, index) in teacherLines[id-1]"
          :key="index"
          :config="line"
        />
      </v-layer>
      <v-layer>
        <!-- 学生保存的笔迹 -->
        <v-line
          v-for="(line, index) in topic[index]"
          :key="index"
          :config="line"
        />
      </v-layer>
      <v-layer>
        <!-- 老师保存的笔迹 -->
        <v-line
          v-for="(line, index) in topic2[index]"
          :key="index"
          :config="{
            stroke: '#d42d1f',
            strokeWidth:1.5,
            points:line.points,
            lineCap: line.lineCap,
            lineJoin: line.lineJoin,
            bezier:line.bezier,
            rotation:line.rotation,}"
        />
      </v-layer>
      <v-layer>
        <!-- 试卷题目 -->
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
    // 页面初始化获取试卷题目，并保存到VueX中
    this.axios.get('http://192.168.51.117:3000/exam',{
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
  },
  mounted(){
    this.id = localStorage.getItem('teacherphone').slice(6,localStorage.getItem('teacherphone').length)
    window.addEventListener('touchmove', function(){}, { passive: false })
    this.getXb = document.getElementById('card').clientWidth
    this.getYb = document.getElementById('card').clientHeight
    this.stageConfig.width = this.$refs.wrapper.$el.offsetWidth
    this.stageConfig.height = this.$refs.wrapper.$el.offsetHeight
    this.$store.commit('initXb', this.getXb)
    this.$store.commit('initYb', this.getYb)
    const that = this
    // 获取之前保存的笔迹
    this.axios.post('http://192.168.51.117:3000/student/gettopic',{
      stucode:localStorage.getItem('teacherphone'),
    }).then((res)=>{
      for (let k = 0; k < res.data.message.length; k++) {
        let count
        let count2
        // 学生做题笔迹
        count = JSON.parse(res.data.message[k].stuanswer)
        // 老师批改笔迹
        if(res.data.message[k].updateanswer != null){
          count2 = JSON.parse(res.data.message[k].updateanswer)
        }
        // 获取数据库学生做题的笔迹保存到that.topic
        for (let i = 0; i < count.length; i++) {
          for (let j = 0; j < count[i].points.length; j++) {
            if(j % 2 == 0){
              count[i].points[j] *= that.getXb
            }else{
              count[i].points[j] *= that.getYb
            }
          }
        }
        that.topic[parseInt(res.data.message[k].topic_index - 1)] = count
        // 获取数据库老师批改的笔迹保存到that.topic2
        if(count2 != undefined){
          for (let i = 0; i < count2.length; i++) {
            for (let j = 0; j < count2[i].points.length; j++) {
              if(j % 2 == 0){
                count2[i].points[j] *= that.getXb
              }else{
                count2[i].points[j] *= that.getYb
              }
            }
          }
        }
        if(count2 != undefined)
          that.topic2[parseInt(res.data.message[k].topic_index - 1)] = count2
      }
    })
  },

  data() {
    return {
      // 画板的宽
      getXb:1,
      // 画板的高
      getYb:1,
      // 画布配置
      stageConfig: {
        width: 560,
        height: 450
      },
      // 绘画状态
      painting: false,
      // 画笔颜色
      stroke: '#000000',
      // 画笔宽度
      strokeWidth: 2,
      // 学生学号后两位
      id:0,
      getlines:[],
      // 学生答题记录
      topic:[[],[],[],[],[]],
      // 老师批改记录
      topic2:[[],[],[],[],[]],
      // 当前显示下标
      index:0
    }

  },
  computed: {
    // 学生实时画的线，老师实时画的线，要保存的线，试卷题目
    ...mapState(['lines','teacherLines','savelines','initexam'])
  },

 
  methods: {
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
          this.axios.post('http://192.168.51.117:3000/student/savetopic',{
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

              that.axios.post('http://192.168.51.117:3000/student/gettopic',{
                stucode:localStorage.getItem('teacherphone'),
              }).then((res)=>{
                // console.log(JSON.parse(res.data.message[that.index].stuanswer))
                for (let k = 0; k < res.data.message.length; k++) {
                  const count = JSON.parse(res.data.message[k].stuanswer)
                  const count2 = JSON.parse(res.data.message[k].updateanswer)
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
          that.axios.post('http://192.168.51.117:3000/student/updatetopic',{
                stucode:localStorage.getItem('teacherphone'),
                room:"1001",
                exam_code:"1001",
                topic_index:(temp).toString(),
                stuanswer:that.savelines,
                // update_answer:"",
                fintime:"0"
              }).then((res)=>{
                let count = JSON.parse(res.data.message[0].stuanswer)
                for (let i = 0; i < JSON.parse(res.data.message[0].stuanswer).length; i++) {
                  that.savelines.push(JSON.parse(res.data.message[0].stuanswer)[i])
                }
                // console.log(that.savelines);
                that.axios.post('http://192.168.51.117:3000/student/updatetopic2',{
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

                that.axios.post('http://192.168.51.117:3000/student/gettopic',{
                stucode:localStorage.getItem('teacherphone'),
              }).then((res)=>{
                // console.log(JSON.parse(res.data.message[that.index].stuanswer))
                for (let k = 0; k < res.data.message.length; k++) {
                  const count = JSON.parse(res.data.message[k].stuanswer)
                  const count2 = JSON.parse(res.data.message[k].updateanswer)
                  for (let i = 0; i < count.length; i++) {
                    // console.log(count[i]);
                    for (let j = 0; j < count[i].points.length; j++) {
                      if(j % 2 == 0){
                        count[i].points[j] *= that.getXb
                      }else{
                        count[i].points[j] *= that.getYb
                      }
                    }
                  }
                  if(count2 != null){
            
          that.topic2[parseInt(res.data.message[k].topic_index - 1)] =count2
          }
                  that.topic[parseInt(res.data.message[k].topic_index - 1)] = count
                }
                // console.log(that.topic);
              })
              })
              })
        }
    
      }

    },
    // 下一题
    nextTopic(){
      const that = this
      if(this.index == 4){
        this.index = 4
      }else{
        this.index++
        //定义一个变量用来判断老师是否需要更新数据
        var isupdate = 0
         // 如果切换题目的时候，学生在上一块画板上画过
        if(this.savelines.length != 0){
          isupdate=1
          let savetemp = this.savelines
          // 清空saveline
          this.$store.commit('clearsaveLine')
          // 如果上一块画板是空画板，则添加一条新纪录
          if(this.topic[this.index - 1].length === 0){
            let saveindex = this.index - 1
            // 把学生实时笔迹保存到本地变量
            this.topic[parseInt(saveindex)] = this.lines
            // 清空学生实时笔迹
            this.$store.commit('clearLine')
            this.axios.post('http://192.168.51.117:3000/student/savetopic',{
              stucode:localStorage.getItem('teacherphone'),
              room:"1001",
              exam_code:"1001",
              topic_index:(this.index).toString(),//第几道题
              stuanswer:savetemp,
              fintime:"0"
            }).then((res)=>{
              
            })
          }else{
            // 如果上一块画板不是空画板，则找到那条记录，向里面的点添加数据
            console.log("update");
            let saveindex = this.index
            let templines = []
            for (let i = 0; i < this.lines.length; i++) {
              templines[i] = this.lines[i]
            }
            this.$store.commit('clearLine')
            // 找到要修改的那条题目数据（根据学号，房间号，试卷号，题号确定唯一索引）
            that.axios.post('http://192.168.51.117:3000/student/updatetopic',{
              stucode:localStorage.getItem('teacherphone'),
              room:"1001",
              exam_code:"1001",
              topic_index:(saveindex).toString()
              }).then((res)=>{
                let count = JSON.parse(res.data.message[0].stuanswer)
                // 找到后，把之前保存的点的数据添加到savetemp后面，然后再将数据库中的数据修改成savetemp
                for (let i = 0; i < JSON.parse(res.data.message[0].stuanswer).length; i++) {
                  savetemp.push(JSON.parse(res.data.message[0].stuanswer)[i]) 
                }
                for (let i = 0; i < count.length; i++) {
                  for (let j = 0; j < count[i].points.length; j++) {
                    if(j % 2 === 0){
                      count[i].points[j] *= that.getXb
                    }else{
                      count[i].points[j] *= that.getYb
                    }
                    templines.push(count[i])
                  }
                }
                  that.topic[parseInt(saveindex-1)] = templines
                  
                // 修改数据
                that.axios.post('http://192.168.51.117:3000/student/updatetopic2',{
                stucode:localStorage.getItem('teacherphone'),
                room:"1001",
                exam_code:"1001",
                topic_index:(saveindex).toString(),
                stuanswer:savetemp
              }).then(res => {
                
              })
            })
          }
        }
        // 如果切换题目的时候，老师在上一块板画过
        if(this.teacherLines[this.id-1].length != 0){
          isupdate+=10
          // 保存老师画的笔迹
          let savetemp = []
          let templines = []
          let saveindex = this.index
          

          if(this.topic2[parseInt(saveindex - 1)].length === 0){
            for (let i = 0; i < this.teacherLines[this.id-1].length; i++) {
            savetemp[i] = this.teacherLines[this.id-1][i]
            templines[i] = this.teacherLines[this.id-1][i]
          }
          // 清空老师的实时笔迹
          this.$store.commit('clearteacherLine',this.id-1)
            // 把点换算为百分比的点
            for (let i = 0; i < savetemp.length; i++) {
              for (let j = 0; j < savetemp[i].points.length; j++) {
                if(j % 2 == 0){
                  savetemp[i].points[j] /= this.getXb
                }else{
                  savetemp[i].points[j] /= this.getYb
                }
              }
            }

          // 保存老师画的点
          that.axios.post('http://192.168.51.117:3000/student/updatetopic3',{
            stucode:localStorage.getItem('teacherphone'),
            room:"1001",
            exam_code:"1001",
            topic_index:saveindex.toString(),
            updateanswer:savetemp,
            fintime:"0"
          }).then(res => {
            
            // 重新获取数据库中最新的数据
            for (let i = 0; i < savetemp.length; i++) {
              for (let j = 0; j < savetemp[i].points.length; j++) {
                if(j % 2 == 0){
                  savetemp[i].points[j] *= that.getXb
                }else{
                  savetemp[i].points[j] *= that.getYb
                }
              }
            }
            that.topic2[parseInt(saveindex - 1)] = savetemp
          })
          }else{
            // 如果上一块画板不是空画板，则找到那条记录，向里面的点添加数据
            console.log("update");
            for (let i = 0; i < this.teacherLines[this.id-1].length; i++) {
              savetemp[i] = this.teacherLines[this.id-1][i]
              templines[i] = this.teacherLines[this.id-1][i]
            }
              // 清空老师的实时笔迹
              this.$store.commit('clearteacherLine',this.id-1)
            // 找到要修改的那条题目数据（根据学号，房间号，试卷号，题号确定唯一索引）
            that.axios.post('http://192.168.51.117:3000/student/updatetopic',{
              stucode:localStorage.getItem('teacherphone'),
              room:"1001",
              exam_code:"1001",
              topic_index:saveindex.toString()
              }).then((res)=>{
                let count = JSON.parse(res.data.message[0].updateanswer)
                let count2 = JSON.parse(res.data.message[0].updateanswer)
                new Promise((reslove,rej) => {
                  for (let i = 0; i < count.length; i++) {
                    for (let j = 0; j < count[i].points.length; j++) {
                      if(j % 2 === 0){
                        count[i].points[j] *= that.getXb
                      }else{
                        count[i].points[j] *= that.getYb
                      }
                    }
                    templines.push(count[i])
                  }
                that.topic2[parseInt(saveindex - 1)] = templines
                console.log(templines);
                reslove("yes")
               }).then(res=>{
                  let temp = []
                  for (let i = 0; i < savetemp.length; i++) {
                    temp.push(JSON.parse(JSON.stringify(savetemp[i])))
                  }
                 for (let i = 0; i < temp.length; i++) {
                    for (let j = 0; j < temp[i].points.length; j++) {
                      if(j % 2 == 0){
                        temp[i].points[j] /= this.getXb
                      }else{
                        temp[i].points[j] /= this.getYb
                      }
                    }
                  }
                  for (let i = 0; i < count2.length; i++) {
                    temp.push(count2[i])
                  }
                  // 修改数据
                that.axios.post('http://192.168.51.117:3000/student/updatetopic3',{
                  stucode:localStorage.getItem('teacherphone'),
                  room:"1001",
                  exam_code:"1001",
                  topic_index:(saveindex).toString(),
                  updateanswer:temp
                }).then(res => {
              
                })
                })
               })
               
                
                
             
            
          }  
        }
        // 给老师发学号后两位和题号,更新数据那些数据
        // 0不更新 1只更新学生 10只更新老师 11都更新
        this.$store.dispatch('changeTopic', {id:localStorage.getItem('teacherphone'),indexTopic:this.index + 1,isupdate:isupdate})
      }
    },
    // 上一题
    beforeTopic(){
      const that = this
      if(this.index == 0){
        this.index = 0
      }else{
        this.index--
        //定义一个变量用来判断老师是否需要更新数据
        var isupdate = 0
        // 如果切换题目的时候，学生在上一块画板上画过
        if(this.savelines.length != 0){
          isupdate=1
          let savetemp = this.savelines
          // 先清空saveline
          this.$store.commit('clearsaveLine')
          // 如果上一块画板是空画板，则添加一条新纪录
          if(this.topic[this.index +1].length === 0){
            let saveindex = this.index + 1
            that.topic[parseInt(saveindex)] = this.lines
            this.$store.commit('clearLine')
            this.axios.post('http://192.168.51.117:3000/student/savetopic',{
              stucode:localStorage.getItem('teacherphone'),
              room:"1001",
              exam_code:"1001",
              topic_index:(this.index + 2).toString(),//第几道题
              stuanswer:savetemp,
              fintime:"0"
            }).then((res)=>{
              // console.log(1);
            })
          }else{
            // 如果上一块画板不是空画板，则找到那条记录，向里面的点添加数据
            console.log("update");
            let saveindex = this.index + 2
            let templines = []
            for (let i = 0; i < this.lines.length; i++) {
              templines[i] = this.lines[i]
            }
            this.$store.commit('clearLine')
            // 找到要修改的那条题目数据（根据学号，房间号，试卷号，题号确定唯一索引）
            that.axios.post('http://192.168.51.117:3000/student/updatetopic',{
              stucode:localStorage.getItem('teacherphone'),
              room:"1001",
              exam_code:"1001",
              topic_index:saveindex.toString()
              }).then((res)=>{
                let count = JSON.parse(res.data.message[0].stuanswer)
                // 找到后，把之前保存的点的数据添加到savetemp后面，然后再将数据库中的数据修改成savetemp
                for (let i = 0; i < JSON.parse(res.data.message[0].stuanswer).length; i++) {
                  savetemp.push(JSON.parse(res.data.message[0].stuanswer)[i])
                }
                for (let i = 0; i < count.length; i++) {
                  for (let j = 0; j < count[i].points.length; j++) {
                    if(j % 2 === 0){
                      count[i].points[j] *= that.getXb
                    }else{
                      count[i].points[j] *= that.getYb
                    }
                    templines.push(count[i])
                  }
                }
                  that.topic[parseInt(saveindex - 1)] = templines
                // 修改数据库中的数据
                that.axios.post('http://192.168.51.117:3000/student/updatetopic2',{
                stucode:localStorage.getItem('teacherphone'),
                room:"1001",
                exam_code:"1001",
                topic_index:saveindex.toString(),
                stuanswer:savetemp
              }).then(res => {
                
              })
            })
          }
        }
        // 如果切换题目的时候，老师在上一块板画过
        if(this.teacherLines[this.id-1].length != 0){
          isupdate+=10
          // 保存老师画的笔迹
          let savetemp = []
          let templines = []
          let saveindex = this.index + 2
          for (let i = 0; i < this.teacherLines[this.id-1].length; i++) {
            savetemp[i] = this.teacherLines[this.id-1][i]
            templines[i] = this.teacherLines[this.id-1][i]
          }
          // 清空老师的实时笔迹
          this.$store.commit('clearteacherLine',this.id-1)
          if(this.topic2[this.index +1].length === 0){
            // 把点换算为百分比的点
            for (let i = 0; i < savetemp.length; i++) {
              for (let j = 0; j < savetemp[i].points.length; j++) {
                if(j % 2 == 0){
                  savetemp[i].points[j] /= this.getXb
                }else{
                  savetemp[i].points[j] /= this.getYb
                }
              }
            }
            // 保存老师画的点
            that.axios.post('http://192.168.51.117:3000/student/updatetopic3',{
              stucode:localStorage.getItem('teacherphone'),
              room:"1001",
              exam_code:"1001",
              topic_index:saveindex.toString(),
              updateanswer:savetemp,
              fintime:"0"
            }).then(res => {
              // 清空老师的实时笔迹
            this.$store.commit('clearteacherLine',this.id-1)
              // 重新获取数据库中最新的数据
              for (let i = 0; i < savetemp.length; i++) {
                for (let j = 0; j < savetemp[i].points.length; j++) {
                  if(j % 2 == 0){
                    savetemp[i].points[j] *= that.getXb
                  }else{
                    savetemp[i].points[j] *= that.getYb
                  }
                }
              }
              that.topic2[parseInt(saveindex - 1)] = savetemp
            })
          }else{
            // 如果上一块画板不是空画板，则找到那条记录，向里面的点添加数据
            console.log("update");
             // 清空老师的实时笔迹
            this.$store.commit('clearteacherLine',this.id-1)
            // this.$store.commit('clearLine')
            // 找到要修改的那条题目数据（根据学号，房间号，试卷号，题号确定唯一索引）
            that.axios.post('http://192.168.51.117:3000/student/updatetopic',{
              stucode:localStorage.getItem('teacherphone'),
              room:"1001",
              exam_code:"1001",
              topic_index:saveindex.toString()
              }).then((res)=>{
                let count = JSON.parse(res.data.message[0].updateanswer)
                let count2 = JSON.parse(res.data.message[0].updateanswer)
                new Promise((reslove,rej) => {
                  for (let i = 0; i < count.length; i++) {
                    for (let j = 0; j < count[i].points.length; j++) {
                      if(j % 2 === 0){
                        count[i].points[j] *= that.getXb
                      }else{
                        count[i].points[j] *= that.getYb
                      }
                    }
                    templines.push(count[i])
                  }
                that.topic2[parseInt(saveindex - 1)] = templines
                console.log(templines);
                reslove("yes")
               }).then(res=>{
                  let temp = []
                  for (let i = 0; i < savetemp.length; i++) {
                    temp.push(JSON.parse(JSON.stringify(savetemp[i])))
                  }
                 for (let i = 0; i < temp.length; i++) {
                    for (let j = 0; j < temp[i].points.length; j++) {
                      if(j % 2 == 0){
                        temp[i].points[j] /= this.getXb
                      }else{
                        temp[i].points[j] /= this.getYb
                      }
                    }
                  }
                  for (let i = 0; i < count2.length; i++) {
                    temp.push(count2[i])
                  }
                  // 修改数据
                that.axios.post('http://192.168.51.117:3000/student/updatetopic3',{
                  stucode:localStorage.getItem('teacherphone'),
                  room:"1001",
                  exam_code:"1001",
                  topic_index:(saveindex).toString(),
                  updateanswer:temp
                }).then(res => {
              
                })
                })
               })
  
          }
          
          
        }
          // 给老师发学号后两位和题号,更新数据那些数据
          // 0不更新 1只更新学生 10只更新老师 11都更新
        this.$store.dispatch('changeTopic', {id:localStorage.getItem('teacherphone'),indexTopic:this.index + 1,isupdate:isupdate})
      }
    },
    
    remove(){
      this.axios.post('http://192.168.51.117:3000/student/savetopic',{
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
    },
    
    // 笔按下
    touchstartHandler(e) {
      this.painting = true
      let newX = Math.ceil(e.evt.changedTouches[0].clientX-$('#card').offset().left)
      let newY = Math.ceil(e.evt.changedTouches[0].clientY-$('#card').offset().top+ $(document).scrollTop())
      // 创建一个新线条
      const newLine = {
        points: [newX / this.getXb , newY / this.getYb,(newX + 0.5) / this.getXb,(newY + 0.5) / this.getYb],
        stroke: "#FFFFFF",
        strokeWidth: 1,
        lineCap: 'round',
        lineJoin: 'round',
        preventDefault: false,
        // bezier:true,
        rotation:0.1,
      }
      const newLine2 = {
        points: [newX / this.getXb , newY / this.getYb,(newX + 0.5) / this.getXb,(newY + 0.5) / this.getYb],
        stroke: "#FFFFFF",
        strokeWidth: 1,
        lineCap: 'round',
        lineJoin: 'round',
        preventDefault: false,
        rotation:0.1,
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
