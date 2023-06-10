<template>
    <div class="home-wrap">
        <div class="home-top">
            <div class="pb-tl">早上好</div>
            <div class="column-list">
                <template v-for="(item, index) in obj.timeRec" :key="index">
                    <dl>
                        <dt><img :src="item.pic"></dt>
                        <dd>{{item.text}}</dd>
                    </dl>
                </template>
                <template v-for="(item, index) in obj.recentList" :key="index">
                    <dl>
                        <dt><img :src="item.pic"></dt>
                        <dd>{{item.text}}</dd>
                    </dl>
                </template>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, toRefs, reactive, onMounted } from 'vue';
import axios from 'axios';

const obj = reactive({ 
    timeRec: [],
    recentList: []
});

const getIndexMusicRec = () => {
    axios.get('/api/indexMusicRec')
    .then(res => {
        obj.timeRec.push(...res.data.data.timeRec);
        obj.recentList.push(...res.data.data.recentList);
    })
    .catch(err => {
        console.log(err);
    });
}

onMounted(() => {
    getIndexMusicRec();
});

</script>

<style scoped></style>