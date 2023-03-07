<template>
    <div class="out-audio-wrap">
        <!-- <audio :src="obj.url"></audio> -->

        <div class="audio-box js-outer-audio" @click="showInAudio">
            <div class="inner">
                <div class="audio-img">
                    <template v-if="obj.list.length">
                        <img :src="obj.list[obj.count].pic">
                    </template>
                </div>

                <div class="audio-info">
                    <template v-if="obj.list.length">
                        <div class="info">{{obj.list[obj.count].title}} <em>{{obj.list[obj.count].singer}}</em></div>
                    </template>

                    <div class="progress-wrap">
                        <div class="bar js-bar">
                            <!-- <div class="rdy js-progress-rdy"></div> -->
                            <div class="cur js-progress-cur" :style="{'width': obj.musicProgress  + '%'}"></div>
                        </div>
                    </div>
                </div>
                
                <div class="btns">
                    <a class="play js-play" @click.stop="audioPlay" :class="{'active' : isPlay}"></a>
                </div>
            </div>
        </div>
    </div>

    <in-audio 
        ref='childRef'
        :isShow="isShow" 
        :isPlay="isPlay" 
        :obj="obj"
        @updateShowParam='updateShowParam'
        @updatePlayParam='updatePlayParam'
        @updateUsProgress='updateUsProgress'
    ></in-audio>
</template>

<script setup>
import { ref, toRefs, reactive, onMounted, nextTick } from 'vue';
import axios from 'axios';
import inAudio from '@/components/myAudio/inAudio.vue';

// 子组件ref
const childRef = ref(null);

nextTick(() => {
    // 获取子组件type
    console.log(childRef.value.type); // 测试用
    // 执行子组件方法
    // childRef.value.changeType();   // 歌词变动 测试用
});

const isFirst = ref(true); // 首次加载音乐
const isShow = ref(false); // 显示播放
const isPlay = ref(false); // 播放
const isMove = ref(false); // 拖拽

const obj = reactive({
    $audio: '',
    $barCur: '',
    $play: '',
    musicProgress: 0,
    count: 0,
    curTime: '00:00',
    usTime: '00:00',
    list: [
        // {
        //     url: '',
        //     pic: '',
        //     title: '',
        //     singer: '',
        //     source: ''
        // }
    ]
});

// 显示内页
const showInAudio = () => {
    isShow.value = true;
}

// -- 有关内页的方法 begin --
const updateShowParam = (param) => {
    isShow.value = param;
}

// 播放按钮处理
const updatePlayParam = (param) => {
    if (param === 1 || param === -1) {  // 切歌
        obj.count += param;
        obj.count = obj.count > obj.list.length - 1 ? 0 : (obj.count < 0 ? obj.list.length - 1 : obj.count);
        obj.$barCur.style.width = 0;
        isFirst.value = true;
        isPlay.value = false;
        setAudio();
    }

    audioPlay();
}

// 音乐播放条移动距离
const updateUsProgress = (inIsMove, time) => {
    isMove.value = inIsMove;

    if (isMove.value) {
        getTime(time, function (h, m, s) {
            obj.curTime = `${m}:${s}`;
        });

        obj.musicProgress = (time / obj.$audio.duration) * 100;

    }
    else {
        obj.$audio.currentTime = time;
    }
}
// -- end --

const getMusicList = () => {
    axios.get('/api/musicList')
    .then(res => {
        // obj.list = res.data.data;
        obj.list.push(...res.data.data);
        setAudio();
    })
    .catch(err => {
        
    });
}

const getTime = (myTime, callback) => {
    let cb = callback || function() {};
    let hour = parseInt(myTime / 3600);
    let min = parseInt((myTime % 3600) / 60);
    let sec = Math.ceil(myTime % 60);

    // if (min < 10) {
    //     min = '0' + min;
    // }

    if (sec < 10) {
        sec = '0' + sec; 
    }

    cb(hour, min, sec);
}

const moveCurPos = function() {
    if (isMove.value) {
        return;
    }

    if (!obj.$audio.duration) {
        return;
    }

    getTime(obj.$audio.currentTime, function (h, m, s) {
        obj.curTime = `${m}:${s}`;
    });

    obj.musicProgress = (obj.$audio.currentTime / obj.$audio.duration) * 100;
}

const setAudio = () => {
    let $audio = obj.$audio;
    if (!$audio) {
        obj.$audio = new Audio();
        $audio = obj.$audio;

        $audio.addEventListener('play', function () {});

        $audio.addEventListener('pause', function () {});

        // 播放位置改变
        $audio.addEventListener('timeupdate', function () {
            moveCurPos();
            childRef.value.changeType(); // 歌词变动
        });

        $audio.addEventListener('ended', function () {
            // 重播
            // if (!isMouseMove) {
            //     obj.count = obj.count >= obj.list.length - 1 ? 0 : obj.count + 1;
            //     $audio = null;
            //     obj.$barCur.style.width = 0;

            //     setAudio();
            // }
            
            obj.count = obj.count >= obj.list.length - 1 ? 0 : obj.count + 1;
            obj.$audio = null;
            obj.$barCur.style.width = 0;
            setAudio();
        });

        // ————顺序执行————
        // 开始加载
        $audio.addEventListener('loadstart', function () {});

        // 时长改变触发
        $audio.addEventListener('durationchange', function () {});

        // 媒体文件元数据加载完毕
        $audio.addEventListener('loadedmetadata', function () {});

        // 媒体文件第一帧加载完毕
        $audio.addEventListener('loadeddata', function () {
            if (isFirst.value) {
                return;
            }

            this.play();
        });

        // 下载媒体文件触发
        $audio.addEventListener('progress', function () {
            // getBuffer();
        });

        // 浏览器认为可播放时触发
        $audio.addEventListener('canplay', function () {
            getTime(obj.$audio.duration, function (h, m, s) {
                obj.usTime = `${m}:${s}`;
            });
        });

        // 浏览器认为无需缓冲播放时触发
        $audio.addEventListener('canplaythrough', function () {});
    }

    $audio.src = obj.list[obj.count].url + '?randomTime=' + new Date().getTime();
    $audio.load();
}

const audioPlay = () => {
    if (isFirst.value) {
        isFirst.value = false;
    }

    if (isPlay.value) {
        isPlay.value = false;
        obj.$audio.pause();
    }
    else {
        isPlay.value = true;
        obj.$audio.play();
    }
}

onMounted(() => {
    obj.$barCur = document.querySelector('.js-progress-cur');
    // obj.$play = document.querySelector('.js-play');
    getMusicList();
});
</script>
