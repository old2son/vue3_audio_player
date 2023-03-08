<template>
    <!-- 直接插入到body -->
    <teleport to="body">
        <div 
            class="in-audio-wrap" 
            :class="{'show' : isShow}"
            :style="{'overflow': isHidden ? 'hidden' : 'auto'}" 
            v-if="obj.list[obj.count]"
        >
            <div class="us-head">
                <i class="icon-arrow-down" @click="hideInAudio"></i>
                <dl class="us-tl">
                    <dt>来自"歌单"</dt>
                    <dd>{{obj.list[obj.count].source}}</dd>
                </dl>
            </div>
            
            <div class="us-body">
                <div class="us-poster">
                    <i><img :src="obj.list[obj.count].pic" ></i>
                </div>
                
                <dl class="us-msg">
                    <dt>{{obj.list[obj.count].title}}</dt>
                    <dd class="name">{{obj.list[obj.count].singer}}</dd>
                    <dd 
                        class="icon-speaker js-volume" 
                        @click.prevent="isVolume ? isVolume = false : isVolume = true"
                    >
                        <span 
                            class="volume-bar js-volume-bar"
                            ref="volumeRef"
                            v-show="isVolume"
                            @touchstart.prevent="volumeStart"
                            @touchmove.prevent="volumeMove"
                            @touchend.prevent="volumeEnd"
                        >
                            <span 
                                class="volume-cur js-volume-cur" 
                                :style="{'height': volume + '%'}"
                            ></span>
                        </span>
                    </dd>
                    <dd class="icon-heart js-like">❤</dd>
                </dl>

                <div class="us-audio js-usaudio">
                    <div class="audio-box">
                        <div class="inner">
                            <div class="audio-info">
                                <div class="progress-wrap">
                                    <div class="bar js-bar"
                                        @touchstart.prevent="musicTouchstart"
                                        @touchmove.prevent="musicTouchmove"
                                        @touchend.prevent="musicTouchend"
                                    >
                                        <div class="rdy"></div>
                                        <div class="cur" :style="{'width': obj.musicProgress  + '%'}">
                                            <span class="js-circle circle" :class="{'active' : isMove}"><i></i></span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="audio-time">
                                <em class="js-time-cur">{{obj.curTime}}</em>
                                <em class="js-time-total">{{obj.usTime}}</em>
                            </div>
                            
                            <div class="btns">
                                <a class="random" :class="{'music-state-active' : isRandom}" @click.prevent="updatePlayParam(2)"></a>
                                <a class="prev" @click.prevent="updatePlayParam(-1)"></a>
                                <a class="play" :class="{'active' : isPlay}" @click.prevent="updatePlayParam(0)"></a>
                                <a class="next" @click.prevent="updatePlayParam(1)"></a>
                                <a class="same" :class="{'music-state-active' : isSame}" @click.prevent="updatePlayParam(3)"></a>
                            </div>

                            <div class="lyric-wrap">
                                <ul class="lyric-wrap-inner" ref="ulRef" :style="{'transform': 'translateY(' + lyricTop + ')'}">
                                    <li
                                        v-for="(item, index) in showLyric.lyricObj"
                                        :key="item.uid"
                                        :class="{acting: Idx === index}"
                                        :data-index="index"
                                        :data-time="item.time"
                                        :ref="setRef"
                                    >
                                        {{item.lyric}}
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </teleport>
    
</template>

<script setup>
// defineExpose无需引入
import { ref, toRefs, reactive, onMounted ,computed, watch, nextTick, onBeforeUpdate, onUpdated } from 'vue';

const state = reactive({
    type: '测试用'
}) 
// 将方法、变量暴露给父组件使用，父组件才可通过ref API拿到子组件暴露的数据
defineExpose({
    // 解构state
    ...toRefs(state),
    // 声明方法
    changeType () {
        // state.type = 'Tom'
        handleLyricTransform();
    }
});

const props = defineProps({
    isShow: {
        type: Boolean,
        default: false
    },
    isPlay: {
        type: Boolean,
        default: false
    },
    isRandom: {
        type: Boolean,
        default: false
    },
    isSame: {
        type: Boolean,
        default: false
    },
    obj: {} // 歌曲信息
});

const isMove = ref(false);      // 圆圈是否移动
const lyricFlag = ref(true);    // 是否歌词滚动
const lyricTop = ref(0);        // 歌词距离
const Idx = ref(0);             // 歌词索引

// 歌词 dom
const ulRef = ref(null);
const liRef = ref([]);

const pos = reactive({
    startX: '',
    startY: '',
    moveEndX: '',
    moveEndY: '',
    startTime: '',
    endTime: '',
    distanceX: '',
    distanceY: '',
    isRecord: false
}); 

const showLyric = reactive({
    lyricObj: {}
});

const emit = defineEmits(['updateShowParam', 'updateUsProgress', 'updatePlayParam']);

const hideInAudio = () => {     // 隐藏内页
    emit('updateShowParam', false);
}
const updateMusicProgress = (isMove, time) => {
    emit('updateUsProgress', isMove, time);
}
const updatePlayParam = (num) => {
    if (isNaN(num) || typeof num !== 'number') {
        return;
    }

    lyricFlag.value = true;
    emit('updatePlayParam', num);
}

// 计算跳转播放横条
const hengtiao = () => {
    let $wrap = document.querySelector('.js-usaudio');
    let $bar = $wrap.querySelector('.js-bar');
    return (pos.startX - $bar.getBoundingClientRect().left) / $bar.offsetWidth * 100;
} 

// 获取当前播放时间
const getUsCurTime = () => {
    let $wrap = document.querySelector('.js-outer-audio');
    let $cur = $wrap.querySelector('.js-progress-cur');
    let $bar = $wrap.querySelector('.js-bar');
    return $cur.offsetWidth / $bar.offsetWidth * props.obj.$audio.duration;
}

const musicTouchstart = (event) => {
    if (!event.cancelable) {
        return;
    }

    pos.startTime = new Date().getTime();
    pos.startX = event.changedTouches[0].clientX;
    pos.startY = event.changedTouches[0].clientY;
}
const musicTouchmove = (event) => {
    let moveEndX = event.changedTouches[0].clientX;
    let moveEndY = event.changedTouches[0].clientY;
    let x = moveEndX - pos.startX;
    let y = moveEndY - pos.startY;
    pos.distanceX = moveEndX;
    pos.distanceY = moveEndY;
    isMove.value = true;
    
    let width = (moveEndX - document.querySelector('.js-usaudio .js-bar').getBoundingClientRect().left) / document.querySelector('.js-usaudio .js-bar').offsetWidth * 100;
    width = parseFloat(width.toFixed(5));

    if (width > 100) {
        width = 100;
    } 
    else if (width < 0) {
        width = 0;
    }

    document.querySelector('.js-outer-audio .js-progress-cur').style.width = width + '%';
    updateMusicProgress(true, getUsCurTime());

    if (Math.abs(x) > Math.abs(y) && x > 0) {
        // 右滑
    } 
    else if (Math.abs(x) > Math.abs(y) && x < 0) {
        // 左滑
    } 
    else if (Math.abs(y) > Math.abs(x) && y > 0) {
        // 下滑
    
    } 
    else if (Math.abs(y) > Math.abs(x) && y < 0) {
        // 上滑
    } 
    else {
        
    }
}
const musicTouchend = (event) => {
    pos.endTime = new Date().getTime();
    pos.isRecord = false;

    pos.endTime = 0;
    pos.startTime = 0;

    let width = hengtiao();
    width = parseFloat(width.toFixed(5));

    if (width > 100) {
        width = 100;
    } 
    else if (width < 0) {
        width = 0;
    }

    if (pos.endTime - pos.startTime < 200) {
        // 点击
    } 
    else {
        // 长按
    }

    if (isMove.value) {
        // 滑动中
        isMove.value = false;
    }
    else {
        document.querySelector('.js-outer-audio .js-progress-cur').style.width = width + '%';
    }

    updateMusicProgress(false, getUsCurTime());
}

onBeforeUpdate(() => {
    liRef.value = []; // 清空歌词dom
});

onUpdated(() => {
    // handleLyricTransform();
})

const setRef = (el) => {
    liRef.value.push(el); // 获取歌词dom
};

// todo: 歌词时间拖动处理
// 歌词和播放时间处理
const handleLyricTransform  = () => {

    let item = showLyric.lyricObj;

    // 正在播放的索引
    let index = parseInt(liRef.value[Idx.value].dataset.index);

     // 歌词滚动结束
    if (Idx.value >= item.length - 1) {
        lyricFlag.value = false;
        return;
    }
    
    // 播放时间 > 下一句歌词时间
    if (lyricFlag.value && props.obj.$audio.currentTime > item[[Idx.value + 1]].time) {
        Idx.value++;

        // 前几句/最后几句不滚动
        if ((index <= 4) || (index >= item.length - 5)) {
            return;
        }
        lyricTop.value = `${-(liRef.value[Idx.value].offsetHeight * (index - 4))}px`; 
    }
}
// 歌词格式化
const formatMusicLyrics = (lyric) => {
	if (lyric === '') {
		return { lyric: [{ time: 0, lyric: '这个地方没有歌词！', uid: 520520 }] }
	}
	let lyricObjArr = [];
	let lineLyric = lyric.split(/\n/);

	let regTime = /\d{2}:\d{2}.\d{2,3}/;

	 for (let i = 0; i < lineLyric?.length; i++) {
	    if (lineLyric[i] === '') {
            continue;
        }
	    const time = formatLyricTime(lineLyric[i].match(regTime)[0])
        
	    if (lineLyric[i].split(']')[1] !== '') {
	        lyricObjArr.push({
                time: time,
                lyric: lineLyric[i].split(']')[1].trim() || '🎵...μs...🎵',
                uid: parseInt(Math.random().toString().slice(-6))
            })
	    }
    }

    return lyricObjArr
}
// 歌词时间格式化
const formatLyricTime = (time) => {
    const regMin = /.*:/
    const regSec = /:.*\./
    const regMs = /\./

    const min = parseInt((time.match(regMin))[0].slice(0, 2))
    let sec = parseInt((time.match(regSec))[0].slice(1, 3))
    const ms = time.slice((time.match(regMs)).index + 1, (time.match(regMs)).index + 3)
    if (min !== 0) {
        sec += min * 60
    }
    return Number(sec + '.' + ms)
}

const volume = ref(100);        // 音量
const volumeRef = ref(null);
const isHidden = ref(false);
const isVolume = ref(false);
const getTouchPos = (event) => {
    const touch = event.touches[0];
    return {
        x: touch.clientX,
        y: touch.clientY
    }
}
const getVolumePos = (event) => {
    const { top, height } = volumeRef.value.getBoundingClientRect();
    const { y } = getTouchPos(event);
    let startY = y - top;
    if (startY <= 0) {
        startY = 0;
    } 
    else if (startY > height) {
        startY = height;
    }

    let num = ((height - startY) / height);
    props.obj.$audio.volume = num;
    volume.value = num * 100;
}
// 音量拖动
const volumeStart = (event) => {
    getVolumePos(event);
    isHidden.value = true;
}
const volumeMove = (event) => {
    getVolumePos(event);
}
const volumeEnd = (event) => {
    isHidden.value = false;
}

onMounted(() => {
    // console.log(props.obj.list[0])
});

nextTick(() => {
    
});

watch(
    () => props.obj.list[props.obj.count],
    (newVal, oldVal) => {
        if (newVal) {
            Idx.value = 0; // 重置歌词索引
            lyricTop.value = 0; // 重置歌词滚动
            lyricFlag.value = true; // 重置歌词滚动标识
            showLyric.lyricObj = formatMusicLyrics(newVal.lyric);
        }
    },
    {   
        // 只能监听单个
        // immediate: true, // 立即执行
        // deep: true // 深度监听
    }
);

</script>
