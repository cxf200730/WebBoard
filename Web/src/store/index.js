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
  messages:[],
  getXb:1,
  getYb:1,
  teacherLines:[[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]],
  teacherLines2:[[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]]
}

const mutations = {
  initXb(state, getXb){
    state.getXb = getXb
  },
  initYb(state, getYb){
    state.getYb = getYb
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
    console.log(12);
    state.messages.push(message)
  },
  addToteacherphones(state, teacherphone) {
    if (!state.teacherphones.includes(teacherphone)) {
      state.teacherphones.push(teacherphone)
    }
  },
  studentdrawNewLine(state, obj) {
    let newLine = obj.line
    let teacherphone = obj.teacherphone
    let id = obj.id
    console.log(id - 1);
    newLine.points[0] *= state.getXb
    newLine.points[1] *= state.getYb
    newLine.points[2] *= state.getXb
    newLine.points[3] *= state.getYb
    state.teacherLines[id - 1].push(newLine)
  },
 
  studentupdateNewLine(state, obj) {
    let lastLine = obj.line
    let teacherphone = obj.teacherphone
    if(teacherphone === "20210101"){
      const line = state.teacherLines[0][state.teacherLines[0].length - 1]
      var x = lastLine.points[lastLine.points.length-2]
      var y = lastLine.points[lastLine.points.length-1]
      x = x * state.getXb
      y = y * state.getYb
      line.points = line.points.concat([x,y])
    }else if(teacherphone === "20210102"){
      console.log(11);
      const line = state.teacherLines[1][state.teacherLines[1].length - 1]
      var x = lastLine.points[lastLine.points.length-2]
      var y = lastLine.points[lastLine.points.length-1]
      x = x * state.getXb
      y = y * state.getYb
      line.points = line.points.concat([x,y])
    }
  },
  teacherNewLine(state, newLine) {
    console.log(newLine);
    const id = newLine.id
    const newline = newLine.line
    newline.points[0] *= state.getXb
    newline.points[1] *= state.getYb
    // console.log(newline);
    // state.lines.push(newline)
    // console.log(id - 1);
    state.teacherLines[id - 1].push(newline)
  },
  teacherNewLine2(state, newLine) {
      newLine.points[0] *= state.getXb
      newLine.points[1] *= state.getYb
      state.lines.push(newLine)
  },
  teacherupdateLine2(state, obj) {
    
    const id = obj.id - 1
    console.log(id);
    const lastLine = obj.line
      const line = state.teacherLines[id][state.teacherLines[id].length - 1]
      var x = lastLine.points[lastLine.points.length-2]
      var y = lastLine.points[lastLine.points.length-1]
      x = x * state.getXb
      y = y * state.getYb
      line.points = line.points.concat([x,y])
  },
  teaupdateLine(state, obj) {
    
    let lastLine = obj.line
    let teacherphone = obj.teacherphone
    let id = obj.id
    // console.log(obj);
    // console.log(teacherphone);
    let x = lastLine.points[lastLine.points.length-2]
    let y = lastLine.points[lastLine.points.length-1]
    x = x * state.getXb
    y = y * state.getYb
    const line = state.teacherLines[id - 1][state.teacherLines[id - 1].length - 1]
    line.points = line.points.concat([x,y])

  },
  drawNewLine(state, newLine) {
    newLine.points[0] *= state.getXb
    newLine.points[1] *= state.getYb
    newLine.points[2] *= state.getXb
    newLine.points[3] *= state.getYb
    // console.log(newLine);
    state.lines.push(newLine)
  },
  teacherdrawNewLine(state, qq) {
    const newLine = qq.newLine
    const temp = qq.a.slice(5,qq.a.length) - 1
    newLine.points[0] *= state.getXb
    newLine.points[1] *= state.getYb
    console.log(1);
    state.teacherLines2[temp].push(newLine)
  },
  teacherdrawNewLine2(state, newLine) {
    newLine.points[0] *= state.getXb
    newLine.points[1] *= state.getYb
    state.lines2.push(newLine)
    state.teacherLines[1].push(newLine)
  },
  teacherupdateNewLine1(state, obj) {
    // console.log(obj);
    const lastLine =  obj.lastLine
    let temp = obj.a.slice(5,obj.a.length) - 1
    lastLine.points[lastLine.points.length-2] *= state.getXb
    lastLine.points[lastLine.points.length-1] *= state.getYb

    const line2 = state.teacherLines2[temp][state.teacherLines2[temp].length - 1]
    line2.points = lastLine.points 
        // console.log(state.teacherLines[1][state.teacherLines[1].length - 1].points);
  },
  teacherupdateNewLine2(state, lastLine) {
    const line = state.lines2[state.lines2.length - 1]
    lastLine.points[lastLine.points.length-2] *= state.getXb
    lastLine.points[lastLine.points.length-1] *= state.getYb
    var y = lastLine.points[lastLine.points.length-1]
    line.points = lastLine.points
    const line2 = state.teacherLines[1][state.teacherLines[1].length - 1]
    // console.log(state.lines2);
    line2.points = lastLine.points
    // const line2 = state.teacherLines['lines2'][state.teacherLines['lines2'].length - 1]
    // line2.points = lastLine.points
    // console.log(state.teacherLines['lines2']);
  },
  updateNewLine1(state, lastLine) {
    const line = state.lines[state.lines.length - 1]
    lastLine.points[lastLine.points.length-2] *= state.getXb
    lastLine.points[lastLine.points.length-1] *= state.getYb
    var y = lastLine.points[lastLine.points.length-1]
    line.points = lastLine.points
  },
  teacherupdateNewLine(state, lastLine) {
    
    const line = state.lines1[state.lines1.length - 1]
    var x = lastLine.points[lastLine.points.length-2]
    var y = lastLine.points[lastLine.points.length-1]
    x = x * state.getXb
    y = y * state.getYb
    line.points = line.points.concat([x,y]) 
  },
  updateNewLine(state, lastLine) {
    
    const line = state.lines[state.lines.length - 1]
    var x = lastLine.points[lastLine.points.length-2]
    var y = lastLine.points[lastLine.points.length-1]
     x = x * state.getXb
     y = y * state.getYb
    line.points = line.points.concat([x,y]) 
   },


  delFromteacherphones(state, teacherphone) {
    state.teacherphones = state.teacherphones.filter(item => item !== teacherphone)
  }
}

const actions = {
  // 测试
  sendMessage(context, message) {
    return new Promise((resolve, reject) => {
      socket.emit('sendMessage', message, res => {
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
  sendDrawNewLine(context, newLine) {
    const obj = {
      line:newLine.newLine,
      teacherphone:localStorage.getItem('teacherphone'),
      id: newLine.id
    }
    // alert(1)
    // console.log(newLine.id);
    // console.log(obj);
    socket.emit('stunew_line', obj)
  },
  // 画新线
  teachersendDrawNewLine(context, newLine) {
    const obj = {
      line:newLine.newLine,
      teacherphone:localStorage.getItem('teacherphone'),
      id:newLine.id
    }
    // console.log(newLine.id);
    socket.emit('teacherNew_line', obj)
  },
  teachersendDrawNewLine2(context, newLine) {
    const obj = {
      line:newLine,
      teacherphone:localStorage.getItem('teacherphone')
    }
    socket.emit('new_line2', obj)
  },
  // 更新线条
  teachersendUpdateNewLine(context, lastLine) {
    const obj = {
      line:lastLine.lastLine,
      teacherphone:localStorage.getItem('teacherphone'),
      id:lastLine.id
    }
    socket.emit('update_line', obj)
  },
  // 更新线条
  teachersendUpdateNewLine2(context, lastLine) {
    const obj = {
      line:lastLine,
      teacherphone:localStorage.getItem('teacherphone')
    }
    socket.emit('update_line2', obj)
  },
  // 更新线条
  sendUpdateNewLine(context, lastLine) {
    const obj = {
      line:lastLine,
      teacherphone:localStorage.getItem('teacherphone')
    }
    socket.emit('update_line', obj)
  },

  // 更新线条
  stuUpdateNewLine(context, lastLine) {
    const obj = {
      line:lastLine.lastLine,
      teacherphone:localStorage.getItem('teacherphone'),
      id:lastLine.id
    }
    // console.log(obj);
    socket.emit('stuupdate_line', obj)
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
