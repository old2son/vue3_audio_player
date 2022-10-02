<template>
    <tabbar class="pb-navbottom">
        <template #test>
            <tabbar-item path="/home">
                <template #item-icon>
                    <i class="icon-sharkfins-grey"></i>
                </template>
                <template #item-icon-active>
                    <i class="icon-sharkfins-white"></i>
                </template>
                <template v-slot:item-text>首页</template>
            </tabbar-item>
            <tabbar-item path="/search">
                <template #item-icon>
                    <i class="icon-glasses-grey"></i>
                </template>
                <template #item-icon-active>
                    <i class="icon-glasses-white"></i>
                </template>
                <template v-slot:item-text>搜索</template>
            </tabbar-item>
            <tabbar-item path="/radio">
                <template #item-icon>
                    <i class="icon-radio-grey"></i>
                </template>
                <template #item-icon-active> 
                    <i class="icon-radio-white"></i>
                </template>
                <template v-slot:item-text>播放</template>
            </tabbar-item>
        </template>
    </tabbar>
</template>
<script setup>
import tabbar from '@/common/tabbar/tabbar.vue';
import tabbarItem from '@/common/tabbar/tabbarItem.vue';


</script>
<style scoped>

</style>