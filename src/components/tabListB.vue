<script setup>
import { reactive } from 'vue';

const props = defineProps({
    tab: {
        type: Number,
        default: 0
    }
});

const state = reactive({
    tabCont1: 0,
    tabCont2: 0,
    tabCont3: 0
});
</script>

<template>
    <div class="tab-list">
        <div class="tab-list-item" v-show="props.tab === 0">
            <div class="tab-list-item-title"  @click="state.tabCont1++">Tabb1</div>
            <div class="tab-list-item-content">Tab1 content:  {{ state.tabCont1 }}</div>
        </div>
        <div class="tab-list-item" v-show="props.tab === 1">
            <div class="tab-list-item-title"  @click="state.tabCont2++">Tabb2</div>
            <div class="tab-list-item-content">Tab2 content:  {{ state.tabCont2 }}</div>
        </div>
        <div class="tab-list-item" v-show="props.tab === 2">
            <div class="tab-list-item-title"  @click="state.tabCont3++">Tabb3</div>
            <div class="tab-list-item-content">Tab3 content: {{ state.tabCont3 }}</div>
        </div>
    </div>
</template>