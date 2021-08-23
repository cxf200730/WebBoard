const io = require('socket.io')

module.exports = httpServer => {

    const server = io(httpServer)
    const user2socket = {}
    const socket2user = {}
	const message = ""
    let currentGame = null

 server.on("text", function (str) {
        //将收到的信息提取key
        var key=str.split(":");
        //数据传输标准：key:信息
        //通过:分隔从而得到key
        switch(key[0]){
            case 'login':
                console.log("登录信息");
                break;
            default:
                console.log("the key not match");
                break;
        }
        socket.emit(str.toUpperCase()+"!!!")
    })

    server.on('connection', socket => {


        // 测试
        // ------------------------------------------------------------
        socket.on('sendMessage', (message,callback) => {
			const teacherphone = message.teacherphone
            const msg = message.msg
            const send = teacherphone + "：" + msg
            console.log(send);
            // 发送消息给其他用户
            if(teacherphone === "20210101"){
                server.sockets.in('20210101').emit('user_send', send)
            }else if(teacherphone === "20210102"){
                server.sockets.in('20210102').emit('user_send', send)
            }else if(teacherphone === "1"){
                server.sockets.in('20210101').emit('user_send', send)
                socket.broadcast.to('20210102').emit('user_send', send)
            }
            // socket.broadcast.emit('user_send', message)
            callback( message)
        })
       
        // 【事件】用户进入教室
        // ------------------------------------------------------------
        socket.on('enter', (obj) => {
            const sid = socket.id
            let teacherphone = obj.teacherphone
            const type = obj.type
            // console.log(teacherphone + " " + type);
            // 添加用户信息
            user2socket[teacherphone] = sid
            socket2user[sid] = teacherphone
            
            if(teacherphone === "20210101"){
                socket.join('20210101')
                // server.sockets.in('20210101').emit('user_send', teacherphone)
            }else if(teacherphone === "20210102"){
                socket.join('20210102')
                // server.sockets.in('20210102').emit('user_send', teacherphone)
            }else if(teacherphone === "1"){
                socket.join('20210101')
                socket.join('20210102')
                // server.sockets.in('20210101').emit('user_send', teacherphone)
                // socket.broadcast.to('20210102').emit('user_send', teacherphone)
            }

            // 发送用户列表给当前用户
            socket.emit('room_info', {
                teacherphones: Object.keys(user2socket),
                holder: currentGame && currentGame.holder,
                lines: currentGame && currentGame.lines || []
            })
            // socket.broadcast.to('20210101').emit('user_send', teacherphone)
            // server.sockets.in('20210101').emit('user_send', teacherphone)
            // 发送新进用户给其他用户
            socket.broadcast.to('20210101').emit('user_enter', teacherphone)
        })

        // 【事件】用户离开游戏
        // ------------------------------------------------------------
        socket.on('leave', () => {
            const sid = socket.id
            const teacherphone = socket2user[sid]

            // 移除用户信息
            delete user2socket[teacherphone]
            delete socket2user[sid]

            // 如果当前离开的是游戏主持人
            if (currentGame && currentGame.holder === teacherphone) {
                currentGame = null
            }

            // 发送离开用户给其他用户
            socket.broadcast.emit('user_leave', teacherphone)
        })

        // 【事件】申请开始游戏
        // ------------------------------------------------------------
        socket.on('start_game', (finalAnswer) => {
            if (currentGame) {
                // 游戏已经处于开始状态了
                socket.emit('already_started', currentGame.holder)
                return
            }

            // 游戏可以开始：设置当前游戏信息
            currentGame = {
                success: false,
                holder: socket2user[socket.id],
                finalAnswer,
                lines: []
            }

            server.of('/').emit('game_started', currentGame.holder)
        })

        // 【事件】申请终止游戏
        // ------------------------------------------------------------
        socket.on('stop_game', () => {
            const teacherphone = socket2user[socket.id]

            if (currentGame && teacherphone === currentGame.holder) {
                currentGame = null
                server.of('/').emit('game_stoped')
            }
        })

        // 【事件】用户回答答案
        // ------------------------------------------------------------
        socket.on('answer_game', (answer) => {
            if (!currentGame) return

            if (currentGame.success) {
                socket.emit('game_answered', {
                    alreadyDone: true
                })
            } else {
                const success = currentGame.finalAnswer === answer

                if (success) {
                    currentGame.success = true
                }

                server.of('/').emit('game_answered', {
                    alreadyDone: false,
                    success,
                    teacherphone: socket2user[socket.id],
                    answer
                })
            }
        })

        // 【事件】用户绘图
        // ------------------------------------------------------------
        socket.on('new_line', (obj) => {
            let line = obj.line
            let teacherphone = obj.teacherphone
                if(teacherphone === "20210101"){
                    socket.broadcast.to('20210101').emit('starting_line', obj)
                }else if(teacherphone === "20210102"){
                    socket.broadcast.to('20210102').emit('starting_line', obj)
                }else if(teacherphone === "1"){
                    socket.broadcast.to('20210101').emit('studentstarting_line', obj)
                    // socket.broadcast.to('20210102').emit('studentstarting_line', obj)
                }

                // socket.broadcast.emit('starting_line', line)
            // }
        })
        socket.on('new_line2', (obj) => {
            let line = obj.line
            let teacherphone = obj.teacherphone
                if(teacherphone === "20210101"){
                    socket.broadcast.to('20210101').emit('starting_line', obj)
                }else if(teacherphone === "20210102"){
                    socket.broadcast.to('20210102').emit('starting_line', obj)
                }else if(teacherphone === "1"){
                    // console.log(1);
                    // console.log(obj);
                    // socket.broadcast.to('20210102').emit('user_send', "123")
                    // socket.broadcast.to('20210101').emit('studentstarting_line', obj)
                    socket.broadcast.to('20210102').emit('studentstarting_line2', obj)
                }

                // socket.broadcast.emit('starting_line', line)
            // }
        })
        socket.on('update_line', (obj) => {
            let line = obj.line
            let teacherphone = obj.teacherphone
            // if (currentGame&& currentGame.lines) {
                // currentGame.lines[currentGame.lines.length - 1] = line

                if(teacherphone === "20210101"){
                    socket.broadcast.to('20210101').emit('updating_line', obj)
                }else if(teacherphone === "20210102"){
                    socket.broadcast.to('20210102').emit('updating_line', obj)
                }else if(teacherphone === "1"){
                    socket.broadcast.to('20210101').emit('studentupdating_line2', obj)
                    // socket.broadcast.to('20210102').emit('studentupdating_line', obj)
                }
                // socket.broadcast.emit('updating_line', line)
            // }
        })
        socket.on('update_line2', (obj) => {
            let line = obj.line
            let teacherphone = obj.teacherphone
            // if (currentGame&& currentGame.lines) {
                // currentGame.lines[currentGame.lines.length - 1] = line

                if(teacherphone === "20210101"){
                    socket.broadcast.to('20210101').emit('updating_line', obj)
                }else if(teacherphone === "20210102"){
                    socket.broadcast.to('20210102').emit('updating_line', obj)
                }else if(teacherphone === "1"){
                    // socket.broadcast.to('20210101').emit('studentupdating_line', obj)
                    socket.broadcast.to('20210102').emit('studentupdating_line', obj)
                }
                // socket.broadcast.emit('updating_line', line)
            // }
        })
        // 【事件】客户端断开连接
        // ------------------------------------------------------------
        socket.on('disconnect', () => {
            const sid = socket.id
            const teacherphone = socket2user[sid]

            delete user2socket[teacherphone]
            delete socket2user[sid]

            // 如果当前离开的是游戏主持人
            if (currentGame && teacherphone === currentGame.holder) {
                currentGame = null
            }

            // 发送离开的用户信息给其他用户
            socket.broadcast.emit('user_leave', teacherphone)
        })

        // ------------------------------------------------------------
    })

}