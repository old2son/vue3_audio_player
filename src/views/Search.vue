<template>
	<!-- 阻止跳转 -->
	<div class="search-form-wrap">
		<form @submit.prevent="search">
			<input type="text" class="search-input" placeholder="Search demo" v-model="obj.searchVal" />
			<input type="submit" class="btn-search" value="S" />
		</form>
	</div>

	<div class="search-cont">
		<template v-for="(item, index) in filterUserList" :key="item.id">
			<dl>
				<dt>
					<image-lazy :src="item.img" :alt="item.desc" :lazy="index > 10"></image-lazy>
				</dt>
				<dd>
					{{ item.name }}
				</dd>
			</dl>
		</template>
	</div>
</template>
<script setup>
import { reactive, onMounted, nextTick, computed } from 'vue';
import imageLazy from '@/components/imageLazy.vue';
import axios from 'axios';

//定义/mock/index.js
import Mock from 'mockjs';
// 拦截get请求，返回数据
Mock.mock(/\/api\/feed/, 'get', (config) => {
	const po = config.url.indexOf('?');
	const search = {};

	if (po != -1) {
		const query = config.url.slice(po + 1);
		let arr = query.split('&');
		arr.forEach((item) => {
			let temp = item.split('=');
			search[temp[0]] = temp[1];
		});
	}

	// 返回一个随机数据
	return Mock.mock({
		code: 0,
		'userList|30-50': [
			{
				id: '@ID',
				name: '@NAME',
				img: '@IMAGE(100x100, @COLOR, @COLOR, @NAME)',
				desc: '@PARAGRAPH(1)'
			}
		],
		temp: {
			val: search.val
		}
	});
});

const obj = reactive({
	userList: [],
	searchVal: ''
});

const search = () => {
	getMockJsCont();
};

const getViteMockCont = () => {
	axios
		.get('/api/getSearchData')
		.then((res) => {
			obj.userList.push(...res.data.data.userList);
		})
		.catch((err) => {
			console.log(err);
		});
};

const getMockJsCont = () => {
	axios
		.get(`/api/feed?val=${obj.searchVal}`)
		.then((res) => {
			obj.searchVal = '';
			obj.userList = [];
			obj.userList.push(...res.data.userList);
		})
		.catch((err) => {
			console.log(err);
		});
};

onMounted(() => {
	nextTick(() => {
		getViteMockCont();
	});
});

const filterUserList = computed(() => {
	return obj.userList.filter((item) => {
		return item.name.includes(obj.searchVal);
	});
});
</script>
<style scoped></style>
