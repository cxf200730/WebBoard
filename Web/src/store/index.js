import Vue from 'vue'
import Vuex from 'vuex'
import socket from '@/socket'

Vue.use(Vuex)

const state = {
  connected: false, // 连接状态
  teacherphone: '', // 当前用户昵称
  teacherphones: [], // 房间用户昵称列表
  holder: '', // 游戏主持人
  lines:[],
  lines1: [] ,// 房间的绘图信息 (画了多少根线)
  lines2: [] ,// 房间的绘图信息 (画了多少根线)
  messages:[],
  getXb:1,
}

const mutations = {
  initXb(state, getXb){
    state.getXb = getXb
  },
  updateConnected(state, connected) {
    state.connected = connected
  },
  updateteacherphone(state, teacherphone) {
    state.teacherphone = teacherphone || ''
  },
  updateteacherphones(state, teacherphones) {
    state.teacherphones = teacherphones || []
  },
  updateHolder(state, holder) {
    state.holder = holder || ''
  },
  updateLines(state, lines) {
    state.lines = lines || []
  },
  
  updatemessages(state, messages) {
    state.messages = messages || []
  },
  addTomessages(state, message) {
    state.messages.push(message)
  },
  addToteacherphones(state, teacherphone) {
    if (!state.teacherphones.includes(teacherphone)) {
      state.teacherphones.push(teacherphone)
    }
  },
  studentdrawNewLine(state, obj) {
    let newLine = obj.line
    // console.log(obj.line);
    let teacherphone = obj.teacherphone
    if(teacherphone === "20210101"){
      newLine.points[0] *= state.getXb
      state.lines1.push(newLine)
    }else if(teacherphone === "20210102"){
      newLine.points[0] *= state.getXb
      state.lines2.push(newLine)
    }
    //console.log("初始画板大小"+state.getXb);
    // newLine.points[0] *= state.getXb
    // state.lines[index].push(newLine)
    //newLine.points[0] /= state.getXb
  },
  studentupdateNewLine(state, obj) {
    let lastLine = obj.line
    let teacherphone = obj.teacherphone
    if(teacherphone === "20210101"){
      const line = state.lines1[state.lines1.length - 1]
      var x = lastLine.points[lastLine.points.length-2]
      var y = lastLine.points[lastLine.points.length-1]
      x = x * state.getXb
      line.points = line.points.concat([x,y])
    }else if(teacherphone === "20210102"){
      const line = state.lines2[state.lines2.length - 1]
      var x = lastLine.points[lastLine.points.length-2]
      var y = lastLine.points[lastLine.points.length-1]
      x = x * state.getXb
      line.points = line.points.concat([x,y])
    }
    // const line = state.lines[state.lines.length - 1]
    // var x = lastLine.points[lastLine.points.length-2]
    // var y = lastLine.points[lastLine.points.length-1]
    // x = x * state.getXb
    // line.points = line.points.concat([x,y])
  },
  drawNewLine(state, newLine) {
    
    //console.log("初始画板大小"+state.getXb);
    newLine.points[0] *= state.getXb
    state.lines.push(newLine)
    //newLine.points[0] /= state.getXb
  },
  updateNewLine1(state, lastLine) {
    const line = state.lines[state.lines.length - 1]
    lastLine.points[lastLine.points.length-2] *= state.getXb
    var y = lastLine.points[lastLine.points.length-1]
    //console.log("这是变u的线"+line.points.length);
    line.points = lastLine.points
    //console.log("这是变wanhou的线"+line.points.length);
  },
  updateNewLine(state, lastLine) {
    
    const line = state.lines[state.lines.length - 1]
    var x = lastLine.points[lastLine.points.length-2]
    var y = lastLine.points[lastLine.points.length-1]
    //console.log("这是本画板的宽"+state.getXb + " ,变换前" +x + "..." + lastLine.points[lastLine.points.length-2]);
    x = x * state.getXb
    //console.log("+++"+line.points[line.points.length-1]);
    //tempLine.points[tempLine.points.length-2] *= state.getXb
    //console.log("这是本画板的宽"+state.getXb + " ,变换后" +x + "..." + lastLine.points[lastLine.points.length-2]);
    //console.log("这是变u的线"+line.points.length);
    line.points = line.points.concat([x,y]) 
    //console.log("这是变wanhou的线"+line.points.length);
  },


  // updateNewLine2(state, lastLine) {
  //   const line = state.lines[state.lines.length - 1]
  //   var x = lastLine.points[lastLine.points.length-2]
  //   var y = lastLine.points[lastLine.points.length-1]    
  //   x = x * state.getXb   
  //   line.points = line.points.concat([x,y])
    
  // },
  delFromteacherphones(state, teacherphone) {
    state.teacherphones = state.teacherphones.filter(item => item !== teacherphone)
  }
}

const actions = {
  // 测试
  sendMessage(context, message) {
    // console.log(message);
    return new Promise((resolve, reject) => {
      socket.emit('sendMessage', message, res => {
        // console.log(res)
        resolve(res)
      })
    })
  },

 
  // 确认用户名是否存在
  checkUserExist(context, teacherphone) {
    return new Promise((resolve, reject) => {
      socket.emit('check_user_exist', teacherphone, isExist => {
        resolve(isExist)
      })
    })
  },
  // 进入房间
  sendUserEnter(context) {
    let type = localStorage.getItem('type')
    let teacherphone = localStorage.getItem('teacherphone')
    const obj = {
      teacherphone:teacherphone,
      type:type
    }
    socket.emit('enter', obj)
    context.commit('updateteacherphone', obj.teacherphone)
  },
  // 开始游戏申请
  sendStartGame(context, imageAnswer) {
    socket.emit('start_game', imageAnswer)
  },
  // 结束游戏申请
  sendStopGame(context) {
    socket.emit('stop_game')
  },
  // 画新线
  sendDrawNewLine(context, newLine) {
    // alert(1);
    // alert(newLine.points[0]);
  
    const obj = {
      line:newLine,
      teacherphone:localStorage.getItem('teacherphone')
    }

    socket.emit('new_line', obj)
  },
  // 更新线条
  sendUpdateNewLine(context, lastLine) {
    const obj = {
      line:lastLine,
      teacherphone:localStorage.getItem('teacherphone')
    }
    socket.emit('update_line', obj)
  },

  sendAnswerGame(context, inputImageName) {
    socket.emit('answer_game', inputImageName)
  },

  sendUserLeave(context) {
    socket.emit('leave')
    context.commit('updateteacherphone', '')
    localStorage.removeItem('teacherphone')
  }
}

const getters = {
  isGameStarted(state) {
    // 根据主持人是否存在, 判断游戏是否开始
    return !!state.holder
  },
  isGameHolder(state) {
    return state.teacherphone === state.holder
  }
}

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters
})
