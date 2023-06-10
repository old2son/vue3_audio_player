<script setup>
import { reactive, KeepAlive, computed } from 'vue';
import tabListA from '@/components/tabListA.vue';
import tabListB from '@/components/tabListB.vue';

const state = reactive({
	type: 0,
	tabA: 0,
	tabB: 0,
});

const current = computed(() => {
    if (state.type === 0) {
        return tabListA;
    } 
    else if (state.type === 1){
        return tabListB;
    }
});
</script>

<template>
	<div class="tab">
		<div class="tab-item" :class="{ active: state.type === 0 }" @click="state.type = 0">TabA</div>
		<div class="tab-item" :class="{ active: state.type === 1 }" @click="state.type = 1">TabB</div>
	</div>
	<div class="tab" v-show="state.type === 0">
		<div class="tab-item" :class="{ active: state.tabA === 0 }" @click="state.tabA = 0">TabA1</div>
		<div class="tab-item" :class="{ active: state.tabA === 1 }" @click="state.tabA = 1">TabA2</div>
		<div class="tab-item" :class="{ active: state.tabA === 2 }" @click="state.tabA = 2">TabA3</div>
	</div>
	<div class="tab" v-show="state.type === 1">
		<div class="tab-item" :class="{ active: state.tabB === 0 }" @click="state.tabB = 0">TabB1</div>
		<div class="tab-item" :class="{ active: state.tabB === 1 }" @click="state.tabB = 1">TabB2</div>
		<div class="tab-item" :class="{ active: state.tabB === 2 }" @click="state.tabB = 2">TabB3</div>
	</div>

	<keepAlive>
		<component :is="current" :tab="state.tabA"></component>
	</keepAlive>
</template>

<style>
.tab {
	display: flex;
	justify-content: space-around;
	align-items: center;
	height: 50px;
	background-color: #eee;
}
.tab-item {
	flex: 1;
	text-align: center;
	line-height: 50px;
	cursor: pointer;
}
.tab-item.active {
	color: #fff;
	background-color: #000;
}
.tab-list {
	padding: 10px;
}
/* .tab-list-item {
    display: none;
} */
.tab-list-item-title {
	color: #fff;
	font-size: 20px;
	font-weight: bold;
}
.tab-list-item-content {
	color: #fff;
	font-size: 16px;
}
</style>
