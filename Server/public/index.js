const appKey = '113885b9462596ea26d2c9637c543dd1' // 您可以在应用下AppKey管理中获取
const appSecret = '52e49d4ae441'
const nickname = 'test'
const uid = 123123          //正整数, 应该小于Number.MAX_SAFE_INTEGER，同一uid多处登陆会被互踢

/**
 * 该函数用于返回互动白板应用需要的auth信息。
 * 在需要时，互动白板sdk会调用该函数，该函数通过promise将auth交给sdk
 *
 * 下面代码仅为demo，在实际开发时，请不要将appSecret保存在客户端，这可能会导致appSecret被窃取。实际开发时，可以使用getAuthInfo向服务器请求Auth消息，最后在promise中将auth信息返回给sdk。
 */
function getAuthInfo() {
    const Nonce = 'xxxx'   //任意长度小于128位的随机字符串
    const curTime = Math.round((Date.now() / 1000)) //当前UTC时间戳，从1970年1月1日0点0分0秒开始到现在的秒数
    const checksum = sha1(appSecret + Nonce + curTime)
    return Promise.resolve({
        nonce: Nonce,
        checksum: checksum,
        curTime: curTime
    })
}

const sdk = WhiteBoardSDK.getInstance({
    appKey: appKey,
    nickname: nickname,     //非必须
    uid: uid,
    container: document.getElementById('whiteboard'),
    platform: 'web',
    record: true,   //是否开启录制
    getAuthInfo: getAuthInfo
})

// channel任意字符串。不同端需要进入相同的channel才能够互通
const channel = '821937123'
sdk.joinRoom({
  channel: channel,
  createRoom: true
})
.then((drawPlugin) => {
    // 允许编辑
    drawPlugin.enableDraw(true)
    // 设置画笔颜色
    drawPlugin.setColor('rgb(243,0,0)')

    // 初始化工具栏
    const toolCollection = ToolCollection.getInstance({
        /**
        * 工具栏容器。应该和白板容器一致
        */
        container: document.getElementById('whiteboard'),
        handler: drawPlugin,
        options: {
            platform: 'web'
        }
    })

    // 显示工具栏
    toolCollection.show()
})
