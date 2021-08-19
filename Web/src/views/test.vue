<template>
    <div>
<div class="message">
    <span id="hehe"></span>
    <p  id="content"></p>
    <span id="d"></span>
    <ul id="BLEDevices"></ul>
</div>


<div>

</div>

<canvas id="myCanvas" class="board" width="100%" height="960" style="border:1px solid black;"></canvas><br/>
<div class="btn_list">
    <input type="button" value="打开USB设备"  @click="openUSB"/>
    <input type="button" value="关闭USB设备" @click="closeUSB"/>
    <input type="button" value="clear canvas" @click="clearCanvas"/>
    <input type="button" value="切换模式" @click="changeMode"/>
</div>
<div class="btn_list" style="margin-top: 10px">
    <input type="button" value="获取Dongle状态"  @click="getDongleStatus"/>
    <input type="button" value="搜索蓝牙设备" @click="scanBLE"/>
    <input type="button" value="断开蓝牙设备" @click="disconnectBLE"/>
    <br/>

</div>

    </div>
</template>

<script >

export default {
    mounted(){
        const that = this
        this.canvas = document.getElementById('myCanvas')
        this.context = this.canvas.getContext('2d')
        this.context.translate(this.offsetX, this.offsetY);

        /*建立插件通信、添加响应函数*/
            that.port = chrome.runtime.connect(that.editorExtensionId);
            that.port.onMessage.addListener( function(msg){
                that.recMessage(msg)
            })

            that.initCanvas(that.pid)

    },
    data(){
        return{
            vid:1155,
            pid:24672,
            pageY : 8191, // 设备像素Y轴最大值
            pageX : 14335, // 设备像素X轴最大值
            port:"",           // 通信对象
            editorExtensionId:'djkkhcnlplpchfbdgkdggcmlclggefbg',  // 通信ID

            width : 640,
            height : 960,
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
    methods:{
        initCanvas(pid) {
            const that = this
            if (pid == 24672 || pid == 24682) {
                // T8Y ｜｜ T8C
                this.pageY = 21000
                this.pageX = 29700
            }
            this.height = $(window).height() > this.height ? this.height : $(window).height() - 20;
            this.width = parseInt(this.height * this.pageX / this.pageY);
            if(this.width > $(window).width() * 0.68){
                this.width = parseInt($(window).width() * 0.68);
                this.height = parseInt(this.width * this.pageY / this.pageX);
            }
            
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
            let tx = this.ratioX * x;
            let ty = this.ratioY * y;
            let tw = 1.2;
            let con = 'x='+x+',y='+y+',s='+s+',p='+p;
            $('#content').text(con);
            if (s == 16 || s == 0) {
                this.isStart = 0;
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
                        this.context.lineTo(tx, ty);
                    } else {
                        this.context.quadraticCurveTo(this.x1, this.y1, tx, ty);
                        this.context.lineWidth = tw;
                        this.context.stroke();
                        this.context.beginPath();
                        this.context.moveTo(tx,ty);
                    }
                    this.x1 = this.x2;
                    this.y1 = this.y2;
                }
                this.isStart++;
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
            }
        }

    }
}
</script>
<style scoped>
body {
            padding:0;margin:0; font-size:12px; line-height:20px;
        }
        ul{
            margin: 0;
            padding: 0;
        }
        .board {
            box-shadow: 0px 0px 10px #333;
            -webkit-box-shadow: 0px 0px 10px #333;
            border-radius: 3px;
            color: white;
            background-color: #fffbcf;
        }
        
        
        #myCanvas{
            display: block;
            margin: 0 auto;
        }
        .btn_list{
            text-align: center;
        }
        .btn_list input{
            background: #fff;
            border-radius: 3px;
            border: 1px solid #e5e5e5;
            color: #333;
            padding: 10px 15px;
        }
        .message{
            position: fixed;
            left: 20px;
            top: 50px;
            background: #e5e5e5;
        }
        #chrome_app{
            display: inline-block;
            background: #3574ce;
            color: #fff;
            padding: 6px 20px;
            border-radius: 5px;
            margin: 10px;
        }
</style>
