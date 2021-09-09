import io from 'socket.io-client'
import store from '@/store'
import { MessageBox, Notification } from 'element-ui'

const socket = io()

socket.on('connect', () => {
  console.log('>>>>>>> 和服务器已建立连接')
})

// 自己进入房间, 监听room_info事件, 获取房间信息
socket.on('room_info', ({ teacherphones, holder, lines }) => {
  store.commit('updateteacherphones', teacherphones)
  store.commit('updateHolder', holder)
  // store.commit('updateLines', lines)
  store.commit('updateLines', [])
})
   
// 别人进入房间, 监听user_enter事件, 获取进入房间的用户信息
socket.on('user_enter', teacherphone => {
  store.commit('addToteacherphones', teacherphone)
})
socket.on('user_send', message => {
  store.commit('addTomessages', message)
})
// 处理服务连接
socket.on('connect', () => {
  store.commit('updateConnected', true)
})

// 处理服务失去连接
socket.on('disconnect', () => {
  store.commit('updateConnected', false)
})

// 处理游戏开始
socket.on('game_started', holder => {
  store.commit('updateHolder', holder)
  Notification.success(`${holder} 老师开始了课堂，大家可以开始踊跃回答问题啦！`)
})

// 处理游戏已经开始, 不能重复开始
socket.on('already_started', holder => {
  store.commit('updateHolder', holder)
  MessageBox.alert('当前已有课堂在进行中，老师是：' + holder)
})

// 处理终止游戏
socket.on('game_stoped', () => {
  // 1. 清理相关数据
  store.commit('updateHolder', '')
  store.commit('updateLines', [])

  // 2. 弹出提示消息
  Notification.warning('老师下课了')
})

// 监听新线的绘制
socket.on('teastarting_line', newLine => {
  store.commit('studentdrawNewLine', newLine)
})
// 监听新线的绘制
socket.on('studentstarting_line', newLine => {
  store.commit('teacherNewLine', newLine)
})
// 监听新线的绘制
socket.on('studentstarting_line2', newLine => {
  store.commit('teacherNewLine2', newLine.line)
})
// 监听线的更新
socket.on('updating_line', lastLine => {
  store.commit('studentupdateNewLine', lastLine)
})
// 监听线的更新
socket.on('studentupdating_line', lastLine => {
  // console.log(lastLine.line);
  store.commit('teacherupdateLine', lastLine)
})
socket.on('stuupdating_line', lastLine => {
  // console.log(lastLine.line);
  store.commit('teaupdateLine', lastLine)
})
// 监听线的更新
socket.on('studentupdating_line2', lastLine => {
  // console.log(lastLine.line);
  store.commit('teacherupdateLine2', lastLine)
})
socket.on('teachangeTopic', obj => {
  // console.log(lastLine.line);
  store.commit('teachangeTopic', obj)
})

socket.on('game_answered', ({ alreadyDone, success, teacherphone, answer }) => {
  if (alreadyDone) {
    MessageBox.alert('当前问题已经被回答，您不能继续回答了！')
    return
  }
  if (!success) {
    Notification.error(`玩家 ${teacherphone} 回答的的答案不对：${answer}`)
    return
  }

  MessageBox.alert(`玩家 ${teacherphone} 回答了正确的答案：${answer}`, {
    title: '恭喜',
    type: 'success'
  })
})

socket.on('user_leave', teacherphone => {
  store.commit('delFromteacherphones', teacherphone)

  if (teacherphone === store.state.holder) {
    store.commit('updateHolder', '')
    store.commit('updateLines', [])
    Notification.error('老师离开了教室!')
  }
})

export default socket
