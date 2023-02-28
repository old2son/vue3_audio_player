<template>
    <teleport to="body">
        <div class="in-audio-warp" :class="{'show' : showOk}" v-if="obj.list[obj.count]">

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
                    <dd>{{obj.list[obj.count].singer}}</dd>
                </dl>

                <div class="us-audio js-usaudio">
                    <div class="audio-box">
                        <div class="inner">
                            <div class="audio-info">
                                <div class="progress-wrap">
                                    <div class="bar js-bar"
                                        @touchstart="touchstart"
                                        @touchmove="touchmove"
                                        @touchend="touchend">
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
                                <a class="prev js-prev" @click.stop="updatePlayParam(-1)"></a>
                                <a class="play js-play" :class="{'active' : isPlay}" @click.stop="updatePlayParam"></a>
                                <a class="next js-next" @click.stop="updatePlayParam(1)"></a>
                            </div>

                            <div class="lrcs-wrap">
                                <ul class="lrcs-wrap-inner" ref="ulRef" :style="{'transform': 'translateY(' + lyricTop + ')'}">
                                    <li
                                        v-for="(item, index) in showLyric.lyricObj"
                                        :key="item.uid"
                                        :class="{acting: Idx === index}"
                                        :data-index="index"
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
    showOk: {
        type: Boolean,
        default: false
    },
    isPlay: {
        type: Boolean,
        default: false
    },
    obj: {} // 歌曲信息
});

const isMove = ref(false);      // 圆圈是否移动
const lyricFlag = ref(true);    // 是否同首歌
const lyricTop = ref('150px');  // 歌词距离
const Idx = ref(0);             // 歌词索引

// 歌词dom
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
    timeOutEvent: '',
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
    if (num) {
        lyricFlag.value = true;
        lyricTop.value = '150px';
        Idx.value = 0;
        emit('updatePlayParam', num);
    }
    else {
        emit('updatePlayParam');
    }
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

const touchstart = (event) => {
    if (!event.cancelable) {
        return;
    }

    event.preventDefault(); // 阻止默认事件（长按的时候出现复制）
    pos.startTime = new Date().getTime();
    pos.startX = event.changedTouches[0].clientX;
    pos.startY = event.changedTouches[0].clientY;
}

const touchmove = (event) => {
    event.preventDefault();
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

const touchend = (event) => {
    event.preventDefault();
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
    liRef.value = []
});

onUpdated(() => {
    // handleLyricTransform();
})

const setRef = (el) => {
    liRef.value.push(el);
};

// 歌词和播放时间处理
const handleLyricTransform  = (currentTime) => {

    const item = showLyric.lyricObj[Idx.value];

    // 正在播放的索引
    const index = parseInt(liRef.value[Idx.value].dataset.index);
    if (lyricFlag.value && props.obj.$audio.currentTime > item.time) {
        if (Idx.value === index) {
            Idx.value += 1;
            lyricTop.value = `${-(liRef.value[Idx.value].offsetHeight * index) + 150}px`; // 150 为歌词容器高度的一半，让歌词居中
            if (Idx.value >= showLyric.lyricObj.length) { // 歌词没了
                lyricFlag.value = false;
                return;
            }
        }
    }
}

// 歌词格式化
const formatMusicLyrics = (lyric) => {
	if (lyric === '') {
		return { lyric: [{ time: 0, lyric: '这个地方没有歌词！', uid: 520520 }] }
	}
	var lyricObjArr = [];
	var lineLyric = lyric.split(/\n/);

	var regTime = /\d{2}:\d{2}.\d{2,3}/;

	 for (let i = 0; i < lineLyric?.length; i++) {
	    if (lineLyric[i] === '') {
            continue;
        }
	    const time = formatLyricTime(lineLyric[i].match(regTime)[0])
        
	    if (lineLyric[i].split(']')[1] !== '') {
	        lyricObjArr.push({
                time: time,
                lyric: lineLyric[i].split(']')[1],
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

onMounted(() => {
    // console.log(props.obj.list[0])
});

nextTick(() => {
    
});

watch(
    () => props.obj.list[props.obj.count],
    (newVal, oldVal) => {
        if (newVal) {
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
