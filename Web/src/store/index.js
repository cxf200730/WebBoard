import Vue from 'vue'
import Vuex from 'vuex'
import socket from '@/socket'

Vue.use(Vuex)

const state = {
  connected: false, // 连接状态
  teacherphone: '', // 当前用户昵称
  teacherphones: [], // 房间用户昵称列表
  holder: '', // 游戏主持人
  lines: [] ,// 房间的绘图信息 (画了多少根线)
  messages:[],
}

const mutations = {
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
  drawNewLine(state, newLine) {
    state.lines.push(newLine)
  },
  updateNewLine(state, lastLine) {
    const line = state.lines[state.lines.length - 1]
    line.points = lastLine.points
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
    const teacherphone = localStorage.getItem('teacherphone')
    socket.emit('enter', teacherphone)
    context.commit('updateteacherphone', teacherphone)
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
    socket.emit('new_line', newLine)
  },
  // 更新线条
  sendUpdateNewLine(context, lastLine) {
    socket.emit('update_line', lastLine)
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
