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
        :isSame="isSame"
        :isRandom="isRandom"
        :obj="obj"
        @updateShowParam='updateShowParam'
        @updatePlayParam='updatePlayParam'
        @updateUsProgress='updateUsProgress'
    ></in-audio>
</template>

<script setup>
import { ref, toRefs, reactive, onMounted, nextTick, computed } from 'vue';
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

const isFirst = ref(true);      // 首次加载音乐
const isShow = ref(false);      // 显示播放
const isPlay = ref(false);      // 播放
const isSame = ref(false);      // 循环
const isRandom = ref(false);    // 随机
const isMove = ref(false);      // 拖拽
const originList = ref([]);     // 原始列表
const randomList = ref([]);     // 随机列表

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
    switch(param) {
        case 0: // 暂停/播放
            audioPlay();
            break;
        case -1:
        case 1: // 切歌
            obj.count += param;
            obj.count = obj.count > obj.list.length - 1 ? 0 : (obj.count < 0 ? obj.list.length - 1 : obj.count);
            obj.$barCur.style.width = 0;
            isFirst.value = true;
            isPlay.value = false;
            setAudio();
            audioPlay();
            break;
        case 2:
            isRandom.value = !isRandom.value;
            break;
        case 3:
            isSame.value = !isSame.value;
            break;
    }
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
        originList.value = extend([], obj.list);
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
    else if (sec >= 60) {
        sec = '00';
        min += 1;
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
            childRef.value.changeType(); // 歌词更新
        });

        $audio.addEventListener('ended', function () {
            if (isRandom.value) {
                !randomList.value.length ? randomList.value = extend([], shuffle(obj.list)) : randomList.value = [];
            }
            else {
                !randomList.value.length ? obj.list = extend([], originList.value) : '';
            }

            if (!isSame.value) {
                obj.count = obj.count >= obj.list.length - 1 ? 0 : obj.count + 1;
            }

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

const isArrEqual = (oldArr, newArr) => {
    return oldArr.length === newArr.length && oldArr.every((ele) => newArr.includes(ele));
};

const shuffle = (list) => {
    let arr = list;
    let len = arr.length;
    let i = len;
    let j = 0;
    let temp = null;

    while (i--) {
        j = Math.floor(Math.random() * (i + 1));
        temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }

    return arr;
}

const extend = (a, b) => {
    for (var i in b) {
        if (typeof b[i] === 'object' && b[i] !== null) {
            a[i] = a[i] || {};
            extend(a[i], b[i]);
        } else {
            a[i] = b[i];
        }
    }
    return a;
}

// 已弃用
// const originList = computed({
//     get: () => {
//         if (isRandom.value) {
//             return extend([], obj.list);
//         }
//     },
// 	// set: (val) => {},
// });

onMounted(() => {
    obj.$barCur = document.querySelector('.js-progress-cur');
    getMusicList();
});
</script>
