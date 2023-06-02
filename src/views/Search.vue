<template>
    <form action="https://www.google.com/search">
        <input type="text" name="q" placeholder="Search Google" />
        <input type="submit" value="Search" />
    </form>
    <image-lazy
        src="../src/assets/shark.png"
        alt="shark"
    ></image-lazy>
</template>
<script setup>
import imageLazy from '@/components/imageLazy.vue';
import axios from 'axios';
// import Random from '@/../mock/api/getSearchData';

// 搜索功能
const search = () => {
    axios.get('/api/getSearchData')
    .then(res => {
        console.log(res);
    })
    .catch(err => {
        
    });
}

search();


</script>
<style scoped>

</style>