<template>
<div>
  <div class="message">
    <span id="hehe"></span>
    <p  id="content"></p>
    <span id="d"></span>
    <ul id="BLEDevices"></ul>
    </div>
  <input type="button" value="打开USB设备"  @click="openUSB"/>
    <input type="button" value="切换模式" @click="changeMode"/>
  <el-card ref="wrapper" :body-style="{ padding: 0 }" id="card">
    
    <v-stage
    id="stage"
      :config="stageConfig"
      @mousedown="mousedownHandler"
      @mouseup="mouseupHandler"
      @mousemove="mousemoveHandler"
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
    </v-stage>
<canvas  v-show="false" id="myCanvas" class="board" width="1228" height="960" style="border:1px solid black;">
   
</canvas><br/>
  </el-card>

  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
export default {
  created(){
    
  },
  mounted(){
    // this.stageConfig.width = this.$refs.wrapper.$el.offsetWidth
    const that = this
    window.addEventListener('touchmove', function(){}, { passive: false })
   
      
        this.canvas = document.getElementById('myCanvas')
        this.context = this.canvas.getContext('2d')
        // this.context.translate(this.offsetX, this.offsetY);

        /*建立插件通信、添加响应函数*/
            that.port = chrome.runtime.connect(that.editorExtensionId);
            that.port.onMessage.addListener( function(msg){
                that.recMessage(msg)
            })

            that.initCanvas(that.pid)

    },
  data() {
    return {
        // 画布配置
        stageConfig: {
            width: 1228,
            height: 700
        },
        // 绘画状态
        painting: false,
        stroke: '#000000',
        strokeWidth: 1,
        vid:1155,
        // pid:24672, //T8Y
        pid:24671,//J7M
        pageY : 8170, // 设备像素Y轴最大值
        pageX : 14335, // 设备像素X轴最大值
        port:"",           // 通信对象
        editorExtensionId:'djkkhcnlplpchfbdgkdggcmlclggefbg',  // 通信ID

        width : 1228,
        height : 700,
        offsetX : 0.5,
        offsetY : 0.5,
        ratioX : 1, 
        ratioY : 1,
        x1:2, y1:2, x2:2, y2:2, res : 2,
        canvas : "",
        context : "",
        isStart : 0,
    }
  },
  computed: {
    ...mapState(['lines']),
    ...mapGetters(['isGameStarted', 'isGameHolder'])
  },

 
  methods: {
    // 鼠标按下
    mousedownHandler(e) {
      if (!this.isGameHolder || !this.isGameHolder) return

      this.painting = true
      // 创建一个新线条
      const newLine = {
        stroke: this.stroke,
        strokeWidth: this.strokeWidth,
        points: [e.evt.layerX, e.evt.layerY]
      }
      // 本地画线, 存到vuex中
      this.$store.commit('drawNewLine', newLine)
      // 请求服务器
      this.$store.dispatch('sendDrawNewLine', newLine)
      
    },

    // 鼠标拖动
    mousemoveHandler(e) {
      if (!this.painting) return
      const lastLine = this.lines[this.lines.length - 1]
      lastLine.points = lastLine.points.concat([e.evt.layerX, e.evt.layerY])
      console.log(lastLine)
      this.$store.commit('updateNewLine', lastLine)
      // 请求服务器
      this.$store.dispatch('sendUpdateNewLine', lastLine)
    },

    // 鼠标释放
    mouseupHandler() {
      this.painting = false
    },
    // 笔按下
    touchstartHandler(e) {
       
      if (!this.isGameHolder || !this.isGameHolder) return
   
      this.painting = true
      // 创建一个新线条
      const newLine = {
        stroke: this.stroke,
        strokeWidth: this.strokeWidth,
        points: [e.evt.changedTouches[0].clientX-$('#card').offset().left, e.evt.changedTouches[0].clientY-$('#card').offset().top+ $(document).scrollTop()]
      }
      // 本地画线, 存到vuex中
      this.$store.commit('drawNewLine', newLine)
      // 请求服务器
      this.$store.dispatch('sendDrawNewLine', newLine)
     },
  
    // 笔拖动
    touchmoveHandler(e) {
      // e = window.event || e;
      // console.log(e.screenX + " " + e.screenY);
    
      if (!this.painting) return
      const lastLine = this.lines[this.lines.length - 1]
    //   console.log($('#card').offset());

      lastLine.points = lastLine.points.concat([e.evt.changedTouches[0].clientX-$('#card').offset().left, e.evt.changedTouches[0].clientY-$('#card').offset().top + $(document).scrollTop()])
      console.log(lastLine)
      this.$store.commit('updateNewLine', lastLine)
      // 请求服务器
      this.$store.dispatch('sendUpdateNewLine', lastLine)
    },

    // 笔释放
    touchendHandler() {
      this.painting = false
    },
    initCanvas(pid) {
            const that = this
            if (pid == 24672 || pid == 24682) {
                // T8Y ｜｜ T8C
                this.pageY = 21000
                this.pageX = 29700
            }
            // this.height = $(window).height() > this.height ? this.height : $(window).height() - 20;
            // this.width = parseInt(this.height * this.pageX / this.pageY);
            // if(this.width > $(window).width() * 0.68){
            //     this.width = parseInt($(window).width() * 0.68);
            //     this.height = parseInt(this.width * this.pageY / this.pageX);
            // }
            
            this.ratioX = this.width / this.pageX;
            this.ratioY = this.height / this.pageY;
            $(that.canvas).attr("width", that.width);
            $(that.canvas).attr("height", that.height);
            this.penInit()
        },
        recMessage(msg) {
            switch (msg.status) {
                case 0:
                    $('#hehe').html('设备连接成功');
                    break;
                case 1:
                    this.lineTo(msg.x, msg.y, msg.s, msg.p);
                    break;
                case 2:
                    $('#hehe').html('usb操作权限获取失败');
                    break;
                case 3:
                    $('#hehe').html('指定的usb设备未找到');
                    break;
                case 4:
                    $('#hehe').html('usb设备连接失败及打开设备失败');
                    break;
                case 5: 
                    $('#hehe').html('存在打开的设备');
                    break;
                case 6:
                    if (msg.mode == 'mouse') {
                        $('#hehe').html('当前模式为鼠标模式');
                    }else if (msg.mode == 'pen') {
                        $('#hehe').html('当前模式为笔模式');
                    }
                    break;
                case 20:
                    $('#hehe').html(msg.dongle_status);
                    break;
                case 21:
                    $('#BLEDevices').append("<li>"+msg.device_name+"<button  onclick='connectBLE("+msg.num+")'>连接</button></li>");
                    break;
                        case 32:
                            window.alert('左键单击')
                            break;
                        case 33:
                            window.alert('左键双击')
                            break;
                        case 34:
                            window.alert('左键长按')
                            break;
                        case 35:
                            window.alert('右键单击')
                            break;
                        case 36:
                            window.alert('右键双击')
                            break;
                        case 37:
                            window.alert('右键长按')
                            break;
                case 100:
                    let c = document.getElementById('myCanvas');
                    c.height = c.height;
                    break;
            }
        },
        penInit(){
            this.closeUSB()
        },
        //打开USB设备
        openUSB(){
            let VID = this.vid;
            let PID = this.pid;
            this.port.postMessage({cmd:'openUSB',pid: PID,vid: VID});
            this.changeMode()
        },
        //关闭USB设备
        closeUSB(){
            this.port.postMessage({cmd:'closeUSB'});
            
        },
        //获取dongle状态
        getDongleStatus() {
            console.log(123);
            this.port.postMessage({cmd:'dongleStatus'});
        },
        //扫描蓝牙
        scanBLE(){
            this.port.postMessage({cmd:'scanBLE'});
        },
        //连接蓝牙设备
        connectBLE(num) {
            this.port.postMessage({cmd:'connectBLE',num: num});
        },
        //断开蓝牙
        disconnectBLE() {
            this.port.postMessage({cmd:'closeBLE'});
        },
        // 切换笔模式
        changeMode() {
            this.port.postMessage({cmd:'changeMode'});
        },
        // clear canvas
        clearCanvas(){
            let c = document.getElementById('myCanvas');
            c.height = c.height;
            this.port.postMessage({cmd:'clearCanvas'});
        },

        lineTo(x, y, s, p){
            const that = this
            let tx = this.ratioX * x;
            let ty = this.ratioY * y;
            let tw = 1.1;
            let con = 'x='+x+',y='+y+',s='+s+',p='+p;
            $('#content').text(con);
            if (s == 16 || s == 0) {
                this.isStart = 0;
                that.painting = false
                return;
            }
            if(this.isStart > 0){
                
                this.x2 = Math.floor(this.ratioX * x);
                this.y2 = Math.floor(this.ratioY * y);
                let d = Math.sqrt(Math.pow(this.x1 - this.x2, 2) + Math.pow(this.y1 - this.y2, 2));
                if(d > this.res){
                    tx = Math.round((this.x1 + this.x2) / 2 * 100) / 100;
                    ty = Math.round((this.y1 + this.y2) / 2 * 100) / 100;
                    if (this.isStart == 1) {
                       
                    } else {
                        this.context.quadraticCurveTo(this.x1, this.y1, tx, ty);
                        this.context.lineWidth = tw;
                        this.context.stroke();
                        this.context.beginPath();
                        this.context.moveTo(tx,ty);
                        const lastLine = that.lines[that.lines.length - 1]
                            lastLine.points = lastLine.points.concat([this.x1, this.y1])
                            console.log(lastLine)
                            that.$store.commit('updateNewLine', lastLine)
                            // 请求服务器
                            that.$store.dispatch('sendUpdateNewLine', lastLine)
                        
                        // console.log(tx + " " + ty);
                        
                            
                        
                            
                    }
                    this.x1 = this.x2;
                    this.y1 = this.y2;
                }
                this.isStart++;
                that.painting = true
            }else{
                /* 初始化画点*/
                this.isStart = 1;
                this.context.beginPath();
                this.context.lineCap = "round";
                this.context.strokeStyle = "#000";//新增
                this.x1 = tx;
                this.y1 = ty;
                this.context.moveTo(tx, ty);//起点
                this.isStart++;
                that.painting = true
                // 创建一个新线条
                const newLine = {
                    stroke: this.stroke,
                    strokeWidth: this.strokeWidth,
                    points: [this.x1, this.y1]
                }
                // 本地画线, 存到vuex中
                that.$store.commit('drawNewLine', newLine)
                // 请求服务器
                that.$store.dispatch('sendDrawNewLine', newLine)
                this.context.lineTo(tx, ty);
            }
        }

    
  }
}
</script>
<style lang="less" scoped>
.el-card{
     touch-action: none;
     width: 1228px;
     overflow: auto;
}
</style>
