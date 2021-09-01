<template>
<el-container>
    <el-header>
        
    </el-header>
    <el-main>
            <div class="my-3 p-3 bg-white rounded box-shadow small">

      <h6 class="border-bottom border-gray pb-2 mb-0 pureAudioContent">推拉纯音频流</h6>

      <div class="row" style="margin-top:1%">
      </div>

      <div class="row"> 
        <div class="col-sm">
          <button type="button" id="createRoom" class="btn btn-primary btn-sm enterRoomPush" @click="enterRoom">进入房间（推流）</button>
          <button type="button" id="openRoom" class="btn btn-primary btn-sm enterRoomPlay">进入房间（不推流）</button>
          <button type="button" id="leaveRoom" class="btn btn-secondary btn-sm leaveRoom">退出</button>
        </div>
      </div>
      
      <div id="view"></div>
      
      <div class="row videoRow">
        <div class="col-sm" >
          <label id="previewLabel"></label>
          <audio id="previewVideo" autoplay muted playsinline ></audio>
          <el-tag>老师 </el-tag>
          <input type="button" id="btn1" value="打开麦克风" @click="openSay"/>
          <input type="button" id="btn2" value="关闭麦克风" @click="closeSay"/>
          <input type="button" id="btn3"  value="打开听筒" @click="openListen" />
          <input type="button" id="btn4" value="关闭听筒" @click="closeListen" />
        </div>
        <div class="col-sm remoteVideo">
          <!--<video  autoplay muted playsinline></video>-->
        </div>
      </div>
      <div id="view2" style="margin-top: 20px;"></div>
    </div>
         
    </el-main>
</el-container>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import { checkAnRun, enterRoom, publish, zg, useLocalStreamList, logout } from './common';

export default {
     created() {
    this.$store.dispatch('sendUserEnter')
    
    $(async () => {
    await checkAnRun();
    zg.off('roomStreamUpdate');
    zg.on('roomStreamUpdate', async (roomID, updateType, streamList, extendedData) => {
        // console.log('roomStreamUpdate roomID ', roomID, streamList, extendedData);
        if (updateType == 'ADD') {
            for (let i = 0; i < streamList.length; i++) {
                // console.info(streamList[i].streamID + ' was added');
                let remoteStream;

                try {
                    remoteStream = await zg.startPlayingStream(streamList[i].streamID, {
                        video: false,
                    });
                    useLocalStreamList.push(streamList[i]);

                    $('.remoteVideo').append($(`<audio id=${streamList[i].streamID} autoplay muted playsinline ></audio>`));
                    const audio = $('.remoteVideo audio:last')[0];
                    // console.warn('audio', audio, remoteStream);
                    audio.srcObject = remoteStream;
                    audio.muted = false;
                    var MyDiv =document.getElementById("view2");
                    // alert(MyDiv);
                    let name = ["学生","打开麦克风","关闭麦克风","打开听筒","关闭听筒"]
                    for (let i = 0; i < 5; i++) {
                        var button = document.createElement("input");
                        button.setAttribute("type", "button");
                        button.setAttribute("value", name[i] );
                        button.setAttribute("id", "btn" + i);
                        button.style.width = "120px";
                        // button.setAttribute("onclick", "function(this.id)");
                        MyDiv.appendChild(button);
                    }
                } catch (error) {
                    // console.error(error);
                    continue;
                }

            }
        } else if (updateType == 'DELETE') {
            for (let k = 0; k < useLocalStreamList.length; k++) {
                for (let j = 0; j < streamList.length; j++) {
                    if (useLocalStreamList[k].streamID === streamList[j].streamID) {
                        try {
                            zg.stopPlayingStream(useLocalStreamList[k].streamID);
                        } catch (error) {
                            console.error(error);
                        }

                        // console.info(useLocalStreamList[k].streamID + 'was devared');


                        $('.remoteVideo audio:eq(' + k + ')').remove();
                        useLocalStreamList.splice(k--, 1);

                        break;
                    }
                }
            }
        }
    });

    
});


  },
computed: {
},
mounted(){
    
},
data(){
    return{
        
    }
},
methods: {
    async enterRoom(){
        let loginSuc = false;
        try {
            loginSuc = await enterRoom();
            loginSuc && (await publish({ camera: { video: false } }));
        } catch (error) {
            console.error(error);
        }
    },

    async openSay(){
        logout()
        let loginSuc = false;
        try {
            loginSuc = await enterRoom();
            loginSuc && (await publish());
        } catch (error) {
            console.error(error);
        }
    },
    async closeSay(){
        logout()
        enterRoom()
    },
    openListen(){
        var myAuto = document.getElementById('previewVideo');
        myAuto.play();
    },
    closeListen(){
        var myAuto = document.getElementById('previewVideo');
        myAuto.pause();
    },
}

}
</script>
<style lang = "less" scoped>
.el-container{
    width: 100%;
    height: 100%;
    background-color: aqua;

    .el-header{
        line-height: 60px;
    }

    .el-main{
        background-color: aquamarine;
        overflow: hidden;
         
        .bg-f2{
          background-color: #f8f9fa;
        }
        video{
            width: 320px;
            height: auto;
        }
        .videoRow{
            margin-top: 30px;
        }
        #previewLabel{
            display: block;
        }
            
        
    }
}
.el-card{
    width: 100%;
    height: 100%;
}
</style>